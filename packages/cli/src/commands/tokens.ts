import { Command } from 'commander';
import pc from 'picocolors';
import { existsSync } from 'node:fs';
import { TranscriptCache, transcriptsDirFor } from '../core/transcripts.js';
import { formatUsd } from '../core/pricing.js';
import { resolveProjectRoot } from '../core/project-state.js';

export function registerTokens(program: Command): void {
  program
    .command('tokens')
    .description('Relatório de uso de tokens + custos (lê transcripts do Claude Code)')
    .option('--json', 'Output JSON pra script')
    .option('--sessions', 'Lista sessões com custo individual')
    .option('--cwd <path>')
    .action(async (opts: { json?: boolean; sessions?: boolean; cwd?: string }) => {
      await runTokens(opts);
    });
}

interface TokensOpts {
  json?: boolean;
  sessions?: boolean;
  cwd?: string;
}

async function runTokens(opts: TokensOpts): Promise<void> {
  const projectRoot = await resolveProjectRoot(opts.cwd);
  const dir = transcriptsDirFor(projectRoot);
  if (!existsSync(dir)) {
    if (opts.json) {
      console.log(JSON.stringify({ error: 'no transcripts', dir }));
      return;
    }
    console.log(pc.yellow(`Sem transcripts em ${dir}.`));
    console.log(pc.dim('Abra Claude Code no projeto pra gerar histórico.'));
    return;
  }

  const cache = new TranscriptCache(projectRoot);
  const newCount = await cache.sync(projectRoot);
  const summary = cache.summary();
  cache.close();

  if (opts.json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log('');
  console.log(pc.bold('Genesis tokens'));
  console.log(pc.dim(`  projeto: ${projectRoot}`));
  console.log(pc.dim(`  cache:   ${dir}`));
  if (newCount > 0) console.log(pc.cyan(`  novas:   ${newCount} mensagens`));
  console.log('');
  console.log(`  ${pc.bold('Custo total')}: ${pc.green(formatUsd(summary.totalCostUsd))}`);
  console.log(`  ${pc.bold('Sessões')}:     ${summary.sessionCount}`);
  console.log(`  ${pc.bold('Mensagens')}:   ${summary.messageCount.toLocaleString('pt-BR')}`);
  console.log(
    `  ${pc.bold('Tokens')}:      ${formatTokens(summary.totalInput)} input + ${formatTokens(summary.totalOutput)} output (+ ${formatTokens(summary.totalCacheRead)} cache read)`,
  );
  console.log('');

  if (summary.byModel.length > 0) {
    console.log(pc.bold('  Por modelo:'));
    for (const m of summary.byModel) {
      console.log(
        `    ${m.model.padEnd(24)} ${m.messages.toString().padStart(5)} msgs   ${pc.green(formatUsd(m.cost).padStart(10))}`,
      );
    }
    console.log('');
  }

  if (opts.sessions && summary.bySession.length > 0) {
    console.log(pc.bold('  Sessões:'));
    for (const s of summary.bySession.slice(0, 20)) {
      const date = s.firstTs?.slice(0, 16).replace('T', ' ') ?? '—';
      console.log(
        `    ${s.sessionId.slice(0, 8)}…  ${date}  ${s.messages.toString().padStart(5)} msgs   ${pc.green(formatUsd(s.cost).padStart(10))}`,
      );
    }
    if (summary.bySession.length > 20) {
      console.log(pc.dim(`    ... (+${summary.bySession.length - 20} mais)`));
    }
    console.log('');
  }
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}
