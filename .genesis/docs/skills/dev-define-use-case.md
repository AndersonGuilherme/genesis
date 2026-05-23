# dev-define-use-case

## O que faz

Implementa 1 use case completo seguindo TDD pragmático: escreve teste failing, implementa o mínimo pra passar, refatora.

## Quando você invoca

Para cada use case da spec, individualmente. Após `dev-scaffold-module`.

## O que a IA faz

1. RED — cria `<name>.use-case.spec.<ext>` com teste falhando.
2. GREEN — implementa `<name>.use-case.<ext>` mínimo pra passar.
3. REFACTOR — limpa nomes, aplica SOLID/Clean Code.
4. Adiciona teste de erro/borda.

## O que VOCÊ faz

- Aponta qual use case (1 por vez).
- Revê o teste antes da impl (essencial).
- Aprova commit.

## Rules invocadas

- [dev-tdd-pragmatic](../../../.claude/rules/dev-tdd-pragmatic.md)
- [dev-use-case-per-file](../../../.claude/rules/dev-use-case-per-file.md)
- [dev-clean-architecture-layers](../../../.claude/rules/dev-clean-architecture-layers.md)
- [dev-solid](../../../.claude/rules/dev-solid.md)

## Próximo passo natural

Outro use case com `dev-define-use-case`, ou `dev-design-entity` se nova entidade emerge.
