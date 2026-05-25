import type { GenesisConfig } from '../../core/project-state.js';
import { progressByPhase } from '../../core/project-state.js';
import { PHASES } from '../../core/skills-discovery.js';
import { html } from '../lib/html.js';
import { layout } from '../lib/render.js';

export function renderPhases(cfg: GenesisConfig): string {
  const progress = progressByPhase(cfg);

  const STATUS_ORDER: Record<string, number> = { doing: 0, pending: 1, done: 2, skip: 3 };

  const columns = PHASES.map((p) => {
    const b = progress.get(p) ?? { done: 0, total: 0, skip: 0 };
    const skills = cfg.skills
      .filter((s) => s.phase === p)
      .sort(
        (a, c) =>
          (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[c.status] ?? 99) ||
          a.id.localeCompare(c.id),
      );
    const isActive = p === cfg.phase.active;
    const pct = b.total === 0 ? 0 : Math.round((b.done / b.total) * 100);
    const nextSkill = skills.find((s) => s.status === 'pending' || s.status === 'doing');

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
        `<a href="/skills/${escape(s.id)}" class="block border ${colors[s.status]} rounded p-2 text-xs hover:shadow-sm hover:border-cyan-400 transition-all"><span class="text-slate-500 mr-1">${icons[s.status]}</span><span class="font-mono">${escape(s.id)}</span></a>`,
      );
    });

    const nextLine = nextSkill
      ? `<div class="px-3 py-1.5 text-[10px] bg-cyan-50 text-cyan-900 border-b border-cyan-200">próxima: <a href="/skills/${escape(nextSkill.id)}" class="font-mono font-semibold hover:underline">${escape(nextSkill.id)}</a></div>`
      : '';

    return html.raw(`<div class="${isActive ? 'ring-2 ring-cyan-400' : ''} bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="${isActive ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-800'} px-3 py-2 flex items-center justify-between">
        <div class="font-semibold text-sm">${isActive ? '→ ' : ''}${escape(p)}</div>
        <div class="text-xs tabular-nums">${b.done}/${b.total}</div>
      </div>
      <div class="bg-slate-100 h-1"><div class="bg-cyan-500 h-full" style="width: ${pct}%"></div></div>
      ${nextLine}
      <div class="p-2 space-y-1 max-h-[60vh] overflow-y-auto">${cards.length === 0 ? '<div class="text-xs text-slate-400 italic p-1">sem skills</div>' : cards.map((c) => c.__raw).join('')}</div>
    </div>`);
  });

  const body = html`
    <div class="flex items-center justify-between mb-2">
      <h1 class="text-2xl font-bold text-slate-900">Lifecycle: 8 phases</h1>
      <button id="phase-next-btn" class="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-3 py-1.5 rounded">Próxima phase →</button>
    </div>
    <p class="text-sm text-slate-600 mb-6">Phase ativa em destaque ciano. Use os botões nos cards de skill (em /skills) pra marcar progresso.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">${columns}</div>
    <script>${html.raw(PHASE_NEXT_JS)}</script>
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

const PHASE_NEXT_JS = `
document.getElementById('phase-next-btn')?.addEventListener('click', async () => {
  if (!confirm('Avançar pra próxima phase?')) return;
  const res = await fetch('/api/phase/next', { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    alert('erro: ' + (body.error || res.status));
    return;
  }
  location.reload();
});
`;
