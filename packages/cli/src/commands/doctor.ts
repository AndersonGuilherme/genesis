import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import pc from 'picocolors';
import { assetsDir, packageRoot } from '../core/paths.js';

export function registerDoctor(program: Command): void {
  program
    .command('doctor')
    .description('Valida instalação saudável: assets, lint, paths')
    .action(async () => {
      await runDoctor();
    });
}

interface Check {
  name: string;
  pass: boolean;
  detail?: string;
}

export async function runDoctor(): Promise<void> {
  const checks: Check[] = [];

  // 1. Root do pacote acessível
  let root: string | undefined;
  try {
    root = packageRoot();
    checks.push({ name: 'package root resolvido', pass: true, detail: root });
  } catch (err) {
    checks.push({
      name: 'package root resolvido',
      pass: false,
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  // 2. Assets presentes
  if (root) {
    const assets = assetsDir();
    const hasAssets = existsSync(assets);
    checks.push({
      name: 'assets/ embarcados',
      pass: hasAssets,
      detail: hasAssets ? assets : `ausente em ${assets}. Rode \`npm run sync-assets\``,
    });

    if (hasAssets) {
      // Sub-checks dentro de assets/
      const expected = [
        '.claude',
        '.claude/skills',
        '.claude/rules',
        '.claude/agents',
        '.claude/hooks',
        '.genesis',
        '.genesis/scripts',
        '.genesis/templates',
        'docs',
        'CLAUDE.md',
        'README.md',
        'LICENSE',
      ];
      for (const rel of expected) {
        const p = join(assets, rel);
        checks.push({
          name: `assets/${rel}`,
          pass: existsSync(p),
        });
      }
    }
  }

  // 3. Node version
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  checks.push({
    name: 'Node ≥ 20.10',
    pass: nodeMajor >= 20,
    detail: `current: ${process.versions.node}`,
  });

  // Report
  console.log('');
  console.log(pc.bold('Genesis Doctor'));
  console.log('');
  let failed = 0;
  for (const c of checks) {
    const icon = c.pass ? pc.green('✓') : pc.red('✗');
    const detail = c.detail ? pc.dim(` (${c.detail})`) : '';
    console.log(`  ${icon} ${c.name}${detail}`);
    if (!c.pass) failed += 1;
  }
  console.log('');

  if (failed === 0) {
    console.log(pc.green(pc.bold(`APROVADO — ${checks.length} checks OK.`)));
    process.exit(0);
  }
  console.log(pc.red(pc.bold(`FALHOU — ${failed} de ${checks.length} checks com problema.`)));
  process.exit(1);
}
