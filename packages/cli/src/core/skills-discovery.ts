import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';

export interface SkillMeta {
  id: string;
  phase: string;
  description: string;
  rules?: string[];
  path: string; // relativo ao root do projeto (ex: .claude/skills/sec-threat-model/SKILL.md)
}

export interface RuleMeta {
  id: string;
  phase: string;
  description: string;
  path: string;
}

export interface AgentMeta {
  id: string;
  phase: string;
  description: string;
  tools?: string;
  path: string;
}

/**
 * Lê todas as skills em <root>/.claude/skills/<name>/SKILL.md.
 * <root> pode ser packages/cli/assets (pristine) ou projeto-filho.
 */
export async function discoverSkills(rootDir: string): Promise<SkillMeta[]> {
  const base = join(rootDir, '.claude', 'skills');
  if (!existsSync(base)) return [];
  const files = await fg(['*/SKILL.md'], { cwd: base, onlyFiles: true });
  const skills: SkillMeta[] = [];
  for (const rel of files) {
    const abs = join(base, rel);
    const raw = await readFile(abs, 'utf8');
    const fm = matter(raw).data as Record<string, unknown>;
    const id = (fm.name as string) ?? rel.split('/')[0]!;
    const phase = (fm.phase as string) ?? 'unknown';
    const description = (fm.description as string) ?? '';
    const rules = Array.isArray(fm.rules) ? (fm.rules as string[]) : undefined;
    skills.push({
      id,
      phase,
      description,
      rules,
      path: join('.claude', 'skills', rel).split('\\').join('/'),
    });
  }
  return skills.sort((a, b) => a.id.localeCompare(b.id));
}

export async function discoverRules(rootDir: string): Promise<RuleMeta[]> {
  const base = join(rootDir, '.claude', 'rules');
  if (!existsSync(base)) return [];
  const files = await fg(['*.md'], { cwd: base, onlyFiles: true });
  const rules: RuleMeta[] = [];
  for (const rel of files) {
    const abs = join(base, rel);
    const raw = await readFile(abs, 'utf8');
    const fm = matter(raw).data as Record<string, unknown>;
    const id = (fm.name as string) ?? rel.replace(/\.md$/, '');
    rules.push({
      id,
      phase: (fm.phase as string) ?? 'unknown',
      description: (fm.description as string) ?? '',
      path: join('.claude', 'rules', rel).split('\\').join('/'),
    });
  }
  return rules.sort((a, b) => a.id.localeCompare(b.id));
}

export async function discoverAgents(rootDir: string): Promise<AgentMeta[]> {
  const base = join(rootDir, '.claude', 'agents');
  if (!existsSync(base)) return [];
  const files = await fg(['*.md'], { cwd: base, onlyFiles: true });
  const agents: AgentMeta[] = [];
  for (const rel of files) {
    const abs = join(base, rel);
    const raw = await readFile(abs, 'utf8');
    const fm = matter(raw).data as Record<string, unknown>;
    const id = (fm.name as string) ?? rel.replace(/\.md$/, '');
    agents.push({
      id,
      phase: (fm.phase as string) ?? 'unknown',
      description: (fm.description as string) ?? '',
      tools: (fm.tools as string) ?? undefined,
      path: join('.claude', 'agents', rel).split('\\').join('/'),
    });
  }
  return agents.sort((a, b) => a.id.localeCompare(b.id));
}

export const PHASES = [
  'discovery',
  'planning',
  'security',
  'lgpd',
  'development',
  'pre-launch',
  'operations',
  'maintenance',
] as const;

export type Phase = (typeof PHASES)[number];

export function isPhase(s: string): s is Phase {
  return (PHASES as readonly string[]).includes(s);
}
