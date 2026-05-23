# dev-refactor-to-clean-architecture

## O que faz

Refatora código existente que viola Clean Architecture (dependência errada, lógica no controller, port no infra) sem mudar comportamento. Testes verdes antes → verdes depois.

## Quando você invoca

- Code review apontou violação.
- Onboarding em módulo legado.
- Antes de adicionar feature em módulo bagunçado.

## O que a IA faz

1. Confirma suite verde.
2. Mapeia violações (1 por vez).
3. Extrai/move código preservando comportamento.
4. Re-roda testes a cada passo, confirma verde.
5. Commit pequeno por extração.

## O que VOCÊ faz

- Garante cobertura de teste antes (se faltar, escrever testes de caracterização primeiro).
- Revisa diff a cada extração.
- Não introduzir feature nova no meio do refactor.

## Rules invocadas

- [dev-clean-architecture-layers](../../../.claude/rules/dev-clean-architecture-layers.md)
- [dev-dependency-direction](../../../.claude/rules/dev-dependency-direction.md)
- [dev-solid](../../../.claude/rules/dev-solid.md)
- [dev-tdd-pragmatic](../../../.claude/rules/dev-tdd-pragmatic.md)

## Próximo passo natural

`dev-review-module-cohesion` pra confirmar estrutura final.
