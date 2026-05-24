# Tests: ops-define-observability

## Pré-condição
- Stack escolhida.
- Provider de observability decidido (Datadog, Grafana Cloud, Honeycomb, self-hosted).

## Prompts canônicos
- "configurar observability"
- "OpenTelemetry SDK"
- "logs estruturados + traces"

## Comportamentos esperados
- [ ] OTel SDK no runtime de cada serviço.
- [ ] Logs estruturados (cross-link `ops-structured-logging`).
- [ ] Métricas RED por serviço + USE por recurso + custom de negócio.
- [ ] Traces W3C, sample rate adequado.
- [ ] Agregador recebendo (OTLP exporter).
- [ ] Dashboards mínimos (≤ 8 panels essenciais).
- [ ] Sanitizer pra PII.

## Anti-padrões
- [ ] NÃO loga PII em claro.
- [ ] NÃO usa SDK proprietário direto (perde portabilidade).
- [ ] NÃO faz sample rate 100% em prod sem necessidade.
