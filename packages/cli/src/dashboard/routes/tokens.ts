import type { GenesisConfig } from '../../core/project-state.js';
import { TranscriptCache, transcriptsDirFor, type TokenSummary } from '../../core/transcripts.js';
import { loadPricing, formatUsd, ageDays } from '../../core/pricing.js';
import { html } from '../lib/html.js';
import { layout, renderMarkdown } from '../lib/render.js';
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
  const last1h = cache.usageWindow(1);
  const last24h = cache.usageWindow(24);
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
    <div class="bg-slate-50 border border-slate-200 rounded p-3 mb-4 text-xs text-slate-600">
      <div>📁 Projeto: <code class="bg-white px-1 rounded text-slate-800">${projectRoot}</code></div>
      <div class="mt-1">📊 Transcripts: <code class="bg-white px-1 rounded text-slate-800">${dir}</code></div>
      <div class="mt-1 text-slate-500">Dados isolados por projeto. Outros projetos têm cache + diretório próprios.${newCount > 0 ? html.raw(` <span class="text-cyan-700">· ${newCount} mensagem(ns) nova(s) processada(s).</span>`) : ''}</div>
    </div>

    ${banner}

    <section class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-400">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Última 1h</div>
        <div class="text-2xl font-bold text-slate-900 mt-1">${formatUsd(last1h.cost)}</div>
        <div class="text-xs text-slate-500 mt-1">${last1h.messages} mensagens</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-cyan-400">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Últimas 24h</div>
        <div class="text-2xl font-bold text-slate-900 mt-1">${formatUsd(last24h.cost)}</div>
        <div class="text-xs text-slate-500 mt-1">${last24h.messages} mensagens</div>
      </div>
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 col-span-2 md:col-span-2">
        <div class="text-xs font-semibold text-amber-900 uppercase tracking-wide">⚠ Rate limits da API</div>
        <div class="text-xs text-amber-800 mt-1">
          Genesis não consegue ler tokens restantes ou tempo até reset — esses dados ficam nos headers HTTP da API e não estão nos transcripts.
        </div>
        <div class="text-xs text-amber-800 mt-1">
          Limite real do seu plano: <a href="https://console.anthropic.com/settings/limits" class="underline font-medium" target="_blank">console.anthropic.com/settings/limits</a>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
        <div class="text-xs text-slate-500 uppercase tracking-wide">Total tokens processados</div>
        <div class="text-2xl font-semibold text-slate-900 mt-1">${formatNum(summary.totalInput + summary.totalOutput + summary.totalCacheRead + summary.totalCacheWrite)}</div>
        <div class="text-xs text-slate-500 mt-1">input + output + cache</div>
      </div>
    </section>

    <section class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-3" title="Tokens enviados pra API que não estavam em cache. Pagam preço cheio de input.">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Input <span class="text-slate-400">ⓘ</span></div>
        <div class="text-xl font-semibold text-slate-900 mt-1">${formatNum(summary.totalInput)}</div>
        <div class="text-[10px] text-slate-400 mt-0.5">novos, não cacheados</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-3" title="Tokens gerados pela IA (resposta). Costuma ser o item mais caro (5x mais que input em Sonnet, 5x em Opus).">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Output <span class="text-slate-400">ⓘ</span></div>
        <div class="text-xl font-semibold text-slate-900 mt-1">${formatNum(summary.totalOutput)}</div>
        <div class="text-[10px] text-slate-400 mt-0.5">resposta da IA</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-3" title="Tokens lidos do prompt cache. Pagam ~10% do preço de input. Maior parte do contexto em sessões longas vem daqui.">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Cache read <span class="text-slate-400">ⓘ</span></div>
        <div class="text-xl font-semibold text-cyan-700 mt-1">${formatNum(summary.totalCacheRead)}</div>
        <div class="text-[10px] text-slate-400 mt-0.5">~90% off vs input</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-3" title="Tokens escritos no cache pela primeira vez (ttl 5min). Pagam 1.25x preço de input — mas economiza nas leituras seguintes.">
        <div class="text-xs text-slate-500 uppercase tracking-wide">Cache write <span class="text-slate-400">ⓘ</span></div>
        <div class="text-xl font-semibold text-amber-700 mt-1">${formatNum(summary.totalCacheWrite)}</div>
        <div class="text-[10px] text-slate-400 mt-0.5">1.25x input (one-time)</div>
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

  // Os 200 últimos exibidos, mas mantém índice ORIGINAL (1-based) pra link estável
  const lastN = Math.min(msgs.length, 200);
  const rows = msgs
    .slice(-lastN)
    .reverse()
    .map((m, revIdx) => {
      // index real = msgs.length - 1 - revIdx (já no msgs original)
      const origIdx = msgs.length - 1 - revIdx;
      return `<tr class="border-t border-slate-100 hover:bg-slate-50">
        <td class="px-3 py-1.5 text-xs text-slate-500 font-mono">${escape(m.ts.slice(11, 19))}</td>
        <td class="px-3 py-1.5 text-xs font-mono">${escape(m.model)}</td>
        <td class="px-3 py-1.5 text-xs text-right tabular-nums">${formatNum(m.inputTokens)}</td>
        <td class="px-3 py-1.5 text-xs text-right tabular-nums">${formatNum(m.outputTokens)}</td>
        <td class="px-3 py-1.5 text-xs text-right tabular-nums text-slate-500">${formatNum(m.cacheRead)}</td>
        <td class="px-3 py-1.5 text-xs text-right tabular-nums font-semibold">${escape(formatUsd(m.costUsd))}</td>
        <td class="px-3 py-1.5 text-xs text-center"><a href="/tokens/sessions/${escape(sessionId)}/messages/${origIdx}" class="text-cyan-700 hover:underline">ver →</a></td>
      </tr>`;
    })
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
    ${sess.cwd ? html.raw(html`<p class="text-xs text-slate-500 mb-3">cwd: <code class="bg-slate-100 px-1 rounded">${sess.cwd}</code>${sess.gitBranch ? html.raw(html` · branch: <code class="bg-slate-100 px-1 rounded">${sess.gitBranch}</code>`) : ''}</p>`) : ''}
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
            <th class="px-3 py-2 text-center text-xs font-medium text-slate-500 uppercase">Conversa</th>
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

