# lgpd-define-retention-policy

## O que faz
Define prazo de retenção por categoria de PII + ação ao expirar (delete | anonymize). Inclui backup. Produz `docs/security/lgpd/retention-policy.md`.

## Quando você invoca
Após `lgpd-data-inventory`. Antes de implementar persistência regulada. Em auditoria.

## O que a IA faz
1. Pra cada categoria PII: definir retenção máxima.
2. Base "consent" → enquanto válido. Base "obrigação legal" → prazo legal.
3. Ação ao expirar (delete | anonymize).
4. Backup com retenção e purge.
5. Job de retenção planejado (schedule + audit).
6. Restore drill mencionado.

## Rules invocadas
- [lgpd-retention-limit](../../../.claude/rules/lgpd-retention-limit.md)
- [lgpd-processing-registry](../../../.claude/rules/lgpd-processing-registry.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)

## Próximo passo natural
Implementar job de retenção + restore drill.
