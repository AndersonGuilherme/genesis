---
name: sec-define-rate-limiting
description: Define rate limit por endpoint (IP + user), limites de login estritos, 429 com Retry-After. Cobre endpoints com custo monetário (LLM, SMS) com limites extras.
phase: security
rules:
  - sec-rate-limit-public-api
---

# Skill: sec-define-rate-limiting

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Tabela de rate limits por endpoint + tecnologia (Redis-backed para multi-instance) + monitoramento. Atualiza `docs/security/auth-strategy.md` seção "Endpoints públicos" e cria `docs/security/rate-limiting.md`.

## Quando usar

- Após `sec-define-auth-strategy` (endpoints públicos listados).
- Quando endpoint novo expõe API pública.

## Processo

1. Listar endpoints: caminho, método, exposição (público/autenticado/interno).
2. Para cada endpoint, definir limite por IP + por user. Tomar max ou stack.
3. Endpoints com custo monetário (LLM, SMS, email): limite extra mais restrito.
4. Login: 5-10 req/min/IP, lockout escalonado.
5. Resposta 429 com headers `X-RateLimit-*` + `Retry-After`.
6. Configurar logger/alerta para 429.
7. Escolher tecnologia (gateway, middleware, Redis-backed).

## Critérios de conclusão

- [ ] Tabela endpoint × limit IP × limit user.
- [ ] Login com lockout escalonado.
- [ ] Endpoints monetizados com limite extra.
- [ ] Tecnologia escolhida e configurada.
- [ ] Alertas configurados.
