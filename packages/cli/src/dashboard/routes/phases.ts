import type { GenesisConfig } from '../../core/project-state.js';
import { progressByPhase } from '../../core/project-state.js';
import { PHASES } from '../../core/skills-discovery.js';
import { html } from '../lib/html.js';
import { layout } from '../lib/render.js';

export function renderPhases(cfg: GenesisConfig): string {
  const progress = progressByPhase(cfg);

  const columns = PHASES.map((p) => {
    const b = progress.get(p) ?? { done: 0, total: 0, skip: 0 };
    const skills = cfg.skills.filter((s) => s.phase === p);
    const isActive = p === cfg.phase.active;
    const pct = b.total === 0 ? 0 : Math.round((b.done / b.total) * 100);

    const cards = skills.map((s) => {
      const colors: Record<typeof s.status, string> = {
        pending: 'border-slate-200 bg-white',
        doing: 'border-amber-300 bg-amber-50',
        done: 'border-green-300 bg-green-50',
        skip: 'border-slate-200 bg-slate-100 opacity-60',
      };
      const icons: Record<typeof s.status, string> = {
        pending: '○',
        doing: '◐',
        done: '●',
        skip: '⊘',
      };
      return html.raw(
        `<div class="border ${colors[s.status]} rounded p-2 text-xs"><span class="text-slate-500 mr-1">${icons[s.status]}</span><span class="font-mono">${escape(s.id)}</span></div>`,
      );
    });

    return html.raw(`<div class="${isActive ? 'ring-2 ring-cyan-400' : ''} bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="${isActive ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-800'} px-3 py-2 flex items-center justify-between">
        <div class="font-semibold text-sm">${isActive ? '→ ' : ''}${escape(p)}</div>
        <div class="text-xs tabular-nums">${b.done}/${b.total}</div>
      </div>
      <div class="bg-slate-100 h-1"><div class="bg-cyan-500 h-full" style="width: ${pct}%"></div></div>
      <div class="p-2 space-y-1 max-h-[60vh] overflow-y-auto">${cards.length === 0 ? '<div class="text-xs text-slate-400 italic p-1">sem skills</div>' : cards}</div>
    </div>`);
  });

  const body = html`
    <h1 class="text-2xl font-bold text-slate-900 mb-2">Lifecycle: 8 phases</h1>
    <p class="text-sm text-slate-600 mb-6">Phase ativa em destaque ciano. Avance via CLI: <code class="bg-slate-200 px-1 rounded">genesis phase next</code>.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">${columns}</div>
  `;
  return layout({
    title: 'Phases',
    active: 'phases',
    projectName: cfg.project.name,
    phaseActive: cfg.phase.active,
    body: html.raw(body),
  });
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
