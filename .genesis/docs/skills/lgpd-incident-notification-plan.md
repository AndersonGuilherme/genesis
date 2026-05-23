# lgpd-incident-notification-plan

## O que faz
Define playbook pra notificação ANPD + titulares em incidente envolvendo PII. LGPD art. 48 (prazo razoável; convenção interna 72h).

## Quando você invoca
Antes de go-live. Após mudança de equipe. Em auditoria de readiness.

## O que a IA faz
1. Define critérios de "incidente notificável".
2. Severidade × volume × sensibilidade → nível (1-4).
3. Fluxo: detecção → contenção → comunicação interna → avaliação → notificação ANPD + titulares.
4. Prazo interno 72h.
5. Templates de comunicação (ANPD + titular).
6. Responsáveis nomeados (DPO, CTO, jurídico).
7. Postmortem pós-incidente.

## Rules invocadas
- [lgpd-subject-rights-respected](../../../.claude/rules/lgpd-subject-rights-respected.md)
- [lgpd-processing-registry](../../../.claude/rules/lgpd-processing-registry.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)

## Próximo passo natural
Simulação tabletop pra validar fluxo.
