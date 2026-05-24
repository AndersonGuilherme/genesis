import { Command } from 'commander';
import pc from 'picocolors';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { discoverSkills, PHASES } from '../core/skills-discovery.js';
import {
  readConfig,
  writeConfig,
  resolveProjectRoot,
  setSkillStatus,
  type SkillStatus,
} from '../core/project-state.js';

export function registerSkill(program: Command): void {
  const skill = program.command('skill').description('Inspeciona e atualiza status das skills do projeto');

  skill
    .command('list')
    .description('Lista skills do projeto com status atual')
    .option('--phase <name>', 'Filtra por phase')
    .option('--status <name>', 'Filtra por status (pending|doing|done|skip)')
    .option('--cwd <path>', 'Projeto destino (default: cwd ascendente)')
    .action(async (opts) => list(opts));

  skill
    .command('show <id>')
    .description('Mostra detalhes da skill (frontmatter + status + rules)')
    .option('--cwd <path>')
    .action(async (id, opts) => show(id, opts));

  for (const status of ['select', 'skip', 'done'] as const) {
    const cmdName = status;
    const targetStatus: SkillStatus = status === 'select' ? 'doing' : (status as SkillStatus);
    skill
      .command(`${cmdName} <id>`)
      .description(`Marca skill como ${targetStatus}`)
      .option('--notes <text>', 'Anotação curta')
      .option('--cwd <path>')
      .action(async (id, opts) => setStatus(id, targetStatus, opts));
  }
}

interface CommonOpts {
  cwd?: string;
  notes?: string;
  phase?: string;
  status?: string;
}

async function list(opts: CommonOpts): Promise<void> {
  const root = await resolveProjectRoot(opts.cwd);
  const cfg = await readConfig(root);
  if (!cfg) {
    throw new Error('.genesis/config.json ausente. Esse projeto foi criado com @tchr/genesis-cli ≥ 0.3.0?');
  }

  let rows = cfg.skills;
  if (opts.phase) rows = rows.filter((s) => s.phase === opts.phase);
  if (opts.status) rows = rows.filter((s) => s.status === opts.status);

  console.log('');
  console.log(pc.bold(`Skills do projeto '${cfg.project.name}' — phase ativa: ${pc.cyan(cfg.phase.active)}`));
  console.log('');
  console.log(`  ${pc.dim('STATUS    PHASE          ID')}`);
  for (const s of rows) {
    const icon = statusIcon(s.status);
    const phase = s.phase.padEnd(14);
    console.log(`  ${icon} ${pc.dim(phase)} ${s.id}`);
  }
  console.log('');
  console.log(pc.dim(`${rows.length} skill(s) listada(s).`));
}

async function show(id: string, opts: CommonOpts): Promise<void> {
  const root = await resolveProjectRoot(opts.cwd);
  const cfg = await readConfig(root);
  if (!cfg) throw new Error('.genesis/config.json ausente.');

  const state = cfg.skills.find((s) => s.id === id);
  if (!state) {
    throw new Error(`skill '${id}' não está no config.`);
  }

  // Descobre meta a partir do filesystem
  const skills = await discoverSkills(root);
  const meta = skills.find((s) => s.id === id);

  console.log('');
  console.log(pc.bold(`Skill: ${id}`));
  console.log(`  status:     ${statusIcon(state.status)} ${state.status}`);
  console.log(`  phase:      ${pc.cyan(state.phase)}`);
  if (state.notes) console.log(`  notes:      ${state.notes}`);
  if (state.updatedAt) console.log(`  updated:    ${pc.dim(state.updatedAt)}`);
  if (meta) {
    console.log(`  path:       ${pc.dim(meta.path)}`);
    console.log(`  description:`);
    console.log(`    ${meta.description}`);
    if (meta.rules && meta.rules.length > 0) {
      console.log(`  rules carregadas:`);
      for (const r of meta.rules) {
        console.log(`    - ${pc.dim(r)}`);
      }
    }
  } else {
    console.log(pc.yellow('  ! skill não encontrada no filesystem (config desatualizado?)'));
  }
  console.log('');
}

async function setStatus(id: string, status: SkillStatus, opts: CommonOpts): Promise<void> {
  const root = await resolveProjectRoot(opts.cwd);
  const cfg = await readConfig(root);
  if (!cfg) throw new Error('.genesis/config.json ausente.');

  setSkillStatus(cfg, id, status, opts.notes);
  await writeConfig(root, cfg);
  console.log(`  ${pc.green('✓')} skill ${pc.bold(id)} → ${statusIcon(status)} ${status}`);
}

function statusIcon(status: SkillStatus): string {
  switch (status) {
    case 'pending':
      return pc.dim('○');
    case 'doing':
      return pc.yellow('◐');
    case 'done':
      return pc.green('●');
    case 'skip':
      return pc.gray('⊘');
    default:
      return '?';
  }
}

// Re-exporta utilitário (não usado externamente, mas util pra docs/test)
export const __testing = { statusIcon };

// silence unused
void readFile;
void join;
void PHASES;
