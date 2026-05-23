# ops-feature-flags-strategy

## O que faz
Define como flags são criadas, nomeadas, ramped e removidas. Evita flag debt.

## Quando você invoca
Antes do primeiro rollout gradual. Ao adotar provider novo. Em auditoria de debt.

## O que a IA faz
1. Tipos: release, operational, permission, experiment.
2. Convenção de nome (`<tipo>.<modulo>.<feature>`).
3. Owner + tipo + deadline + rollout plan.
4. Auditoria mensal de flags vencidas.
5. Limite de flag debt.
6. Audit log de mudança.

## Rules invocadas
- [ops-rollback-tested](../../../.claude/rules/ops-rollback-tested.md)
- [ops-no-prod-debug-flag](../../../.claude/rules/ops-no-prod-debug-flag.md)

## Próximo passo natural
Limpar flags vencidas.
