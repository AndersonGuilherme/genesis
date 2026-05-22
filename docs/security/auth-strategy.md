# Auth strategy

> Como autenticamos e autorizamos. Decisões aqui têm efeito em todos os módulos.

## Autenticação

### Métodos suportados

- [ ] Email + senha (sempre disponível)
- [ ] Magic link (opcional)
- [ ] OAuth (Google, Apple)
- [ ] SSO corporativo (apenas plano enterprise)
- [ ] Passkey / WebAuthn (futuro)

Detalhe da escolha do MVP em ADR específico (`docs/adr/NNNN-auth-strategy.md`).

### Senhas

- Hash: argon2id (preferencial) ou bcrypt (mínimo)
- Política: mínimo 10 caracteres; lista negra de senhas vazadas
- Esquecimento: link com token de uso único, expirando em 15 min
- Bloqueio: 5 tentativas falhas → captcha; 10 → lock temporário 15 min

### MFA

- Opcional para usuário comum
- Obrigatório para admin e papéis com acesso financeiro
- Métodos: TOTP (Authenticator) preferencial; SMS apenas como fallback

### Sessão

- Access token (curta vida): _(ex.: 15 min, JWT assinado)_
- Refresh token (longa vida): _(ex.: 30 dias, rotacionável, gravado no banco com hash)_
- Logout invalida refresh token server-side
- Device tracking opcional (lista de sessões ativas)

## Autorização

### Modelo

- RBAC para começar (Roles: owner, admin, member, viewer, etc.)
- Mover para ABAC quando regras virarem condicionais complexas

### Multi-tenancy

- `tenant_id` em todo recurso e em todo token
- Verificar tenant em **todas** as queries (middleware obrigatório)
- Cross-tenant é zero por padrão

### Permissões granulares

| Recurso | create | read | update | delete | extras |
|---------|--------|------|--------|--------|--------|
| school | owner | any-member | owner | owner | manage_billing: owner |
| class | owner, admin | any-member | owner, admin | owner | — |
| student | owner, admin, secretary | role-scoped | owner, admin, secretary | owner | — |
| course | owner | any-member, public | owner | owner | publish: owner |
| transaction | system | owner, admin | system | none | refund: owner |

## Tokens

- Algoritmo: ES256 (preferencial) ou RS256
- Chave assimétrica em gerenciador de segredo
- Rotação anual ou em incidente
- Claims essenciais: `sub`, `tenant_id`, `roles`, `iat`, `exp`, `jti`

## Integração externa (SSO)

- OIDC quando suportado
- SAML apenas para enterprise sob demanda
- Email do IdP é a fonte de verdade

## Auditoria

Logar com identidade do ator:
- Login bem/mal sucedido
- Logout
- Mudança de senha
- Mudança de permissão
- Acesso administrativo

Retenção: ver [../operations/logging.md](../operations/logging.md).

## Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| Token roubado em XHR | curto TTL + HttpOnly cookie em fluxos sensíveis |
| Replay de webhook | nonce + signing |
| Brute force | rate limit + bloqueio progressivo |
| Phishing em admin | MFA + treinamento + email DMARC |

## Quando reavaliar

- Quando passar de _(número)_ tenants
- Quando primeiro pedido enterprise de SSO surgir
- Após incidente de segurança
- Anualmente
