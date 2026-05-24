# Tests: dev-define-use-case-authenticated

## Pré-condição
- Mesmas de `dev-define-use-case`.
- `docs/security/auth-strategy.md` define authn + roles + matriz role × recurso.

## Prompts canônicos
- "implementar use case autenticado"
- "use case com authz"
- "TDD com auth + audit"

## Comportamentos esperados
- [ ] Carrega rules `sec-*` declaradas (authn-required, authz-enforced, audit-trail, input-validation).
- [ ] Use case recebe `actor` (id + role + tenant).
- [ ] Primeira ação: verificar permissão. Falha → `UnauthorizedError`.
- [ ] Multi-tenant: query filtra `tenant_id = actor.tenant_id`.
- [ ] Audit log emitido (happy path + falha authz).
- [ ] Testes: sem permissão → throw, outro tenant → throw, input inválido → throw.

## Anti-padrões
- [ ] NÃO faz authz só no controller.
- [ ] NÃO esquece tenant filter.
- [ ] NÃO catch silencioso de erro de auth.
