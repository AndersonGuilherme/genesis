# Auth Strategy: <nome-do-sistema>

> Aplicado pela skill `sec-define-auth-strategy`. Documenta decisões de authn/z do sistema.

## Resumo

- **Authentication method**: <JWT | Session cookie | OAuth2 + JWT | OIDC>
- **Authorization model**: <RBAC | ABAC | RBAC + ABAC>
- **Multi-tenant**: <sim/não> — tenant_id em <claim JWT | header | path>
- **Password hash**: <bcrypt cost 12 | argon2id>
- **Session/Token TTL**: <ex: access token 15min, refresh token 7 dias>

## Endpoints públicos (sem authn)

Lista exaustiva. Qualquer endpoint fora dessa lista exige authn.

| Endpoint | Motivo | Rate limit |
|----------|--------|-----------|
| `GET /health` | LB healthcheck | 1000/min/IP |
| `POST /auth/login` | login | 5/min/IP, 20/hora/email |
| `POST /auth/signup` | signup | 3/hora/IP |
| `POST /auth/forgot-password` | reset | 3/hora/email |

## Roles e permissões

### Roles

| Role | Descrição | Hierarquia |
|------|-----------|-----------|
| guest | não autenticado | — |
| student | aluno autenticado | herda guest |
| professor | professor autenticado | herda guest |
| admin | administrador | herda professor + student |

### Matriz role × recurso

| Recurso / Ação | guest | student | professor | admin |
|----------------|:-----:|:-------:|:---------:|:-----:|
| view-course-catalog | ✓ | ✓ | ✓ | ✓ |
| enroll-in-course | ✗ | ✓ (self) | ✗ | ✓ (any) |
| publish-course | ✗ | ✗ | ✓ (own) | ✓ (any) |
| delete-user | ✗ | ✗ | ✗ | ✓ |

## Token / Session lifecycle

### Login

1. Cliente POST `/auth/login` com `{ email, password }`.
2. Server valida senha (bcrypt/argon2).
3. Server emite access token (JWT, TTL=15min) + refresh token (TTL=7d, em cookie HttpOnly).
4. Resposta inclui access token no body.

### Refresh

1. Cliente POST `/auth/refresh` com cookie refresh.
2. Server valida refresh, emite novo access token. Rotaciona refresh (sliding).

### Logout

1. Cliente POST `/auth/logout`.
2. Server invalida refresh (revocation list / DB flag).
3. Cookie removido.

## Multi-tenant

- `tenant_id` é claim do JWT (após login com email + senha do tenant).
- Toda query a repository filtra por `tenant_id` do actor.
- Helper centralizado `withTenant(query, actor)` evita esquecimento.

## Senha

- Hash: <bcrypt cost 12 | argon2id m=64MB,t=3,p=4>.
- Política: mínimo 12 chars, sem dicionário comum, sem dado pessoal óbvio.
- Reset: token único, TTL 30min, single-use, invalidação após reset.
- Lockout: 5 falhas → bloqueio escalonado (1min, 5min, 30min, 1h).

## OAuth/SSO (se aplicável)

- Provider: ___
- Scopes solicitados: ___
- Validação de callback: state param + verificação issuer.
- PKCE em cliente público.

## Rotação e revogação

- Chave de assinatura JWT: rotação a cada N dias, com KID no header pra suportar transição.
- Refresh tokens revogáveis: lista de invalidados em Redis (TTL = TTL do refresh).
- Logout de todos os dispositivos: incrementa version do user; tokens com version < atual são invalidados.

## Audit

Eventos de auth em audit log (cross: `sec-audit-trail`):
- login.success, login.failure (com IP + user-agent)
- logout
- password.changed
- password.reset.requested, password.reset.completed
- role.granted, role.revoked
- token.refresh
- mfa.enabled, mfa.disabled

## Revisão

| Data | Revisor | Mudança |
|------|---------|---------|
| ___  | ___     | ___ |
