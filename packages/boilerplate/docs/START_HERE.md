# START_HERE

Bem-vindo. Este é o ponto de entrada do projeto. Leia este arquivo antes de qualquer outro.

## O que este repositório é

Um projeto criado a partir do `project-genesis-boilerplate`. O boilerplate força uma sequência disciplinada de planejamento antes de qualquer código. Isto não é um template de código — é um sistema de mentoria.

## Por onde começar

1. **Leia o [README.md](../README.md)** da raiz. Ele explica o fluxo geral.
2. **Leia o [CLAUDE.md](../CLAUDE.md)** da raiz. Ele define como a IA deve se comportar aqui.
3. **Abra o Claude Code** no diretório raiz e diga: *"vamos iniciar o projeto"*. A IA vai carregar a skill `plan-init-project` e conduzir você pelas phases.
4. **Acompanhe seu progresso em [PROJECT_STATE.md](PROJECT_STATE.md)**. Ele é atualizado a cada phase concluída.
5. **Em dúvida sobre um termo**, consulte [glossary.md](glossary.md).
6. **Em dúvida sobre uma skill específica**, consulte [.genesis/docs/skills/](../.genesis/docs/skills/README.md) — walkthrough humano de cada skill.

## Lifecycle: 8 phases

Você passará por estas phases, nesta ordem, sem pular. Cada phase tem skills/rules/agents próprios (namespace correspondente em `.claude/`).

| # | Phase | Skills | Saída esperada |
|--:|-------|--------|----------------|
| 1 | **discovery** | `disc-*` | Premissas validadas (entrevistas, experimentos) |
| 2 | **planning** | `plan-*` | Produto + negócio + stack + arquitetura + specs |
| 3 | **security** | `sec-*` | Threat model + auth + encryption + audit + rate limit |
| 4 | **lgpd** | `lgpd-*` | ROPA + consent + retenção + direitos titular + DPAs |
| 5 | **development** | `dev-*` | Código com TDD + DDD + Clean Architecture |
| 6 | **pre-launch** | `prelaunch-*` | Checklist final + load test + go/no-go |
| 7 | **operations** | `ops-*` | CI/CD + observability + SLO + runbooks + incident response |
| 8 | **maintenance** | `maint-*` | Updates + postmortems + deprecação + compatibility |

Pessoas com pressa querem pular pra 5 (development). A IA vai redirecionar.

## Como saber se estou pronto pra avançar

Cada gate de readiness valida uma phase antes da próxima:

```bash
bash .genesis/scripts/check-readiness.sh              # default: planning gate
bash .genesis/scripts/check-readiness.sh --planning   # planning completo
bash .genesis/scripts/check-readiness.sh --security   # security completo
bash .genesis/scripts/check-readiness.sh --lgpd       # lgpd completo
bash .genesis/scripts/check-readiness.sh --pre-launch # tudo + checklist launch
bash .genesis/scripts/check-readiness.sh --all        # sequencial de todos
```

Se retornar `0`, gate passou. Se retornar `1`, leia a saída — ela lista o que falta.

## Regras de ouro

- Não tente pular phases. A IA vai redirecionar.
- Toda decisão importante vira ADR em `docs/adr/`.
- Todo módulo precisa de spec em `docs/specs/` antes do código.
- Documentos vazios contam como "não preenchidos". Conteúdo real é exigido.
- Se discordar de uma sugestão da IA, registre o motivo. Mentoria é diálogo.

## Próximo passo

Vá para [PROJECT_STATE.md](PROJECT_STATE.md) e verifique em que phase você está. Depois peça à IA para conduzir essa phase.
