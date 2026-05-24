---
name: ops-structured-logging
description: Logs em JSON estruturado, nunca string livre. Cada evento tem campos canônicos (timestamp, level, service, trace_id, message, contexto). Parseável por agregador.
phase: operations
---

# Rule: ops-structured-logging

## Princípio

Todo log de aplicação sai em JSON. Cada entry tem campos canônicos: `timestamp` (ISO8601 UTC), `level`, `service`, `env`, `trace_id`, `span_id`, `message`, `context` (objeto livre). Sem `console.log("user X failed Y")` — vira `logger.error({ user_id, action, error_code })`.

## Por que existe

String livre é cara: agregador (Loki, ELK, Datadog) não indexa, alerta vira regex frágil, correlação não acontece. JSON estruturado entra direto no pipeline de observability, filtra por campo, alerta por threshold em métrica derivada.

## Como aplicar

1. Adotar logger estruturado: pino (Node), structlog (Python), zap (Go), log/slog (Go stdlib), tracing (Rust).
2. Campos canônicos obrigatórios em todo entry: `timestamp`, `level`, `service`, `env`, `message`.
3. Campos contextuais: `trace_id` (cross-link `ops-correlation-id`), `user_id` (cuidado com PII), `request_id`.
4. Sem string livre: `logger.info("User logged in")` → `logger.info({ event: "user.login", user_id })`.
5. Cross-link `sec-no-logged-secrets`: sanitizer aplicado antes de escrever.
6. Output: stdout/stderr (12-factor). Coleta via runtime (k8s, docker, agente do provider).

## Exemplos bons

- `logger.info({ event: "order.created", order_id, customer_id, total_cents })`.
- Entry: `{"timestamp":"2026-05-23T12:00:00Z","level":"info","service":"billing","trace_id":"abc123","event":"order.created","order_id":"ord_1"}`.
- Grafana alert: `count_over_time({service="billing", level="error"}[5m]) > 10`.

## Exemplos ruins

- `print("user " + user_id + " logged in")` — string concat, sem level, sem campo.
- `logger.error("everything broke")` — sem contexto.
- Log em arquivo local (`./app.log`) — não vai pro agregador.
- Mistura de formatos (linhas JSON + linhas string) — quebra parser.

## Exceções

- Output humano de CLI (mensagem amigável pro user) é separado de log de aplicação.
- Script one-off de migração pode usar print direto, desde que não vire serviço.

