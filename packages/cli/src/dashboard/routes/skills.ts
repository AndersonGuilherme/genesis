import type { GenesisConfig, SkillStatus, SkillState } from '../../core/project-state.js';
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

  // Source of truth: filesystem. Skills no config sem arquivo são ignoradas (órfãs).
  // Skills no fs sem entry no config aparecem com status `pending`.
  const metas = await discoverSkills(projectRoot);
  const metaMap = new Map(metas.map((m) => [m.id, m]));
  const configMap = new Map(cfg.skills.map((s) => [s.id, s]));

  let rows: SkillState[] = metas.map((m) => {
    const fromConfig = configMap.get(m.id);
    return (
      fromConfig ?? {
        id: m.id,
        phase: m.phase,
        status: 'pending' as SkillStatus,
      }
    );
  });
  if (filterPhase) rows = rows.filter((s) => s.phase === filterPhase);
  if (filterStatus) rows = rows.filter((s) => s.status === filterStatus);

  const cards = rows.map((s) => {
    const meta = metaMap.get(s.id);
    const desc = meta?.description ?? '';
    const rules = meta?.rules ?? [];
    return html.raw(`<div class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow" data-skill-id="${escape(s.id)}">
      <div class="flex items-start justify-between gap-2 mb-2">
        <a href="/skills/${escape(s.id)}" class="block flex-1 hover:opacity-70 transition-opacity">
          <div class="font-mono text-sm text-cyan-700 font-semibold hover:underline">${escape(s.id)}</div>
          <div class="text-xs text-slate-500 mt-0.5">phase: <span class="text-cyan-700">${escape(s.phase)}</span></div>
        </a>
        <div class="skill-badge">${statusBadge(s.status)}</div>
      </div>
      <p class="text-sm text-slate-600 line-clamp-3">${escape(desc)}</p>
      ${rules.length > 0
        ? `<div class="mt-2 flex flex-wrap gap-1">${rules.map((r) => `<span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">${escape(r)}</span>`).join('')}</div>`
        : ''}
      <div class="mt-3 pt-2 border-t border-slate-100 flex gap-1">
        ${statusBtn(s.id, 'pending', 'pending', s.status)}
        ${statusBtn(s.id, 'doing', 'doing', s.status)}
        ${statusBtn(s.id, 'done', 'done', s.status)}
        ${statusBtn(s.id, 'skip', 'skip', s.status)}
      </div>
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
    <div class="flex items-center justify-between mb-4 gap-3">
      <p class="text-sm text-slate-500"><span id="results-count">${rows.length}</span> skill(s). <span class="text-cyan-700">Clique nos status pra atualizar.</span></p>
      <div class="flex gap-2 items-center flex-1 max-w-md">
        <input id="search-input" type="text" placeholder="Buscar id ou descrição..." class="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none" autofocus>
        <a href="/skills/new" class="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1.5 rounded whitespace-nowrap">+ Nova</a>
      </div>
    </div>
    <section id="cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${cards}</section>
    <script>${html.raw(SKILL_TOGGLE_JS + SEARCH_JS)}</script>
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

function statusBtn(skillId: string, target: SkillStatus, label: string, current: SkillStatus): string {
  const active = target === current;
  const base = 'flex-1 text-[10px] font-medium px-2 py-1 rounded cursor-pointer transition-colors';
  const cls = active
    ? 'bg-cyan-600 text-white'
    : 'bg-slate-100 text-slate-500 hover:bg-slate-200';
  return `<button data-toggle="${skillId}" data-status="${target}" class="${base} ${cls}">${label}</button>`;
}

const SEARCH_JS = `
const searchInput = document.getElementById('search-input');
const grid = document.getElementById('cards-grid');
const countEl = document.getElementById('results-count');
searchInput?.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  let visible = 0;
  grid.querySelectorAll('[data-skill-id]').forEach((card) => {
    const txt = card.textContent.toLowerCase();
    const match = !q || txt.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) visible += 1;
  });
  if (countEl) countEl.textContent = visible;
});
`;

const SKILL_TOGGLE_JS = `
document.querySelectorAll('button[data-toggle]').forEach((btn) => {
  btn.addEventListener('click', async (ev) => {
    const id = btn.getAttribute('data-toggle');
    const status = btn.getAttribute('data-status');
    btn.disabled = true;
    btn.style.opacity = '0.5';
    try {
      const res = await fetch('/api/skill/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert('erro: ' + (body.error || res.status));
        return;
      }
      location.reload();
    } catch (err) {
      alert('falha de rede: ' + err.message);
    } finally {
      btn.disabled = false;
      btn.style.opacity = '';
    }
  });
});
`;

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
