# Tests: lgpd-define-retention-policy

## Pré-condição
- `docs/security/lgpd/data-inventory.md` preenchido.

## Prompts canônicos
- "retention policy"
- "quanto tempo guardar dado de aluno inativo?"
- "purgar backups antigos"

## Comportamentos esperados
- [ ] Pra cada categoria PII: retenção máxima declarada.
- [ ] Base legal define limite (consent/contrato/obrigação legal/legítimo interesse).
- [ ] Ação ao expirar: `delete` ou `anonymize`.
- [ ] Backup com retenção definida + processo de purge.
- [ ] Job de retenção planejado (schedule + idempotente + audit log).
- [ ] Restore drill valida que dado expirado não volta.
- [ ] Produz `docs/security/lgpd/retention-policy.md`.

## Anti-padrões
- [ ] NÃO permite retenção indefinida.
- [ ] NÃO chama soft delete de deleção LGPD.
- [ ] NÃO esquece dos backups.
- [ ] NÃO retém audit log indefinidamente sem base legal documentada.
