import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { copy, ensureDir, remove } from 'fs-extra/esm';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { findUp } from 'find-up';
import { select, isCancel, cancel, intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import { assetsDir } from '../core/paths.js';
import {
  readManifest,
  writeManifest,
  hashCurrent,
  compareManifests,
  isUserOwned,
  type FileDiff,
  type Manifest,
} from '../core/manifest.js';

export function registerUpdate(program: Command): void {
  program
    .command('update')
    .description('Atualiza projeto-filho com a versão nova do boilerplate (3-way merge por hash)')
    .option('--dry-run', 'Mostra o que mudaria sem aplicar')
    .option('--force', 'Aplica safe-overwrite e adds sem prompt (conflitos ainda perguntam)')
    .option('--cwd <path>', 'Projeto destino (default: cwd subindo até achar .genesis/manifest.lock.json)')
    .action(async (opts: { dryRun?: boolean; force?: boolean; cwd?: string }) => {
      await runUpdate(opts);
    });
}

interface UpdateOptions {
  dryRun?: boolean;
  force?: boolean;
  cwd?: string;
}

export async function runUpdate(opts: UpdateOptions = {}): Promise<void> {
  intro(pc.bold('Genesis update'));

  const projectRoot = await resolveProjectRoot(opts.cwd);
  log.info(`projeto: ${pc.bold(projectRoot)}`);

  const lockPath = join(projectRoot, '.genesis', 'manifest.lock.json');
  const pristine = await readManifest(lockPath);
  if (!pristine) {
    throw new Error(
      `.genesis/manifest.lock.json não encontrado em ${projectRoot}. Esse projeto foi criado com @tchr/genesis-cli ≥ 0.2.0? (init mais antigo não gravava lock)`,
    );
  }
  log.info(`versão instalada: ${pc.bold(`v${pristine.version}`)} (${Object.keys(pristine.files).length} arquivos)`);

  const newManifestPath = join(assetsDir(), 'manifest.json');
  const next = await readManifest(newManifestPath);
  if (!next) {
    throw new Error(`manifest.json ausente em ${newManifestPath}. CLI corrompido?`);
  }
  log.info(`versão disponível: ${pc.bold(`v${next.version}`)} (${Object.keys(next.files).length} arquivos)`);

  if (pristine.version === next.version) {
    log.info('mesma versão — nada a fazer.');
    outro(pc.green('up-to-date'));
    return;
  }

  // Compute hashes do projeto atual (apenas paths que pristine ou next conhecem)
  const trackedPaths = Array.from(
    new Set([...Object.keys(pristine.files), ...Object.keys(next.files)]),
  );
  const current = await hashCurrent(projectRoot, trackedPaths);

  const diffs = compareManifests(pristine, current, next);
  const actionable = diffs.filter((d) => d.kind !== 'unchanged' && !isUserOwned(d.path));

  const summary = summarize(actionable);
  log.info('mudanças:');
  console.log(`  ${pc.green('safe-overwrite')}: ${summary.safe}`);
  console.log(`  ${pc.cyan('added-upstream')}: ${summary.added}`);
  console.log(`  ${pc.yellow('user-customized')}: ${summary.customized} (mantidos)`);
  console.log(`  ${pc.red('conflict')}: ${summary.conflict}`);
  console.log(`  ${pc.dim('removed-upstream')}: ${summary.removed}`);
  console.log('');

  if (opts.dryRun) {
    printDryRunDetail(actionable);
    outro(pc.yellow('dry-run — nada aplicado'));
    return;
  }

  if (actionable.length === 0) {
    outro(pc.green('nenhuma mudança aplicável'));
    return;
  }

  // Backup
  const backupDir = join(projectRoot, '.genesis', '.backup', new Date().toISOString().replace(/[:.]/g, '-'));
  log.info(`backup em ${pc.dim(backupDir)}`);

  const srcAssets = assetsDir();
  let applied = 0;

  for (const diff of actionable) {
    const absProject = join(projectRoot, diff.path);
    const absNew = join(srcAssets, diff.path);

    switch (diff.kind) {
      case 'safe-overwrite': {
        await backupFile(absProject, backupDir, diff.path);
        await ensureDir(dirname(absProject));
        await copy(absNew, absProject, { overwrite: true });
        log.applied('safe-overwrite', diff.path);
        applied += 1;
        break;
      }
      case 'added-upstream': {
        await ensureDir(dirname(absProject));
        await copy(absNew, absProject, { overwrite: false, errorOnExist: false });
        log.applied('added', diff.path);
        applied += 1;
        break;
      }
      case 'user-customized': {
        // Não mexer — usuário tocou, upstream não mudou.
        break;
      }
      case 'removed-upstream': {
        const action = opts.force ? 'delete' : await promptRemoved(diff.path);
        if (action === 'delete') {
          await backupFile(absProject, backupDir, diff.path);
          await remove(absProject);
          log.applied('deleted', diff.path);
          applied += 1;
        } else if (action === 'keep') {
          log.skip(diff.path);
        } else if (action === 'cancel') {
          cancel('cancelado pelo usuário');
          process.exit(1);
        }
        break;
      }
      case 'conflict': {
        const action = await promptConflict(diff.path);
        if (action === 'keep') {
          log.skip(diff.path);
        } else if (action === 'overwrite') {
          await backupFile(absProject, backupDir, diff.path);
          await copy(absNew, absProject, { overwrite: true });
          log.applied('overwrite', diff.path);
          applied += 1;
        } else if (action === 'new-side') {
          await copy(absNew, `${absProject}.new`, { overwrite: true });
          log.applied('wrote .new', `${diff.path}.new`);
          applied += 1;
        } else if (action === 'cancel') {
          cancel('cancelado pelo usuário');
          process.exit(1);
        }
        break;
      }
      default:
        break;
    }
  }

  // Atualizar lock pra refletir a nova versão pristine
  const newLock: Manifest = {
    generatedAt: new Date().toISOString(),
    version: next.version,
    files: next.files,
  };
  await writeManifest(lockPath, newLock);
  log.ok(`manifest.lock.json atualizado para v${next.version}`);

  outro(pc.green(`update completo — ${applied} mudança(s) aplicada(s)`));
}

// helpers ----------------------------------------------------------------

async function resolveProjectRoot(cwdOpt?: string): Promise<string> {
  if (cwdOpt) {
    const abs = resolve(cwdOpt);
    if (!existsSync(join(abs, '.genesis'))) {
      throw new Error(`--cwd ${abs} não contém .genesis/`);
    }
    return abs;
  }
  const lock = await findUp('.genesis/manifest.lock.json', { cwd: process.cwd() });
  if (lock) return resolve(lock, '..', '..');
  // Fallback: subir até achar .genesis/
  const genesisDir = await findUp('.genesis', { cwd: process.cwd(), type: 'directory' });
  if (!genesisDir) {
    throw new Error('projeto Genesis não localizado (sem .genesis/ ascendente). Use --cwd.');
  }
  return resolve(genesisDir, '..');
}

function summarize(diffs: FileDiff[]): {
  safe: number;
  added: number;
  customized: number;
  conflict: number;
  removed: number;
} {
  const s = { safe: 0, added: 0, customized: 0, conflict: 0, removed: 0 };
  for (const d of diffs) {
    if (d.kind === 'safe-overwrite') s.safe += 1;
    else if (d.kind === 'added-upstream') s.added += 1;
    else if (d.kind === 'user-customized') s.customized += 1;
    else if (d.kind === 'conflict') s.conflict += 1;
    else if (d.kind === 'removed-upstream') s.removed += 1;
  }
  return s;
}

function printDryRunDetail(diffs: FileDiff[]): void {
  for (const d of diffs) {
    const color = pickColor(d.kind);
    console.log(`  ${color(d.kind.padEnd(18))} ${d.path}`);
  }
}

function pickColor(kind: FileDiff['kind']): (s: string) => string {
  if (kind === 'safe-overwrite') return pc.green;
  if (kind === 'added-upstream') return pc.cyan;
  if (kind === 'user-customized') return pc.yellow;
  if (kind === 'conflict') return pc.red;
  if (kind === 'removed-upstream') return pc.dim;
  return pc.white;
}

async function backupFile(absFile: string, backupRoot: string, relPath: string): Promise<void> {
  if (!existsSync(absFile)) return;
  const dest = join(backupRoot, relPath);
  await ensureDir(dirname(dest));
  const content = await readFile(absFile);
  await writeFile(dest, content);
}

async function promptConflict(
  path: string,
): Promise<'keep' | 'overwrite' | 'new-side' | 'cancel'> {
  const choice = await select({
    message: `conflito em ${pc.bold(path)} — você customizou E upstream mudou. O que fazer?`,
    options: [
      { value: 'keep', label: 'keep — manter minha versão atual', hint: 'ignora upstream' },
      { value: 'overwrite', label: 'overwrite — sobrescrever com upstream', hint: 'perde customização (backup automático)' },
      { value: 'new-side', label: 'write .new — escrever upstream em arquivo .new ao lado', hint: 'compara depois manualmente' },
      { value: 'cancel', label: 'cancel — abortar update' },
    ],
  });
  if (isCancel(choice)) return 'cancel';
  return choice as 'keep' | 'overwrite' | 'new-side' | 'cancel';
}

async function promptRemoved(path: string): Promise<'delete' | 'keep' | 'cancel'> {
  const choice = await select({
    message: `${pc.bold(path)} foi removido upstream — deletar localmente?`,
    options: [
      { value: 'keep', label: 'keep — manter arquivo local (não tracked mais)' },
      { value: 'delete', label: 'delete — remover (backup automático)' },
      { value: 'cancel', label: 'cancel — abortar' },
    ],
  });
  if (isCancel(choice)) return 'cancel';
  return choice as 'delete' | 'keep' | 'cancel';
}

const log = {
  info: (msg: string) => console.log(`${pc.bold('»')} ${msg}`),
  ok: (msg: string) => console.log(`  ${pc.green('✓')} ${msg}`),
  warn: (msg: string) => console.log(`  ${pc.yellow('!')} ${msg}`),
  applied: (kind: string, path: string) =>
    console.log(`  ${pc.green('✓')} ${pc.dim(kind.padEnd(12))} ${path}`),
  skip: (path: string) => console.log(`  ${pc.dim('· skip')}      ${path}`),
};
