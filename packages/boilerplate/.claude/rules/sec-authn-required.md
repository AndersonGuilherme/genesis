---
name: sec-authn-required
description: Endpoints autenticados por default. Endpoints públicos explicitamente marcados, listados e revisados. Sem default ambíguo.
phase: security
---

# Rule: sec-authn-required

## Princípio

Toda rota/operação exige autenticação por default. Endpoints públicos (login, signup, health, status) são exceção explícita: anotados, listados em `docs/security/auth-strategy.md` e revisados em PR.

## Por que existe

Default "público" gera vazamento: dev cria endpoint, esquece de proteger, vai pra produção exposto. Default "autenticado" + opt-out explícito força revisão consciente de cada rota pública.

## Como aplicar

1. Middleware/decorator de auth aplicado globalmente (ex.: `app.use(authMiddleware)`).
2. Endpoints públicos usam decorator/marcação explícita (`@Public()`, `app.get('/health', { auth: false }, ...)`).
3. Lista de endpoints públicos vive em `docs/security/auth-strategy.md`.
4. Testes de integração validam: rota não-marcada retorna 401 sem token.
5. CI/code review checa qualquer adição de marcação `@Public`.

## Exemplos bons

- Framework expõe `requireAuth` por default; rota pública usa `@Public()` explícito.
- `docs/security/auth-strategy.md` lista: `GET /health`, `POST /auth/login`, `POST /auth/signup`.
- Teste E2E: requisição a `/student/me` sem token → 401.

## Exemplos ruins

- Cada rota declara `requireAuth()` individualmente (uma esquecida = vulnerabilidade).
- Endpoint `/admin/seed-data` sem auth "porque é só pra dev" — vira backdoor.
- Auth checada parcialmente (token presente ≠ token válido + assinado + não-expirado).

## Exceções

- Healthcheck `/health` simples (sem dados internos) pode ser público.
- Endpoints OAuth callback são públicos por design (mas validam state/code).
- Webhooks recebidos de terceiros são públicos mas validam assinatura (`sec-webhook-signing`).
