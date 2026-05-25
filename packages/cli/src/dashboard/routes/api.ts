import type { IncomingMessage, ServerResponse } from 'node:http';
import { existsSync } from 'node:fs';
import { writeFile, mkdir, readFile, copyFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import matter from 'gray-matter';
import {
  readConfig,
  writeConfig,
  setSkillStatus,
  setActivePhase,
  nextPhase as computeNextPhase,
  type SkillStatus,
} from '../../core/project-state.js';
import { isPhase, PHASES, discoverRules } from '../../core/skills-discovery.js';
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

  // POST /api/skill/create  { id, content }
  // POST /api/rule/create   { id, content }
  // POST /api/agent/create  { id, content }
  const createMatch = ctx.pathname.match(/^\/api\/(skill|rule|agent)\/create$/);
  if (ctx.method === 'POST' && createMatch) {
    const type = createMatch[1] as EntityType;
    return await handleEntityCreate(ctx, type);
  }

  // DELETE /api/skill/<id>
  // DELETE /api/rule/<id>
  // DELETE /api/agent/<id>
  const deleteMatch = ctx.pathname.match(/^\/api\/(skill|rule|agent)\/([a-z][a-z0-9-]*)$/);
  if (ctx.method === 'DELETE' && deleteMatch) {
    const type = deleteMatch[1] as EntityType;
    const id = deleteMatch[2]!;
    return await handleEntityDelete(ctx, type, id);
  }

  // POST /api/skill/rules  { id, rules: string[] }
  if (ctx.method === 'POST' && ctx.pathname === '/api/skill/rules') {
    return await handleSkillRules(ctx);
  }

  return json(ctx.res, 404, { error: 'rota não encontrada' });
}

async function handleEntityCreate(ctx: ApiContext, type: EntityType): Promise<boolean> {
  const body = await readJson(ctx.req);
  const id = String(body.id ?? '');
  const content = String(body.content ?? '');

  if (!isValidId(id)) {
    return json(ctx.res, 400, { error: `id inválido (kebab-case): '${id}'` });
  }
  if (content.length > MAX_CONTENT_BYTES) {
    return json(ctx.res, 413, { error: `content > ${MAX_CONTENT_BYTES} bytes` });
  }
  if (content.length === 0) {
    return json(ctx.res, 400, { error: 'content vazio' });
  }

  const abs = entityFilePath(ctx.projectRoot, type, id);
  if (existsSync(abs)) {
    return json(ctx.res, 409, {
      error: `${type} '${id}' já existe — use POST /api/${type}/save pra editar`,
    });
  }

  // Validar frontmatter mínimo
  let fm: Record<string, unknown> = {};
  try {
    fm = matter(content).data as Record<string, unknown>;
  } catch (err) {
    return json(ctx.res, 400, {
      error: `frontmatter inválido: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
  for (const required of ['name', 'description', 'phase']) {
    if (!fm[required] || typeof fm[required] !== 'string') {
      return json(ctx.res, 400, { error: `frontmatter precisa de '${required}' (string)` });
    }
  }
  if (fm.name !== id) {
    return json(ctx.res, 400, {
      error: `frontmatter.name ('${String(fm.name)}') deve igualar id ('${id}')`,
    });
  }
  if (!isPhase(String(fm.phase))) {
    return json(ctx.res, 400, {
      error: `phase '${String(fm.phase)}' inválida. Válidas: ${PHASES.join(', ')}`,
    });
  }

  try {
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, content, 'utf8');
    return json(ctx.res, 201, {
      ok: true,
      type,
      id,
      path: abs.replace(ctx.projectRoot + '/', ''),
    });
  } catch (err) {
    return json(ctx.res, 500, {
      error: `falha ao criar: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}

async function handleEntityDelete(ctx: ApiContext, type: EntityType, id: string): Promise<boolean> {
  if (!isValidId(id)) {
    return json(ctx.res, 400, { error: `id inválido: '${id}'` });
  }
  const abs = entityFilePath(ctx.projectRoot, type, id);
  if (!existsSync(abs)) {
    return json(ctx.res, 404, { error: `${type} '${id}' não existe` });
  }

  // Backup antes de deletar
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

  try {
    // Skill é dir (SKILL.md dentro), rule/agent são .md soltos.
    if (type === 'skill') {
      await rm(dirname(abs), { recursive: true, force: true });
    } else {
      await rm(abs);
    }
    return json(ctx.res, 200, {
      ok: true,
      type,
      id,
      backup: backupPath.replace(ctx.projectRoot + '/', ''),
    });
  } catch (err) {
    return json(ctx.res, 500, {
      error: `falha ao deletar: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}

async function handleSkillRules(ctx: ApiContext): Promise<boolean> {
  const body = await readJson(ctx.req);
  const id = String(body.id ?? '');
  const rules = Array.isArray(body.rules) ? body.rules.map((r: unknown) => String(r)) : null;

  if (!isValidId(id)) return json(ctx.res, 400, { error: `id inválido: '${id}'` });
  if (!rules) return json(ctx.res, 400, { error: 'rules deve ser array' });

  const abs = entityFilePath(ctx.projectRoot, 'skill', id);
  if (!existsSync(abs)) return json(ctx.res, 404, { error: `skill '${id}' não existe` });

  // Valida rules existentes
  const available = await discoverRules(ctx.projectRoot);
  const availableIds = new Set(available.map((r) => r.id));
  const invalid = rules.filter((r) => !availableIds.has(r));
  if (invalid.length > 0) {
    return json(ctx.res, 400, { error: `rules inexistentes: ${invalid.join(', ')}` });
  }

  // Lê + atualiza frontmatter
  const raw = await readFile(abs, 'utf8');
  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    return json(ctx.res, 500, {
      error: `frontmatter inválido: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
  parsed.data.rules = rules;
  // Backup
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const relPath = abs.replace(ctx.projectRoot + '/', '');
  const backupPath = join(ctx.projectRoot, '.genesis', '.backup', ts, relPath);
  try {
    await mkdir(dirname(backupPath), { recursive: true });
    await copyFile(abs, backupPath);
  } catch (err) {
    return json(ctx.res, 500, {
      error: `backup falhou: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  const newContent = matter.stringify(parsed.content, parsed.data);
  await writeFile(abs, newContent, 'utf8');
  return json(ctx.res, 200, { ok: true, id, rules, backup: backupPath.replace(ctx.projectRoot + '/', '') });
}

// silence unused
void readFile;

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
