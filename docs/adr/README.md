# Architecture Decision Records (ADR)

> Toda decisão importante vira ADR. Sem ADR, decisão se perde, vira folclore, ninguém lembra por que foi feita.

## Quando criar ADR

- Escolha de linguagem / framework principal
- Padrão arquitetural (eventos, CQRS, monolito modular, etc.)
- Escolha de banco de dados
- Política de autenticação / autorização
- Integração com fornecedor crítico
- Mudança de modelo de monetização
- Decisão de não fazer algo importante (anti-decisão)

Regra prática: **se daqui a 6 meses você não vai lembrar por que decidiu, é ADR.**

## Quando NÃO criar ADR

- Escolha de biblioteca pequena substituível
- Convenção de nome
- Detalhe interno de implementação
- Decisão revertível com 1 PR

## Numeração

`NNNN-titulo-curto.md`

- `NNNN` = 4 dígitos, incrementais (`0001`, `0002`, ...)
- `titulo-curto` em kebab-case, máximo ~6 palavras

Exemplos:
- `0001-stack-principal.md`
- `0002-postgres-como-banco-primario.md`
- `0017-nao-usar-microservicos-no-mvp.md`

## Status possível

- `proposed` — em discussão
- `accepted` — decidido e em vigor
- `deprecated` — não usar mais, mas substituído por outro ADR
- `superseded by NNNN` — substituído por outro ADR específico

## Como escrever

Use [../../templates/adr-template.md](../../templates/adr-template.md). Mantenha curto: 1–2 páginas.

## Boas práticas

1. **Escreva no tempo presente.** "Decidimos usar X" (não "decidiu-se").
2. **Liste alternativas REAIS consideradas.** Sem alternativa, decisão é hábito.
3. **Liste consequências negativas também.** Honestidade vale ouro.
4. **Não edite ADRs antigos.** Crie um novo que supersede.
5. **Inclua data.** Ajuda a entender o contexto histórico.

## Índice

| Número | Título | Status | Data |
|--------|--------|--------|------|
| _(ainda nenhum — preencher conforme criar)_ | — | — | — |

Atualize esta tabela toda vez que criar ou mudar o status de um ADR.
