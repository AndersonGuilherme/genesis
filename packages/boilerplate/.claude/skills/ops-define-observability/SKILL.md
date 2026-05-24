---
name: ops-define-observability
description: Define stack de observability (logs + métricas + traces) com OpenTelemetry. Estrutura logs, instrumenta serviços, conecta agregador. Produz `docs/operations/observability.md`.
phase: operations
rules:
  - ops-structured-logging
  - ops-correlation-id
  - sec-no-logged-secrets
---

# Skill: ops-define-observability

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Stack de observability mínima viável: logs estruturados + métricas (RED/USE) + traces distribuídos, com OpenTelemetry como abstração.

## Quando usar

- Antes de primeiro deploy em produção.
- Ao adicionar serviço novo.
- Em incident postmortem (gap de visibilidade).

## Pré-condições

- Stack escolhida.
- Provider de observability decidido (Datadog, Grafana Cloud, Honeycomb, self-hosted).

## Processo

1. Adotar OpenTelemetry SDK no runtime (Node, Python, Go, Rust).
2. Logs estruturados: logger configurado conforme `ops-structured-logging`.
3. Métricas:
   - **RED** pra serviços (Rate, Errors, Duration).
   - **USE** pra recursos (Utilization, Saturation, Errors).
   - Custom metrics de negócio (orders/min, signups/h).
4. Traces distribuídos: propagação W3C, sample rate adequado (ex.: 10% prod, 100% staging).
5. Conectar agregador: OTLP exporter → provider.
6. Dashboards mínimos: visão geral, por serviço, por endpoint top-N.
7. PII: sanitizer no logger + tracer (cross-link `sec-no-logged-secrets`).
8. Custo: monitorar volume de logs/traces (volume cresce rápido).
9. Documentar em `docs/operations/observability.md` com schema, conventions, links de dashboard.

## Restrições

- Sem log/trace contendo PII em claro.
- Sem dependência direta de SDK proprietário (usar OTel pra portabilidade).
- Sem sample rate 100% em produção sem necessidade (custo).
- Sem dashboard cheio de gráficos sem foco (≤ 6-8 panels essenciais).

## Exemplos de uso

- "Configurar observability do tchr com Grafana Cloud."
- "Adicionar tracing distribuído ao módulo billing."

## Critérios de conclusão

- [ ] OTel SDK no runtime de cada serviço.
- [ ] Logs estruturados saindo no formato canônico.
- [ ] Métricas RED ativas + custom de negócio.
- [ ] Traces propagando W3C entre serviços.
- [ ] Agregador recebendo dados.
- [ ] Dashboards mínimos publicados.
- [ ] `docs/operations/observability.md` completo.
