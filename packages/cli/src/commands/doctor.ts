import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import pc from 'picocolors';
import { assetsDir, packageRoot } from '../core/paths.js';
import { resolveProjectRoot, readConfig } from '../core/project-state.js';
import { readManifest } from '../core/manifest.js';
import { transcriptsDirFor } from '../core/transcripts.js';
import { loadPricing, ageDays } from '../core/pricing.js';

export function registerDoctor(program: Command): void {
  program
    .command('doctor')
    .description('Valida instalação saudável: pacote + projeto (config + lock + transcripts + pricing)')
    .option('--cwd <path>', 'Projeto destino (default: cwd ascendente; omite checks de projeto se ausente)')
    .action(async (opts: { cwd?: string }) => {
      await runDoctor(opts);
    });
}

interface Check {
  name: string;
  pass: boolean;
  detail?: string;
  warn?: boolean;
}

export async function runDoctor(opts: { cwd?: string } = {}): Promise<void> {
  const checks: Check[] = [];

  // === Pacote ===
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

  if (root) {
    const assets = assetsDir();
    const hasAssets = existsSync(assets);
    checks.push({
      name: 'assets/ embarcados',
      pass: hasAssets,
      detail: hasAssets ? assets : `ausente em ${assets}. Rode \`npm run sync-assets\``,
    });

    if (hasAssets) {
      const expected = [
        '.claude/skills',
        '.claude/rules',
        '.claude/agents',
        '.claude/hooks',
        '.genesis/scripts',
        '.genesis/templates',
        'docs',
        'CLAUDE.md',
        'manifest.json',
      ];
      for (const rel of expected) {
        checks.push({
          name: `assets/${rel}`,
          pass: existsSync(join(assets, rel)),
        });
      }
    }
  }

  // === Runtime ===
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  checks.push({
    name: 'Node ≥ 20.10',
    pass: nodeMajor >= 20,
    detail: `current: v${process.versions.node}`,
  });

  // === Pricing ===
  try {
    const pricing = loadPricing();
    const age = ageDays(pricing.updatedAt);
    checks.push({
      name: 'pricing carregado',
      pass: true,
      detail: `${Object.keys(pricing.models).length} modelos, atualizado em ${pricing.updatedAt}`,
    });
    if (age > 90) {
      checks.push({
        name: 'pricing recente (< 90 dias)',
        pass: false,
        warn: true,
        detail: `${age} dias atrás. Rode \`genesis pricing update\``,
      });
    }
  } catch (err) {
    checks.push({
      name: 'pricing carregado',
      pass: false,
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  // === Projeto (opcional) ===
  let projectRoot: string | undefined;
  try {
    projectRoot = await resolveProjectRoot(opts.cwd);
  } catch {
    // Projeto não detectado — checks de projeto pulam.
  }

  if (projectRoot) {
    checks.push({ name: 'projeto detectado', pass: true, detail: projectRoot });

    // config.json existe + parseável + tem skills
    const cfg = await readConfig(projectRoot).catch(() => null);
    if (cfg) {
      checks.push({
        name: '.genesis/config.json válido',
        pass: cfg.version === 1 && typeof cfg.project?.name === 'string',
        detail: `v${cfg.version}, ${cfg.skills.length} skills, phase: ${cfg.phase.active}`,
      });
    } else {
      checks.push({
        name: '.genesis/config.json',
        pass: false,
        detail: 'ausente ou inválido. Rode `npx @tchr/genesis-cli init` ou crie manualmente',
      });
    }

    // manifest.lock.json
    const lockPath = join(projectRoot, '.genesis', 'manifest.lock.json');
    const lock = await readManifest(lockPath).catch(() => null);
    if (lock) {
      checks.push({
        name: '.genesis/manifest.lock.json',
        pass: true,
        detail: `v${lock.version}, ${Object.keys(lock.files).length} arquivos`,
      });
      // Comparar com pacote
      if (root) {
        const next = await readManifest(join(assetsDir(), 'manifest.json')).catch(() => null);
        if (next && next.version !== lock.version) {
          checks.push({
            name: 'lock sincronizado com pacote',
            pass: false,
            warn: true,
            detail: `lock=${lock.version}, pacote=${next.version}. Rode \`genesis update\``,
          });
        } else if (next) {
          checks.push({
            name: 'lock sincronizado com pacote',
            pass: true,
            detail: `ambos v${lock.version}`,
          });
        }
      }
    } else {
      checks.push({
        name: '.genesis/manifest.lock.json',
        pass: false,
        warn: true,
        detail: 'ausente — update incremental indisponível',
      });
    }

    // Hooks executáveis
    const hooksDir = join(projectRoot, '.claude', 'hooks');
    if (existsSync(hooksDir)) {
      const fs = await import('node:fs/promises');
      const files = await fs.readdir(hooksDir);
      const shHooks = files.filter((f) => f.endsWith('.sh'));
      let allExec = true;
      for (const f of shHooks) {
        try {
          const stat = await fs.stat(join(hooksDir, f));
          // Verifica bit de execução
          if ((stat.mode & 0o111) === 0) allExec = false;
        } catch {
          allExec = false;
        }
      }
      checks.push({
        name: '.claude/hooks/*.sh executáveis',
        pass: allExec,
        detail: allExec ? `${shHooks.length} hooks` : 'algum hook sem chmod +x — rode `chmod +x .claude/hooks/*.sh`',
      });
    }

    // Transcripts dir
    const txDir = transcriptsDirFor(projectRoot);
    const hasTx = existsSync(txDir);
    checks.push({
      name: 'transcripts dir',
      pass: true,
      warn: !hasTx,
      detail: hasTx
        ? `presente: ${txDir}`
        : `ausente: ${txDir} (abra Claude Code no projeto pra gerar)`,
    });
  } else {
    checks.push({
      name: 'projeto detectado',
      pass: true,
      warn: true,
      detail: 'cwd ascendente sem .genesis/ — rodando só checks de pacote',
    });
  }

  // === Relatório ===
  console.log('');
  console.log(pc.bold('Genesis Doctor'));
  console.log('');
  let failed = 0;
  let warnings = 0;
  for (const c of checks) {
    let icon: string;
    if (c.pass && !c.warn) icon = pc.green('✓');
    else if (c.warn) icon = pc.yellow('!');
    else icon = pc.red('✗');
    const detail = c.detail ? pc.dim(` (${c.detail})`) : '';
    console.log(`  ${icon} ${c.name}${detail}`);
    if (!c.pass && !c.warn) failed += 1;
    if (c.warn) warnings += 1;
  }
  console.log('');

  if (failed === 0 && warnings === 0) {
    console.log(pc.green(pc.bold(`APROVADO — ${checks.length} checks OK.`)));
    process.exit(0);
  }
  if (failed === 0) {
    console.log(
      pc.yellow(pc.bold(`APROVADO com warnings — ${checks.length - warnings} OK, ${warnings} warning(s).`)),
    );
    process.exit(0);
  }
  console.log(
    pc.red(
      pc.bold(`FALHOU — ${failed} falha(s), ${warnings} warning(s) em ${checks.length} checks.`),
    ),
  );
  // Silence unused
  void readFile;
  process.exit(1);
}
