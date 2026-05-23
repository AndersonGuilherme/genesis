# sec-define-audit-logging

## O que faz
Define ações auditadas + formato evento + store separado + retenção legal. Produz `docs/security/audit-logging.md`.

## Quando você invoca
Após `sec-define-auth-strategy`, antes do desenvolvimento.

## O que a IA faz
1. Lista ações sensíveis a auditar.
2. Define formato JSON estruturado.
3. Escolhe store append-only.
4. Define retenção (mín 5 anos LGPD).
5. Acesso restrito + alertas.

## Rules invocadas
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)
- [sec-no-logged-secrets](../../../.claude/rules/sec-no-logged-secrets.md)
- [sec-authz-enforced](../../../.claude/rules/sec-authz-enforced.md)

## Próximo passo natural
`sec-define-rate-limiting`.
