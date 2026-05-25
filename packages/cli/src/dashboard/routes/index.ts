import type { GenesisConfig } from '../../core/project-state.js';
import { progressByPhase } from '../../core/project-state.js';
import { PHASES } from '../../core/skills-discovery.js';
import { html } from '../lib/html.js';
import { layout, renderMarkdown } from '../lib/render.js';

export function renderOverview(cfg: GenesisConfig): string {
  const progress = progressByPhase(cfg);
  const totalSkills = cfg.skills.length;
  const doneSkills = cfg.skills.filter((s) => s.status === 'done').length;
  const skippedSkills = cfg.skills.filter((s) => s.status === 'skip').length;
  const pendingSkills = cfg.skills.filter((s) => s.status === 'pending').length;
  const doingSkills = cfg.skills.filter((s) => s.status === 'doing').length;
  const percent = totalSkills === 0 ? 0 : Math.round((doneSkills / totalSkills) * 100);

  const phaseRows = PHASES.map((p) => {
    const b = progress.get(p) ?? { done: 0, total: 0, skip: 0 };
    const pct = b.total === 0 ? 0 : Math.round((b.done / b.total) * 100);
    const isActive = p === cfg.phase.active;
    return html.raw(`<tr class="${isActive ? 'bg-cyan-50' : ''}">
      <td class="px-3 py-2 ${isActive ? 'font-semibold text-cyan-900' : ''}">${isActive ? '→ ' : ''}${p}</td>
      <td class="px-3 py-2 text-right text-sm tabular-nums">${b.done} / ${b.total}</td>
      <td class="px-3 py-2 text-right text-sm text-slate-500 tabular-nums">${b.skip > 0 ? `${b.skip} skip` : ''}</td>
      <td class="px-3 py-2"><div class="w-full bg-slate-200 rounded-full h-2"><div class="bg-cyan-500 h-2 rounded-full" style="width: ${pct}%"></div></div></td>
    </tr>`);
  });

  const intro = renderMarkdown(`# ${cfg.project.name}

Dashboard local do projeto. Use a navegação acima para explorar:

- **Tokens** — uso + custos por modelo/dia/sessão (lê transcripts do Claude Code).
- **Docs** — viewer da documentação do projeto (\`docs/\`).
- **Skills** — skills disponíveis, status atualizado via toggle ou \`genesis skill done/skip\`.
- **Rules** — princípios aplicados em cada phase.
- **Agents** — 22 agents especializados pra revisão profunda.
- **Phases** — visão kanban das 8 phases do lifecycle.
`);

  const body = html`
    <section class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Progresso</div>
        <div class="text-3xl font-bold text-slate-900 mt-1">${percent}<span class="text-lg text-slate-500">%</span></div>
        <div class="text-xs text-slate-500 mt-1">${doneSkills} de ${totalSkills} skills</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Phase ativa</div>
        <div class="text-xl font-semibold text-cyan-700 mt-1">${cfg.phase.active}</div>
        <div class="text-xs text-slate-500 mt-1">desde ${cfg.project.createdAt}</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Em andamento</div>
        <div class="text-3xl font-bold text-amber-600 mt-1">${doingSkills}</div>
        <div class="text-xs text-slate-500 mt-1">${pendingSkills} pendentes</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Skipped</div>
        <div class="text-3xl font-bold text-slate-400 mt-1">${skippedSkills}</div>
        <div class="text-xs text-slate-500 mt-1">não bloqueiam gate</div>
      </div>
    </section>

    <section class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h2 class="font-semibold text-slate-900">Progresso por phase</h2>
        <a href="/phases" class="text-sm text-cyan-700 hover:underline">kanban completo →</a>
      </div>
      <table class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Phase</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Done</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Skip</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase w-1/3">Progresso</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">${phaseRows}</tbody>
      </table>
    </section>

    <section class="prose max-w-none bg-white rounded-lg shadow-sm p-6">${intro}</section>
  `;

  return layout({
    title: 'Overview',
    active: 'overview',
    projectName: cfg.project.name,
    phaseActive: cfg.phase.active,
    body: html.raw(body),
  });
}
