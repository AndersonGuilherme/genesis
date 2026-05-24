import { existsSync, statSync, readdirSync } from 'node:fs';
import { open } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { mkdir } from 'node:fs/promises';
import Database from 'better-sqlite3';
import { costOf, type Usage } from './pricing.js';

/**
 * Hash de path do projeto pra nome de pasta em ~/.claude/projects/.
 * Claude Code converte separadores `/` em `-`.
 */
export function projectHashFromRoot(projectRoot: string): string {
  return projectRoot.split('/').join('-');
}

export function transcriptsDirFor(projectRoot: string): string {
  return join(homedir(), '.claude', 'projects', projectHashFromRoot(projectRoot));
}

export interface SessionRow {
  id: string;
  filePath: string;
  cwd: string | null;
  gitBranch: string | null;
  firstTs: string | null;
  lastTs: string | null;
  bytesParsed: number;
  mtime: number;
}

export interface MessageRow {
  sessionId: string;
  ts: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheRead: number;
  cacheWrite: number;
  costUsd: number;
}

export interface TokenSummary {
  totalCostUsd: number;
  totalInput: number;
  totalOutput: number;
  totalCacheRead: number;
  totalCacheWrite: number;
  messageCount: number;
  sessionCount: number;
  byModel: { model: string; cost: number; messages: number }[];
  byDay: { day: string; cost: number; messages: number }[];
  bySession: { sessionId: string; cost: number; messages: number; firstTs: string | null; lastTs: string | null }[];
}

/**
 * Cache SQLite armazenado em <projectRoot>/.genesis/.cache/transcripts.sqlite.
 */
export class TranscriptCache {
  private db: Database.Database;
  constructor(projectRoot: string) {
    const dir = join(projectRoot, '.genesis', '.cache');
    if (!existsSync(dir)) {
      // sync mkdir é OK pra cache dir
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      mkdir(dir, { recursive: true });
    }
    const dbPath = join(dir, 'transcripts.sqlite');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initSchema();
  }

  close(): void {
    this.db.close();
  }

