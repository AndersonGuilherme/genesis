import type { GenesisConfig } from '../../core/project-state.js';
import { discoverRules, PHASES } from '../../core/skills-discovery.js';
import { html } from '../lib/html.js';
import { layout } from '../lib/render.js';

export async function renderRules(projectRoot: string, cfg: GenesisConfig): Promise<string> {
  const rules = await discoverRules(projectRoot);
  const byPhase = new Map<string, typeof rules>();
  for (const r of rules) {
    if (!byPhase.has(r.phase)) byPhase.set(r.phase, []);
    byPhase.get(r.phase)!.push(r);
  }

  const sections = PHASES.filter((p) => byPhase.has(p)).map((p) => {
    const list = byPhase.get(p) ?? [];
    const items = list.map(
      (r) => html.raw(`<div class="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
        <div class="font-mono text-sm font-semibold text-slate-900">${escape(r.id)}</div>
        <p class="text-sm text-slate-600 mt-1">${escape(r.description)}</p>
      </div>`),
    );
    return html.raw(`<section class="mb-6">
      <h2 class="text-lg font-semibold text-slate-900 mb-3 capitalize">${escape(p)} <span class="text-xs text-slate-400 font-normal">(${list.length})</span></h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${items.map((i) => i.__raw).join('')}</div>
    </section>`);
  });

  const body = html`
    <h1 class="text-2xl font-bold text-slate-900 mb-4">Rules (${rules.length})</h1>
    <p class="text-sm text-slate-600 mb-6">Princípios aplicados automaticamente pelas skills. Skills declaram quais rules carregar via campo <code class="bg-slate-200 px-1 rounded">rules:</code> no frontmatter.</p>
    ${sections}
  `;
  return layout({
    title: 'Rules',
    active: 'rules',
    projectName: cfg.project.name,
    phaseActive: cfg.phase.active,
    body: html.raw(body),
  });
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
