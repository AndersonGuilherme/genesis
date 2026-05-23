# dev-scaffold-module

## O que faz

Pega uma spec aprovada de módulo (`docs/specs/<modulo>/`) e gera a estrutura de pastas + arquivos esqueleto seguindo Clean Architecture 3-layer (`domain/`, `application/`, `infra/`).

## Quando você invoca

Depois que `plan-define-module-spec` aprovou a spec do módulo. Antes de qualquer use case ou entity ser implementado.

## O que a IA faz

1. Lê spec do módulo.
2. Cria `src/<module>/` com 3 camadas.
3. Esqueletos: entities, value objects, ports, use cases (vazios), repository impls.
4. README do módulo preenchido a partir da spec.

## O que VOCÊ faz

- Confirma o nome do módulo (EN singular kebab-case).
- Aponta a spec.
- Revisa o esqueleto antes de prosseguir pra implementação.

## Rules invocadas

- [dev-clean-architecture-layers](../../../.claude/rules/dev-clean-architecture-layers.md)
- [dev-module-naming](../../../.claude/rules/dev-module-naming.md)
- [dev-ddd-bounded-context](../../../.claude/rules/dev-ddd-bounded-context.md)
- [dev-dependency-direction](../../../.claude/rules/dev-dependency-direction.md)

## Próximo passo natural

`dev-define-use-case` (implementar cada use case com TDD).