  private initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        file_path TEXT NOT NULL,
        cwd TEXT,
        git_branch TEXT,
        first_ts TEXT,
        last_ts TEXT,
        bytes_parsed INTEGER NOT NULL DEFAULT 0,
        mtime INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS messages (
        session_id TEXT NOT NULL,
        ts TEXT NOT NULL,
        model TEXT NOT NULL,
        input_tokens INTEGER NOT NULL DEFAULT 0,
        output_tokens INTEGER NOT NULL DEFAULT 0,
        cache_read INTEGER NOT NULL DEFAULT 0,
        cache_write INTEGER NOT NULL DEFAULT 0,
        cost_usd REAL NOT NULL DEFAULT 0,
        PRIMARY KEY (session_id, ts)
      );
      CREATE INDEX IF NOT EXISTS idx_messages_ts ON messages(ts);
      CREATE INDEX IF NOT EXISTS idx_messages_model ON messages(model);
    `);
  }

  /**
   * Sincroniza cache com transcripts no filesystem. Lê apenas arquivos
   * modificados desde a última varredura (mtime > stored mtime).
   *
   * Retorna número de mensagens novas processadas.
   */
  async sync(projectRoot: string): Promise<number> {
    const dir = transcriptsDirFor(projectRoot);
    if (!existsSync(dir)) return 0;

    const files = readdirSync(dir).filter((f) => f.endsWith('.jsonl'));
    let totalNew = 0;
    for (const f of files) {
      const abs = join(dir, f);
      const stat = statSync(abs);
      const mtime = Math.floor(stat.mtimeMs);
      const sessionId = f.replace(/\.jsonl$/, '');
      const stored = this.db
        .prepare('SELECT bytes_parsed, mtime FROM sessions WHERE id = ?')
        .get(sessionId) as { bytes_parsed: number; mtime: number } | undefined;

      const lastBytes = stored?.bytes_parsed ?? 0;
      const lastMtime = stored?.mtime ?? 0;

      if (mtime <= lastMtime && stat.size <= lastBytes) {
        continue; // arquivo não cresceu nem foi modificado
      }

      const added = await this.parseFile(abs, sessionId, lastBytes);
      totalNew += added;

      this.db
        .prepare(
          `INSERT INTO sessions (id, file_path, bytes_parsed, mtime)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             file_path = excluded.file_path,
             bytes_parsed = excluded.bytes_parsed,
             mtime = excluded.mtime`,
        )
        .run(sessionId, abs, stat.size, mtime);

      // recomputa first_ts/last_ts a partir das messages
      const range = this.db
        .prepare('SELECT MIN(ts) as first, MAX(ts) as last FROM messages WHERE session_id = ?')
        .get(sessionId) as { first: string | null; last: string | null };
      this.db
        .prepare('UPDATE sessions SET first_ts = ?, last_ts = ? WHERE id = ?')
        .run(range.first, range.last, sessionId);
    }
    return totalNew;
  }

  /**
   * Parseia arquivo JSONL a partir de offset (byte position).
   * Insere mensagens novas. Retorna count.
   */
  private async parseFile(absPath: string, sessionId: string, fromOffset: number): Promise<number> {
    const handle = await open(absPath, 'r');
    try {
      const stat = await handle.stat();
      const remaining = stat.size - fromOffset;
      if (remaining <= 0) return 0;

      const buf = Buffer.alloc(remaining);
      await handle.read(buf, 0, remaining, fromOffset);
      const text = buf.toString('utf8');
      const lines = text.split('\n');

      const insert = this.db.prepare(`
        INSERT OR IGNORE INTO messages
          (session_id, ts, model, input_tokens, output_tokens, cache_read, cache_write, cost_usd)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const updateSession = this.db.prepare(
        'UPDATE sessions SET cwd = COALESCE(?, cwd), git_branch = COALESCE(?, git_branch) WHERE id = ?',
      );
      const ensureSession = this.db.prepare(
        'INSERT OR IGNORE INTO sessions (id, file_path) VALUES (?, ?)',
      );
      ensureSession.run(sessionId, absPath);

      let count = 0;
      const tx = this.db.transaction((rows: ParsedLine[]) => {
        for (const row of rows) {
          if (row.kind === 'message' && row.message) {
            const m = row.message;
            insert.run(
              sessionId,
              m.ts,
              m.model,
              m.usage.inputTokens,
              m.usage.outputTokens,
              m.usage.cacheReadTokens,
              m.usage.cacheWriteTokens,
              costOf(m.model, m.usage),
            );
            count += 1;
          } else if (row.kind === 'context') {
            updateSession.run(row.cwd ?? null, row.gitBranch ?? null, sessionId);
          }
        }
      });

