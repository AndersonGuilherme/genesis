import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  readConfig,
  writeConfig,
  setSkillStatus,
  setActivePhase,
  nextPhase as computeNextPhase,
  type SkillStatus,
} from '../../core/project-state.js';
import { isPhase } from '../../core/skills-discovery.js';

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

  return json(ctx.res, 404, { error: 'rota não encontrada' });
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
