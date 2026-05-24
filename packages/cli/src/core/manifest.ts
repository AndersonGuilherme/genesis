import { existsSync } from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, relative } from 'node:path';
import fg from 'fast-glob';

export interface Manifest {
  generatedAt: string;
  version: string;
  files: Record<string, string>; // path → sha256
}

export interface FileDiff {
  path: string;
  pristineHash: string | null; // null = não existia no pristine (novo upstream)
  currentHash: string | null; // null = removido pelo user (raro) ou inexistente
  newHash: string | null; // null = removido do upstream
  kind: 'unchanged' | 'safe-overwrite' | 'user-customized' | 'conflict' | 'added-upstream' | 'removed-upstream';
}

export async function sha256File(absPath: string): Promise<string> {
  const buf = await readFile(absPath);
  return createHash('sha256').update(buf).digest('hex');
}

export async function readManifest(absPath: string): Promise<Manifest | null> {
  if (!existsSync(absPath)) return null;
  const raw = await readFile(absPath, 'utf8');
  return JSON.parse(raw) as Manifest;
}

export async function writeManifest(absPath: string, manifest: Manifest): Promise<void> {
  await mkdir(dirname(absPath), { recursive: true });
  await writeFile(absPath, JSON.stringify(manifest, null, 2), 'utf8');
}

/**
 * Hash de todos os arquivos atualmente no projeto-filho que estão
 * trackeados pelo manifest pristine (lock).
 *
 * Restringido aos paths que pristine conhece — não escaneia o projeto
 * inteiro (evita poluir com node_modules, .git, etc.).
 */
export async function hashCurrent(
  projectRoot: string,
  trackedPaths: string[],
): Promise<Record<string, string | null>> {
  const result: Record<string, string | null> = {};
  for (const rel of trackedPaths) {
    const abs = join(projectRoot, rel);
    result[rel] = existsSync(abs) ? await sha256File(abs) : null;
  }
  return result;
}

/**
 * Gera manifest fresh a partir de um diretório (usado pelo lock após init/update).
 */
export async function buildManifestFromDir(
  rootDir: string,
  version: string,
): Promise<Manifest> {
  const files = await fg(['**/*'], {
    cwd: rootDir,
    onlyFiles: true,
    dot: true,
    ignore: ['node_modules/**', '.git/**', '.genesis/.backup/**', '.genesis/.cache/**'],
  });
  const entries: Record<string, string> = {};
  for (const rel of files.sort()) {
    entries[rel] = await sha256File(join(rootDir, rel));
  }
  return {
    generatedAt: new Date().toISOString(),
    version,
    files: entries,
  };
}

/**
 * 3-way diff: compara pristine (lock) vs current (projeto) vs new (assets do pacote).
 *
 * - unchanged: current == pristine == new
 * - safe-overwrite: current == pristine ≠ new (user não tocou, upstream mudou)
 * - user-customized: current ≠ pristine == new (user tocou, upstream não mudou) → keep
 * - conflict: current ≠ pristine ≠ new (ambos mudaram) → prompt
 * - added-upstream: new tem path que pristine não tem → copy
 * - removed-upstream: pristine tem path que new não tem → prompt delete
 */
export function compareManifests(
  pristine: Manifest,
  current: Record<string, string | null>,
  next: Manifest,
): FileDiff[] {
  const allPaths = new Set<string>([
    ...Object.keys(pristine.files),
    ...Object.keys(next.files),
  ]);

  const diffs: FileDiff[] = [];
  for (const path of allPaths) {
    const pristineHash = pristine.files[path] ?? null;
    const newHash = next.files[path] ?? null;
    const currentHash = current[path] ?? null;

    if (pristineHash === null && newHash !== null) {
      diffs.push({ path, pristineHash, currentHash, newHash, kind: 'added-upstream' });
      continue;
    }
    if (pristineHash !== null && newHash === null) {
      diffs.push({ path, pristineHash, currentHash, newHash, kind: 'removed-upstream' });
      continue;
    }
    if (currentHash === pristineHash && pristineHash === newHash) {
      diffs.push({ path, pristineHash, currentHash, newHash, kind: 'unchanged' });
      continue;
    }
    if (currentHash === pristineHash && pristineHash !== newHash) {
      diffs.push({ path, pristineHash, currentHash, newHash, kind: 'safe-overwrite' });
      continue;
    }
    if (currentHash !== pristineHash && pristineHash === newHash) {
      diffs.push({ path, pristineHash, currentHash, newHash, kind: 'user-customized' });
      continue;
    }
    diffs.push({ path, pristineHash, currentHash, newHash, kind: 'conflict' });
  }
  return diffs.sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * Excludes do diff: arquivos sob `docs/` são sempre user-owned.
 * Manifest.lock também é excluído (gerado pelo update, não trackeado contra si mesmo).
 */
export function isUserOwned(path: string): boolean {
  if (path.startsWith('docs/')) return true;
  if (path === '.genesis/manifest.lock.json') return true;
  if (path.startsWith('.genesis/.backup/')) return true;
  if (path.startsWith('.genesis/.cache/')) return true;
  if (path === 'CHANGELOG.md') return true; // changelog do projeto, não do boilerplate
  return false;
}

export function relativeToRoot(absPath: string, projectRoot: string): string {
  return relative(projectRoot, absPath).split('\\').join('/');
}
