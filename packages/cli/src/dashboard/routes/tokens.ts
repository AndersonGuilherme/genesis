import type { GenesisConfig } from '../../core/project-state.js';
import { TranscriptCache, transcriptsDirFor, type TokenSummary } from '../../core/transcripts.js';
import { loadPricing, formatUsd, ageDays } from '../../core/pricing.js';
import { html } from '../lib/html.js';
import { layout } from '../lib/render.js';
import { existsSync } from 'node:fs';

export async function renderTokens(
  projectRoot: string,
  cfg: GenesisConfig,
): Promise<string> {
  const dir = transcriptsDirFor(projectRoot);
  if (!existsSync(dir)) {
    return layout({
      title: 'Tokens',
      active: 'tokens',
      projectName: cfg.project.name,
      phaseActive: cfg.phase.active,
      body: html.raw(html`<div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-bold text-slate-900 mb-3">Tokens & custos</h1>
        <p class="text-slate-600">
          Sem transcripts pra este projeto em <code class="bg-slate-100 px-1 rounded">${dir}</code>.
          Abra Claude Code em <code class="bg-slate-100 px-1 rounded">${projectRoot}</code> pra começar a gerar histórico.
        </p>
      </div>`),
    });
  }

  const cache = new TranscriptCache(projectRoot);
  const newCount = await cache.sync(projectRoot);
  const summary = cache.summary();
  cache.close();

  const pricing = loadPricing();
  const pricingAge = ageDays(pricing.updatedAt);

  const banner =
    pricingAge > 90
      ? html.raw(
          `<div class="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-900 mb-4">
            ⚠ Pricing atualizado há <strong>${pricingAge} dias</strong> (${pricing.updatedAt}).
            Rode <code class="bg-amber-100 px-1 rounded">genesis pricing update</code> pra atualizar.
          </div>`,
        )
      : html.raw('');

  const body = html`
    <h1 class="text-2xl font-bold text-slate-900 mb-3">Tokens & custos</h1>
    <p class="text-sm text-slate-500 mb-4">
      Lendo transcripts de <code class="bg-slate-100 px-1 rounded">${dir}</code>
      ${newCount > 0 ? html.raw(`· <span class="text-cyan-700">${newCount} mensagem(ns) nova(s) processada(s)</span>`) : ''}
    </p>

    ${banner}

    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Custo total</div>
        <div class="text-3xl font-bold text-slate-900 mt-1">${formatUsd(summary.totalCostUsd)}</div>
        <div class="text-xs text-slate-500 mt-1">${summary.messageCount.toLocaleString('pt-BR')} mensagens</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Sessões</div>
        <div class="text-3xl font-bold text-slate-900 mt-1">${summary.sessionCount}</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Input tokens</div>
        <div class="text-2xl font-semibold text-slate-900 mt-1">${formatNum(summary.totalInput)}</div>
        <div class="text-xs text-slate-500 mt-1">+ ${formatNum(summary.totalCacheRead)} cached</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Output tokens</div>
        <div class="text-2xl font-semibold text-slate-900 mt-1">${formatNum(summary.totalOutput)}</div>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-200 font-semibold text-sm text-slate-900">Por modelo</div>
        ${html.raw(renderModelTable(summary))}
      </div>
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-200 font-semibold text-sm text-slate-900">Custo por dia (últimos ${Math.min(summary.byDay.length, 30)} dias)</div>
        ${html.raw(renderDayChart(summary))}
      </div>
    </section>

    <section class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-4 py-3 border-b border-slate-200 font-semibold text-sm text-slate-900">Sessões (${summary.bySession.length})</div>
      ${html.raw(renderSessionsTable(summary))}
    </section>
  `;

  return layout({
    title: 'Tokens',
    active: 'tokens',
    projectName: cfg.project.name,
    phaseActive: cfg.phase.active,
    body: html.raw(body),
  });
}

