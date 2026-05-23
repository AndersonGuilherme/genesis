# dev-define-use-case-authenticated

## O que faz
Variante de `dev-define-use-case` para use cases que exigem auth. Aplica TDD + RBAC/ABAC + audit log + input validation.

## Quando você invoca
Use case que NÃO é público (maioria — sec-authn-required é default).

## O que a IA faz
1. Aplica processo de `dev-define-use-case` (RED → GREEN → REFACTOR).
2. Adições obrigatórias:
   - Use case recebe `actor` (id + role + tenant).
   - Primeira ação verifica permissão.
   - Validação input via schema.
   - Audit log no sucesso + falha de authz.
   - Multi-tenant: query filtra tenant_id.
3. Testes extras: sem permissão, outro tenant, input inválido.

## Rules invocadas
Base dev + security:
- [dev-tdd-pragmatic](../../../.claude/rules/dev-tdd-pragmatic.md)
- [dev-use-case-per-file](../../../.claude/rules/dev-use-case-per-file.md)
- [dev-clean-architecture-layers](../../../.claude/rules/dev-clean-architecture-layers.md)
- [dev-solid](../../../.claude/rules/dev-solid.md)
- [sec-authn-required](../../../.claude/rules/sec-authn-required.md)
- [sec-authz-enforced](../../../.claude/rules/sec-authz-enforced.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)
- [sec-input-validation](../../../.claude/rules/sec-input-validation.md)

## Próximo passo natural
Continuar com próximo use case ou (se toca PII) `dev-define-use-case-with-pii` (Bloco D).
