# @tchr/genesis-cli

CLI Node.js que bootstrapa projetos a partir do Brazilian Genesis boilerplate + serve dashboard local de tokens/custos/docs.

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
- **Docs** — viewer renderizado de `docs/**/*.md` com sidebar navegável + breadcrumbs.
- **Skills** — grid filtrável por phase/status, cards com descrição + rules carregadas.
- **Rules** — princípios agrupados por phase.
- **Agents** — agents especializados agrupados por phase.
- **Phases** — visão kanban das 8 phases com cards de skills.

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

### `genesis doctor`

Valida que a instalação está saudável: hooks executáveis, manifest íntegro, lint do boilerplate OK.

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

## Licença

MIT
