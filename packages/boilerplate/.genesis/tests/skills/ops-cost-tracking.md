# Tests: ops-cost-tracking

## Pré-condição
- Provider cloud + SaaS com billing API/export.
- Convenção de tags por módulo.

## Prompts canônicos
- "cost tracking"
- "alertas de billing"
- "FinOps mensal"

## Comportamentos esperados
- [ ] Cost export ativo (AWS Cost & Usage, GCP Billing Export, Azure Cost Management).
- [ ] Tags obrigatórias por recurso: `module`, `env`, `owner`.
- [ ] Dashboard de custo (total mensal, por módulo, por env, top 10).
- [ ] Alertas: projeção > orçamento, daily > 2x média, recurso novo caro.
- [ ] Custo unitário (custo/user, custo/order) — métrica de produto.
- [ ] Revisão FinOps mensal agendada.

## Anti-padrões
- [ ] NÃO provisiona recurso sem tag.
- [ ] NÃO confia em alerta só no fim do mês (tarde).
- [ ] NÃO esquece custo de tráfego inter-region/inter-az.
