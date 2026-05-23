---
name: ops-define-incident-response
description: Define severity levels, oncall rotation, escalation, comms templates e processo de postmortem. Produz `docs/operations/incident-response.md`.
phase: operations
rules:
  - ops-runbook-required
  - sec-audit-trail
---

# Skill: ops-define-incident-response

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Processo claro de resposta a incidente — severidade, papéis, comunicação, postmortem.

## Quando usar

- Antes de go-live.
- Após primeiro incidente real (refinar).
- Ao adicionar canal/produto novo que altere blast radius.

## Pré-condições

- Oncall rotation definida (tooling: PagerDuty, Opsgenie, Grafana Oncall).
- Canal interno de incidente (Slack #incidents).
- Template `.genesis/templates/incident-playbook-template.md` disponível.

## Processo

1. Severity levels:
   - **SEV1**: caminho de receita parado, dado vazado, segurança crítica. Acorda em qualquer hora.
   - **SEV2**: degradação significativa, parte do produto inacessível. Horário comercial estendido.
   - **SEV3**: bug recorrente, alerta sem impacto direto. Próximo dia útil.
2. Papéis durante incidente:
   - **Incident Commander (IC)**: coordena, decide, não executa direto.
   - **Tech Lead**: executa investigação técnica.
   - **Comms**: atualiza status page + stakeholders.
   - **Scribe**: timeline em tempo real.
3. Fluxo: detectar → declarar → war room → contenção → mitigação → resolução → postmortem.
4. Templates de comunicação:
   - Status page update.
   - Email pra cliente afetado (em SEV1 com vazamento, cross-link `lgpd-incident-notification-plan`).
   - Comunicado interno.
5. Postmortem blameless em ≤ 5 dias úteis do resolution.
6. Action items do postmortem rastreados até conclusão.
7. Drills periódicos (tabletop) pra validar processo.
8. Documentar em `docs/operations/incident-response.md`.

## Restrições

- Sem culpabilização individual no postmortem.
- Sem fechamento de incidente sem postmortem (em SEV1/SEV2).
- Sem comunicação externa sem alinhamento com IC + comms.
- Action items sem owner + deadline são vento.

## Exemplos de uso

- "Definir processo de incident response do tchr."
- "Refinar processo após primeiro SEV1."

## Critérios de conclusão

- [ ] Severity levels definidos.
- [ ] Papéis claros.
- [ ] Fluxo documentado.
- [ ] Templates de comunicação prontos.
- [ ] Política de postmortem definida.
- [ ] Plano de drill periódico.
- [ ] `docs/operations/incident-response.md` completo.
