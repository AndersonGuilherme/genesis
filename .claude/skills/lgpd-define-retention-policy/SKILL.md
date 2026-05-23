---
name: lgpd-define-retention-policy
description: Define prazo de retenção por categoria de PII + ação ao expirar (delete | anonymize). Inclui backup. Produz `docs/security/lgpd/retention-policy.md`.
phase: lgpd
rules:
  - lgpd-retention-limit
  - lgpd-processing-registry
  - sec-audit-trail
---

# Skill: lgpd-define-retention-policy

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Produzir `docs/security/lgpd/retention-policy.md` com política de retenção por categoria + processo de aplicação (job + audit + backup).

## Quando usar

- Após `lgpd-data-inventory` (precisa de categorias + base legal).
- Antes de implementar persistência de dado regulado.
- Em auditoria periódica.

## Pré-condições

- `docs/security/lgpd/data-inventory.md` preenchido.
- Template `.genesis/templates/data-inventory-template.md` (parte de retention) disponível.

## Processo

1. Pra cada categoria PII no inventory: definir retenção máxima.
2. Critérios pra retenção:
   - Base legal "consent" → enquanto válido.
   - Base "contrato" → enquanto contrato ativo + período legal pós-encerramento.
   - Base "obrigação legal" → prazo legal específico (fiscal 5 anos, trabalhista 30, etc.).
   - Base "legítimo interesse" → enquanto necessário, com revisão semestral.
3. Ação ao expirar: `delete` (PII direta) ou `anonymize` (manter agregado estatístico).
4. Backup: definir retenção máxima (ex.: 90 dias) + processo de purge documentado.
5. Job de retenção: schedule (diário/semanal), idempotente, logado em audit (`retention.applied`).
6. Restore drill: validar que dado expirado não volta após restore.
7. Casos especiais: lead inativo, conta suspensa, account closed por user.
8. Preencher `docs/security/lgpd/retention-policy.md`.

## Restrições

- Sem retenção indefinida.
- Soft delete não é deleção pra LGPD — exige hard delete ou anonimização.
- Backup com PII expirada precisa ser purgado eventualmente.
- Audit log próprio tem retenção independente (5 anos default, justificada).

## Exemplos de uso

- "Definir retention policy do tchr."
- "Aluno inativo há 5 anos — definir ação."

## Critérios de conclusão

- [ ] Retenção por categoria definida.
- [ ] Base legal documentada por entry.
- [ ] Ação ao expirar (delete | anonymize) clara.
- [ ] Backup retention definida.
- [ ] Job de retenção planejado (schedule + idempotência + audit).
- [ ] Restore drill mencionado.
- [ ] `docs/security/lgpd/retention-policy.md` completo.
