import { Command } from 'commander';
import pc from 'picocolors';
import {
  readConfig,
  writeConfig,
  resolveProjectRoot,
  setActivePhase,
  progressByPhase,
  nextPhase as computeNextPhase,
} from '../core/project-state.js';
import { PHASES, type Phase, isPhase } from '../core/skills-discovery.js';

export function registerPhase(program: Command): void {
  const phase = program.command('phase').description('Inspeciona e avança phase ativa do projeto');

  phase
    .command('status')
    .description('Mostra phase ativa + progresso por phase')
    .option('--cwd <path>')
    .action(async (opts) => status(opts));

  phase
    .command('next')
    .description('Avança pra próxima phase do lifecycle (atualiza .genesis/config.json)')
    .option('--cwd <path>')
    .action(async (opts) => next(opts));

  phase
    .command('set <name>')
    .description('Define phase ativa manualmente')
    .option('--cwd <path>')
    .action(async (name, opts) => set(name, opts));
}

interface CommonOpts {
  cwd?: string;
}

async function status(opts: CommonOpts): Promise<void> {
  const root = await resolveProjectRoot(opts.cwd);
  const cfg = await readConfig(root);
  if (!cfg) throw new Error('.genesis/config.json ausente.');

  console.log('');
  console.log(pc.bold(`Phase ativa: ${pc.cyan(cfg.phase.active)}`));
  console.log('');
  console.log(`  ${pc.dim('PHASE              DONE / TOTAL  (SKIP)')}`);
  const progress = progressByPhase(cfg);
  for (const p of PHASES) {
    const bucket = progress.get(p) ?? { done: 0, total: 0, skip: 0 };
    const arrow = p === cfg.phase.active ? pc.cyan('→') : ' ';
    const label = p.padEnd(18);
    const fraction = `${String(bucket.done).padStart(2)} / ${String(bucket.total).padStart(2)}`;
    const skip = bucket.skip > 0 ? pc.dim(`  (${bucket.skip} skip)`) : '';
    console.log(`  ${arrow} ${label} ${fraction}${skip}`);
  }
  console.log('');
  const nextP = computeNextPhase(cfg.phase.active);
  if (nextP) {
    console.log(pc.dim(`próxima: ${nextP} (rode 'genesis phase next' pra avançar)`));
  } else {
    console.log(pc.dim('última phase do lifecycle.'));
  }
  console.log('');
}

async function next(opts: CommonOpts): Promise<void> {
  const root = await resolveProjectRoot(opts.cwd);
  const cfg = await readConfig(root);
  if (!cfg) throw new Error('.genesis/config.json ausente.');

  const target = computeNextPhase(cfg.phase.active);
  if (!target) {
    console.log(pc.yellow(`já está na última phase (${cfg.phase.active}).`));
    return;
  }
  setActivePhase(cfg, target);
  await writeConfig(root, cfg);
  console.log(`  ${pc.green('✓')} phase ativa: ${pc.cyan(target)}`);
}

async function set(name: string, opts: CommonOpts): Promise<void> {
  if (!isPhase(name)) {
    throw new Error(`phase inválida: '${name}'. Válidas: ${PHASES.join(', ')}`);
  }
  const root = await resolveProjectRoot(opts.cwd);
  const cfg = await readConfig(root);
  if (!cfg) throw new Error('.genesis/config.json ausente.');

  setActivePhase(cfg, name as Phase);
  await writeConfig(root, cfg);
  console.log(`  ${pc.green('✓')} phase ativa: ${pc.cyan(name)}`);
}
