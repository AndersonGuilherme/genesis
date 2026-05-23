---
name: ops-define-slos-slis
description: Define SLO/SLI por endpoint/operação crítica. Burn rate alerts. Error budget. Base SRE Google. Produz `docs/operations/slos.md`.
phase: operations
rules:
  - ops-alert-actionable
---

# Skill: ops-define-slos-slis

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Definir SLO (Service Level Objective) e SLI (Service Level Indicator) por endpoint/operação crítica + burn rate alerts + política de error budget.

## Quando usar

- Após observability ativa (`ops-define-observability`).
- Antes de prometer SLA a cliente.
- Ao identificar gap de visibilidade de qualidade.

## Pré-condições

- Métricas de latência + error rate fluindo pro agregador.
- Lista de operações críticas (cross-link com `docs/operations/critical-modules.md`).
- Template `.genesis/templates/slo-sli-template.md` disponível.

## Processo

1. Listar Critical User Journeys (CUJ): login, checkout, busca, etc.
2. Pra cada CUJ, definir SLIs (medidas concretas):
   - Disponibilidade: % de requests sem 5xx.
   - Latência: % de requests abaixo de threshold (ex.: p95 < 500ms).
   - Qualidade: % de jobs concluídos sem erro.
3. Definir SLO target realista por SLI (ex.: 99.5% disponibilidade no mês).
4. Error budget = `1 - SLO` (ex.: 0.5% das requests podem falhar).
5. Burn rate alerts: alerta quando consumo de budget vai mais rápido que esperado (ex.: 5% do budget em 1h).
6. Política: budget esgotado = freeze de release novo até budget recuperar.
7. Revisão trimestral: SLO ainda reflete realidade + expectativa?
8. Documentar em `docs/operations/slos.md` com tabela SLI × SLO × budget.

## Restrições

- SLO impossível (100% disponibilidade) é teatro — não defina.
- SLI sem fonte de dado clara = ficção.
- Burn rate alert sem ação documentada quebra `ops-alert-actionable`.

## Exemplos de uso

- "Definir SLOs do tchr (login, checkout, busca)."
- "Revisar SLOs do billing pós-incidente de Q1."

## Critérios de conclusão

- [ ] CUJs listadas.
- [ ] SLIs definidos com fonte de dado.
- [ ] SLOs com target justificado.
- [ ] Error budget calculado.
- [ ] Burn rate alerts configurados.
- [ ] Política de budget esgotado documentada.
- [ ] `docs/operations/slos.md` completo.