      const parsed: ParsedLine[] = [];
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const obj = JSON.parse(line) as Record<string, unknown>;
          const parsedLine = extractFromLine(obj);
          if (parsedLine) parsed.push(parsedLine);
        } catch {
          // linha inválida, skip
        }
      }
      tx(parsed);
      return count;
    } finally {
      await handle.close();
    }
  }

  summary(): TokenSummary {
    const totals = this.db
      .prepare(
        `SELECT
           COALESCE(SUM(cost_usd), 0) as cost,
           COALESCE(SUM(input_tokens), 0) as input,
           COALESCE(SUM(output_tokens), 0) as output,
           COALESCE(SUM(cache_read), 0) as cacheRead,
           COALESCE(SUM(cache_write), 0) as cacheWrite,
           COUNT(*) as messages
         FROM messages`,
      )
      .get() as {
      cost: number;
      input: number;
      output: number;
      cacheRead: number;
      cacheWrite: number;
      messages: number;
    };

    const sessionCount = (
      this.db.prepare('SELECT COUNT(*) as n FROM sessions').get() as { n: number }
    ).n;

    const byModel = this.db
      .prepare(
        `SELECT model, COALESCE(SUM(cost_usd), 0) as cost, COUNT(*) as messages
         FROM messages GROUP BY model ORDER BY cost DESC`,
      )
      .all() as { model: string; cost: number; messages: number }[];

    const byDay = this.db
      .prepare(
        `SELECT SUBSTR(ts, 1, 10) as day, COALESCE(SUM(cost_usd), 0) as cost, COUNT(*) as messages
         FROM messages WHERE ts IS NOT NULL GROUP BY day ORDER BY day ASC`,
      )
      .all() as { day: string; cost: number; messages: number }[];

    const bySession = this.db
      .prepare(
        `SELECT
           s.id as sessionId,
           COALESCE(SUM(m.cost_usd), 0) as cost,
           COUNT(m.ts) as messages,
           s.first_ts as firstTs,
           s.last_ts as lastTs
         FROM sessions s
         LEFT JOIN messages m ON m.session_id = s.id
         GROUP BY s.id
         ORDER BY cost DESC`,
      )
      .all() as { sessionId: string; cost: number; messages: number; firstTs: string | null; lastTs: string | null }[];

    return {
      totalCostUsd: totals.cost,
      totalInput: totals.input,
      totalOutput: totals.output,
      totalCacheRead: totals.cacheRead,
      totalCacheWrite: totals.cacheWrite,
      messageCount: totals.messages,
      sessionCount,
      byModel,
      byDay,
      bySession,
    };
  }

  sessionMessages(sessionId: string): MessageRow[] {
    return this.db
      .prepare(
        `SELECT session_id as sessionId, ts, model, input_tokens as inputTokens,
                output_tokens as outputTokens, cache_read as cacheRead,
                cache_write as cacheWrite, cost_usd as costUsd
         FROM messages WHERE session_id = ? ORDER BY ts ASC`,
      )
      .all(sessionId) as MessageRow[];
  }

  session(sessionId: string): SessionRow | null {
    const row = this.db
      .prepare(
        `SELECT id, file_path as filePath, cwd, git_branch as gitBranch,
                first_ts as firstTs, last_ts as lastTs,
                bytes_parsed as bytesParsed, mtime
         FROM sessions WHERE id = ?`,
      )
      .get(sessionId) as SessionRow | undefined;
    return row ?? null;
  }
}

interface ParsedMessage {
  ts: string;
  model: string;
  usage: Usage;
}

type ParsedLine =
  | { kind: 'message'; message: ParsedMessage }
  | { kind: 'context'; cwd?: string; gitBranch?: string };

function extractFromLine(obj: Record<string, unknown>): ParsedLine | null {
  const type = obj.type as string | undefined;

  // Attachment com cwd/gitBranch
  if (type === 'attachment') {
    return {
      kind: 'context',
      cwd: typeof obj.cwd === 'string' ? obj.cwd : undefined,
      gitBranch: typeof obj.gitBranch === 'string' ? obj.gitBranch : undefined,
    };
  }

  if (type !== 'assistant') return null;
  const message = obj.message as
    | {
        model?: string;
        usage?: {
          input_tokens?: number;
          output_tokens?: number;
          cache_read_input_tokens?: number;
          cache_creation_input_tokens?: number;
        };
      }
    | undefined;
  if (!message?.usage) return null;
  const ts = (obj.timestamp as string | undefined) ?? '';
  const model = message.model ?? '<unknown>';
  return {
    kind: 'message',
    message: {
      ts,
      model,
      usage: {
        inputTokens: message.usage.input_tokens ?? 0,
        outputTokens: message.usage.output_tokens ?? 0,
        cacheReadTokens: message.usage.cache_read_input_tokens ?? 0,
        cacheWriteTokens: message.usage.cache_creation_input_tokens ?? 0,
      },
    },
  };
}
