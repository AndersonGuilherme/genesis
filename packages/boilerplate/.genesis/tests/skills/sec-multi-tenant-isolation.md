# Tests: sec-multi-tenant-isolation

## Pré-condição
- Sistema é multi-tenant (B2B com clientes isolados, ou marketplace).
- `docs/security/auth-strategy.md` define como `tenant_id` propaga (claim/header/path).

## Prompts canônicos
- "como isolar tenants?"
- "filter de tenant_id"
- "evitar IDOR entre clientes"

## Comportamentos esperados
- [ ] Helper central faz o filter (não cada query manual).
- [ ] Toda query a repository inclui `tenant_id = actor.tenant_id`.
- [ ] Testes de isolamento (actor de tenant A → 404 sobre recurso de tenant B).
- [ ] Monitoramento de tentativas cross-tenant (alerta).

## Anti-padrões
- [ ] NÃO confia em UI passar tenant correto (UI é cliente).
- [ ] NÃO permite query sem `tenant_id` em código de produção.
- [ ] NÃO retorna 403 (vaza existência); retornar 404.
