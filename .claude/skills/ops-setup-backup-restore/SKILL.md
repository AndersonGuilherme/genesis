---
name: ops-setup-backup-restore
description: Configura backup periódico + restore drill. RPO/RTO declarados. Encryption do backup + retenção LGPD respeitada. Produz `docs/operations/backup-restore.md`.
phase: operations
rules:
  - sec-encryption-at-rest
  - lgpd-retention-limit
  - ops-runbook-required
---

# Skill: ops-setup-backup-restore

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Backup automático testado regularmente. RPO/RTO documentados. Restore exercitado em ambiente isolado.

## Quando usar

- Antes de primeiro deploy em produção.
- Ao adicionar storage novo (banco, blob, índice).
- Em auditoria periódica.

## Pré-condições

- Encryption at-rest decidida (cross-link `sec-encryption-at-rest`).
- Retention policy decidida (cross-link `lgpd-retention-limit`).
- Storage de backup (cross-region ou cross-provider).

## Processo

1. Listar fontes que exigem backup: banco principal, banco analítico, blob storage de uploads, configurações críticas.
2. Pra cada: definir frequência (full + incremental se aplicável), retenção, destino cross-region.
3. RPO target (quanto dado podemos perder): ex.: ≤ 1h.
4. RTO target (quanto tempo até restaurar): ex.: ≤ 4h.
5. Backup com encryption mantida.
6. Acesso ao backup restrito (MFA + audit).
7. Restore drill periódico (trimestral mínimo): restaurar em ambiente isolado, validar integridade.
8. Backup respeita retention LGPD: dado expirado é purgado também do backup.
9. Runbook de restore documentado (cross-link `ops-define-runbook`).
10. Documentar em `docs/operations/backup-restore.md`.

## Restrições

- Sem backup "pra mesma região" (provider down = backup inacessível).
- Sem restore que ninguém testou.
- Sem retenção indefinida de backup (PII trapped).
- Sem credencial de backup em código.

## Exemplos de uso

- "Configurar backup do banco do tchr (RPO 1h, RTO 4h)."
- "Adicionar S3 com lifecycle pra arquivar uploads antigos."

## Critérios de conclusão

- [ ] Fontes listadas.
- [ ] Backup automático configurado por fonte.
- [ ] Cross-region/cross-provider.
- [ ] Encryption mantida.
- [ ] RPO/RTO declarados.
- [ ] Restore drill agendado + executado pelo menos 1x.
- [ ] Runbook de restore.
- [ ] `docs/operations/backup-restore.md` completo.
