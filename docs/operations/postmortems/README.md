# Postmortems

Histórico de postmortems blameless. Produzido pela skill `maint-incident-retrospective` em ≤5 dias úteis após resolution de incidente SEV1/SEV2.

## Convenção de nome

`<YYYY-MM-DD>-<slug-curto>.md`

Exemplo: `2026-05-23-billing-null-pointer.md`

## Template

`.genesis/templates/incident-postmortem-template.md`.

## Regras

- **Blameless**: foco em sistema, não pessoa. Nomes só para contexto factual.
- **Timeline factual**: timestamps em UTC.
- **5 whys**: causa próxima + contribuintes + sistêmica.
- **Action items**: cada um com owner + deadline + tipo (prevenção/detecção/recovery/processo).
- **Compartilhamento**: interno em #engineering. SEV1 com impacto público também versão sanitizada em status page/blog.

## Auditoria periódica

Agent `maint-incident-historian` cruza todos os postmortems desta pasta trimestralmente, gera `docs/maintenance/incident-history-<YYYY-Q>.md` com:
- Agregação por módulo / tipo de causa.
- Padrões recorrentes.
- Action items abandonados.
- Recomendações arquiteturais.

## Cross-links

- Severidade + fluxo: `docs/operations/incident-response.md` (skill `ops-define-incident-response`).
- Runbook do módulo: `docs/operations/runbooks/<modulo>.md`.
- LGPD notification: `docs/security/lgpd/incident-notification-plan.md` (se incidente envolveu PII).
