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

### `genesis doctor`

Valida que a instalação está saudável: hooks executáveis, manifest íntegro, lint do boilerplate OK.

### `genesis update` (M2 — em breve)

Atualiza projeto-filho pra versão nova do boilerplate via 3-way merge por hash. Preserva customizações.

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
