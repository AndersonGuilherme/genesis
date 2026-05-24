# Tests: lgpd-data-subject-rights-handler

## Pré-condição
- `docs/security/lgpd/data-inventory.md` preenchido.
- `docs/security/auth-strategy.md` define authn pra endpoints.

## Prompts canônicos
- "direitos do titular"
- "endpoints /me/* art. 18"
- "implementar export/delete de conta"

## Comportamentos esperados
- [ ] Endpoints: `GET /me/data`, `PATCH /me/data`, `DELETE /me/account`, `GET /me/consents`, `DELETE /me/consents/:id`, `GET /me/data-sharing`.
- [ ] Reautenticação antes de delete/export sensível (defesa contra ATO).
- [ ] SLA 15 dias + dashboard de pending + alerta D-3.
- [ ] Audit log de cada exercício.
- [ ] Processo manual pra exceção (titular sem conta).
- [ ] Produz `docs/security/lgpd/subject-rights.md`.

## Anti-padrões
- [ ] NÃO faz soft delete mantendo PII.
- [ ] NÃO ignora dados relacionados (orders, logs, comments) no export.
- [ ] NÃO permite delete sem reautenticação.
- [ ] NÃO direciona pra "email pra suporte" como processo padrão.
