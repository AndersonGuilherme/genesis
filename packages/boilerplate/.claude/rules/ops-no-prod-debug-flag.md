---
name: ops-no-prod-debug-flag
description: Flags de debug, verbose log, profiler invasivo e backdoors nunca rodam em produção. Quem ativa por engano = incidente. Tooling força detecção em CI.
phase: operations
---

# Rule: ops-no-prod-debug-flag

## Princípio

Produção roda sem: `DEBUG=true`, `NODE_ENV=development`, log level `debug`/`trace`, profiler invasivo (sem amostragem), endpoints `/debug/*`, e queries `EXPLAIN ANALYZE` em request crítica. Detecção em CI + healthcheck de boot validam.

## Por que existe

Debug flag em produção: vaza stack trace com PII, expõe estrutura interna a atacante, dobra/triplica latência, gera log de volume insuportável. Backdoor "só pra dev" vira CVE (caso clássico: `actuator` Spring exposto).

## Como aplicar

1. CI valida: build de produção rejeita variáveis de debug.
2. Healthcheck/boot do app valida config crítica: `NODE_ENV === 'production'`, log level ≥ `info`, debug endpoints desabilitados.
3. Endpoints `/admin/*`, `/debug/*`, `/metrics` (se sensível) atrás de auth + IP allowlist.
4. Profiler em produção sempre amostrado (1% requests), nunca 100%.
5. Feature flag `verbose_logs` pode existir mas com auto-reset (TTL ≤ 1h) + audit log do uso.
6. Config de log centralizada (não cada dev cria flag própria).

## Exemplos bons

- Dockerfile produção: `ENV NODE_ENV=production LOG_LEVEL=info`. CI rejeita imagem com `LOG_LEVEL=debug`.
- App valida no startup e crasha se `DEBUG=true` em prod.
- Profiler Sentry/Datadog com sample rate 0.01 em prod.
- Endpoint `/admin/sql-console` retornado 404 em prod, ativo em staging com auth + allowlist.

## Exemplos ruins

- Helm chart com `LOG_LEVEL=debug` esquecido após troubleshooting.
- Endpoint `/debug/dump-state` rodando em prod sem auth.
- `console.log(req.body)` em controller crítico, vazando PII em CloudWatch.
- Feature flag de verbose log permanentemente ligada "por garantia".

## Exceções

- Investigação aprovada de incidente pode ligar verbose log por janela curta, com audit do uso e desligamento agendado.
- Ambiente de homologação interna (não exposto externamente) pode rodar com debug pra parity de troubleshooting.

