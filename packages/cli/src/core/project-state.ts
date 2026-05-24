import { existsSync } from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { findUp } from 'find-up';
import { PHASES, type Phase, isPhase } from './skills-discovery.js';

export const CONFIG_VERSION = 1 as const;

export type SkillStatus = 'pending' | 'doing' | 'done' | 'skip';

export interface SkillState {
  id: string;
  phase: string;
  status: SkillStatus;
  notes?: string;
  updatedAt?: string;
}

export interface GenesisConfig {
  version: typeof CONFIG_VERSION;
  project: {
    name: string;
    createdAt: string;
  };
  phase: {
    active: Phase;
  };
  skills: SkillState[];
}

export const CONFIG_PATH = '.genesis/config.json';

export async function readConfig(projectRoot: string): Promise<GenesisConfig | null> {
  const abs = join(projectRoot, CONFIG_PATH);
  if (!existsSync(abs)) return null;
  const raw = await readFile(abs, 'utf8');
  return JSON.parse(raw) as GenesisConfig;
}

export async function writeConfig(projectRoot: string, cfg: GenesisConfig): Promise<void> {
  const abs = join(projectRoot, CONFIG_PATH);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, JSON.stringify(cfg, null, 2), 'utf8');
}

export async function resolveProjectRoot(cwdOpt?: string): Promise<string> {
  if (cwdOpt) {
    const abs = resolve(cwdOpt);
    if (!existsSync(join(abs, '.genesis'))) {
      throw new Error(`--cwd ${abs} não contém .genesis/`);
    }
    return abs;
  }
  const cfg = await findUp(CONFIG_PATH, { cwd: process.cwd() });
  if (cfg) return resolve(cfg, '..', '..');
  const dir = await findUp('.genesis', { cwd: process.cwd(), type: 'directory' });
  if (!dir) {
    throw new Error('projeto Genesis não localizado (sem .genesis/ ascendente). Use --cwd.');
  }
  return resolve(dir, '..');
}

export function buildDefaultConfig(
  projectName: string,
  skills: { id: string; phase: string }[],
): GenesisConfig {
  return {
    version: CONFIG_VERSION,
    project: {
      name: projectName,
      createdAt: new Date().toISOString().slice(0, 10),
    },
    phase: { active: 'discovery' },
    skills: skills.map((s) => ({
      id: s.id,
      phase: s.phase,
      status: 'pending',
    })),
  };
}

export function setSkillStatus(
  cfg: GenesisConfig,
  id: string,
  status: SkillStatus,
  notes?: string,
): GenesisConfig {
  const found = cfg.skills.find((s) => s.id === id);
  if (!found) {
    throw new Error(`skill '${id}' não está no config. Skills disponíveis: rode 'genesis skill list'.`);
  }
  found.status = status;
  found.updatedAt = new Date().toISOString();
  if (notes !== undefined) found.notes = notes;
  return cfg;
}

export function setActivePhase(cfg: GenesisConfig, phase: string): GenesisConfig {
  if (!isPhase(phase)) {
    throw new Error(`phase inválida: '${phase}'. Válidas: ${PHASES.join(', ')}`);
  }
  cfg.phase.active = phase;
  return cfg;
}

export function filterByPhase(skills: SkillState[], phase: string): SkillState[] {
  return skills.filter((s) => s.phase === phase);
}

export function progressByPhase(cfg: GenesisConfig): Map<string, { done: number; total: number; skip: number }> {
  const map = new Map<string, { done: number; total: number; skip: number }>();
  for (const phase of PHASES) {
    map.set(phase, { done: 0, total: 0, skip: 0 });
  }
  for (const s of cfg.skills) {
    const bucket = map.get(s.phase) ?? { done: 0, total: 0, skip: 0 };
    bucket.total += 1;
    if (s.status === 'done') bucket.done += 1;
    if (s.status === 'skip') bucket.skip += 1;
    map.set(s.phase, bucket);
  }
  return map;
}

export function nextPhase(current: Phase): Phase | null {
  const idx = (PHASES as readonly string[]).indexOf(current);
  if (idx < 0 || idx === PHASES.length - 1) return null;
  return PHASES[idx + 1] ?? null;
}
