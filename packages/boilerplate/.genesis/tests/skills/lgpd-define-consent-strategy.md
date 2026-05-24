# Tests: lgpd-define-consent-strategy

## Pré-condição
- `docs/security/lgpd/data-inventory.md` lista finalidades com base legal = consent.

## Prompts canônicos
- "consent strategy"
- "como capturar consent granular"
- "revogação de consentimento"

## Comportamentos esperados
- [ ] 1 consent por finalidade (cadastro, marketing, parceiros, analytics) — não agrupado.
- [ ] Checkbox **desmarcado** por default.
- [ ] Modelo de dados: `consents(user_id, purpose, version, granted_at, revoked_at, ip)`.
- [ ] Versionamento de texto (hash) + reconsent quando muda.
- [ ] Endpoint `DELETE /me/consents/:id` pra revogação.
- [ ] SLA de propagação (max 24h pra batch).
- [ ] Audit log em grant + revoke.

## Anti-padrões
- [ ] NÃO usa checkbox pré-marcado.
- [ ] NÃO agrupa "aceito tudo".
- [ ] NÃO exige email manual pra revogar.
- [ ] NÃO aceita consent de criança sem responsável (art. 14).
