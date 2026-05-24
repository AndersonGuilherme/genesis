# sec-multi-tenant-isolation

## O que faz
Define propagação e filter de tenant_id + helper central + testes de isolamento. Produz `docs/security/multi-tenant-isolation.md`.

## Quando você invoca
Após `sec-define-auth-strategy` confirmar multi-tenant.

## O que a IA faz
1. Decide onde tenant_id vive (claim/header/path).
2. Helper central que injeta filter.
3. Repositórios com contrato `tenant_id`.
4. Testes: actor de tenant A não vê tenant B.
5. Audit + alert em tentativa cross-tenant.

## Rules invocadas
- [sec-authz-enforced](../../../.claude/rules/sec-authz-enforced.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)

## Próximo passo natural
`sec-webhook-signing` (se houver webhooks).
