import type { GenesisConfig } from '../../core/project-state.js';
import { PHASES } from '../../core/skills-discovery.js';
import { html } from '../lib/html.js';
import { layout } from '../lib/render.js';
import type { EntityType } from './entity-show.js';

export function renderEntityNew(cfg: GenesisConfig, type: EntityType): string {
  const navActive = (type === 'skill' ? 'skills' : type === 'rule' ? 'rules' : 'agents') as
    | 'skills'
    | 'rules'
    | 'agents';
  const label = type === 'skill' ? 'Skill' : type === 'rule' ? 'Rule' : 'Agent';

  const template = templateFor(type);
  const phaseOptions = PHASES.map((p) => `<option value="${p}">${p}</option>`).join('');

  const body = html.raw(html`
    <nav class="text-sm text-slate-500 mb-3">
      <a href="/${navActive}" class="text-cyan-700 hover:underline">${navActive}</a>
      <span class="text-slate-400 mx-1">/</span>
      <span class="text-slate-700">nova</span>
    </nav>

    <h1 class="text-2xl font-bold text-slate-900 mb-4">Nova ${label}</h1>

    <form id="create-form" class="space-y-4">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">ID</label>
        <input id="id-input" type="text" required pattern="^[a-z][a-z0-9-]*$" placeholder="ex: ${type === 'skill' ? 'sec-define-foo' : type === 'rule' ? 'dev-foo-required' : 'sec-foo-reviewer'}" class="w-full border border-slate-300 rounded px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none">
        <p class="text-xs text-slate-500 mt-1">kebab-case, sem espaços. Convenção: prefix de phase (sec-/lgpd-/dev-/etc).</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-4">
        <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Phase</label>
        <select id="phase-select" required class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none">
          ${html.raw(phaseOptions)}
        </select>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-4">
        <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Conteúdo (frontmatter + body)</label>
        <textarea id="content-textarea" rows="30" required class="w-full border border-slate-300 rounded p-3 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-cyan-500 focus:outline-none">${template}</textarea>
        <p class="text-xs text-slate-500 mt-1">O ID e phase do frontmatter são auto-preenchidos quando você muda os campos acima.</p>
      </div>

      <div class="flex items-center gap-2">
        <button type="submit" id="submit-btn" class="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded">Criar</button>
        <a href="/${navActive}" class="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded">Cancelar</a>
        <div id="feedback" class="ml-3 text-sm"></div>
      </div>
    </form>

    <script>${html.raw(CREATE_JS(type))}</script>
  `);

  return layout({
    title: `Nova ${label}`,
    active: navActive,
    projectName: cfg.project.name,
    phaseActive: cfg.phase.active,
    body,
  });
}

function templateFor(type: EntityType): string {
  if (type === 'skill') {
    return `---
name: NOME_DA_SKILL
description: Breve descrição (1 frase) do que essa skill faz.
phase: discovery
rules:
  - dev-tdd-pragmatic
---

# Skill: NOME_DA_SKILL

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Descreva em 1 parágrafo o output esperado.

## Quando usar

- Caso 1.
- Caso 2.

## Processo

1. Passo 1.
2. Passo 2.
3. Passo 3.

## Critérios de conclusão

- [ ] Critério 1.
- [ ] Critério 2.
`;
  }
  if (type === 'rule') {
    return `---
name: NOME_DA_RULE
description: Princípio em 1 frase.
phase: discovery
---

# Rule: NOME_DA_RULE

## Princípio

Texto curto que descreve a regra.

## Por que existe

Justificativa pra existir essa regra. Que problema ela previne?

## Como aplicar

1. Ação concreta 1.
2. Ação concreta 2.

## Exemplos bons

- Exemplo positivo 1.
- Exemplo positivo 2.

## Exemplos ruins

- Anti-padrão 1.
- Anti-padrão 2.

## Exceções

- Quando essa regra NÃO se aplica.
`;
  }
  return `---
name: NOME_DO_AGENT
description: O que esse agent faz (1 frase).
tools: Read, Grep, Glob
phase: discovery
---

# Nome do Agent

Descrição expandida do papel desse agent.

## Quando invocada

- Caso 1.
- Caso 2.

## Como atua

1. Passo 1.
2. Passo 2.

## O que cobra

- Anti-padrão 1.
- Anti-padrão 2.

## Tom

Adjetivos descrevendo o tom esperado (técnico, mentor, cético, etc.).
`;
}

function CREATE_JS(type: EntityType): string {
  return `
const idInput = document.getElementById('id-input');
const phaseSelect = document.getElementById('phase-select');
const textarea = document.getElementById('content-textarea');
const form = document.getElementById('create-form');
const submitBtn = document.getElementById('submit-btn');
const feedback = document.getElementById('feedback');

function syncFrontmatter() {
  const id = idInput.value.trim();
  const phase = phaseSelect.value;
  let content = textarea.value;
  if (id) content = content.replace(/^name: .*$/m, 'name: ' + id);
  content = content.replace(/^phase: .*$/m, 'phase: ' + phase);
  textarea.value = content;
}

idInput.addEventListener('input', syncFrontmatter);
phaseSelect.addEventListener('change', syncFrontmatter);

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const id = idInput.value.trim();
  if (!/^[a-z][a-z0-9-]*$/.test(id)) {
    feedback.textContent = 'id inválido (kebab-case)';
    feedback.className = 'ml-3 text-sm text-red-600';
    return;
  }
  syncFrontmatter();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Criando...';
  feedback.textContent = '';
  try {
    const res = await fetch('/api/${type}/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, content: textarea.value }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      feedback.textContent = 'erro: ' + (data.error || res.status);
      feedback.className = 'ml-3 text-sm text-red-600';
      return;
    }
    feedback.textContent = '✓ criada. redirecionando...';
    feedback.className = 'ml-3 text-sm text-green-600';
    setTimeout(() => { location.href = '/${type === 'skill' ? 'skills' : type === 'rule' ? 'rules' : 'agents'}/' + id; }, 600);
  } catch (err) {
    feedback.textContent = 'falha de rede: ' + err.message;
    feedback.className = 'ml-3 text-sm text-red-600';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Criar';
  }
});
`;
}
