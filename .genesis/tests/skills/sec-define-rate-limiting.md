# Tests: sec-define-rate-limiting

## Pré-condição
- Lista de endpoints (públicos + autenticados).

## Prompts canônicos
- "define rate limit"
- "como evitar brute force no login?"
- "limite de chamadas a LLM/SMS"

## Comportamentos esperados
- [ ] Limite por IP + por user autenticado (max ou stack).
- [ ] Endpoints de login mais estritos (5/min/IP + lockout).
- [ ] Endpoints com custo monetário (LLM, SMS, email) com limite extra.
- [ ] 429 inclui `Retry-After` + headers `X-RateLimit-*`.
- [ ] Logs de 429 monitorados.

## Anti-padrões
- [ ] NÃO usa rate limit só no frontend.
- [ ] NÃO aplica limite igual pra todo endpoint (login = catálogo público).
- [ ] NÃO esquece exception pra healthcheck do LB.
