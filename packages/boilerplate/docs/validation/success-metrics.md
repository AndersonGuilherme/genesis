# Success metrics

> Como saber se o projeto está dando certo. Sem métrica, opinião vence. Sem alvo na métrica, métrica vira ruído.

## North Star Metric

Mesma definida em [../product/product-vision.md](../product/product-vision.md). Recapitule aqui:

| Campo | Valor |
|-------|-------|
| Métrica | _(...)_ |
| Por que essa | _(...)_ |
| Meta 6 meses | _(...)_ |
| Meta 12 meses | _(...)_ |

## Métricas por camada

### Negócio
- MRR / ARR
- Novos clientes / mês
- Churn (logo, revenue)
- Ticket médio (ARPU)
- LTV / CAC
- Payback

### Produto
- Ativação (% que atinge milestone X em N dias)
- Retenção D1 / D7 / D30 / W4
- Engajamento (sessões / usuário ativo)
- Adoção de features-core
- NPS / CSAT

### Aquisição
- CAC por canal
- Conversão signup → ativação → pagante
- Tempo até primeiro valor (TTFV)

### Operação
- Disponibilidade
- Latência p95
- Tickets de suporte / cliente ativo
- Tempo médio de resolução de incidente

## Métricas-âncora vs. métricas-ruído

| Boa | Ruim |
|-----|------|
| Usuários ativos pagantes | "Total de signups" |
| % que ativou em 7 dias | "Visitas no site" |
| MRR retido em 90 dias | "Receita acumulada do mês" |
| Cobranças bem-sucedidas | "Cobranças enviadas" |

Métrica vaidade = aumenta sem relação com sucesso real.

## Painel mínimo

Dashboards obrigatórios desde o MVP:

1. **Negócio:** MRR, novos clientes, churn.
2. **Produto:** ativação, retenção, NPS.
3. **Aquisição:** funil por canal.
4. **Operação:** disponibilidade, p95, fila.

Detalhar em [../architecture/observability-strategy.md](../architecture/observability-strategy.md).

## Cadência

| Métrica | Revisão |
|---------|---------|
| North Star | semanal |
| Retenção | mensal |
| CAC/LTV | trimestral |
| NPS | trimestral |
| SLO operacional | semanal |

## Critérios de "produto funcionando"

- North Star cresce mês a mês.
- Churn mensal < limite definido.
- NPS estável ou crescente.
- LTV/CAC ≥ 3 nos canais principais.

Quando 2+ critérios falham por 2+ meses, abrir revisão estratégica.

## Limites de interpretação

- Pequenas amostras dão variância grande — não tirar conclusão com < 30 obs.
- A/B test mal feito é pior que nenhum.
- Métrica sem comparação histórica é número solto.
