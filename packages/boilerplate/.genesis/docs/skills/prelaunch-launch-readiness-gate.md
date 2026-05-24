# prelaunch-launch-readiness-gate

## O que faz
Gate final consolidado. Wrapper que invoca security, LGPD, performance + valida observability/runbooks/oncall. Reunião go/no-go.

## Quando você invoca
Última etapa antes do go-live. Re-validação anual ou pós-mudança significativa.

## O que a IA faz
1. Consolida outputs das skills `prelaunch-*`.
2. Preenche `docs/launch/launch-readiness.md` com checklist.
3. Cada item com responsável + evidência + status.
4. Lista dívidas não-bloqueantes com deadline.
5. Reunião go/no-go com leads + DPO + IC.
6. Assinatura conjunta.

## Rules invocadas
- [prelaunch-gate-complete](../../../.claude/rules/prelaunch-gate-complete.md)
- [ops-runbook-required](../../../.claude/rules/ops-runbook-required.md)
- [ops-alert-actionable](../../../.claude/rules/ops-alert-actionable.md)

## Próximo passo natural
Go-live + war room nas primeiras 4h + status report D+1.
