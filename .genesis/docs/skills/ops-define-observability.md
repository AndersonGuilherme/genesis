# ops-define-observability

## O que faz
Stack mínimo viável: logs estruturados + métricas RED/USE + traces distribuídos via OpenTelemetry.

## Quando você invoca
Antes do primeiro deploy. Ao adicionar serviço. Em postmortem com gap de visibilidade.

## O que a IA faz
1. Adota OTel SDK.
2. Logs estruturados (cross-link `ops-structured-logging`).
3. RED por serviço + custom de negócio.
4. Traces W3C, sample rate adequado.
5. OTLP exporter → provider.
6. Dashboards focados (≤ 8 panels).
7. Sanitizer pra PII.

## Rules invocadas
- [ops-structured-logging](../../../.claude/rules/ops-structured-logging.md)
- [ops-correlation-id](../../../.claude/rules/ops-correlation-id.md)
- [sec-no-logged-secrets](../../../.claude/rules/sec-no-logged-secrets.md)

## Próximo passo natural
`ops-define-slos-slis` + `ops-define-runbook`.
