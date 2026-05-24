# Tests: ops-define-slos-slis

## Pré-condição
- Observability ativa.
- Lista de operações críticas (`docs/operations/critical-modules.md`).

## Prompts canônicos
- "definir SLOs"
- "error budget"
- "burn rate alerts"

## Comportamentos esperados
- [ ] CUJs (Critical User Journeys) listadas.
- [ ] SLIs com fonte de dado clara (PromQL ou equivalente).
- [ ] SLO target realista (não 100%).
- [ ] Error budget calculado.
- [ ] Burn rate alerts (P1: 14.4, P2: 6).
- [ ] Política de budget esgotado (freeze de release).
- [ ] Produz `docs/operations/slos.md`.

## Anti-padrões
- [ ] NÃO define SLO 100% (impossível).
- [ ] NÃO cria SLI sem fonte de dado.
- [ ] NÃO esquece de definir política de freeze.
