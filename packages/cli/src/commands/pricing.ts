import { Command } from 'commander';
import pc from 'picocolors';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { writeFile, mkdir } from 'node:fs/promises';
import { loadPricing, ageDays, resetPricingCache, type PricingTable } from '../core/pricing.js';

const PRICING_URL =
  'https://raw.githubusercontent.com/AndersonGuilherme/genesis/main/packages/cli/src/pricing/models.json';

export function registerPricing(program: Command): void {
  const cmd = program.command('pricing').description('Inspeciona/atualiza tabela de pricing usada pelo painel de tokens');
  cmd
    .command('show')
    .description('Mostra preços atuais (override do user ou embarcado)')
    .action(async () => {
      show();
    });
  cmd
    .command('update')
    .description('Baixa pricing atual de GitHub raw e grava em ~/.config/genesis/pricing.json')
    .option('--url <url>', 'URL alternativa', PRICING_URL)
    .action(async (opts: { url: string }) => {
      await update(opts.url);
    });
  cmd
    .command('reset')
    .description('Remove override do user (volta a usar pricing embarcado)')
    .action(async () => {
      await reset();
    });
}

function show(): void {
  const table = loadPricing();
  const age = ageDays(table.updatedAt);
  const overridePath = join(homedir(), '.config', 'genesis', 'pricing.json');
  const usingOverride = existsSync(overridePath);
  console.log('');
  console.log(pc.bold('Genesis pricing'));
  console.log(`  source:     ${usingOverride ? `override (${overridePath})` : 'embarcado no pacote'}`);
  console.log(`  atualizado: ${table.updatedAt} (${age} dias atrás)`);
  console.log(`  unidade:    ${table.currency} ${table.unit}`);
  console.log('');
  console.log(pc.bold('  Modelo                       Input    Output   CacheR  CacheW'));
  for (const [model, p] of Object.entries(table.models)) {
    console.log(
      `    ${model.padEnd(26)} ${fmt(p.input)} ${fmt(p.output)} ${fmt(p.cacheRead)} ${fmt(p.cacheWrite)}`,
    );
  }
  console.log('');
  console.log(pc.dim(`  default: input ${fmt(table.default.input)} output ${fmt(table.default.output)} (fallback)`));
  console.log('');
}

async function update(url: string): Promise<void> {
  console.log(pc.dim(`fetching ${url}...`));
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`fetch falhou: HTTP ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  let parsed: PricingTable;
  try {
    parsed = JSON.parse(text) as PricingTable;
  } catch (err) {
    throw new Error(`JSON inválido: ${err instanceof Error ? err.message : String(err)}`);
  }
  // Sanity check
  if (!parsed.models || typeof parsed.models !== 'object' || !parsed.default) {
    throw new Error('pricing inválido: faltam campos `models` ou `default`');
  }
  const dir = join(homedir(), '.config', 'genesis');
  const dest = join(dir, 'pricing.json');
  await mkdir(dir, { recursive: true });
  await writeFile(dest, JSON.stringify(parsed, null, 2), 'utf8');
  resetPricingCache();
  console.log('');
  console.log(`  ${pc.green('✓')} pricing atualizado: ${pc.bold(dest)}`);
  console.log(`  versão: ${parsed.updatedAt} · ${Object.keys(parsed.models).length} modelos`);
  console.log('');
}

async function reset(): Promise<void> {
  const dest = join(homedir(), '.config', 'genesis', 'pricing.json');
  if (!existsSync(dest)) {
    console.log(pc.dim(`nenhum override em ${dest} — nada a fazer.`));
    return;
  }
  const { rm } = await import('node:fs/promises');
  await rm(dest);
  resetPricingCache();
  console.log(`  ${pc.green('✓')} override removido: ${dest}`);
  console.log(pc.dim('  voltando a usar pricing embarcado.'));
}

function fmt(n: number): string {
  return `$${n.toFixed(2).padStart(7)}`;
}
