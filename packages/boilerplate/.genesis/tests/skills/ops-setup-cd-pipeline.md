# Tests: ops-setup-cd-pipeline

## Pré-condição
- CI estável (`ops-setup-ci-pipeline` completo).
- `docs/deployment/deployment-strategy.md` escolhida.
- Observability mínima ativa.

## Prompts canônicos
- "configurar CD canary"
- "rollback automático"
- "deploy com gates"

## Comportamentos esperados
- [ ] Estágios: staging (auto) → smoke test → canary (5-10%) → validação → full rollout.
- [ ] Rollback automático em burn rate alto.
- [ ] Approval manual pra prod em release de alta exposição.
- [ ] Audit log do deploy (actor, sha, timestamp, métricas pós).
- [ ] Runbook de deploy/rollback documentado.

## Anti-padrões
- [ ] NÃO deploy direto em prod sem staging + canary.
- [ ] NÃO acopla migration ao deploy de código quando há risco.
- [ ] NÃO confia apenas em rollback manual.