function renderModelTable(s: TokenSummary): string {
  if (s.byModel.length === 0) {
    return '<div class="p-4 text-sm text-slate-400">sem dados</div>';
  }
  const max = Math.max(...s.byModel.map((m) => m.cost), 0.0001);
  const rows = s.byModel
    .map((m) => {
      const pct = (m.cost / max) * 100;
      return `<tr class="border-t border-slate-100">
        <td class="px-3 py-2 text-sm font-mono">${escape(m.model)}</td>
        <td class="px-3 py-2 text-right text-sm tabular-nums">${m.messages.toLocaleString('pt-BR')}</td>
        <td class="px-3 py-2 text-right text-sm tabular-nums font-semibold">${escape(formatUsd(m.cost))}</td>
        <td class="px-3 py-2 w-32"><div class="bg-slate-200 rounded h-2"><div class="bg-cyan-500 h-2 rounded" style="width: ${pct.toFixed(1)}%"></div></div></td>
      </tr>`;
    })
    .join('');
  return `<table class="w-full">
    <thead class="bg-slate-50">
      <tr>
        <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Modelo</th>
        <th class="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Msgs</th>
        <th class="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Custo</th>
        <th class="px-3 py-2"></th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function renderDayChart(s: TokenSummary): string {
  if (s.byDay.length === 0) {
    return '<div class="p-4 text-sm text-slate-400">sem dados</div>';
  }
  const recent = s.byDay.slice(-30);
  const max = Math.max(...recent.map((d) => d.cost), 0.0001);
  const bars = recent
    .map((d) => {
      const h = Math.max(2, (d.cost / max) * 140);
      return `<div class="flex flex-col items-center" title="${d.day}: ${formatUsd(d.cost)} (${d.messages} msgs)">
        <div class="bg-cyan-500 hover:bg-cyan-600 transition-colors w-3 rounded-t" style="height: ${h}px"></div>
        <div class="text-[9px] text-slate-400 mt-1 -rotate-45 origin-top-left translate-x-2 whitespace-nowrap">${d.day.slice(5)}</div>
      </div>`;
    })
    .join('');
  return `<div class="p-4">
    <div class="flex items-end justify-between gap-0.5 min-h-[160px]">${bars}</div>
    <div class="mt-8 text-xs text-slate-500 text-right">total: ${formatUsd(s.totalCostUsd)}</div>
  </div>`;
}

function renderSessionsTable(s: TokenSummary): string {
  if (s.bySession.length === 0) {
    return '<div class="p-4 text-sm text-slate-400">sem dados</div>';
  }
  const rows = s.bySession
    .map((sess) => {
      const date = sess.firstTs ? sess.firstTs.slice(0, 16).replace('T', ' ') : '—';
      const id8 = sess.sessionId.slice(0, 8);
      return `<tr class="border-t border-slate-100 hover:bg-slate-50">
        <td class="px-3 py-2 text-sm font-mono"><a href="/tokens/sessions/${escape(sess.sessionId)}" class="text-cyan-700 hover:underline">${escape(id8)}…</a></td>
        <td class="px-3 py-2 text-sm text-slate-600">${escape(date)}</td>
        <td class="px-3 py-2 text-right text-sm tabular-nums">${sess.messages.toLocaleString('pt-BR')}</td>
        <td class="px-3 py-2 text-right text-sm tabular-nums font-semibold">${escape(formatUsd(sess.cost))}</td>
      </tr>`;
    })
    .join('');
  return `<table class="w-full">
    <thead class="bg-slate-50">
      <tr>
        <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Session</th>
        <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Início</th>
        <th class="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Msgs</th>
        <th class="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Custo</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

export async function renderSessionDrilldown(
  projectRoot: string,
  cfg: GenesisConfig,
  sessionId: string,
): Promise<string> {
  const cache = new TranscriptCache(projectRoot);
  await cache.sync(projectRoot);
  const sess = cache.session(sessionId);
  const msgs = cache.sessionMessages(sessionId);
  cache.close();

  if (!sess) {
    return layout({
      title: 'Sessão não encontrada',
      active: 'tokens',
      projectName: cfg.project.name,
      phaseActive: cfg.phase.active,
      body: html.raw(html`<div class="bg-amber-50 p-4 rounded">Sessão <code>${sessionId}</code> não encontrada. <a href="/tokens" class="text-cyan-700 hover:underline">← voltar</a></div>`),
    });
  }

  const total = msgs.reduce((acc, m) => acc + m.costUsd, 0);
  const totalInput = msgs.reduce((acc, m) => acc + m.inputTokens, 0);
  const totalOutput = msgs.reduce((acc, m) => acc + m.outputTokens, 0);

  const rows = msgs
    .slice(-200)
    .reverse()
    .map(
      (m) => `<tr class="border-t border-slate-100">
        <td class="px-3 py-1.5 text-xs text-slate-500 font-mono">${escape(m.ts.slice(11, 19))}</td>
        <td class="px-3 py-1.5 text-xs font-mono">${escape(m.model)}</td>
        <td class="px-3 py-1.5 text-xs text-right tabular-nums">${formatNum(m.inputTokens)}</td>
        <td class="px-3 py-1.5 text-xs text-right tabular-nums">${formatNum(m.outputTokens)}</td>
        <td class="px-3 py-1.5 text-xs text-right tabular-nums text-slate-500">${formatNum(m.cacheRead)}</td>
        <td class="px-3 py-1.5 text-xs text-right tabular-nums font-semibold">${escape(formatUsd(m.costUsd))}</td>
      </tr>`,
    )
    .join('');

  const body = html`
    <nav class="text-sm text-slate-500 mb-3">
      <a href="/tokens" class="text-cyan-700 hover:underline">tokens</a>
      <span class="text-slate-400 mx-1">/</span>
      <span class="font-mono text-slate-700">${sessionId.slice(0, 8)}…</span>
    </nav>
    <h1 class="text-xl font-bold text-slate-900 mb-3">Sessão ${html.raw(`<span class="font-mono text-slate-600">${escape(sessionId)}</span>`)}</h1>
    <section class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="bg-white rounded shadow-sm p-3"><div class="text-xs text-slate-500 uppercase">Mensagens</div><div class="text-xl font-semibold">${msgs.length}</div></div>
      <div class="bg-white rounded shadow-sm p-3"><div class="text-xs text-slate-500 uppercase">Custo total</div><div class="text-xl font-semibold">${formatUsd(total)}</div></div>
      <div class="bg-white rounded shadow-sm p-3"><div class="text-xs text-slate-500 uppercase">Input</div><div class="text-xl font-semibold">${formatNum(totalInput)}</div></div>
      <div class="bg-white rounded shadow-sm p-3"><div class="text-xs text-slate-500 uppercase">Output</div><div class="text-xl font-semibold">${formatNum(totalOutput)}</div></div>
    </section>
    ${sess.cwd ? html`<p class="text-xs text-slate-500 mb-3">cwd: <code class="bg-slate-100 px-1 rounded">${sess.cwd}</code>${sess.gitBranch ? html` · branch: <code class="bg-slate-100 px-1 rounded">${sess.gitBranch}</code>` : ''}</p>` : ''}
    <p class="text-xs text-slate-500 mb-2">últimas ${Math.min(msgs.length, 200)} mensagens:</p>
    <section class="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Hora</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Modelo</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Input</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Output</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Cache R</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Custo</th>
          </tr>
        </thead>
        <tbody>${html.raw(rows)}</tbody>
      </table>
    </section>
  `;

  return layout({
    title: `Session ${sessionId.slice(0, 8)}`,
    active: 'tokens',
    projectName: cfg.project.name,
    phaseActive: cfg.phase.active,
    body: html.raw(body),
  });
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString('pt-BR');
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
