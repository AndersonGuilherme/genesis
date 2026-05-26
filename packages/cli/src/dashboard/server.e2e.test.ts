import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtemp, rm, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { startServer } from './server.js';
import { assetsDir } from '../core/paths.js';
import { existsSync } from 'node:fs';

describe('dashboard e2e', () => {
  let tmpDir: string;
  let stopServer: () => void;
  let baseUrl: string;
  const port = 5099;

  beforeAll(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'genesis-e2e-'));
    // Cria projeto mínimo
    await mkdir(join(tmpDir, '.claude', 'skills', 'test-skill'), { recursive: true });
    await mkdir(join(tmpDir, '.claude', 'rules'), { recursive: true });
    await mkdir(join(tmpDir, '.claude', 'agents'), { recursive: true });
    await mkdir(join(tmpDir, '.genesis'), { recursive: true });
    await mkdir(join(tmpDir, 'docs'), { recursive: true });

    // Copia 1 rule real do assets pra ter conteúdo
    const assetsRulesDir = join(assetsDir(), '.claude', 'rules');
    if (existsSync(join(assetsRulesDir, 'plan-no-code-before-spec.md'))) {
      await copyFile(
        join(assetsRulesDir, 'plan-no-code-before-spec.md'),
        join(tmpDir, '.claude', 'rules', 'plan-no-code-before-spec.md'),
      );
    }

    await writeFile(
      join(tmpDir, '.claude', 'skills', 'test-skill', 'SKILL.md'),
      `---
name: test-skill
description: skill de teste e2e
phase: discovery
rules:
  - plan-no-code-before-spec
---
# Skill: test-skill

## Processo
1. Teste
`,
      'utf8',
    );

    await writeFile(
      join(tmpDir, '.claude', 'agents', 'test-agent.md'),
      `---
name: test-agent
description: agent de teste
tools: Read, Grep
phase: discovery
---
# Test Agent
`,
      'utf8',
    );

    await writeFile(
      join(tmpDir, '.genesis', 'config.json'),
      JSON.stringify(
        {
          version: 1,
          project: { name: 'e2e-test', createdAt: '2026-05-26' },
          phase: { active: 'discovery' },
          skills: [{ id: 'test-skill', phase: 'discovery', status: 'pending' }],
        },
        null,
        2,
      ),
      'utf8',
    );

    await writeFile(
      join(tmpDir, 'docs', 'README.md'),
      '# Docs\n\nTest doc.\n',
      'utf8',
    );

    const result = await startServer({ projectRoot: tmpDir, port });
    stopServer = result.stop;
    baseUrl = result.url;
  });

  afterAll(async () => {
    stopServer?.();
    if (tmpDir) await rm(tmpDir, { recursive: true, force: true });
  });

  it('GET / responde 200 com overview', async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('e2e-test');
    expect(text).toContain('Overview');
  });

  it('GET /skills lista skills do fs', async () => {
    const res = await fetch(`${baseUrl}/skills`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('test-skill');
    expect(text).toContain('search-input');
  });

  it('GET /skills/test-skill mostra detalhe', async () => {
    const res = await fetch(`${baseUrl}/skills/test-skill`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('test-skill');
    expect(text).toContain('Rules vinculadas');
  });

  it('GET /skills/inexistente retorna 404', async () => {
    const res = await fetch(`${baseUrl}/skills/inexistente`);
    expect(res.status).toBe(404);
  });

  it('GET /rules lista rules', async () => {
    const res = await fetch(`${baseUrl}/rules`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('plan-no-code-before-spec');
  });

  it('GET /agents lista agents', async () => {
    const res = await fetch(`${baseUrl}/agents`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('test-agent');
  });

  it('GET /phases mostra 8 colunas', async () => {
    const res = await fetch(`${baseUrl}/phases`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('discovery');
    expect(text).toContain('planning');
    expect(text).toContain('maintenance');
    expect(text).not.toContain('[object Object]');
  });

  it('GET /docs/ mostra index', async () => {
    const res = await fetch(`${baseUrl}/docs/`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('Documentação do projeto');
  });

  it('GET /404 retorna 404', async () => {
    const res = await fetch(`${baseUrl}/inexistente`);
    expect(res.status).toBe(404);
  });

  it('POST /api/skill/toggle muda status', async () => {
    const res = await fetch(`${baseUrl}/api/skill/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'test-skill', status: 'doing' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; status: string };
    expect(body.ok).toBe(true);
    expect(body.status).toBe('doing');
  });

  it('POST /api/skill/toggle rejeita status inválido', async () => {
    const res = await fetch(`${baseUrl}/api/skill/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'test-skill', status: 'invalid' }),
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/skill/create cria skill nova', async () => {
    const content = `---
name: e2e-created
description: criada via e2e
phase: discovery
---
# Skill: e2e-created
## Processo
1. ok
`;
    const res = await fetch(`${baseUrl}/api/skill/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'e2e-created', content }),
    });
    expect(res.status).toBe(201);
    expect(existsSync(join(tmpDir, '.claude', 'skills', 'e2e-created', 'SKILL.md'))).toBe(true);
  });

  it('POST /api/skill/create rejeita duplicado', async () => {
    const res = await fetch(`${baseUrl}/api/skill/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'test-skill',
        content: '---\nname: test-skill\ndescription: x\nphase: discovery\n---\n# x',
      }),
    });
    expect(res.status).toBe(409);
  });

  it('DELETE /api/skill/<id> remove e cria backup', async () => {
    const res = await fetch(`${baseUrl}/api/skill/e2e-created`, { method: 'DELETE' });
    expect(res.status).toBe(200);
    expect(existsSync(join(tmpDir, '.claude', 'skills', 'e2e-created'))).toBe(false);
    expect(existsSync(join(tmpDir, '.genesis', '.backup'))).toBe(true);
  });

  it('POST /api/skill/rules atualiza frontmatter', async () => {
    const res = await fetch(`${baseUrl}/api/skill/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'test-skill', rules: ['plan-no-code-before-spec'] }),
    });
    expect(res.status).toBe(200);
  });

  it('POST com method não permitido em rota GET retorna 405', async () => {
    const res = await fetch(`${baseUrl}/`, { method: 'POST' });
    expect(res.status).toBe(405);
  });
});
