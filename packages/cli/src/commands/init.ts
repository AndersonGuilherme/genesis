import { Command } from 'commander';
import { existsSync, statSync } from 'node:fs';
import { copy, ensureDir, remove } from 'fs-extra/esm';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execa } from 'execa';
import pc from 'picocolors';
import fg from 'fast-glob';
import { assetsDir } from '../core/paths.js';
import { readManifest, writeManifest } from '../core/manifest.js';
import { discoverSkills } from '../core/skills-discovery.js';
import { buildDefaultConfig, writeConfig } from '../core/project-state.js';

const NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

export function registerInit(program: Command): void {
  program
    .command('init <nome> [destino]')
    .description('Bootstrapa novo projeto a partir do boilerplate')
    .option('--keep-examples', 'Preserva .genesis/examples/ no projeto-filho')
    .action(async (name: string, dest: string | undefined, opts: { keepExamples?: boolean }) => {
      await runInit(name, dest, opts);
    });
}

interface InitOptions {
  keepExamples?: boolean;
}

export async function runInit(
  name: string,
  destArg: string | undefined,
  opts: InitOptions = {},
): Promise<void> {
  if (!NAME_PATTERN.test(name)) {
    throw new Error(
      `nome do projeto deve ser kebab-case (a-z, 0-9, -), começando com letra. Recebido: '${name}'`,
    );
  }

  const dest = resolve(destArg ?? `./${name}`);
  if (existsSync(dest)) {
    throw new Error(`destino já existe: ${dest}. Apague antes ou escolha outro caminho.`);
  }

  const src = assetsDir();
  if (!existsSync(src)) {
    throw new Error(
      `assets do boilerplate ausentes em ${src}. Esse pacote foi instalado corretamente? (esperado em prepack)`,
    );
  }

  log.info(`criando projeto ${pc.bold(name)} em ${pc.bold(dest)}`);
  log.info(`origem: assets embarcados (${src})`);

  // 1. copy
  await ensureDir(dest);
  await copy(src, dest, {
    filter: (srcPath) => {
      const base = srcPath.replace(src, '');
      // Não copiar o manifest.json bruto (preserva pro lock no fim).
      if (base === '/manifest.json') return false;
      return true;
    },
  });
  log.ok('boilerplate copiado');

  // 2. remover .genesis/examples se aplicável
  if (!opts.keepExamples) {
    const examples = join(dest, '.genesis', 'examples');
    if (existsSync(examples)) {
      await remove(examples);
      log.ok('.genesis/examples/ removido (use --keep-examples pra manter)');
    }
  }

  // 3. substituir README.md pelo template enxuto
  const templateReadme = join(dest, '.genesis', 'templates', 'project-readme.template.md');
  if (existsSync(templateReadme)) {
    await copy(templateReadme, join(dest, 'README.md'), { overwrite: true });
    log.ok('README.md substituído pelo template enxuto do projeto');
  }

  // 4. zerar CHANGELOG.md raiz
  await writeFile(
    join(dest, 'CHANGELOG.md'),
    `# Changelog

Todas as mudanças relevantes do **projeto** ficam aqui. Mudanças do boilerplate vivem em [.genesis/CHANGELOG.md](.genesis/CHANGELOG.md).

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Unreleased]
`,
    'utf8',
  );
  log.ok('CHANGELOG.md raiz resetado');

  // 5. substituir __PROJECT_NAME__ em docs/README/CLAUDE
  const targets = await fg(['README.md', 'CLAUDE.md', 'docs/**/*.md'], {
    cwd: dest,
    onlyFiles: true,
    dot: false,
  });
  let replaced = 0;
  for (const rel of targets) {
    const abs = join(dest, rel);
    const content = await readFile(abs, 'utf8');
    if (content.includes('__PROJECT_NAME__')) {
      await writeFile(abs, content.replaceAll('__PROJECT_NAME__', name), 'utf8');
      replaced += 1;
    }
  }
  if (replaced > 0) {
    log.ok(`placeholders __PROJECT_NAME__ substituídos em ${replaced} arquivo(s)`);
  }

  // 6. zerar PROJECT_STATE.md (nome + datas + estágio + fase ativa)
  const projectState = join(dest, 'docs', 'PROJECT_STATE.md');
  if (existsSync(projectState)) {
    const today = new Date().toISOString().slice(0, 10);
    let content = await readFile(projectState, 'utf8');
    content = content
      .replace(/^(\| Nome do projeto \|).*$/m, `$1 ${name} |`)
      .replace(/^(\| Data de início \|).*$/m, `$1 ${today} |`)
      .replace(/^(\| Última atualização \|).*$/m, `$1 ${today} |`)
      .replace(/^(\| Estágio \|).*$/m, `$1 ideia |`)
      .replace(/^(\*\*Phase ativa agora:\*\*).*$/m, `$1 1 — discovery`);
    await writeFile(projectState, content, 'utf8');
    log.ok('docs/PROJECT_STATE.md zerado para o projeto novo');
  }

  // 7. escrever manifest.lock.json (snapshot da versão pristine do upstream).
  //    Mantemos o manifest CRU (não pós-init) porque update compara contra
  //    novo upstream pristine — arquivos transformados pelo init (README, examples
  //    removidos) aparecem em update como "user-customized" e são preservados.
  const pristineManifest = await readManifest(join(src, 'manifest.json'));
  if (pristineManifest) {
    await writeManifest(join(dest, '.genesis', 'manifest.lock.json'), pristineManifest);
    log.ok(`.genesis/manifest.lock.json gravado (v${pristineManifest.version}, ${Object.keys(pristineManifest.files).length} arquivos)`);
  } else {
    log.warn('manifest.json não encontrado em assets — update incremental ficará indisponível');
  }

  // 8. gerar .genesis/config.json default (descoberta de skills + status pending)
  const skills = await discoverSkills(dest);
  const config = buildDefaultConfig(name, skills);
  await writeConfig(dest, config);
  log.ok(
    `.genesis/config.json gerado (${skills.length} skills em status pending, phase ativa: discovery)`,
  );

  // 9. git init -b main
  try {
    await execa('git', ['init', '-b', 'main'], { cwd: dest, stdio: 'ignore' });
    log.ok('git init feito (branch main)');
  } catch {
    log.warn('git init falhou — instale git e rode `git init -b main` manualmente');
  }

  // Mensagem final
  console.log('');
  console.log(pc.green(pc.bold(`Projeto '${name}' criado em ${dest}`)));
  console.log('');
  console.log('Próximos passos:');
  console.log(`  ${pc.bold('1.')} cd ${dest}`);
  console.log(`  ${pc.bold('2.')} Abra o Claude Code aqui (ou seu cliente de Claude Agent SDK).`);
  console.log(`  ${pc.bold('3.')} Diga: "vamos iniciar o projeto"`);
  console.log(`  ${pc.bold('4.')} Deixe a mentoria conduzir as 8 phases.`);
  console.log('');
  console.log(pc.dim('Gates de readiness: bash .genesis/scripts/check-readiness.sh --planning'));
  console.log('');
}

// helpers ----------------------------------------------------------------

const log = {
  info: (msg: string) => console.log(`${pc.bold('»')} ${msg}`),
  ok: (msg: string) => console.log(`  ${pc.green('✓')} ${msg}`),
  warn: (msg: string) => console.log(`  ${pc.yellow('!')} ${msg}`),
};

// utilizado em tests pra inspecionar default de destino
export function defaultDest(name: string): string {
  return resolve(`./${name}`);
}

// não-export, mas referência futura em update.ts pra contar bytes
function _statBytes(path: string): number {
  return statSync(path).size;
}
