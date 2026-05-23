---
name: sec-define-auth-strategy
description: Use após `sec-threat-model` para definir estratégia de authn/z — método (JWT/sessão/OAuth), roles, matriz permissão, multi-tenant, lifecycle de token. Produz `docs/security/auth-strategy.md`.
phase: security
rules:
  - sec-authn-required
  - sec-authz-enforced
  - sec-audit-trail
  - sec-encryption-in-transit
---

# Skill: sec-define-auth-strategy

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Produzir `docs/security/auth-strategy.md` com decisões concretas de autenticação e autorização: método, roles, permissões, multi-tenant, lifecycle, rotação.

## Quando usar

- Após `sec-threat-model` + `plan-map-users` (precisa de personas + threat model).
- Antes de implementar qualquer auth.

## Pré-condições

- `docs/security/threat-model.md` preenchido.
- `docs/product/target-users.md` lista personas/roles.
- Template `.genesis/templates/auth-strategy-template.md` disponível.

## Processo

1. Escolher método de autenticação (JWT, sessão cookie, OAuth+JWT, OIDC) considerando: tipo de cliente (web, mobile, B2B), necessidade de SSO, complexidade aceitável.
2. Listar endpoints públicos (sem authn). Justificar cada um.
3. Definir roles do sistema com hierarquia + matriz role × recurso (RBAC) ou políticas (ABAC).
4. Decidir multi-tenant: tenant_id em claim, header, ou path. Como filtra.
5. Lifecycle: TTL de access token e refresh token, rotação, revogação, logout de todos os dispositivos.
6. Política de senha: hash (bcrypt cost N, argon2id params), complexidade mínima, reset, lockout.
7. OAuth (se aplicável): provider, scopes, PKCE.
8. Listar eventos de auth que vão para audit log.
9. Plano de rotação de chave de assinatura.
10. Preencher `docs/security/auth-strategy.md` com base no template.

## Restrições

- Default: endpoints autenticados. Públicos são exceção explícita listada.
- Sem `none` algorithm em JWT.
- Cookie de sessão: `HttpOnly`, `Secure`, `SameSite`.
- Multi-tenant: filter obrigatório, helper central.
- Senha: bcrypt ≥ cost 12 ou argon2id.

## Exemplos de uso

- "Definir auth strategy do tchr (mobile + web)."
- "Refazer auth strategy: agora aceitamos SSO via Google."

## Critérios de conclusão

- [ ] Método justificado.
- [ ] Endpoints públicos listados exaustivamente.
- [ ] Matriz role × recurso preenchida.
- [ ] Multi-tenant decidido.
- [ ] Lifecycle de token claro.
- [ ] Senha policy definida.
- [ ] Lista de eventos para audit.
- [ ] `docs/security/auth-strategy.md` completo.
