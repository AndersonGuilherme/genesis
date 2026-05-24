import { describe, it, expect } from 'vitest';
import { costOf, formatUsd, ageDays } from './pricing.js';

describe('pricing', () => {
  describe('costOf', () => {
    it('calcula custo opus-4-7 corretamente (input + output)', () => {
      // opus: $15 input / $75 output por 1M tokens
      const cost = costOf('claude-opus-4-7', {
        inputTokens: 1_000_000,
        outputTokens: 1_000_000,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
      });
      expect(cost).toBeCloseTo(90, 5); // 15 + 75
    });

    it('aplica cacheRead com desconto (~80% off do input)', () => {
      // opus cacheRead: $1.50 / 1M tokens
      const cost = costOf('claude-opus-4-7', {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 1_000_000,
        cacheWriteTokens: 0,
      });
      expect(cost).toBeCloseTo(1.5, 5);
    });

    it('cacheWrite custa mais que input (1.25x)', () => {
      // opus cacheWrite: $18.75 / 1M (=15 * 1.25)
      const cost = costOf('claude-opus-4-7', {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 1_000_000,
      });
      expect(cost).toBeCloseTo(18.75, 5);
    });

    it('modelo desconhecido cai pra default (sonnet-tier)', () => {
      const cost = costOf('modelo-fictício', {
        inputTokens: 1_000_000,
        outputTokens: 1_000_000,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
      });
      // default = sonnet: $3 + $15
      expect(cost).toBeCloseTo(18, 5);
    });

    it('zero usage retorna zero', () => {
      expect(
        costOf('claude-opus-4-7', {
          inputTokens: 0,
          outputTokens: 0,
          cacheReadTokens: 0,
          cacheWriteTokens: 0,
        }),
      ).toBe(0);
    });
  });

  describe('formatUsd', () => {
    it('formata valores pequenos com 4 decimais', () => {
      expect(formatUsd(0.0001234)).toBe('$0.0001');
    });
    it('formata valores médios com 3 decimais', () => {
      expect(formatUsd(0.123)).toBe('$0.123');
    });
    it('formata valores normais com 2 decimais', () => {
      expect(formatUsd(12.34)).toBe('$12.34');
    });
    it('valores grandes com locale + sem decimais', () => {
      expect(formatUsd(1234.56)).toBe('$1,235');
    });
  });

  describe('ageDays', () => {
    it('retorna 0 pra hoje', () => {
      const today = new Date().toISOString().slice(0, 10);
      expect(ageDays(today)).toBeLessThanOrEqual(1);
    });
    it('retorna >= 1 pra ontem', () => {
      const yesterday = new Date(Date.now() - 86_400_000 * 2).toISOString().slice(0, 10);
      expect(ageDays(yesterday)).toBeGreaterThanOrEqual(1);
    });
    it('retorna Infinity pra data inválida', () => {
      expect(ageDays('not-a-date')).toBe(Infinity);
    });
  });
});
