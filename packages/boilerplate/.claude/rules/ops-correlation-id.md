---
name: ops-correlation-id
description: Toda request gera/propaga trace_id. Logs, métricas, traces, jobs assíncronos e eventos carregam o ID. Sem ID = debug impossível em produção.
phase: operations
---

# Rule: ops-correlation-id

## Princípio

`trace_id` (ou `request_id`) é gerado na boundary externa (gateway/controller) ou propagado de header W3C `traceparent`. Toda chamada interna, log, métrica, evento publicado e job consumido carrega o mesmo ID. OpenTelemetry como padrão.

## Por que existe

Debug em distribuído sem correlation ID é vasculhar logs por timestamp aproximado — impossível em produção com volume. Trace ID conecta: request HTTP → log de controller → log de use case → query de banco → evento publicado → consumidor → job. Tudo na mesma linha.

## Como aplicar

1. Middleware na boundary HTTP: lê header `traceparent` (W3C Trace Context). Se ausente, gera novo UUID.
2. Propaga via contexto (AsyncLocalStorage Node, contextvars Python, Context Go).
3. Logger inclui `trace_id` automaticamente (logger wrapper).
4. Cliente HTTP para chamadas internas inclui header `traceparent` (OpenTelemetry instrumentation faz por default).
5. Eventos publicados em fila/bus carregam `trace_id` no envelope.
6. Consumidor lê `trace_id` do envelope, propaga no contexto, loga.
7. Jobs agendados (cron, scheduled) geram novo `trace_id` no início.

## Exemplos bons

- Header `traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01`.
- Log `{"trace_id":"0af7651916cd43dd8448eb211c80319c","service":"api","event":"order.created"}` + `{"trace_id":"0af7651916cd43dd8448eb211c80319c","service":"billing","event":"charge.initiated"}`.
- Grafana: filtro `{trace_id="abc"}` mostra request inteira atravessando serviços.

## Exemplos ruins

- Trace ID gerado no client e não validado (cliente injeta ID conflitante).
- Jobs assíncronos sem trace ID (cron roda em vazio, debug impossível).
- Log de exceção sem trace ID (sabe que quebrou, não sabe em qual request).
- Headers diferentes por serviço (`X-Request-Id` vs `X-Trace-Id` vs `traceparent`) — quebra propagação.

## Exceções

- Healthcheck simples (`/health`) pode dispensar trace (volume alto, sem valor pra debug).
- Logs internos puramente operacionais (boot, shutdown) não exigem trace ID.

