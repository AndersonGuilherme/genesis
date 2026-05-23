# sec-secrets-management-plan

## O que faz
Inventário de secrets + vault/KMS + procedimento de rotação. Produz `docs/security/secrets-management.md`.

## Quando você invoca
Após `plan-design-architecture`, antes de qualquer deploy.

## O que a IA faz
1. Lista secrets necessários por ambiente.
2. Escolhe vault/KMS.
3. Define como app obtém secrets.
4. Procedimento padrão + emergencial de rotação.

## Rules invocadas
- [sec-secrets-no-commit](../../../.claude/rules/sec-secrets-no-commit.md)
- [sec-no-logged-secrets](../../../.claude/rules/sec-no-logged-secrets.md)
- [sec-encryption-at-rest](../../../.claude/rules/sec-encryption-at-rest.md)

## Próximo passo natural
`sec-dependency-vuln-scan`.
