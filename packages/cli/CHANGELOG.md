# Changelog

Histórico de versões do `@tchr/genesis-cli`. Semver simplificado:
- MAJOR — mudança incompatível em comando/output.
- MINOR — adição de capacidade.
- PATCH — fix.

## [1.1.0] — 2026-05-24

### Adicionado

- **Rotas show + edit pra skill/rule/agent**:
  - `GET /skills/<id>` — frontmatter formatado + markdown renderizado.
  - `GET /rules/<id>` — análogo.
  - `GET /agents/<id>` — análogo.
  - Botão **Editar** revela `<textarea>` com conteúdo cru (frontmatter + body).
  - Botões **Salvar** + **Cancelar** com feedback inline (sem `alert()`).
- **API endpoints**:
  - `POST /api/skill/save  { id, content }`
  - `POST /api/rule/save   { id, content }`
  - `POST /api/agent/save  { id, content }`
  - Valida id kebab-case, exige arquivo existente, limite 200KB.
  - **Backup automático** antes de sobrescrever em `.genesis/.backup/<ISO>/.claude/...`.
- **Cards de skills/rules/agents agora linkam pra página show** (header
  clicável, toggle buttons continuam funcionais separadamente).

### Arquivos novos

- `src/dashboard/routes/entity-show.ts` — render compartilhado pra 3 tipos.
- `src/dashboard/routes/api.ts` — handleEntitySave + MAX_CONTENT_BYTES.

### Segurança

- ID validation `^[a-z][a-z0-9-]*$` previne path traversal.
- POST exige arquivo já existir (não cria via API).
- Backup pré-write permite recuperar de edit errado: copie de
  `.genesis/.backup/<timestamp>/.claude/<type>/<file>` de volta.

## [1.0.1] — 2026-05-24

### Corrigido

- **`/docs/` renderizando HTML como texto puro** (bug #1). Causa: `layout()`
  ternary devolvia `string` de `html\`\`` que era re-interpolada em outro
  `html\`\`` → tagged literal escapava. Fix: wrap com `html.raw()`. Afetava
  todas as páginas com sidebar (só `/docs/*` em prática).
- **`/phases` exibindo `[object Object],[object Object]`** (bug #4). Causa:
  array de `RawHtml` em template string crua chamava `Array.toString()`. Fix:
  `cards.map((c) => c.__raw).join('')`.
- **Pricing de Haiku 4.5 desatualizado** (bug #2 parcial). Era `$0.80/$4`
  (preço 3.5 Haiku); corrigido pra oficial `$1/$5` (input/output). Cache
  ajustado proporcionalmente. Mesmo fix em `claude-3-5-haiku`.
- **`updatedAt` do pricing** bumpado pra `2026-05-24` (evita warning de
  pricing desatualizado em projetos novos).

### Melhorado

- **`/tokens` UI mais clara** (bug #2 UX). Grid expandido pra 3 cards top
  (Custo / Sessões / Total tokens) + 4 cards de tipos de token (Input /
  Output / Cache read / Cache write) com tooltips explicando cada
  categoria + cor distintiva (cache read ciano, cache write âmbar).

### Tests

- 36 → 38 unit tests. Adicionado regression test pro bug #1 (escape de
  string aninhada em `html\`\``).

## [1.0.0] — 2026-05-24

### Adicionado (M6 — Hardening + release final)
- **vitest** com 36 unit tests cobrindo `core/pricing`, `core/manifest`, `core/project-state`, `dashboard/lib/html`.
- **`genesis pricing update`** funcional: baixa pricing atual de GitHub raw + grava em `~/.config/genesis/pricing.json`. Flag `--url` pra fonte alternativa.
- **`genesis pricing reset`** — remove override, volta a usar embarcado.
- **`genesis doctor` expandido**: 13 checks de pacote + 5 checks de projeto (config.json, manifest.lock, hooks executáveis, transcripts dir, sync vs upstream). Distingue ✓/!/✗.
- README polished com badges, roadmap, dev setup.

### Modificado
- `pricing/models.json` permanece em 2026-01-15 (atualize via `genesis pricing update` quando necessário).

### Validado
- `npm test` → 36/36 OK.
- `genesis doctor --cwd /projeto` reporta health real.
- `genesis pricing update` baixa + grava + reset funcionam.

## [0.5.0] — 2026-05-24

### Adicionado (M5 — Dashboard interativo + tokens)
- **Painel `/tokens`** lê transcripts do Claude Code em `~/.claude/projects/<hash>/*.jsonl` via cache SQLite incremental (better-sqlite3). Total, por modelo, por dia (bar chart CSS), por sessão.
- **Drill-down** `/tokens/sessions/<id>` com timeline das últimas 200 mensagens.
- **Toggles client-side** em `/skills`: botões pending/doing/done/skip via `POST /api/skill/toggle`.
- **Botão "próxima phase"** em `/phases` via `POST /api/phase/next`.
- **`genesis tokens`** — CLI mirror do painel (`--sessions`, `--json`).
- **`genesis pricing show`** — tabela de preços (placeholder de update).
- `src/pricing/models.json` — pricing embarcado pra opus/sonnet/haiku 4-x + 3.5.
- Validado real: 1697 mensagens do projeto Genesis lidas, $1,237 custo total.

## [0.4.0] — 2026-05-24

### Adicionado (M4 — Dashboard read-only)
- **`genesis dashboard`** spawna server HTTP local (Node nativo, sem Express).
- 6 rotas: `/`, `/docs/[path]`, `/skills`, `/rules`, `/agents`, `/phases`.
- Markdown via `marked` + sidebar tree + breadcrumbs em /docs.
- Tailwind via Play CDN (zero build). Auto-open browser (`open` lib).
- Decisão de stack: descartado Astro original do plano em favor de Node http + template literals — mais simples, menos overhead, M4/M5 unificados.

## [0.3.0] — 2026-05-24

### Adicionado (M3 — skill + phase + config.json)
- **`.genesis/config.json`** schema v1: `{ project, phase: { active }, skills: [{ id, phase, status }] }`.
- **`genesis skill list|show|select|done|skip`** — CRUD interativo.
- **`genesis phase status|next|set`** — navega lifecycle.
- **`init` gera config.json** auto-descobrindo skills via `gray-matter`.
- Parser frontmatter fallback (regex) quando YAML quebra (e.g. `:` em descrição).

## [0.2.0] — 2026-05-24

### Adicionado (M2 — update incremental)
- **`genesis update`** com **3-way merge por SHA-256**.
- Estados: unchanged / safe-overwrite / user-customized / conflict / added-upstream / removed-upstream.
- Backup automático em `.genesis/.backup/<timestamp>/`.
- Prompts interativos pra conflitos (keep/overwrite/write .new/cancel).
- `init` grava `.genesis/manifest.lock.json` (snapshot pristine).
- Flags: `--dry-run`, `--force`, `--cwd`.

## [0.1.0] — 2026-05-24

### Adicionado (M1 — CLI scaffold)
- **`genesis init <nome> [destino]`** — porta TypeScript de `genesis-init.sh`.
- **`genesis doctor`** — health check inicial (15 checks).
- Monorepo `packages/cli` + `packages/boilerplate` (npm workspaces).
- Assets embarcados via `npm prepack` → `assets/` (sync de `packages/boilerplate/`).
- Stack: TypeScript ES2022 + commander + @clack/prompts + picocolors + fs-extra.
