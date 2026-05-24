# Tests: maint-dependency-update

## Pré-condição
- CI verde com pipeline (cross-link `ops-setup-ci-pipeline`).
- Tooling automatizado (Renovate, Dependabot).
- `docs/maintenance/dependency-update-policy.md` definida.

## Prompts canônicos
- "dependency update semanal"
- "triagem de CVE"
- "atualizar deps"

## Comportamentos esperados
- [ ] PRs automáticos abertos por Renovate/Dependabot.
- [ ] Triage por tipo: patch (auto se CI verde), minor (review changelog), major (review profundo).
- [ ] CVE com severidade dispara SLA (`maint-security-patch-sla`).
- [ ] Validação: CI completo + smoke staging + canary prod.
- [ ] Auditoria mensal de deps obsoletas/abandonadas/licença incompatível.

## Anti-padrões
- [ ] NÃO faz merge sem CI verde.
- [ ] NÃO pula triage de major.
- [ ] NÃO deixa CVE crítico esperar batch semanal.
