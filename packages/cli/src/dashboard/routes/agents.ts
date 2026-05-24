import type { GenesisConfig } from '../../core/project-state.js';
import { discoverAgents, PHASES } from '../../core/skills-discovery.js';
import { html } from '../lib/html.js';
import { layout } from '../lib/render.js';

export async function renderAgents(projectRoot: string, cfg: GenesisConfig): Promise<string> {
  const agents = await discoverAgents(projectRoot);
  const byPhase = new Map<string, typeof agents>();
  for (const a of agents) {
    if (!byPhase.has(a.phase)) byPhase.set(a.phase, []);
    byPhase.get(a.phase)!.push(a);
  }

  const sections = PHASES.filter((p) => byPhase.has(p)).map((p) => {
    const list = byPhase.get(p) ?? [];
    const items = list.map(
      (a) => html.raw(`<a href="/agents/${escape(a.id)}" class="block bg-white rounded-lg shadow-sm p-3 hover:shadow-md hover:bg-slate-50 transition-all">
        <div class="font-mono text-sm font-semibold text-cyan-700">${escape(a.id)}</div>
        <p class="text-sm text-slate-600 mt-1">${escape(a.description)}</p>
        ${a.tools ? `<div class="mt-2 text-[10px] text-slate-500">tools: ${escape(a.tools)}</div>` : ''}
      </a>`),
    );
    return html.raw(`<section class="mb-6">
      <h2 class="text-lg font-semibold text-slate-900 mb-3 capitalize">${escape(p)} <span class="text-xs text-slate-400 font-normal">(${list.length})</span></h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${items.map((i) => i.__raw).join('')}</div>
    </section>`);
  });

  const body = html`
    <h1 class="text-2xl font-bold text-slate-900 mb-4">Agents (${agents.length})</h1>
    <p class="text-sm text-slate-600 mb-6">Agents especializados invocáveis pra revisão profunda em cada área. Use <code class="bg-slate-200 px-1 rounded">Agent({ subagent_type: ... })</code> no Claude Code.</p>
    ${sections}
  `;
  return layout({
    title: 'Agents',
    active: 'agents',
    projectName: cfg.project.name,
    phaseActive: cfg.phase.active,
    body: html.raw(body),
  });
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
