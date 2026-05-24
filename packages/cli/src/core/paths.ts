import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

/**
 * Localiza o root do pacote @tchr/genesis-cli a partir do arquivo atual.
 *
 * Funciona em dev (tsx executando src/core/paths.ts) e em prod
 * (node executando dist/core/paths.js).
 */
export function packageRoot(): string {
  let current = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 6; i += 1) {
    const pkgPath = join(current, 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { name?: string };
      if (pkg.name === '@tchr/genesis-cli') return current;
    }
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  throw new Error('não foi possível localizar o root de @tchr/genesis-cli');
}

/**
 * Diretório onde os assets do boilerplate estão embarcados (criado por sync-assets).
 */
export function assetsDir(): string {
  return join(packageRoot(), 'assets');
}
