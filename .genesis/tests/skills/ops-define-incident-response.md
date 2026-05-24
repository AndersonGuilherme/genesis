# Tests: ops-define-incident-response

## Pré-condição
- Oncall rotation definida (PagerDuty/Opsgenie/Grafana Oncall).
- Canal interno de incidente.

## Prompts canônicos
- "incident response process"
- "severity levels + oncall"
- "templates de comunicação de incidente"

## Comportamentos esperados
- [ ] Severity matrix (SEV1/2/3) com critérios + tempo de resposta.
- [ ] Papéis: IC, Tech Lead, Comms, Scribe.
- [ ] Fluxo: detectar → declarar → war room → contenção → mitigação → resolução → postmortem.
- [ ] Templates: status page, email cliente, comms interna.
- [ ] Política de postmortem (≤5 dias úteis SEV1/2).
- [ ] Drills periódicos (tabletop trimestral).
- [ ] Produz `docs/operations/incident-response.md`.

## Anti-padrões
- [ ] NÃO permite culpabilização individual em postmortem.
- [ ] NÃO fecha incidente SEV1/2 sem postmortem.
- [ ] NÃO comunica externamente sem IC + jurídico alinhados.
