# prelaunch-performance-baseline

## O que faz
Load test em staging com paridade de prod. Baseline + spike + stress. Valida SLO sob carga.

## Quando você invoca
Antes do go-live. Antes de evento de tráfego previsto. Após mudança arquitetural.

## O que a IA faz
1. Define cenários (baseline, spike, stress).
2. Roda load test (k6, Locust, JMeter, Gatling).
3. Mede latência p50/p95/p99, error rate, throughput, CPU/memory.
4. Valida contra SLO.
5. Identifica gargalos.
6. Plano de mitigação pra gargalos críticos.

## Rules invocadas
- [prelaunch-gate-complete](../../../.claude/rules/prelaunch-gate-complete.md)
- [ops-alert-actionable](../../../.claude/rules/ops-alert-actionable.md)

## Próximo passo natural
`prelaunch-launch-readiness-gate`.
