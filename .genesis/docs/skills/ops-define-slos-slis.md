# ops-define-slos-slis

## O que faz
SLO/SLI por Critical User Journey. Burn rate alerts. Error budget. Política de freeze.

## Quando você invoca
Após observability ativa. Antes de prometer SLA. Quando time não enxerga qualidade.

## O que a IA faz
1. Lista CUJs.
2. Define SLIs com fonte de dado.
3. SLO target realista.
4. Error budget calculado.
5. Burn rate alerts (P1: 14.4, P2: 6).
6. Política de budget esgotado (freeze de release).

## Rules invocadas
- [ops-alert-actionable](../../../.claude/rules/ops-alert-actionable.md)

## Próximo passo natural
`ops-define-incident-response`.
