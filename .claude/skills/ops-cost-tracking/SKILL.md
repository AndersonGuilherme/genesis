---
name: ops-cost-tracking
description: Configura alertas de billing por serviço/conta. Tag de recursos por módulo. Dashboard de custo. Previne fatura surpresa. Produz `docs/operations/cost-tracking.md`.
phase: operations
rules:
  - ops-alert-actionable
---

# Skill: ops-cost-tracking

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Visibilidade de custo de infra/SaaS por módulo. Alertas previnem fatura surpresa.

## Quando usar

- Antes de produção (evita susto no fim do mês 1).
- Ao adicionar SaaS novo com custo variável.
- Em revisão financeira mensal.

## Pré-condições

- Provider cloud + SaaS com billing API/export.
- Convenção de tags por módulo (cross-link com `dev-module-naming`).

## Processo

1. Habilitar cost export do provider (AWS Cost & Usage Report, GCP Billing Export pra BigQuery, Azure Cost Management).
2. Tag obrigatória em cada recurso: `module`, `env`, `owner`.
3. Dashboard de custo: total mensal, por módulo, por env, top 10 recursos.
4. Alertas:
   - Custo mensal projetado > orçamento → warning.
   - Custo diário > 2x média histórica → alerta.
   - Recurso novo de alto custo sem aprovação → alerta.
5. SaaS billing: integrar billing API quando possível, manual review mensal quando não.
6. FinOps: revisão mensal — top spenders, oportunidades de saving (reserved instances, spot, downsizing).
7. Custo por user/order (unit economics) — métrica de produto.
8. Documentar em `docs/operations/cost-tracking.md`.

## Restrições

- Sem recurso provisioned sem tag.
- Sem alerta de billing apenas no fim do mês (tarde).
- Sem ignorar custo de tráfego inter-region/inter-az (esquece e bate forte).
- Sem deixar feature flag ativada que consome LLM/SMS após teste.

## Exemplos de uso

- "Configurar cost tracking do tchr (AWS + Sendgrid + OpenAI)."
- "Revisar FinOps Q1 — onde sangra mais."

## Critérios de conclusão

- [ ] Cost export ativo.
- [ ] Tags obrigatórias em recursos.
- [ ] Dashboard publicado.
- [ ] Alertas configurados.
- [ ] Revisão mensal agendada.
- [ ] Métrica de custo por unidade de negócio.
- [ ] `docs/operations/cost-tracking.md` completo.
