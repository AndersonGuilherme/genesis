# Brazilian Genesis — monorepo

Repositório que contém:

| Pacote | Função | Distribuição |
|--------|--------|--------------|
| [`packages/boilerplate/`](packages/boilerplate/) | Conteúdo do boilerplate: 56 skills, 46 rules, 22 agents, 31 templates, 56 narrativas humanas. Lifecycle de 8 phases (`discovery → planning → security → lgpd → development → pre-launch → operations → maintenance`). | Embarcado no pacote npm |
| [`packages/cli/`](packages/cli/) | `@tchr/genesis-cli` — CLI Node.js que bootstrapa projeto + serve dashboard local. | npm público (`npx @tchr/genesis-cli`) |

## Estado atual

- **Boilerplate**: v0.4.0 (estável). Lint APROVADO. Lifecycle de 8 phases completo.
- **CLI**: em desenvolvimento (M1 — scaffold). Releases incrementais 0.1.0 → 1.0.0 conforme plano.

## Bootstrap de projeto (modo legado, hoje)

```bash
git clone https://github.com/AndersonGuilherme/genesis.git
bash genesis/packages/boilerplate/.genesis/scripts/genesis-init.sh meu-projeto
```

## Bootstrap de projeto (modo CLI, após M1)

```bash
npx @tchr/genesis-cli init meu-projeto
```

## Documentação humana

A trilha completa do boilerplate (skills, fluxo, exemplos) está em [`packages/boilerplate/README.md`](packages/boilerplate/README.md). Para entender o que é o Genesis enquanto sistema de mentoria, leia esse README primeiro.

## Desenvolvimento

Requisitos: Node.js ≥ 20.10, npm.

```bash
# Lint do boilerplate
npm run lint

# Sanity checks por skill
npm run test:boilerplate
```

Cada workspace tem seu próprio `package.json` e instruções específicas.

## Licença

MIT — veja [`packages/boilerplate/LICENSE`](packages/boilerplate/LICENSE).
