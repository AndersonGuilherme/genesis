# Tests: ops-setup-backup-restore

## Pré-condição
- Encryption at-rest decidida (cross-link `sec-encryption-at-rest`).
- Retention policy decidida (cross-link `lgpd-retention-limit`).

## Prompts canônicos
- "configurar backup"
- "restore drill"
- "RPO/RTO target"

## Comportamentos esperados
- [ ] Lista de fontes (banco, blob, configs críticas).
- [ ] Frequência + retenção + destino cross-region por fonte.
- [ ] RPO target (ex.: ≤ 1h) + RTO target (ex.: ≤ 4h).
- [ ] Encryption mantida no backup.
- [ ] Restore drill periódico (trimestral mínimo).
- [ ] Backup respeita retention LGPD (purge eventual).
- [ ] Runbook de restore documentado.

## Anti-padrões
- [ ] NÃO backup "na mesma região" (provider down = backup inacessível).
- [ ] NÃO confia em restore nunca testado.
- [ ] NÃO retém backup indefinidamente (PII trapped).
