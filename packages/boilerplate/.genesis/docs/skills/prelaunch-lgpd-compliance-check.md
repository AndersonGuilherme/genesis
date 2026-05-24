# prelaunch-lgpd-compliance-check

## O que faz
Checklist final de LGPD. Cruza outputs lgpd-* com código/infra. Bloqueia launch se gap crítico.

## Quando você invoca
Antes da reunião go/no-go. Após feature nova que toca PII. Em auditoria.

## O que a IA faz
1. ROPA atualizado contra código.
2. Consent implementado + UI testada.
3. Retenção operacional + backup respeitando.
4. Endpoints `/me/*` funcionando.
5. Encryption + transfer + DPAs verificados.
6. DPIA + plano de incidente publicados.
7. DPO + privacy notice operacionais.

## Rules invocadas
- [prelaunch-gate-complete](../../../.claude/rules/prelaunch-gate-complete.md)
- [lgpd-data-minimization](../../../.claude/rules/lgpd-data-minimization.md)
- [lgpd-explicit-consent](../../../.claude/rules/lgpd-explicit-consent.md)
- [lgpd-purpose-limitation](../../../.claude/rules/lgpd-purpose-limitation.md)
- [lgpd-retention-limit](../../../.claude/rules/lgpd-retention-limit.md)
- [lgpd-subject-rights-respected](../../../.claude/rules/lgpd-subject-rights-respected.md)
- [lgpd-pii-encrypted](../../../.claude/rules/lgpd-pii-encrypted.md)
- [lgpd-international-transfer-rule](../../../.claude/rules/lgpd-international-transfer-rule.md)
- [lgpd-processing-registry](../../../.claude/rules/lgpd-processing-registry.md)

## Próximo passo natural
`prelaunch-launch-readiness-gate`.
