# Audit Logging: <nome-do-sistema>

> Aplicado pela skill `sec-define-audit-logging`. Define o que é audited, formato, store, retenção.

## Ações auditadas

| Categoria | Ação | Resource | Quando registrar | Severidade |
|-----------|------|----------|------------------|------------|
| Auth | login.success | user | sempre | info |
| Auth | login.failure | user (se identificável) | sempre | warn |
| Auth | logout | user | sempre | info |
| Auth | password.changed | user | sempre | info |
| Auth | password.reset.completed | user | sempre | warn |
| Auth | mfa.enabled | user | sempre | info |
| Auth | mfa.disabled | user | sempre | warn |
| Authz | role.granted | user → user | sempre | warn |
| Authz | role.revoked | user → user | sempre | warn |
| Authz | unauthorized.access.attempt | user → resource | sempre | warn |
| Data | pii.accessed | actor → subject | sempre que actor ≠ subject | info |
| Data | pii.exported | actor → subjects | sempre | warn |
| Data | record.deleted | actor → resource | sempre (especialmente PII) | warn |
| Financial | transaction.created | actor → transaction | sempre | info |
| Financial | transaction.refunded | actor → transaction | sempre | warn |
| Admin | config.changed | actor → config_key | sempre | warn |
| Admin | feature_flag.toggled | actor → flag | sempre | info |

(Listar as ações específicas do domínio do projeto.)

## Formato do evento

JSON estruturado:

```json
{
  "timestamp": "2026-05-23T13:42:10.123Z",
  "event_id": "uuid-v4",
  "category": "auth | authz | data | financial | admin",
  "action": "login.success",
  "severity": "info | warn | error",
  "actor": {
    "id": "user-uuid",
    "role": "student | professor | admin",
    "tenant_id": "tenant-uuid"
  },
  "resource": {
    "type": "user | student | course | transaction | ...",
    "id": "resource-uuid"
  },
  "context": {
    "ip": "203.0.113.42",
    "user_agent": "Mozilla/...",
    "request_id": "req-uuid",
    "tenant_id": "tenant-uuid"
  },
  "result": "success | failure",
  "metadata": { /* campos extras específicos da ação */ }
}
```

## Store

- **Tecnologia**: <DynamoDB com stream + S3 Object Lock | Postgres dedicated table + read replica | ElasticSearch dedicado com index protegido>
- **Append-only**: writes não permitem update/delete (constraint a nível de storage quando possível).
- **Acesso**: read-only para auditores (role específica). Writes apenas via SDK do audit logger.
- **Backup**: independente do backup principal; ciclo próprio.

## Retenção

| Categoria | Mínimo | Justificativa |
|-----------|--------|---------------|
| Auth events | 5 anos | LGPD + investigação de incidente |
| Authz events | 5 anos | Mesma |
| Data access (PII) | 5 anos | LGPD art. 37 |
| Financial | 5 anos (ou mais se exigido por norma fiscal) | Receita Federal / regulação |
| Admin config | 3 anos | Operacional |

## Acesso

- **Leitura**: role `auditor`. Concedida via processo formal (cross: `sec-authz-enforced`).
- **Export**: requer autorização adicional + audit do próprio export.
- **Pesquisa**: dashboard read-only por categoria/actor/janela de tempo.

## Privacidade no audit

- PII no audit: pseudonimizada quando possível (user_id em vez de nome/email).
- Quando dado sensível precisa estar no audit (ex.: campo alterado), apenas o hash do valor anterior + hash do novo são gravados, não o valor em claro.

## Alertas

| Evento | Threshold | Ação |
|--------|-----------|------|
| login.failure (mesmo IP) | > 20/min | alert SOC + lockout temporário |
| unauthorized.access.attempt | > 5/min por mesmo user | alert + revisão |
| pii.exported | qualquer | alert para DPO |
| role.granted (admin) | qualquer | alert + revisão obrigatória |

## Revisão

| Data | Revisor | Mudança |
|------|---------|---------|
| ___  | ___     | ___ |
