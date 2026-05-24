# Tests: maint-incident-retrospective

## Pré-condição
- Incidente resolvido.
- Timeline registrada no canal #incident-*.

## Prompts canônicos
- "postmortem do incidente"
- "retrospectiva blameless"
- "análise pós-incidente"

## Comportamentos esperados
- [ ] Meeting marcada em ≤5 dias úteis do resolution.
- [ ] Timeline reconstruída com timestamps (UTC).
- [ ] Análise: causa próxima + contribuintes (5 whys) + sistêmica.
- [ ] **Blameless**: foco em sistema, não pessoa.
- [ ] Action items: owner + deadline + tipo (prevenção/detecção/recovery/processo).
- [ ] Compartilhamento interno + (SEV1) externo sanitizado.
- [ ] Runbook do módulo atualizado.
- [ ] Produz `docs/operations/postmortems/<YYYY-MM-DD>-<slug>.md`.

## Anti-padrões
- [ ] NÃO culpabiliza indivíduo.
- [ ] NÃO cria action item sem owner+deadline.
- [ ] NÃO fecha SEV1/2 sem postmortem.
