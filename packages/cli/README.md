# @tchr/genesis-cli

[![npm version](https://img.shields.io/npm/v/@tchr/genesis-cli.svg)](https://www.npmjs.com/package/@tchr/genesis-cli)
[![license](https://img.shields.io/npm/l/@tchr/genesis-cli.svg)](LICENSE)

CLI Node.js que bootstrapa projetos a partir do **Brazilian Genesis** boilerplate + serve dashboard local de tokens/custos/docs. Sistema de mentoria disciplinada com lifecycle de 8 phases (`discovery → planning → security → lgpd → development → pre-launch → operations → maintenance`).

## Instalação

Zero-install via npx:

```bash
npx @tchr/genesis-cli init meu-projeto
```

Ou global:

```bash
npm install -g @tchr/genesis-cli
genesis init meu-projeto
```

## Comandos

### `genesis init <nome> [destino]`

Bootstrapa novo projeto a partir do boilerplate.

Flags:
- `--keep-examples` — preserva `.genesis/examples/` no projeto-filho.

Comportamento: copia `.claude/`, `.genesis/`, `docs/`, `CLAUDE.md`, `README.md`, `CHANGELOG.md`, `LICENSE` pro destino. Faz `git init -b main`. Substitui `__PROJECT_NAME__` por `<nome>` em docs. Zera `docs/PROJECT_STATE.md`.

Exemplo:

```bash
npx @tchr/genesis-cli init meu-saas-brasileiro ./meu-saas
cd ./meu-saas
# Abra Claude Code aqui e diga: "vamos iniciar o projeto"
```

### `genesis dashboard`

Abre dashboard local em `http://localhost:4321` com:

- **Overview** — phase ativa, progresso por phase, contadores (done/doing/pending/skip).
- **Tokens** — uso de tokens + custo USD (lê transcripts do Claude Code em `~/.claude/projects/<hash>/*.jsonl`). Por modelo, por dia, por sessão. Drill-down `/tokens/sessions/<id>`.
- **Docs** — viewer renderizado de `docs/**/*.md` com sidebar navegável + breadcrumbs.
- **Skills** — grid filtrável por phase/status, cards com descrição + rules carregadas. **Toggle interativo** muda status sem sair do browser.
- **Rules** — princípios agrupados por phase.
- **Agents** — agents especializados agrupados por phase.
- **Phases** — visão kanban das 8 phases com cards de skills. **Botão "próxima phase"** avança lifecycle.

Flags:
- `--port <n>` — porta HTTP (default: 4321).
- `--no-open` — não abre browser automaticamente.
- `--cwd <path>` — projeto destino.

Server simples Node nativo, zero build. Tailwind via Play CDN. Markdown via `marked`. Ctrl+C pra parar.

```bash
cd meu-projeto
genesis dashboard         # http://localhost:4321 (abre browser)
genesis dashboard --port 8080 --no-open
```

### `genesis skill`

CRUD de status das skills do projeto. Persistido em `.genesis/config.json`.

- `genesis skill list [--phase X] [--status Y]` — grid das skills.
- `genesis skill show <id>` — detalhes (descrição + rules carregadas).
- `genesis skill select <id>` — marca como `doing`.
- `genesis skill done <id>` — marca como `done`.
- `genesis skill skip <id> [--notes ...]` — marca como `skip` (não bloqueia gates).

### `genesis phase`

Inspeciona e avança phase ativa do lifecycle.

- `genesis phase status` — phase ativa + progresso por phase (done/total + skip).
- `genesis phase next` — avança pra próxima phase.
- `genesis phase set <name>` — define phase ativa manualmente.

Phases válidas: `discovery | planning | security | lgpd | development | pre-launch | operations | maintenance`.

### `genesis tokens`

Relatório CLI do uso de tokens + custos (mirror do painel `/tokens` do dashboard).

```bash
genesis tokens                    # tabela formatada
genesis tokens --sessions         # inclui lista de sessões
genesis tokens --json             # output JSON pra script
```

### `genesis pricing`

Gerencia tabela de pricing usada pra calcular custos.

```bash
genesis pricing show              # tabela atual (override do user ou embarcada)
genesis pricing update            # baixa pricing atual de GitHub raw → ~/.config/genesis/pricing.json
genesis pricing update --url <u>  # baixa de URL alternativa
genesis pricing reset             # remove override, volta a usar embarcado
```

### `genesis doctor`

Health check completo: pacote + projeto + hooks + lock + transcripts + pricing.

- ✓ verde: tudo OK.
- ! amarelo: warning (não bloqueia uso — ex.: pricing desatualizado, projeto sem transcripts ainda).
- ✗ vermelho: erro (corrigir antes de continuar).

```bash
genesis doctor                    # cwd ascendente
genesis doctor --cwd /path/proj   # explícito
```

### `genesis update`

Atualiza projeto-filho pra versão nova do boilerplate via 3-way merge por hash. Preserva customizações.

Flags:
- `--dry-run` — mostra o que mudaria sem aplicar.
- `--force` — aplica safe-overwrite e adds sem prompt (conflitos ainda perguntam).
- `--cwd <path>` — projeto destino (default: cwd ascendente até achar `.genesis/manifest.lock.json`).

Comportamento (3-way diff por SHA-256):

| Estado | Ação |
|--------|------|
| `unchanged` (current == pristine == new) | no-op silencioso |
| `safe-overwrite` (current == pristine ≠ new) | sobrescreve (upstream mudou, você não tocou) |
| `user-customized` (current ≠ pristine == new) | mantém (você tocou, upstream não mudou) |
| `conflict` (current ≠ pristine ≠ new) | **prompt**: keep / overwrite / write .new / cancel |
| `added-upstream` (não no pristine, sim no new) | copia |
| `removed-upstream` (no pristine, não no new) | **prompt**: keep / delete / cancel |

`docs/`, `CHANGELOG.md`, `.genesis/.backup/`, `.genesis/.cache/`, `.genesis/manifest.lock.json` são **user-owned** — nunca tocados pelo update.

Backup automático em `.genesis/.backup/<timestamp>/` antes de cada sobrescrita ou delete.

Exemplo:

```bash
cd meu-projeto
npx @tchr/genesis-cli update --dry-run   # vê o que mudaria
npx @tchr/genesis-cli update             # aplica interativamente
```

### `genesis dashboard` (M4 — em breve)

Abre dashboard local com viewer de docs, browser de skills/rules/agents, painel de tokens/custos.

## Lifecycle do projeto criado

```
discovery → planning → security → lgpd → development → pre-launch → operations → maintenance
```

Cada phase tem skills/rules/agents próprios em `.claude/`. Gate por phase via `bash .genesis/scripts/check-readiness.sh --<phase>`.

Conteúdo completo do boilerplate: [README do boilerplate](https://github.com/AndersonGuilherme/genesis/blob/main/packages/boilerplate/README.md).

## Requisitos

- Node.js ≥ 20.10
- `git`

## Desenvolvimento

```bash
git clone https://github.com/AndersonGuilherme/genesis.git
cd genesis
npm install
cd packages/cli
npm run sync-assets    # copia boilerplate → assets/
npm run build          # tsc → dist/
npm test               # vitest (36 unit tests)
npm run dev -- init meu-projeto  # rodar via tsx sem build
```

Estrutura monorepo:
- [`packages/boilerplate/`](../boilerplate/) — conteúdo (skills, rules, agents, templates, docs).
- [`packages/cli/`](.) — CLI Node + dashboard local.

## Roadmap

| Milestone | Versão | Status |
|-----------|--------|--------|
| M1 — CLI scaffold (init + doctor) | 0.1.0 | ✅ |
| M2 — update incremental (3-way merge) | 0.2.0 | ✅ |
| M3 — skill + phase + config.json | 0.3.0 | ✅ |
| M4 — Dashboard read-only | 0.4.0 | ✅ |
| M5 — Dashboard interativo + tokens | 0.5.0 | ✅ |
| M6 — Hardening + release 1.0 | **1.0.0** | ✅ |

Próximos: dashboard SSE (live update), prebuilt binaries, more skills.

## CI/CD

Workflows em [.github/workflows/](../../.github/workflows/):

- **`ci.yml`** — roda em PR + push pra main: unit tests (Node 20+22), lint do boilerplate, smoke test do `init` (e2e).
- **`release.yml`** — roda em tag push (`v*`): build + test + `npm publish --provenance`. Requer secret `NPM_TOKEN` (automation token) configurado em GitHub repo settings → Environments → `npm`.

Pra publicar uma versão nova:
```bash
# bump version
cd packages/cli && npm version patch    # ou minor / major
git push --follow-tags                  # release.yml dispara, publica auto
```

## Licença

MIT — © Anderson Souza
