---
name: sec-rate-limit-public-api
description: Toda API pública tem rate limit por IP + por user. Limites documentados, headers `X-RateLimit-*` retornados, 429 com `Retry-After` em excesso.
phase: security
---

# Rule: sec-rate-limit-public-api

## Princípio

Toda rota pública (sem autenticação OU autenticada mas exposta a internet) tem rate limit configurado. Limites diferentes para endpoints diferentes (login mais estrito que health). Resposta 429 inclui `Retry-After`. Limites documentados em `docs/security/auth-strategy.md`.

## Por que existe

Sem rate limit: brute force em login, scraping massivo, DoS barato, abuso de API que custa $/request (LLM/SMS/email). Rate limit não substitui WAF mas é primeira barreira.

## Como aplicar

1. Rate limiter em gateway/middleware (Redis-backed para multi-instance).
2. Limite por IP + por user autenticado. Tomar max ou stack.
3. Endpoints com custo monetário (LLM, envio de email/SMS) têm limite extra mais restrito.
4. Login: 5-10 tentativas por minuto por IP, com lockout escalonado.
5. Resposta 429 com headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`.
6. Logs de 429 monitorados (sinal de ataque ou cliente mal-configurado).

## Exemplos bons

- nginx `limit_req` ou middleware (`express-rate-limit`, `slowapi`, etc.) configurado.
- `POST /auth/login`: 5 req/min/IP. `GET /api/products`: 100 req/min/user.
- `POST /api/llm/chat`: 20 req/min/user (custo monetário).
- Endpoint `/health` exceção com limite alto pra healthchecks de loadbalancer.

## Exemplos ruins

- API sem rate limit "porque o uso interno é baixo" (interno ≠ seguro contra erro de cliente).
- Rate limit só no frontend (cliente controla, bypassa).
- Limite igual pra tudo (login = 1000/min/IP — abre brute force).
- 429 sem `Retry-After` (cliente não sabe quando voltar).

## Exceções

- Healthcheck de loadbalancer pode bypass via IP allowlist.
- Cliente interno crítico (admin tool) pode ter limite muito maior, autenticado por mTLS.
