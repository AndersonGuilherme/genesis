import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { GenesisConfig } from '../../core/project-state.js';
import { html } from '../lib/html.js';
import { layout, renderMarkdown } from '../lib/render.js';
import { buildDocsTree, renderTreeHtml } from '../lib/tree.js';

export async function renderDocs(
  projectRoot: string,
  cfg: GenesisConfig,
  docPath: string,
): Promise<{ html: string; status: number }> {
  const tree = await buildDocsTree(projectRoot);
  const sidebarHtml = renderTreeHtml(tree, docPath);
  const sidebar = html`
    <h3 class="font-semibold text-sm text-slate-900 mb-2 px-2">docs/</h3>
    <ul>${html.raw(sidebarHtml)}</ul>
  `;

  // Index do docs (sem path específico)
  if (!docPath || docPath === '' || docPath === '/') {
    const body = html`
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-bold mb-3">Documentação do projeto</h1>
        <p class="text-slate-600 mb-4">Selecione um arquivo na sidebar pra começar. Sugestões:</p>
        <ul class="list-disc pl-6 space-y-1 text-cyan-700">
          <li><a href="/docs/START_HERE.md" class="hover:underline">START_HERE.md</a> — ponto de entrada do projeto</li>
          <li><a href="/docs/PROJECT_STATE.md" class="hover:underline">PROJECT_STATE.md</a> — estado vivo das phases</li>
          <li><a href="/docs/glossary.md" class="hover:underline">glossary.md</a> — termos consistentes em PT-BR</li>
        </ul>
      </div>
    `;
    return {
      status: 200,
      html: layout({
        title: 'Docs',
        active: 'docs',
        projectName: cfg.project.name,
        phaseActive: cfg.phase.active,
        body: html.raw(body),
        sidebar: html.raw(sidebar),
      }),
    };
  }

  const abs = join(projectRoot, 'docs', docPath);
  if (!abs.startsWith(join(projectRoot, 'docs'))) {
    // path traversal protection
    return {
      status: 400,
      html: layout({
        title: 'Caminho inválido',
        active: 'docs',
        projectName: cfg.project.name,
        phaseActive: cfg.phase.active,
        body: html.raw(html`<div class="bg-red-50 border border-red-200 rounded p-4">Caminho inválido</div>`),
      }),
    };
  }
  if (!existsSync(abs)) {
    return {
      status: 404,
      html: layout({
        title: 'Não encontrado',
        active: 'docs',
        projectName: cfg.project.name,
        phaseActive: cfg.phase.active,
        body: html.raw(html`<div class="bg-amber-50 border border-amber-200 rounded p-4">
          <p>Arquivo não encontrado: <code>docs/${docPath}</code></p>
          <p class="mt-2"><a href="/docs/" class="text-cyan-700 hover:underline">← voltar ao índice</a></p>
        </div>`),
        sidebar: html.raw(sidebar),
      }),
    };
  }

  const raw = await readFile(abs, 'utf8');
  const rendered = renderMarkdown(raw);
  const crumbs = renderBreadcrumbs(docPath);

  const body = html`
    <nav class="text-sm text-slate-500 mb-3">${html.raw(crumbs)}</nav>
    <article class="prose max-w-none bg-white rounded-lg shadow-sm p-6">${rendered}</article>
  `;
  return {
    status: 200,
    html: layout({
      title: docPath.split('/').pop() ?? 'doc',
      active: 'docs',
      projectName: cfg.project.name,
      phaseActive: cfg.phase.active,
      body: html.raw(body),
      sidebar: html.raw(sidebar),
    }),
  };
}

function renderBreadcrumbs(path: string): string {
  const parts = path.split('/');
  const links: string[] = [`<a href="/docs/" class="hover:underline text-cyan-700">docs</a>`];
  for (let i = 0; i < parts.length; i += 1) {
    const accum = parts.slice(0, i + 1).join('/');
    const label = parts[i]!;
    const isLast = i === parts.length - 1;
    if (isLast) {
      links.push(`<span class="text-slate-700 font-medium">${escape(label)}</span>`);
    } else {
      links.push(`<a href="/docs/${escape(accum)}" class="hover:underline text-cyan-700">${escape(label)}</a>`);
    }
  }
  return links.join(' <span class="text-slate-400">/</span> ');
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
