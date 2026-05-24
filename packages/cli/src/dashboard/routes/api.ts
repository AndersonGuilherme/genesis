import type { IncomingMessage, ServerResponse } from 'node:http';
import { existsSync } from 'node:fs';
import { writeFile, mkdir, readFile, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
  readConfig,
  writeConfig,
  setSkillStatus,
  setActivePhase,
  nextPhase as computeNextPhase,
  type SkillStatus,
} from '../../core/project-state.js';
import { isPhase } from '../../core/skills-discovery.js';
import { entityFilePath, isValidId, type EntityType } from './entity-show.js';

const MAX_CONTENT_BYTES = 200 * 1024; // 200KB — generous mas evita abuso

export interface ApiContext {
  projectRoot: string;
  pathname: string;
  method: string;
  req: IncomingMessage;
  res: ServerResponse;
}

export async function handleApi(ctx: ApiContext): Promise<boolean> {
  if (!ctx.pathname.startsWith('/api/')) return false;

  // POST /api/skill/toggle  { id, status }
  if (ctx.method === 'POST' && ctx.pathname === '/api/skill/toggle') {
    const body = await readJson(ctx.req);
    const id = String(body.id ?? '');
    const status = String(body.status ?? '') as SkillStatus;
    if (!['pending', 'doing', 'done', 'skip'].includes(status)) {
      return json(ctx.res, 400, { error: `status inválido: '${status}'` });
    }
    const cfg = await readConfig(ctx.projectRoot);
    if (!cfg) return json(ctx.res, 500, { error: 'config.json ausente' });
    try {
      setSkillStatus(cfg, id, status);
      await writeConfig(ctx.projectRoot, cfg);
      return json(ctx.res, 200, { ok: true, id, status });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return json(ctx.res, 400, { error: message });
    }
  }

  // POST /api/phase/next
  if (ctx.method === 'POST' && ctx.pathname === '/api/phase/next') {
    const cfg = await readConfig(ctx.projectRoot);
    if (!cfg) return json(ctx.res, 500, { error: 'config.json ausente' });
    const target = computeNextPhase(cfg.phase.active);
    if (!target) {
      return json(ctx.res, 400, { error: 'já está na última phase' });
    }
    setActivePhase(cfg, target);
    await writeConfig(ctx.projectRoot, cfg);
    return json(ctx.res, 200, { ok: true, active: target });
  }

  // POST /api/phase/set  { phase }
  if (ctx.method === 'POST' && ctx.pathname === '/api/phase/set') {
    const body = await readJson(ctx.req);
    const phase = String(body.phase ?? '');
    if (!isPhase(phase)) {
      return json(ctx.res, 400, { error: `phase inválida: '${phase}'` });
    }
    const cfg = await readConfig(ctx.projectRoot);
    if (!cfg) return json(ctx.res, 500, { error: 'config.json ausente' });
    setActivePhase(cfg, phase);
    await writeConfig(ctx.projectRoot, cfg);
    return json(ctx.res, 200, { ok: true, active: phase });
  }

  // POST /api/skill/save  { id, content }
  // POST /api/rule/save   { id, content }
  // POST /api/agent/save  { id, content }
  const saveMatch = ctx.pathname.match(/^\/api\/(skill|rule|agent)\/save$/);
  if (ctx.method === 'POST' && saveMatch) {
    const type = saveMatch[1] as EntityType;
    return await handleEntitySave(ctx, type);
  }

  return json(ctx.res, 404, { error: 'rota não encontrada' });
}

async function handleEntitySave(ctx: ApiContext, type: EntityType): Promise<boolean> {
  const body = await readJson(ctx.req);
  const id = String(body.id ?? '');
  const content = String(body.content ?? '');

  if (!isValidId(id)) {
    return json(ctx.res, 400, { error: `id inválido (kebab-case): '${id}'` });
  }
  if (content.length > MAX_CONTENT_BYTES) {
    return json(ctx.res, 413, {
      error: `content > ${MAX_CONTENT_BYTES} bytes (recebido ${content.length})`,
    });
  }
  if (content.length === 0) {
    return json(ctx.res, 400, { error: 'content vazio' });
  }

  const abs = entityFilePath(ctx.projectRoot, type, id);
  if (!existsSync(abs)) {
    return json(ctx.res, 404, {
      error: `${type} '${id}' não existe — edit só permite atualizar arquivos existentes`,
    });
  }

  // Backup antes de sobrescrever
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const relPath = abs.replace(ctx.projectRoot + '/', '');
  const backupPath = join(ctx.projectRoot, '.genesis', '.backup', timestamp, relPath);
  try {
    await mkdir(dirname(backupPath), { recursive: true });
    await copyFile(abs, backupPath);
  } catch (err) {
    return json(ctx.res, 500, {
      error: `falha ao criar backup: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  // Escreve novo conteúdo
  try {
    await writeFile(abs, content, 'utf8');
    const stat = await readFile(abs, 'utf8');
    return json(ctx.res, 200, {
      ok: true,
      type,
      id,
      bytes: stat.length,
      backup: backupPath.replace(ctx.projectRoot + '/', ''),
    });
  } catch (err) {
    return json(ctx.res, 500, {
      error: `falha ao escrever: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}

function json(res: ServerResponse, status: number, body: unknown): true {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
  return true;
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw) as Record<string, unknown>);
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
    req.on('error', reject);
  });
}
