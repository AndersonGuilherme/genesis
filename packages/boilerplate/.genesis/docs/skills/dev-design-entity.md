# dev-design-entity

## O que faz

Modela 1 entity ou value object do domínio: atributos, invariantes validados, métodos da linguagem ubíqua. Tudo com teste, sem framework.

## Quando você invoca

Quando spec do módulo lista uma entity nova, ou refactor exige criação de VO.

## O que a IA faz

1. Decide entity vs VO baseado em "tem identidade?".
2. Teste failing: construção válida + cada invariante.
3. Implementa entity/VO com construtor privado + factory `create()`.
4. Métodos de domínio com nomes ubíquos (não CRUD).

## O que VOCÊ faz

- Confirma se é entity ou VO.
- Revisa invariantes listados.
- Aprova commit.

## Rules invocadas

- [dev-ddd-bounded-context](../../../.claude/rules/dev-ddd-bounded-context.md)
- [dev-tdd-pragmatic](../../../.claude/rules/dev-tdd-pragmatic.md)
- [dev-clean-code](../../../.claude/rules/dev-clean-code.md)
- [dev-solid](../../../.claude/rules/dev-solid.md)

## Próximo passo natural

`dev-define-use-case` para use cases que usam a entity.
