# sec-define-rate-limiting

## O que faz
Tabela de rate limits por endpoint + tecnologia Redis-backed + 429 com Retry-After. Cria `docs/security/rate-limiting.md`.

## Quando você invoca
Após `sec-define-auth-strategy`.

## O que a IA faz
1. Lista endpoints com exposição.
2. Limite por IP + por user.
3. Endpoints monetizados (LLM/SMS) com limite extra.
4. Login com lockout escalonado.
5. Tecnologia escolhida (gateway/middleware).

## Rules invocadas
- [sec-rate-limit-public-api](../../../.claude/rules/sec-rate-limit-public-api.md)

## Próximo passo natural
`sec-multi-tenant-isolation` (se multi-tenant).
