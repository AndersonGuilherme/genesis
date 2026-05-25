import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { GenesisConfig } from '../../core/project-state.js';
import { discoverRules, discoverSkills } from '../../core/skills-discovery.js';
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
    .filter(([k]) => !(type === 'skill' && k === 'rules')) // rules tem editor dedicado
    .map(([k, v]) => {
      const val = Array.isArray(v) ? `[${v.join(', ')}]` : String(v);
      return `<div class="grid grid-cols-[120px_1fr] gap-2 py-1 border-b border-slate-100 last:border-0">
        <span class="text-xs font-mono text-slate-500 uppercase">${escape(k)}</span>
        <span class="text-sm text-slate-800">${escape(val)}</span>
      </div>`;
    })
    .join('');

  // Relacionamentos
  let rulesEditorSection = '';
  if (type === 'skill') {
    const currentRules = Array.isArray(fm.rules) ? (fm.rules as string[]) : [];
    const availableRules = await discoverRules(projectRoot);
    rulesEditorSection = renderSkillRulesEditor(id, currentRules, availableRules);
  }

  let usedBySection = '';
  if (type === 'rule') {
    const allSkills = await discoverSkills(projectRoot);
    const usedBy = allSkills.filter((s) => Array.isArray(s.rules) && s.rules.includes(id));
    usedBySection = renderUsedBy(usedBy);
  }

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
          <button id="delete-btn" class="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded">Excluir</button>
          <button id="cancel-btn" class="hidden bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-3 py-1.5 rounded">Cancelar</button>
          <button id="save-btn" class="hidden bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1.5 rounded">Salvar</button>
        </div>
      </div>

      <p class="text-xs text-slate-500 mb-3">arquivo: <code class="bg-slate-100 px-1 rounded">${relPath}</code></p>

      <div id="view-mode">
        ${rulesEditorSection ? html.raw(rulesEditorSection) : ''}
        ${usedBySection ? html.raw(usedBySection) : ''}
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
      ${type === 'skill' ? html.raw(`<script>${SKILL_RULES_JS(id)}</script>`) : ''}
    `),
  });

  return { html: html_, status: 200 };
}

function renderSkillRulesEditor(
  skillId: string,
  currentRules: string[],
  availableRules: { id: string; phase: string; description: string }[],
): string {
  const chips = currentRules
    .map(
      (r) => `<span class="inline-flex items-center gap-1 bg-cyan-100 text-cyan-900 text-xs font-mono px-2 py-1 rounded" data-rule="${escape(r)}">
        <a href="/rules/${escape(r)}" class="hover:underline">${escape(r)}</a>
        <button type="button" data-remove-rule="${escape(r)}" class="text-cyan-700 hover:text-red-600 ml-1 font-bold">×</button>
      </span>`,
    )
    .join('');

  const available = availableRules.filter((r) => !currentRules.includes(r.id));
  const options = available
    .sort((a, b) => a.phase.localeCompare(b.phase) || a.id.localeCompare(b.id))
    .map((r) => `<option value="${escape(r.id)}">${escape(r.phase)} · ${escape(r.id)}</option>`)
    .join('');

  return `<section class="bg-white rounded-lg shadow-sm p-4 mb-4">
    <div class="flex items-center justify-between mb-2">
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rules vinculadas (${currentRules.length})</div>
      <span class="text-xs text-slate-400">carregadas via Pre-flight</span>
    </div>
    <div id="rules-chips" class="flex flex-wrap gap-1 mb-3 min-h-[28px]">
      ${chips || '<span class="text-xs text-slate-400 italic">nenhuma rule vinculada</span>'}
    </div>
    <div class="flex gap-2 items-center">
      <select id="rule-select" class="flex-1 border border-slate-300 rounded px-2 py-1 text-xs font-mono">
        <option value="">— escolher rule —</option>
        ${options}
      </select>
      <button type="button" id="add-rule-btn" class="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1 rounded">+ Adicionar</button>
      <button type="button" id="save-rules-btn" class="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium px-3 py-1 rounded">Salvar rules</button>
    </div>
    <div id="rules-feedback" class="mt-2 text-xs"></div>
  </section>`;
}

function renderUsedBy(skills: { id: string; phase: string }[]): string {
  if (skills.length === 0) {
    return `<section class="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Usado por</div>
      <p class="text-xs text-slate-400 italic">nenhuma skill carrega essa rule.</p>
    </section>`;
  }
  const list = skills
    .map(
      (s) => `<a href="/skills/${escape(s.id)}" class="inline-flex items-center gap-1 bg-slate-100 hover:bg-cyan-100 text-slate-700 hover:text-cyan-900 text-xs font-mono px-2 py-1 rounded transition-colors">
        <span class="text-slate-500">${escape(s.phase)}</span>
        <span>·</span>
        <span>${escape(s.id)}</span>
      </a>`,
    )
    .join('');
  return `<section class="bg-white rounded-lg shadow-sm p-4 mb-4">
    <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Usado por (${skills.length} skill${skills.length > 1 ? 's' : ''})</div>
    <div class="flex flex-wrap gap-1">${list}</div>
  </section>`;
}

function SKILL_RULES_JS(skillId: string): string {
  return `
