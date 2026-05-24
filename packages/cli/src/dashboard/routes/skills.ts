import type { GenesisConfig, SkillStatus } from '../../core/project-state.js';
import { discoverSkills, PHASES } from '../../core/skills-discovery.js';
import { html } from '../lib/html.js';
import { layout } from '../lib/render.js';

export async function renderSkills(
  projectRoot: string,
  cfg: GenesisConfig,
  query: URLSearchParams,
): Promise<string> {
  const filterPhase = query.get('phase') ?? '';
  const filterStatus = query.get('status') ?? '';

  const metas = await discoverSkills(projectRoot);
  const metaMap = new Map(metas.map((m) => [m.id, m]));

  let rows = cfg.skills;
  if (filterPhase) rows = rows.filter((s) => s.phase === filterPhase);
  if (filterStatus) rows = rows.filter((s) => s.status === filterStatus);

  const cards = rows.map((s) => {
    const meta = metaMap.get(s.id);
    const desc = meta?.description ?? '';
    const rules = meta?.rules ?? [];
    return html.raw(`<div class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between gap-2 mb-2">
        <div>
          <div class="font-mono text-sm text-slate-900 font-semibold">${escape(s.id)}</div>
          <div class="text-xs text-slate-500 mt-0.5">phase: <span class="text-cyan-700">${escape(s.phase)}</span></div>
        </div>
        <div>${statusBadge(s.status)}</div>
      </div>
      <p class="text-sm text-slate-600 line-clamp-3">${escape(desc)}</p>
      ${rules.length > 0
        ? `<div class="mt-2 flex flex-wrap gap-1">${rules.map((r) => `<span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">${escape(r)}</span>`).join('')}</div>`
        : ''}
    </div>`);
  });

  const phaseButtons = PHASES.map((p) => {
    const active = filterPhase === p;
    return html.raw(
      `<a href="/skills?phase=${p}${filterStatus ? `&status=${filterStatus}` : ''}" class="px-2 py-1 text-xs rounded ${active ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}">${p}</a>`,
    );
  });
  const statusButtons = (['pending', 'doing', 'done', 'skip'] as SkillStatus[]).map((st) => {
    const active = filterStatus === st;
    return html.raw(
      `<a href="/skills?status=${st}${filterPhase ? `&phase=${filterPhase}` : ''}" class="px-2 py-1 text-xs rounded ${active ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}">${st}</a>`,
    );
  });

  const body = html`
    <section class="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-xs font-medium text-slate-500 uppercase">Phase:</span>
        <a href="/skills${filterStatus ? `?status=${filterStatus}` : ''}" class="px-2 py-1 text-xs rounded ${!filterPhase ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}">todas</a>
        ${phaseButtons}
      </div>
      <div class="flex flex-wrap items-center gap-3 mt-2">
        <span class="text-xs font-medium text-slate-500 uppercase">Status:</span>
        <a href="/skills${filterPhase ? `?phase=${filterPhase}` : ''}" class="px-2 py-1 text-xs rounded ${!filterStatus ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}">todos</a>
        ${statusButtons}
      </div>
    </section>
    <p class="text-sm text-slate-500 mb-4">${rows.length} skill(s) listada(s).</p>
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${cards}</section>
  `;

  return layout({
    title: 'Skills',
    active: 'skills',
    projectName: cfg.project.name,
    phaseActive: cfg.phase.active,
    body: html.raw(body),
  });
}

function statusBadge(status: SkillStatus): string {
  const map: Record<SkillStatus, [string, string]> = {
    pending: ['bg-slate-200 text-slate-700', '○ pending'],
    doing: ['bg-amber-200 text-amber-800', '◐ doing'],
    done: ['bg-green-200 text-green-800', '● done'],
    skip: ['bg-slate-200 text-slate-500', '⊘ skip'],
  };
  const [cls, label] = map[status];
  return `<span class="${cls} text-[10px] font-medium px-2 py-0.5 rounded">${label}</span>`;
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
