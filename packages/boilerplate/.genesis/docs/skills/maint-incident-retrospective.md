# maint-incident-retrospective

## O que faz
Postmortem blameless após incidente. Timeline factual + análise causa raiz (5 whys) + action items com owner/deadline.

## Quando você invoca
Após SEV1 ou SEV2. Em SEV3 recorrente (3+ ocorrências). Em near-miss significativo.

## O que a IA faz
1. Marca postmortem meeting em ≤5 dias úteis.
2. Reconstrói timeline com timestamps.
3. Análise: causa próxima + contribuintes (5 whys) + sistêmica.
4. **Blameless**: sem culpa individual.
5. Action items: owner + deadline + tipo (prevenção/detecção/recovery).
6. Compartilhamento interno + (SEV1) externo sanitizado.
7. Atualiza runbook.

## Rules invocadas
- [ops-alert-actionable](../../../.claude/rules/ops-alert-actionable.md)
- [ops-runbook-required](../../../.claude/rules/ops-runbook-required.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)

## Próximo passo natural
Tracking de action items até conclusão.
