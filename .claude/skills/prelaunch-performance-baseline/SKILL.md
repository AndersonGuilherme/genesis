---
name: prelaunch-performance-baseline
description: Load test em staging com paridade de prod. Estabelece baseline de capacidade, identifica gargalos, valida SLO sob carga esperada. Produz `docs/launch/performance-baseline.md`.
phase: pre-launch
rules:
  - prelaunch-gate-complete
  - ops-alert-actionable
---

# Skill: prelaunch-performance-baseline

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Baseline de performance sob carga esperada + headroom pra picos. Valida SLO antes de cliente real chegar.

## Quando usar

- Antes do go-live.
- Antes de evento de tráfego previsto (lançamento de marketing, Black Friday).
- Após mudança arquitetural significativa.

## Pré-condições

- Sistema em staging com paridade razoável de prod (mesmo runtime, banco com dado representativo).
- Observability ativa (cross-link `ops-define-observability`).
- SLOs definidos (cross-link `ops-define-slos-slis`).
- Ferramenta de load test (k6, Locust, JMeter, Gatling).

## Processo

1. Definir cenário:
   - Tráfego baseline esperado (rps por endpoint crítico).
   - Pico esperado (2-3x baseline).
   - Stress test (até quebrar — identificar limite).
2. Escrever scripts de load test no padrão da ferramenta.
3. Rodar em staging:
   - Smoke test (validar setup).
   - Baseline run (30min na carga esperada).
   - Spike run (subida brusca pro pico).
   - Stress run (até erro/latência inaceitável).
4. Medir: latência p50/p95/p99 por endpoint, error rate, throughput, CPU/memory de cada componente, conexões de banco, queue depth.
5. Validar contra SLO: SLO atingido na carga baseline + pico?
6. Identificar gargalos: query lenta, falta de cache, pool de conexão, etc.
7. Plano de mitigação pra gargalos críticos (escalar antes do launch).
8. Documentar em `docs/launch/performance-baseline.md` com gráficos + conclusão.

## Restrições

- Sem rodar load test em produção (a menos que canary controlado).
- Sem ignorar gargalo crítico ("vamos escalar se quebrar").
- Dado representativo no staging (volume + distribuição).
- Limitar custo: 1 baseline + 1 spike + 1 stress = suficiente, não 50 runs.

## Exemplos de uso

- "Rodar performance baseline do tchr pré-launch."
- "Validar capacidade pra lançamento de marketing em junho."

## Critérios de conclusão

- [ ] Cenários definidos.
- [ ] Scripts versionados no repo.
- [ ] Baseline + spike + stress executados.
- [ ] Métricas coletadas e comparadas com SLO.
- [ ] Gargalos identificados.
- [ ] Plano de mitigação documentado.
- [ ] `docs/launch/performance-baseline.md` completo.
