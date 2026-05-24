# Tests: ops-define-deployment-strategy

## Pré-condição
- Runtime/orquestrador escolhido (ECS, k8s, Lambda, App Runner).
- CI funcionando.

## Prompts canônicos
- "deployment strategy"
- "rolling vs blue-green vs canary"
- "migration sem downtime"

## Comportamentos esperados
- [ ] 3 estratégias avaliadas com trade-off (rolling, blue-green, canary).
- [ ] Recomendação justificada por maturidade de observability + volume + custo + risco.
- [ ] Gates definidos (qual métrica autoriza próximo step do canary).
- [ ] Migration strategy separada do deploy (expand-contract preferido).
- [ ] Janelas de deploy + procedimento de hotfix.
- [ ] Runbook de deploy + rollback.
- [ ] Produz `docs/deployment/deployment-strategy.md`.

## Anti-padrões
- [ ] NÃO faz deploy direto em prod sem staging.
- [ ] NÃO faz canary sem métrica de validação.
- [ ] NÃO acopla migration ao deploy de código.
