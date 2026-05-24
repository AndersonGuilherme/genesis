# Tests: lgpd-incident-notification-plan

## Pré-condição
- DPO definido.
- Canal interno de incidente (Slack channel, oncall).

## Prompts canônicos
- "plano de notificação ANPD"
- "art. 48 LGPD"
- "como avisar titular de vazamento"

## Comportamentos esperados
- [ ] Critérios de incidente notificável (acesso não autorizado, vazamento, integridade, indisponibilidade prolongada).
- [ ] Severidade × volume × sensibilidade → nível (1-4).
- [ ] Fluxo: detectar → conter → comunicar interno → avaliar → notificar ANPD + titulares.
- [ ] Prazo interno ≤72h (alinhado GDPR).
- [ ] Templates de comunicação prontos (ANPD + titular).
- [ ] Responsáveis nomeados (DPO decide notificar, CTO contém, jurídico comunica).
- [ ] Postmortem pós-incidente.
- [ ] Produz `docs/security/lgpd/incident-notification-plan.md`.

## Anti-padrões
- [ ] NÃO comunica publicamente sem DPO/jurídico.
- [ ] NÃO destrói evidência durante contenção.
- [ ] NÃO esquece audit log do próprio incidente.
