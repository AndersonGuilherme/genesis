# sec-define-auth-strategy

## O que faz
Define authn (JWT/OAuth/sessão) + authz (RBAC/ABAC) + multi-tenant + lifecycle de token + senha policy. Produz `docs/security/auth-strategy.md`.

## Quando você invoca
Após `sec-threat-model` + `plan-map-users`.

## O que a IA faz
1. Escolhe método de auth justificado.
2. Lista endpoints públicos (exceções).
3. Matriz role × recurso.
4. Decide multi-tenant + filter.
5. Lifecycle de token + rotação de chave.
6. Senha policy (hash + complexidade + reset + lockout).

## Rules invocadas
- [sec-authn-required](../../../.claude/rules/sec-authn-required.md)
- [sec-authz-enforced](../../../.claude/rules/sec-authz-enforced.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)
- [sec-encryption-in-transit](../../../.claude/rules/sec-encryption-in-transit.md)

## Próximo passo natural
`sec-secrets-management-plan` + `sec-define-encryption-strategy`.
