# prelaunch-security-final-review

## O que faz
Checklist final de segurança. Cruza outputs sec-* com código/infra. Lista gaps bloqueantes.

## Quando você invoca
Antes da reunião go/no-go. Após mudança arquitetural significativa pós-launch.

## O que a IA faz
1. Revalida threat model.
2. Verifica auth/authz/secrets/encryption/audit.
3. Confirma rate limit + sanitizer + vuln scan verde.
4. Lista bloqueantes vs dívidas.
5. Documenta em `docs/launch/security-final-review.md`.

## Rules invocadas
- [prelaunch-gate-complete](../../../.claude/rules/prelaunch-gate-complete.md)
- [sec-secrets-no-commit](../../../.claude/rules/sec-secrets-no-commit.md)
- [sec-authn-required](../../../.claude/rules/sec-authn-required.md)
- [sec-authz-enforced](../../../.claude/rules/sec-authz-enforced.md)
- [sec-encryption-at-rest](../../../.claude/rules/sec-encryption-at-rest.md)
- [sec-encryption-in-transit](../../../.claude/rules/sec-encryption-in-transit.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)
- [sec-rate-limit-public-api](../../../.claude/rules/sec-rate-limit-public-api.md)
- [sec-no-logged-secrets](../../../.claude/rules/sec-no-logged-secrets.md)

## Próximo passo natural
`prelaunch-lgpd-compliance-check` + `prelaunch-performance-baseline`.
