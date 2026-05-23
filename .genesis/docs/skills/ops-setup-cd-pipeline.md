# ops-setup-cd-pipeline

## O que faz
CD com gates (canary, manual approval em prod), rollback automático em SLO burn rate.

## Quando você invoca
Após CI estável. Antes do primeiro deploy em produção.

## O que a IA faz
1. Estágios: staging → smoke → canary → full.
2. Estratégia escolhida (cross-link `ops-define-deployment-strategy`).
3. Rollback automático em burn rate alto.
4. Approval gate pra prod quando aplicável.
5. Audit log do deploy.

## Rules invocadas
- [ops-rollback-tested](../../../.claude/rules/ops-rollback-tested.md)
- [ops-no-prod-debug-flag](../../../.claude/rules/ops-no-prod-debug-flag.md)
- [ops-runbook-required](../../../.claude/rules/ops-runbook-required.md)

## Próximo passo natural
`ops-define-observability` + `ops-define-slos-slis`.
