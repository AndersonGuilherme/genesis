# dev-review-module-cohesion

## O que faz

Auditoria estrutural de 1 módulo. Verifica camadas, dependency direction, bounded context, use case granularity, ports. Reporta findings, NÃO refatora.

## Quando você invoca

- Periodicamente (a cada N PRs no módulo).
- Antes de feature significativa.
- Após onboarding de novo dev.

## O que a IA faz

1. Lista arquivos por camada.
2. Mapeia imports e valida direção.
3. Confere bounded context (vazamento? glossário consistente?).
4. Confere use cases (1 por arquivo? teste irmão?).
5. Confere ports (vivem no domain? não-infladas?).
6. Retorna findings: `arquivo:linha — severidade — problema — fix sugerido`.

## O que VOCÊ faz

- Aponta o módulo.
- Decide quais findings priorizar.
- Pode invocar `dev-refactor-to-clean-architecture` em seguida.

## Rules invocadas

- [dev-clean-architecture-layers](../../../.claude/rules/dev-clean-architecture-layers.md)
- [dev-dependency-direction](../../../.claude/rules/dev-dependency-direction.md)
- [dev-ddd-bounded-context](../../../.claude/rules/dev-ddd-bounded-context.md)
- [dev-use-case-per-file](../../../.claude/rules/dev-use-case-per-file.md)

## Próximo passo natural

Refatoração focada com `dev-refactor-to-clean-architecture` (se há high-severity findings).