const chipsDiv = document.getElementById('rules-chips');
const select = document.getElementById('rule-select');
const addBtn = document.getElementById('add-rule-btn');
const saveBtn = document.getElementById('save-rules-btn');
const feedback = document.getElementById('rules-feedback');

function currentRules() {
  return Array.from(chipsDiv.querySelectorAll('[data-rule]')).map((el) => el.getAttribute('data-rule'));
}

function rebuildChips(rules) {
  if (rules.length === 0) {
    chipsDiv.innerHTML = '<span class="text-xs text-slate-400 italic">nenhuma rule vinculada</span>';
    return;
  }
  chipsDiv.innerHTML = rules.map((r) =>
    '<span class="inline-flex items-center gap-1 bg-cyan-100 text-cyan-900 text-xs font-mono px-2 py-1 rounded" data-rule="' + r + '">' +
      '<a href="/rules/' + r + '" class="hover:underline">' + r + '</a>' +
      '<button type="button" data-remove-rule="' + r + '" class="text-cyan-700 hover:text-red-600 ml-1 font-bold">×</button>' +
    '</span>'
  ).join('');
  attachRemoveHandlers();
}

function attachRemoveHandlers() {
  chipsDiv.querySelectorAll('[data-remove-rule]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rule = btn.getAttribute('data-remove-rule');
      const updated = currentRules().filter((r) => r !== rule);
      rebuildChips(updated);
    });
  });
}
attachRemoveHandlers();

addBtn.addEventListener('click', () => {
  const val = select.value;
  if (!val) return;
  if (currentRules().includes(val)) return;
  rebuildChips([...currentRules(), val]);
  // remove option do select
  const opt = select.querySelector('option[value="' + val + '"]');
  if (opt) opt.remove();
  select.value = '';
});

saveBtn.addEventListener('click', async () => {
  saveBtn.disabled = true;
  saveBtn.textContent = 'Salvando...';
  feedback.textContent = '';
  try {
    const res = await fetch('/api/skill/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ${JSON.stringify(skillId)}, rules: currentRules() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      feedback.textContent = 'erro: ' + (data.error || res.status);
      feedback.className = 'mt-2 text-xs text-red-600';
      return;
    }
    feedback.textContent = '✓ rules salvas. recarregando...';
    feedback.className = 'mt-2 text-xs text-green-600';
    setTimeout(() => location.reload(), 600);
  } catch (err) {
    feedback.textContent = 'falha: ' + err.message;
    feedback.className = 'mt-2 text-xs text-red-600';
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Salvar rules';
  }
});
`;
}

function EDIT_JS(type: EntityType, id: string): string {
  const listRoute = type === 'skill' ? '/skills' : type === 'rule' ? '/rules' : '/agents';
  return `
const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('delete-btn');
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
  deleteBtn.classList.toggle('hidden', editing);
  cancelBtn.classList.toggle('hidden', !editing);
  saveBtn.classList.toggle('hidden', !editing);
  feedback.textContent = '';
}

editBtn.addEventListener('click', () => setMode(true));
cancelBtn.addEventListener('click', () => setMode(false));

deleteBtn.addEventListener('click', async () => {
  if (!confirm('Excluir ${type} ${id}? Backup automático será criado em .genesis/.backup/')) return;
  deleteBtn.disabled = true;
  deleteBtn.textContent = 'Excluindo...';
  try {
    const res = await fetch('/api/${type}/' + ${JSON.stringify(id)}, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert('erro: ' + (data.error || res.status));
      deleteBtn.disabled = false;
      deleteBtn.textContent = 'Excluir';
      return;
    }
    location.href = ${JSON.stringify(listRoute)};
  } catch (err) {
    alert('falha de rede: ' + err.message);
    deleteBtn.disabled = false;
    deleteBtn.textContent = 'Excluir';
  }
});

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
