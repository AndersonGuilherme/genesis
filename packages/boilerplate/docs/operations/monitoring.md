# Monitoring

> O que medimos em produção, com que frequência, e o que fazemos com cada métrica.

## Princípios

1. **Métrica sem dono é métrica esquecida.**
2. **Alerta sem ação é spam.**
3. **Mais cardinalidade ≠ mais informação.**

## Camadas

### Negócio
- MRR / receita do dia
- Novos cadastros
- Cobranças bem-sucedidas vs. tentadas
- GMV do marketplace
- NPS / CSAT (atualizado em ciclo, não tempo real)

### Produto
- Ativação
- Retenção D1, D7, D30
- Sessões / usuário ativo
- Erros visíveis ao usuário
- Tickets de suporte

### Aplicação (RED)
- Requests/seg (Rate)
- % erro por endpoint (Errors)
- Latência p50/p95/p99 (Duration)

### Infra (USE)
- CPU / memória / disco / rede
- Saturação (filas, conexões, locks)
- Erros do nível mais baixo (timeouts, OOM)

## SLOs (alvos mínimos)

| Indicador | Alvo | Janela | Penalidade interna |
|-----------|------|--------|---------------------|
| Disponibilidade | 99.5% | 30 dias | revisão de release |
| Latência p95 (rotas críticas) | < 300ms | 7 dias | revisão de query/index |
| Sucesso de cobrança | 99% | 30 dias | análise por falha |

Comece humilde — SLO mentiroso desincentiva.

## Dashboards padrão

1. **Saúde do sistema** — RED + erros
2. **Negócio** — receita, cadastros, churn semanal
3. **Workers e filas** — fila depth, throughput, erros
4. **Integrações externas** — sucesso por provedor
5. **Tenants top** — uso, latência, erros (privacidade-aware)

## Alertas

| Alerta | Severidade | Notifica |
|--------|------------|----------|
| 5xx > 1% por 5 min | sev2 | on-call |
| Disponibilidade < SLO por 15 min | sev1 | on-call + lead |
| Sucesso de cobrança < 95% por 30 min | sev1 | on-call + produto |
| Disco > 80% | sev3 | on-call (horário comercial) |
| Worker queue > limite por 10 min | sev2 | on-call |
| Latência p95 > 2x baseline por 10 min | sev2 | on-call |

Severidades:
- **sev1**: incidente em produção, resposta imediata
- **sev2**: degradação relevante, resposta em < 30 min
- **sev3**: problema operacional, resposta em horário comercial

## On-call

Detalhar em [incident-response.md](incident-response.md).

- Rotação: _(definir — semanal, 24x7 ou business hours)_
- Tempo alvo de ack: 5 min para sev1, 15 min para sev2
- Compensação: definir

## Métricas vs. logs vs. traces

- **Métricas:** "está acontecendo agora?"
- **Logs:** "o que aconteceu nesse caso específico?"
- **Traces:** "como esse pedido se moveu pelos sistemas?"

Use os três juntos. Cada um sozinho mente.

## Cardinalidade

- Não emitir métrica por `user_id` ou `email`
- Tags com baixa cardinalidade controlada
- Auditar mensalmente a cardinalidade

## Custos

- Estimar mensal por pilar
- Definir teto e alerta antes de explodir
