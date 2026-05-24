# lgpd-data-minimization-review

## O que faz
Audita campos PII coletados — cada um tem finalidade ativa? Propõe remoção/anonimização dos sem justificativa.

## Quando você invoca
Auditoria semestral, após cortar feature, antes de DPIA, triagem inicial em projeto legado.

## O que a IA faz
1. Lista campos PII no banco/entidades.
2. Cruza com data-inventory.
3. Identifica campos sem entry ou sem finalidade ativa.
4. Propõe ação (remover, anonimizar, justificar).
5. Gera relatório + opcional PR de migration.

## Rules invocadas
- [lgpd-data-minimization](../../../.claude/rules/lgpd-data-minimization.md)
- [lgpd-purpose-limitation](../../../.claude/rules/lgpd-purpose-limitation.md)
- [lgpd-processing-registry](../../../.claude/rules/lgpd-processing-registry.md)

## Próximo passo natural
Aprovação do DPO + execução do PR de migration.
