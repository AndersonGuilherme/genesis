# ops-setup-backup-restore

## O que faz
Backup automático periódico + restore drill. RPO/RTO declarados. Encryption mantida. Respeita retenção LGPD.

## Quando você invoca
Antes do primeiro deploy. Ao adicionar storage novo. Em auditoria.

## O que a IA faz
1. Lista fontes (banco, blob, configs).
2. Define frequência + retenção + destino cross-region.
3. RPO/RTO target.
4. Encryption mantida no backup.
5. Restore drill trimestral.
6. Purge de backup respeitando retention LGPD.
7. Runbook de restore.

## Rules invocadas
- [sec-encryption-at-rest](../../../.claude/rules/sec-encryption-at-rest.md)
- [lgpd-retention-limit](../../../.claude/rules/lgpd-retention-limit.md)
- [ops-runbook-required](../../../.claude/rules/ops-runbook-required.md)

## Próximo passo natural
Executar primeiro restore drill.
