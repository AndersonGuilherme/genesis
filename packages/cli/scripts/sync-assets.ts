#!/usr/bin/env node
/**
 * sync-assets.ts
 *
 * Copia o conteúdo do `packages/boilerplate/` para `packages/cli/assets/`.
 * Rodado antes do `npm pack` / `npm publish` via "prepack".
 *
 * Inclui: .claude/, .genesis/, docs/, CLAUDE.md, README.md, CHANGELOG.md, LICENSE
 * Exclui: node_modules, .git, package.json (do workspace member — não vai no pacote final)
 */
import { copy, ensureDir, remove } from 'fs-extra/esm';
import { existsSync, readFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import fg from 'fast-glob';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const CLI_ROOT = resolve(__dirname, '..');
const BOILERPLATE_ROOT = resolve(CLI_ROOT, '..', 'boilerplate');
const ASSETS_DIR = resolve(CLI_ROOT, 'assets');

const INCLUDED = [
  '.claude',
  '.genesis',
  'docs',
  'CLAUDE.md',
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
];

async function sha256OfFile(absPath: string): Promise<string> {
  const buf = await readFile(absPath);
  return createHash('sha256').update(buf).digest('hex');
}

async function main(): Promise<void> {
  if (!existsSync(BOILERPLATE_ROOT)) {
    throw new Error(`boilerplate não encontrado em ${BOILERPLATE_ROOT}`);
  }

  console.log(`» sync-assets: ${BOILERPLATE_ROOT} → ${ASSETS_DIR}`);

  // Limpa assets/ antigo
  if (existsSync(ASSETS_DIR)) {
    await remove(ASSETS_DIR);
  }
  await ensureDir(ASSETS_DIR);

  // Copia cada entry incluso
  for (const entry of INCLUDED) {
    const src = join(BOILERPLATE_ROOT, entry);
    if (!existsSync(src)) {
      console.warn(`  ! ${entry} ausente em ${BOILERPLATE_ROOT}, pulando`);
      continue;
    }
    await copy(src, join(ASSETS_DIR, entry), {
      filter: (srcPath) => {
        const rel = srcPath.replace(BOILERPLATE_ROOT, '');
        if (rel.includes('/node_modules/')) return false;
        if (rel.endsWith('/package.json') && rel === '/package.json') return false;
        return true;
      },
    });
    console.log(`  ✓ ${entry}`);
  }

  // Gera manifest.json com SHA-256 de cada arquivo (pra futuro `update`)
  const files = await fg(['**/*'], {
    cwd: ASSETS_DIR,
    onlyFiles: true,
    dot: true,
  });
  const manifest: Record<string, string> = {};
  for (const rel of files.sort()) {
    const abs = join(ASSETS_DIR, rel);
    manifest[rel] = await sha256OfFile(abs);
  }
  await writeFile(
    join(ASSETS_DIR, 'manifest.json'),
    JSON.stringify(
      { generatedAt: new Date().toISOString(), version: getVersion(), files: manifest },
      null,
      2,
    ),
    'utf8',
  );
  console.log(`  ✓ manifest.json (${Object.keys(manifest).length} arquivos hash)`);

  console.log('» sync-assets: OK');
}

function getVersion(): string {
  const pkg = JSON.parse(readFileSync(join(CLI_ROOT, 'package.json'), 'utf8')) as {
    version: string;
  };
  return pkg.version;
}

main().catch((err) => {
  console.error('sync-assets falhou:', err);
  process.exit(1);
});
