import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { GenesisConfig } from '../../core/project-state.js';
import { html } from '../lib/html.js';
import { layout, renderMarkdown } from '../lib/render.js';

export type EntityType = 'skill' | 'rule' | 'agent';

/**
 * Resolve path absoluto pro arquivo do entity, dado tipo + id.
 *
 * - skill → .claude/skills/<id>/SKILL.md
 * - rule  → .claude/rules/<id>.md
 * - agent → .claude/agents/<id>.md
 */
export function entityFilePath(projectRoot: string, type: EntityType, id: string): string {
  if (type === 'skill') {
    return join(projectRoot, '.claude', 'skills', id, 'SKILL.md');
  }
  if (type === 'rule') {
    return join(projectRoot, '.claude', 'rules', `${id}.md`);
  }
  return join(projectRoot, '.claude', 'agents', `${id}.md`);
}

const ID_PATTERN = /^[a-z][a-z0-9-]*$/;

export function isValidId(id: string): boolean {
  return ID_PATTERN.test(id);
}

export async function renderEntityShow(
  projectRoot: string,
  cfg: GenesisConfig,
  type: EntityType,
  id: string,
): Promise<{ html: string; status: number }> {
  const navActive = type === 'skill' ? 'skills' : type === 'rule' ? 'rules' : 'agents';

  if (!isValidId(id)) {
    return {
      status: 400,
      html: layout({
        title: 'ID inválido',
        active: navActive as 'skills' | 'rules' | 'agents',
        projectName: cfg.project.name,
        phaseActive: cfg.phase.active,
        body: html.raw(html`<div class="bg-red-50 border border-red-200 rounded p-4">ID inválido (deve ser kebab-case): <code>${id}</code></div>`),
      }),
    };
  }

  const abs = entityFilePath(projectRoot, type, id);
  if (!existsSync(abs)) {
    return {
      status: 404,
      html: layout({
        title: `${type} não encontrado`,
        active: navActive as 'skills' | 'rules' | 'agents',
        projectName: cfg.project.name,
        phaseActive: cfg.phase.active,
        body: html.raw(html`<div class="bg-amber-50 border border-amber-200 rounded p-4">
          <p><code>${id}</code> não encontrado em <code>${abs.replace(projectRoot + '/', '')}</code>.</p>
          <p class="mt-2"><a href="/${navActive}" class="text-cyan-700 hover:underline">← voltar pra /${navActive}</a></p>
        </div>`),
      }),
    };
  }

  const raw = await readFile(abs, 'utf8');
  let fm: Record<string, unknown> = {};
  let body = raw;
  try {
    const parsed = matter(raw);
    fm = parsed.data as Record<string, unknown>;
    body = parsed.content;
  } catch {
    // Frontmatter quebrado — exibe raw inteiro
  }

  const relPath = abs.replace(projectRoot + '/', '');
  const rendered = renderMarkdown(body);

  const frontmatterPretty = Object.entries(fm)
    .map(([k, v]) => {
      const val = Array.isArray(v) ? `[${v.join(', ')}]` : String(v);
      return `<div class="grid grid-cols-[120px_1fr] gap-2 py-1 border-b border-slate-100 last:border-0">
        <span class="text-xs font-mono text-slate-500 uppercase">${escape(k)}</span>
        <span class="text-sm text-slate-800">${escape(val)}</span>
      </div>`;
    })
    .join('');

  const html_ = layout({
    title: id,
    active: navActive as 'skills' | 'rules' | 'agents',
    projectName: cfg.project.name,
    phaseActive: cfg.phase.active,
    body: html.raw(html`
      <nav class="text-sm text-slate-500 mb-3">
        <a href="/${navActive}" class="text-cyan-700 hover:underline">${navActive}</a>
        <span class="text-slate-400 mx-1">/</span>
        <span class="font-mono text-slate-700">${id}</span>
      </nav>

      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-slate-900 font-mono">${id}</h1>
        <div class="flex gap-2">
          <button id="edit-btn" class="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-3 py-1.5 rounded">Editar</button>
          <button id="cancel-btn" class="hidden bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-3 py-1.5 rounded">Cancelar</button>
          <button id="save-btn" class="hidden bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1.5 rounded">Salvar</button>
        </div>
      </div>

      <p class="text-xs text-slate-500 mb-3">arquivo: <code class="bg-slate-100 px-1 rounded">${relPath}</code></p>

      <div id="view-mode">
        ${Object.keys(fm).length > 0
          ? html.raw(`<section class="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Frontmatter</div>
            ${frontmatterPretty}
          </section>`)
          : ''}
        <article class="prose max-w-none bg-white rounded-lg shadow-sm p-6">${rendered}</article>
      </div>

      <div id="edit-mode" class="hidden">
        <textarea id="content-editor" class="w-full bg-white border border-slate-300 rounded-lg p-4 font-mono text-sm leading-relaxed shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" rows="40">${raw}</textarea>
        <div id="save-feedback" class="mt-2 text-sm"></div>
      </div>

      <script>${html.raw(EDIT_JS(type, id))}</script>
    `),
  });

  return { html: html_, status: 200 };
}

function EDIT_JS(type: EntityType, id: string): string {
  return `
const editBtn = document.getElementById('edit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const viewMode = document.getElementById('view-mode');
const editMode = document.getElementById('edit-mode');
const editor = document.getElementById('content-editor');
const feedback = document.getElementById('save-feedback');

function setMode(editing) {
  viewMode.classList.toggle('hidden', editing);
  editMode.classList.toggle('hidden', !editing);
  editBtn.classList.toggle('hidden', editing);
  cancelBtn.classList.toggle('hidden', !editing);
  saveBtn.classList.toggle('hidden', !editing);
  feedback.textContent = '';
}

editBtn.addEventListener('click', () => setMode(true));
cancelBtn.addEventListener('click', () => setMode(false));

saveBtn.addEventListener('click', async () => {
  saveBtn.disabled = true;
  saveBtn.textContent = 'Salvando...';
  feedback.textContent = '';
  feedback.className = 'mt-2 text-sm';
  try {
    const res = await fetch('/api/${type}/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ${JSON.stringify(id)}, content: editor.value }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      feedback.textContent = 'erro: ' + (data.error || res.status);
      feedback.className = 'mt-2 text-sm text-red-600';
      return;
    }
    feedback.textContent = '✓ salvo. recarregando...';
    feedback.className = 'mt-2 text-sm text-green-600';
    setTimeout(() => location.reload(), 600);
  } catch (err) {
    feedback.textContent = 'falha de rede: ' + err.message;
    feedback.className = 'mt-2 text-sm text-red-600';
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Salvar';
  }
});
`;
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
