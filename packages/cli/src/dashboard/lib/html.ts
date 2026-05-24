/**
 * Tagged template literal helper para HTML.
 * Escapa interpolações por default. Use html.raw(...) para inserir HTML cru.
 */

const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPE[ch] ?? ch);
}

export interface RawHtml {
  __raw: string;
}

export function isRaw(value: unknown): value is RawHtml {
  return typeof value === 'object' && value !== null && '__raw' in value;
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  let out = '';
  for (let i = 0; i < strings.length; i += 1) {
    out += strings[i];
    if (i < values.length) {
      const v = values[i];
      if (v === null || v === undefined) continue;
      if (isRaw(v)) {
        out += v.__raw;
      } else if (Array.isArray(v)) {
        for (const item of v) {
          if (isRaw(item)) out += item.__raw;
          else out += escapeHtml(item);
        }
      } else {
        out += escapeHtml(v);
      }
    }
  }
  return out;
}

html.raw = (str: string): RawHtml => ({ __raw: str });
