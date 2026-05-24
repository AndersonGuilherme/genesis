# Tests: sec-define-audit-logging

## Pré-condição
- Lista de ações sensíveis identificada (auth, mudança de role, acesso a PII de terceiros, ações financeiras).

## Prompts canônicos
- "define audit logging"
- "quais ações precisam ser auditadas?"
- "audit trail strategy"

## Comportamentos esperados
- [ ] Lista de ações sensíveis explicitada.
- [ ] Formato do evento: actor, action, resource, tenant, ip, user-agent, timestamp, result.
- [ ] Store separado, append-only (DynamoDB stream, S3 Object Lock, WORM).
- [ ] Retenção mínima 5 anos (ou conforme regulação).
- [ ] Acesso ao audit log restrito + audit do próprio acesso.
- [ ] Produz `docs/security/audit-logging.md`.

## Anti-padrões
- [ ] NÃO mistura audit no `app.log`.
- [ ] NÃO permite usuário escrever direto no audit (pode falsificar).
- [ ] NÃO esquece `tenant_id` em multi-tenant.
