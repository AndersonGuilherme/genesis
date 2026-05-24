import { Command } from 'commander';
import pc from 'picocolors';
import { loadPricing, ageDays } from '../core/pricing.js';

export function registerPricing(program: Command): void {
  const cmd = program.command('pricing').description('Inspeciona tabela de pricing usada pelo painel de tokens');
  cmd
    .command('show')
    .description('Mostra preços atuais')
    .action(async () => {
      show();
    });
  cmd
    .command('update')
    .description('Atualiza pricing baixando de URL pública (placeholder M5 — implementação completa em M6)')
    .action(async () => {
      console.log(pc.yellow('genesis pricing update — não implementado em v0.5.0.'));
      console.log(pc.dim('Override manual: edite ~/.config/genesis/pricing.json'));
      console.log(pc.dim('Formato igual a src/pricing/models.json embarcado.'));
    });
}

function show(): void {
  const table = loadPricing();
  const age = ageDays(table.updatedAt);
  console.log('');
  console.log(pc.bold('Genesis pricing'));
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

function fmt(n: number): string {
  return `$${n.toFixed(2).padStart(7)}`;
}
