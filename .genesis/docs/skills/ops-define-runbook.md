# ops-define-runbook

## O que faz
Runbook por módulo crítico: arquitetura, deps, alertas, procedimentos, contatos. Oncall consegue resolver sem ajuda.

## Quando você invoca
Antes do módulo crítico ir pra produção. Após mudança arquitetural. Pós-incidente.

## O que a IA faz
1. Propósito + arquitetura resumida.
2. Dependências up/down.
3. Alertas mapeados com ação imediata.
4. SLO/SLI referenciado.
5. Procedimentos: deploy, rollback, restart, scale, debug.
6. Procedimentos por severidade.
7. Contatos atualizados.

## Rules invocadas
- [ops-runbook-required](../../../.claude/rules/ops-runbook-required.md)
- [ops-alert-actionable](../../../.claude/rules/ops-alert-actionable.md)

## Próximo passo natural
Próximo módulo crítico.
