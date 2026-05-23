---
name: ops-rollback-tested
description: Rollback é testado em staging antes de cada release. Migration de schema tem reverse migration. Botão de rollback existe e foi exercitado nos últimos 30 dias.
phase: operations
---

# Rule: ops-rollback-tested

## Princípio

Rollback não é teoria — é exercício. Toda release passa por staging com rollback exercitado. Migration de banco tem reverse migration ou estratégia de compatibilidade (expand-contract). Botão/comando de rollback documentado no runbook, com janela máxima de RTO.

## Por que existe

Rollback nunca testado é mito. Quando precisar, descobre que a migration não reverte, que o feature flag não funciona, que o deploy anterior não está mais na infra. Incidente vira escalada. Exercitar mensalmente evita.

## Como aplicar

1. Política de release inclui rollback drill: staging recebe nova versão, valida, rola pra trás, valida.
2. Migration de banco: usar padrão expand-contract (add column → backfill → switch read → switch write → remove old) que tolera rollback sem perda.
3. Reverse migration obrigatória quando expand-contract não é viável — testada em staging.
4. Feature flags pra rollout: rollback = flip do flag (não exige redeploy).
5. RTO target documentado no runbook (ex.: "rollback completo ≤ 5min").
6. Auditoria mensal: lista de releases + se rollback foi exercitado.

## Exemplos bons

- Migration adiciona coluna `email_v2` (nullable). Code escreve nos dois. Switch read. Switch write. Remove `email` velho. Cada step revertível.
- Feature flag `new-checkout` permite rollback em segundos sem redeploy.
- Drill mensal de rollback em staging, gravado no calendário do time.

## Exemplos ruins

- Migration `ALTER TABLE users DROP COLUMN email` sem down migration.
- Rollback "manual" exige time inteiro + 2 horas + tribal knowledge.
- Última prática de rollback foi há 8 meses; ninguém lembra o procedimento.
- Deploy via tag git, mas imagens antigas removidas do registry após 1 semana.

## Exceções

- Hotfix de segurança crítica pode pular drill prévio em troca de janela mínima de execução documentada.
- Mudança puramente cosmética (CSS, copy estático) pode dispensar drill formal, mas ainda precisa de rollback viável.

