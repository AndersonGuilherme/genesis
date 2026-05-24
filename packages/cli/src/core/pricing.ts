import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { packageRoot } from './paths.js';

export interface ModelPricing {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

export interface PricingTable {
  updatedAt: string;
  currency: string;
  unit: string;
  models: Record<string, ModelPricing>;
  default: ModelPricing & { _note?: string };
}

let cached: PricingTable | null = null;

export function loadPricing(): PricingTable {
  if (cached) return cached;
  // 1) Override do user em ~/.config/genesis/pricing.json
  const userOverride = join(homedir(), '.config', 'genesis', 'pricing.json');
  if (existsSync(userOverride)) {
    cached = JSON.parse(readFileSync(userOverride, 'utf8')) as PricingTable;
    return cached;
  }
  // 2) Embarcado no pacote
  const bundled = join(packageRoot(), 'src', 'pricing', 'models.json');
  const dist = join(packageRoot(), 'dist', 'pricing', 'models.json');
  const path = existsSync(dist) ? dist : bundled;
  if (!existsSync(path)) {
    throw new Error(`models.json não encontrado em ${path}`);
  }
  cached = JSON.parse(readFileSync(path, 'utf8')) as PricingTable;
  return cached;
}

export interface Usage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
}

/**
 * Calcula custo em USD pra uma mensagem dado modelo + usage.
 * Aplica fallback `default` quando modelo não conhecido.
 */
export function costOf(model: string, usage: Usage): number {
  const table = loadPricing();
  const p = table.models[model] ?? table.default;
  const MIL = 1_000_000;
  return (
    (usage.inputTokens * p.input) / MIL +
    (usage.outputTokens * p.output) / MIL +
    (usage.cacheReadTokens * p.cacheRead) / MIL +
    (usage.cacheWriteTokens * p.cacheWrite) / MIL
  );
}

export function formatUsd(n: number): string {
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  if (n < 100) return `$${n.toFixed(2)}`;
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export function ageDays(updatedAt: string): number {
  const t = new Date(updatedAt).getTime();
  if (Number.isNaN(t)) return Infinity;
  return Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24));
}

export function resetPricingCache(): void {
  cached = null;
}
