# Tests: sec-define-auth-strategy

## Pré-condição
- `docs/security/threat-model.md` preenchido.
- `docs/product/target-users.md` lista personas/roles.

## Prompts canônicos
- "define a auth strategy"
- "qual método de autenticação?"
- "preciso de RBAC + multi-tenant"

## Comportamentos esperados
- [ ] Justifica método (JWT, sessão, OAuth, OIDC) com trade-off.
- [ ] Lista exaustivamente endpoints públicos com motivo.
- [ ] Matriz role × recurso preenchida.
- [ ] Decisão de multi-tenant (claim, header, path) + filter.
- [ ] Lifecycle de token + rotação de chave.
- [ ] Política de senha (hash + complexidade + reset + lockout).
- [ ] Produz `docs/security/auth-strategy.md`.

## Anti-padrões
- [ ] NÃO aceita `none` algorithm em JWT.
- [ ] NÃO esquece cookies `HttpOnly + Secure + SameSite`.
- [ ] NÃO deixa multi-tenant filter implícito.
- [ ] NÃO aceita bcrypt com cost < 12 ou senhas sem hash.
