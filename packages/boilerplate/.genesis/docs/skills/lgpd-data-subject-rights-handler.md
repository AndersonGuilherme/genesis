# lgpd-data-subject-rights-handler

## O que faz
Define endpoints + fluxos pra titular exercer direitos do art. 18 LGPD (acesso, retificação, exclusão, portabilidade, revogação). SLA 15 dias.

## Quando você invoca
Antes de go-live. Ao adicionar canal novo (mobile, API B2B). Em auditoria.

## O que a IA faz
1. Mapeia cada direito do art. 18 → endpoint/fluxo.
2. Reautenticação antes de delete/export sensível.
3. SLA + dashboard de pendentes.
4. Audit log de cada exercício.
5. Processo manual pra exceção (titular sem conta).
6. Privacy notice cita endpoints.

## Rules invocadas
- [lgpd-subject-rights-respected](../../../.claude/rules/lgpd-subject-rights-respected.md)
- [lgpd-explicit-consent](../../../.claude/rules/lgpd-explicit-consent.md)
- [sec-authn-required](../../../.claude/rules/sec-authn-required.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)

## Próximo passo natural
`lgpd-incident-notification-plan`.
