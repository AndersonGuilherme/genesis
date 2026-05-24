import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readConfig } from '../core/project-state.js';
import { renderOverview } from './routes/index.js';
import { renderDocs } from './routes/docs.js';
import { renderSkills } from './routes/skills.js';
import { renderRules } from './routes/rules.js';
import { renderAgents } from './routes/agents.js';
import { renderPhases } from './routes/phases.js';

export interface ServerOptions {
  projectRoot: string;
  port: number;
}

export function startServer(opts: ServerOptions): Promise<{ url: string; stop: () => void }> {
  const server = createServer((req, res) => {
    handle(req, res, opts).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error && err.stack ? err.stack : '';
      console.error(`[dashboard] erro em ${req.url}: ${message}`);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(`<pre style="padding:20px;font-family:monospace;background:#fee;color:#900">${escape(message)}\n\n${escape(stack)}</pre>`);
    });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(opts.port, () => {
      const url = `http://localhost:${opts.port}`;
      resolve({
        url,
        stop: () => server.close(),
      });
    });
  });
}

async function handle(
  req: IncomingMessage,
  res: ServerResponse,
  opts: ServerOptions,
): Promise<void> {
  const url = new URL(req.url ?? '/', `http://localhost:${opts.port}`);
  const pathname = url.pathname;

  const cfg = await readConfig(opts.projectRoot);
  if (!cfg) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`.genesis/config.json ausente em ${opts.projectRoot}`);
    return;
  }

  // Roteamento simples
  if (pathname === '/') {
    send(res, 200, renderOverview(cfg));
    return;
  }
  if (pathname === '/skills' || pathname === '/skills/') {
    send(res, 200, await renderSkills(opts.projectRoot, cfg, url.searchParams));
    return;
  }
  if (pathname === '/rules' || pathname === '/rules/') {
    send(res, 200, await renderRules(opts.projectRoot, cfg));
    return;
  }
  if (pathname === '/agents' || pathname === '/agents/') {
    send(res, 200, await renderAgents(opts.projectRoot, cfg));
    return;
  }
  if (pathname === '/phases' || pathname === '/phases/') {
    send(res, 200, renderPhases(cfg));
    return;
  }
  if (pathname.startsWith('/docs/') || pathname === '/docs') {
    const docPath = pathname.replace(/^\/docs\/?/, '').replace(/^\/+/, '');
    const result = await renderDocs(opts.projectRoot, cfg, docPath);
    send(res, result.status, result.html);
    return;
  }

  // 404
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<h1>404</h1><p>not found</p><p><a href="/">← /</a></p>');
}

function send(res: ServerResponse, status: number, body: string): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(body);
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
