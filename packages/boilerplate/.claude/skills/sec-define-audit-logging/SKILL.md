---
name: sec-define-audit-logging
description: Define quais ações são auditadas, formato do evento, store separado, retenção legal. Produz `docs/security/audit-logging.md`.
phase: security
rules:
  - sec-audit-trail
  - sec-no-logged-secrets
  - sec-authz-enforced
---

# Skill: sec-define-audit-logging

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Listar ações sensíveis a auditar + formato do evento + storage + retenção. Produz `docs/security/audit-logging.md`.

## Quando usar

- Após `sec-define-auth-strategy` (sabe quem é actor) e antes do desenvolvimento.

## Processo

1. Listar ações sensíveis a partir do domínio: auth, authz, dados (PII), financeiro, admin.
2. Definir formato do evento (timestamp, actor, action, resource, result, context).
3. Escolher store separado (append-only): DynamoDB stream + S3 Object Lock, ou equivalente.
4. Retenção mínima: 5 anos para auth/PII/financeiro (LGPD + ANPD + setor).
5. Acesso restrito (role auditor).
6. Alertas para eventos críticos.
7. Aplicar template `.genesis/templates/audit-logging-template.md`.

## Critérios de conclusão

- [ ] Lista de ações auditadas.
- [ ] Formato JSON estruturado.
- [ ] Store + retenção documentados.
- [ ] Acesso restrito a role auditor.
- [ ] `docs/security/audit-logging.md` completo.
