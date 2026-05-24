# ops-setup-ci-pipeline

## O que faz
Configura CI pipeline com lint, test, build, secret/dep/SAST scan e gate de merge. Stack-neutral.

## Quando você invoca
Antes do primeiro deploy. Ao adicionar serviço novo. Em readiness.

## O que a IA faz
1. Define estágios (lint → test → build → scans).
2. Define gates (falha bloqueia merge).
3. Configura cache + matrix.
4. Secrets via vault do provider.
5. Notificação de falha em main.

## Rules invocadas
- [ops-rollback-tested](../../../.claude/rules/ops-rollback-tested.md)
- [sec-secrets-no-commit](../../../.claude/rules/sec-secrets-no-commit.md)

## Próximo passo natural
`ops-setup-cd-pipeline`.
