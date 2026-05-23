# ops-define-deployment-strategy

## O que faz
Escolhe estratégia (rolling, blue-green, canary) com trade-off + procedimentos + runbook.

## Quando você invoca
Antes do primeiro deploy. Ao mudar runtime. Ao identificar limitação.

## O que a IA faz
1. Avalia 3 estratégias com trade-off.
2. Recomenda baseado em observability/volume/custo/risco.
3. Define gates de canary.
4. Migration strategy (separada do código, expand-contract).
5. Janelas + hotfix.
6. Runbook de deploy + rollback.

## Rules invocadas
- [ops-rollback-tested](../../../.claude/rules/ops-rollback-tested.md)
- [ops-runbook-required](../../../.claude/rules/ops-runbook-required.md)

## Próximo passo natural
`ops-setup-cd-pipeline` aplicando a estratégia.
