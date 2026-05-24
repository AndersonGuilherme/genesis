# sec-dependency-vuln-scan

## O que faz
Configura scanners (deps, secrets, SAST, DAST) com gates em CI + SLA de triage. Produz `docs/security/vuln-scan-strategy.md`.

## Quando você invoca
Após `plan-choose-stack`, antes do primeiro deploy.

## O que a IA faz
1. Identifica scanners apropriados à stack.
2. Configura workflow CI.
3. Define gates por severidade.
4. SLA por severidade (critical 24h, high 7d, medium 30d).
5. Exception process documentado.

## Rules invocadas
- [sec-secrets-no-commit](../../../.claude/rules/sec-secrets-no-commit.md)

## Próximo passo natural
`sec-define-encryption-strategy`.
