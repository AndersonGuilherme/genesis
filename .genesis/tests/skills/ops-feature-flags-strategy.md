# Tests: ops-feature-flags-strategy

## Pré-condição
- Provider de flag escolhido (LaunchDarkly, Unleash, GrowthBook, ConfigCat) ou build próprio simples.

## Prompts canônicos
- "feature flags strategy"
- "evitar flag debt"
- "rollout gradual"

## Comportamentos esperados
- [ ] Tipos: release, operational (kill switch), permission, experiment.
- [ ] Convenção de nome `<tipo>.<modulo>.<feature>`.
- [ ] Cada flag tem: owner, tipo, propósito, deadline de remoção, default, rollout plan.
- [ ] Auditoria mensal de flags vencidas.
- [ ] Limite de flag debt (ex.: ≤ 5% do código atrás de flag).
- [ ] Audit log de mudança de flag.

## Anti-padrões
- [ ] NÃO permite flag sem owner.
- [ ] NÃO release flag sem deadline.
- [ ] NÃO depende APENAS de flag pra rollback.
