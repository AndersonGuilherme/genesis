import { Command } from 'commander';
import pc from 'picocolors';
import open from 'open';
import { resolveProjectRoot } from '../core/project-state.js';
import { startServer } from '../dashboard/server.js';

export function registerDashboard(program: Command): void {
  program
    .command('dashboard')
    .description('Abre dashboard local com viewer de docs + skill/rule/agent browser + progresso por phase')
    .option('--port <number>', 'Porta HTTP (default: 4321)', '4321')
    .option('--no-open', 'Não abre browser automaticamente')
    .option('--cwd <path>', 'Projeto destino (default: cwd ascendente)')
    .action(async (opts: { port: string; open: boolean; cwd?: string }) => {
      await runDashboard(opts);
    });
}

interface DashboardOpts {
  port: string;
  open: boolean;
  cwd?: string;
}

async function runDashboard(opts: DashboardOpts): Promise<void> {
  const projectRoot = await resolveProjectRoot(opts.cwd);
  const port = Number(opts.port);
  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`--port inválido: ${opts.port}`);
  }

  const { url, stop } = await startServer({ projectRoot, port });

  console.log('');
  console.log(`  ${pc.green('✓')} Genesis dashboard rodando`);
  console.log(`  ${pc.dim('projeto:')} ${projectRoot}`);
  console.log(`  ${pc.cyan('URL:')}      ${pc.bold(url)}`);
  console.log('');
  console.log(pc.dim('  Ctrl+C pra parar.'));
  console.log('');

  if (opts.open !== false) {
    try {
      await open(url);
    } catch {
      // ignora falha de abertura
    }
  }

  // Mantém vivo até SIGINT
  const shutdown = (): void => {
    console.log('');
    console.log(pc.dim('parando dashboard...'));
    stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
