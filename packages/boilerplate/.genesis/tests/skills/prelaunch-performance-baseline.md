# Tests: prelaunch-performance-baseline

## Pré-condição
- Sistema em staging com paridade de prod.
- Observability ativa + SLOs definidos.
- Ferramenta de load test (k6, Locust, JMeter, Gatling).

## Prompts canônicos
- "performance baseline"
- "load test pré-launch"
- "validar SLO sob carga"

## Comportamentos esperados
- [ ] Cenários: baseline (rps esperado), spike (2-3x), stress (até quebrar).
- [ ] Scripts versionados no repo.
- [ ] Métricas coletadas: latência p50/p95/p99, error rate, throughput, CPU/memory, queue depth.
- [ ] Comparação contra SLO.
- [ ] Gargalos identificados (query lenta, cache faltante, pool, etc.).
- [ ] Plano de mitigação pra gargalos críticos.
- [ ] Produz `docs/launch/performance-baseline.md`.

## Anti-padrões
- [ ] NÃO roda load test em produção sem canary controlado.
- [ ] NÃO ignora gargalo crítico ("vamos escalar se quebrar").
- [ ] NÃO usa dado não-representativo em staging.
