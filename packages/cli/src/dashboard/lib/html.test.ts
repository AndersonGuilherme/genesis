import { describe, it, expect } from 'vitest';
import { html, escapeHtml, isRaw } from './html.js';

describe('html helper', () => {
  it('escapa caracteres especiais por default', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(escapeHtml('a&b')).toBe('a&amp;b');
    expect(escapeHtml(`'"`)).toBe('&#39;&quot;');
  });

  it('null/undefined viram string vazia', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('html`` escapa interpolações', () => {
    const evil = '<img onerror=alert(1)>';
    const result = html`<p>${evil}</p>`;
    expect(result).toBe('<p>&lt;img onerror=alert(1)&gt;</p>');
  });

  it('html.raw bypassa escape', () => {
    const safe = html.raw('<strong>bold</strong>');
    const result = html`<p>${safe}</p>`;
    expect(result).toBe('<p><strong>bold</strong></p>');
  });

  it('arrays misturam raw e escaped', () => {
    const items = [html.raw('<li>1</li>'), '<li>2</li>'];
    const result = html`<ul>${items}</ul>`;
    expect(result).toBe('<ul><li>1</li>&lt;li&gt;2&lt;/li&gt;</ul>');
  });

  it('isRaw identifica objetos RawHtml', () => {
    expect(isRaw(html.raw('x'))).toBe(true);
    expect(isRaw('plain')).toBe(false);
    expect(isRaw(null)).toBe(false);
  });

  // Regression: bug #1 — quando html`` retorna string e é re-interpolada
  // em outro html``, a string é tratada como user input e escapada.
  // Wrap com html.raw() pra preservar HTML.
  it('html() escapa string crua (não-RawHtml) na interpolação aninhada', () => {
    const inner = html`<strong>bold</strong>`; // retorna string crua "<strong>bold</strong>"
    const outer = html`<div>${inner}</div>`;
    // SEM wrap: outer escapa o inner
    expect(outer).toBe('<div>&lt;strong&gt;bold&lt;/strong&gt;</div>');
  });

  it('html() preserva HTML quando aninhamento usa html.raw()', () => {
    const inner = html`<strong>bold</strong>`;
    const outer = html`<div>${html.raw(inner)}</div>`;
    expect(outer).toBe('<div><strong>bold</strong></div>');
  });
});