export async function renderMessageView(
  projectRoot: string,
  cfg: GenesisConfig,
  sessionId: string,
  index: number,
): Promise<string> {
  const cache = new TranscriptCache(projectRoot);
  await cache.sync(projectRoot);
  const total = cache.assistantCount(sessionId);
  const pair = await cache.messagePair(sessionId, index);
  cache.close();

  if (!pair) {
    return layout({
      title: 'Mensagem não encontrada',
      active: 'tokens',
      projectName: cfg.project.name,
      phaseActive: cfg.phase.active,
      body: html.raw(
        html`<div class="bg-amber-50 border border-amber-200 rounded p-4">
          Mensagem #${index} não encontrada em sessão <code>${sessionId.slice(0, 8)}</code>.
          <a href="/tokens/sessions/${sessionId}" class="text-cyan-700 hover:underline">← voltar</a>
        </div>`,
      ),
    });
  }

  const prevLink =
    index > 0
      ? `<a href="/tokens/sessions/${escape(sessionId)}/messages/${index - 1}" class="text-cyan-700 hover:underline">← anterior</a>`
      : '<span class="text-slate-400">← anterior</span>';
  const nextLink =
    index < total - 1
      ? `<a href="/tokens/sessions/${escape(sessionId)}/messages/${index + 1}" class="text-cyan-700 hover:underline">próxima →</a>`
      : '<span class="text-slate-400">próxima →</span>';

  const toolUsesHtml = pair.toolUses
    .map((t) => {
      const inputStr = JSON.stringify(t.input, null, 2);
      return `<details class="bg-slate-50 border border-slate-200 rounded p-2 mb-1">
        <summary class="cursor-pointer text-xs font-mono text-slate-700">🔧 ${escape(t.name)}</summary>
        <pre class="mt-2 text-xs bg-white p-2 rounded overflow-x-auto">${escape(inputStr)}</pre>
      </details>`;
    })
    .join('');

  const toolResultsHtml = pair.toolResults
    .map((r) => {
      const truncated = r.content.length > 3000 ? r.content.slice(0, 3000) + '\n... (truncado)' : r.content;
      const cls = r.isError ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50';
      return `<details class="${cls} border rounded p-2 mb-1">
        <summary class="cursor-pointer text-xs font-mono text-slate-700">${r.isError ? '❌ erro' : '✓'} tool_result (${r.content.length} chars)</summary>
        <pre class="mt-2 text-xs bg-white p-2 rounded overflow-x-auto whitespace-pre-wrap">${escape(truncated)}</pre>
      </details>`;
    })
    .join('');

  const userBlock = pair.userPrompt
    ? `<section class="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
        <div class="text-xs font-semibold text-cyan-900 uppercase tracking-wide mb-2">👤 User</div>
        <div class="prose max-w-none text-sm">${renderMarkdown(pair.userPrompt).__raw}</div>
      </section>`
    : `<section class="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-xs text-slate-500 italic">
        (sem prompt user identificável — provavelmente continuação automática após tool_result)
      </section>`;

  const assistantBlock = pair.assistantText
    ? `<section class="bg-white border border-slate-200 rounded-lg p-4 mb-4">
        <div class="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">🤖 Assistant (${escape(pair.model)})</div>
        <div class="prose max-w-none text-sm">${renderMarkdown(pair.assistantText).__raw}</div>
      </section>`
    : `<section class="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-xs text-slate-500 italic">
        (assistant não gerou texto — provavelmente apenas tool_use)
      </section>`;

  const body = html.raw(`
    <nav class="text-sm text-slate-500 mb-3">
      <a href="/tokens" class="text-cyan-700 hover:underline">tokens</a>
      <span class="text-slate-400 mx-1">/</span>
      <a href="/tokens/sessions/${escape(sessionId)}" class="text-cyan-700 hover:underline">${escape(sessionId.slice(0, 8))}…</a>
      <span class="text-slate-400 mx-1">/</span>
      <span class="text-slate-700">mensagem #${index + 1} de ${total}</span>
    </nav>

    <div class="flex items-center justify-between mb-4">
      <div class="text-xs text-slate-500">
        <span class="font-mono">${escape(pair.ts)}</span> · <span class="font-mono">${escape(pair.model)}</span>
      </div>
      <div class="flex gap-3 text-sm">
        ${prevLink}
        ${nextLink}
      </div>
    </div>

    ${userBlock}
    ${assistantBlock}

    ${pair.toolUses.length > 0 ? `<section class="mb-4">
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tool uses (${pair.toolUses.length})</div>
      ${toolUsesHtml}
    </section>` : ''}

    ${pair.toolResults.length > 0 ? `<section class="mb-4">
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tool results (${pair.toolResults.length})</div>
      ${toolResultsHtml}
    </section>` : ''}

    <details class="mt-6 bg-slate-50 border border-slate-200 rounded p-3">
      <summary class="cursor-pointer text-xs text-slate-600">Raw JSONL</summary>
      <pre class="mt-2 text-xs bg-white p-2 rounded overflow-x-auto">${escape(JSON.stringify(pair.raw, null, 2))}</pre>
    </details>
  `);

  return layout({
    title: `msg #${index + 1} — ${sessionId.slice(0, 8)}`,
    active: 'tokens',
    projectName: cfg.project.name,
    phaseActive: cfg.phase.active,
    body,
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
