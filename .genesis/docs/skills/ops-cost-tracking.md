# ops-cost-tracking

## O que faz
Cost export ativo, tags obrigatórias, dashboard de custo, alertas de billing. Previne fatura surpresa.

## Quando você invoca
Antes de produção. Ao adicionar SaaS com custo variável. Em revisão FinOps mensal.

## O que a IA faz
1. Habilita cost export.
2. Tags por módulo/env/owner.
3. Dashboard de custo (total, por módulo, top 10).
4. Alertas (projeção > orçamento, daily > 2x média, recurso novo caro).
5. Custo unitário (custo/user, custo/order).

## Rules invocadas
- [ops-alert-actionable](../../../.claude/rules/ops-alert-actionable.md)

## Próximo passo natural
Revisão FinOps mensal.
