import { marked } from 'marked';
import { html, type RawHtml } from './html.js';

export interface LayoutProps {
  title: string;
  active: 'overview' | 'docs' | 'skills' | 'rules' | 'agents' | 'phases' | 'tokens';
  projectName: string;
  phaseActive: string;
  body: RawHtml;
  sidebar?: RawHtml;
}

const NAV = [
  { key: 'overview', href: '/', label: 'Overview' },
  { key: 'tokens', href: '/tokens', label: 'Tokens' },
  { key: 'docs', href: '/docs/', label: 'Docs' },
  { key: 'skills', href: '/skills', label: 'Skills' },
  { key: 'rules', href: '/rules', label: 'Rules' },
  { key: 'agents', href: '/agents', label: 'Agents' },
  { key: 'phases', href: '/phases', label: 'Phases' },
] as const;

export function layout(props: LayoutProps): string {
  const navItems = NAV.map((item) => {
    const active = item.key === props.active;
    return html.raw(
      `<a href="${item.href}" class="px-3 py-2 rounded text-sm font-medium transition-colors ${
        active ? 'bg-slate-900 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }">${item.label}</a>`,
    );
  });

  return html`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${props.title} — Genesis dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .prose h1 { font-size: 2rem; font-weight: 700; margin: 1.5rem 0 1rem; color: #0f172a; }
    .prose h2 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.75rem; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; }
    .prose h3 { font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: #334155; }
    .prose h4 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem; }
    .prose p { margin: 0.75rem 0; line-height: 1.7; }
    .prose ul, .prose ol { margin: 0.75rem 0; padding-left: 1.5rem; line-height: 1.7; }
    .prose ul { list-style: disc; }
    .prose ol { list-style: decimal; }
    .prose li { margin: 0.25rem 0; }
    .prose code { background: #f1f5f9; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875em; color: #be185d; }
    .prose pre { background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
    .prose pre code { background: transparent; color: inherit; padding: 0; }
    .prose a { color: #2563eb; text-decoration: underline; }
    .prose a:hover { color: #1e40af; }
    .prose table { border-collapse: collapse; margin: 1rem 0; width: 100%; }
    .prose th, .prose td { border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; text-align: left; }
    .prose th { background: #f1f5f9; font-weight: 600; }
    .prose blockquote { border-left: 4px solid #94a3b8; padding-left: 1rem; color: #475569; margin: 1rem 0; font-style: italic; }
    .prose hr { border: 0; border-top: 1px solid #e2e8f0; margin: 2rem 0; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen">
  <header class="bg-slate-950 text-white shadow">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <a href="/" class="font-bold text-lg">Genesis</a>
        <nav class="flex gap-1">${navItems}</nav>
      </div>
      <div class="text-sm text-slate-400">
        <span class="text-white font-medium">${props.projectName}</span>
        <span class="mx-2">·</span>
        <span>phase: <span class="text-cyan-300 font-medium">${props.phaseActive}</span></span>
      </div>
    </div>
  </header>
  <main class="max-w-7xl mx-auto px-4 py-6">
    ${props.sidebar
      ? html.raw(html`<div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside class="bg-white rounded-lg shadow-sm p-4 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">${props.sidebar}</aside>
          <div>${props.body}</div>
        </div>`)
      : props.body}
  </main>
  <footer class="text-center text-xs text-slate-400 py-6">
    <a href="https://www.npmjs.com/package/@tchr/genesis-cli" class="hover:text-slate-600">@tchr/genesis-cli</a>
  </footer>
</body>
</html>`;
}

/**
 * Renderiza markdown pra HTML usando marked com GFM.
 */
export function renderMarkdown(md: string): RawHtml {
  marked.setOptions({ gfm: true, breaks: false });
  const result = marked.parse(md, { async: false }) as string;
  return html.raw(result);
}
