# Scalability strategy

> Plano honesto para crescimento. Sem fantasia de "10x desde o dia 1".

## Capacidade alvo por horizonte

| Horizonte | Usuários ativos | Requisições/min pico | GB de banco | Latência alvo (p95) |
|-----------|------------------|------------------------|-------------|----------------------|
| Lançamento | _(100)_ | _(60)_ | _(<10)_ | _(<300ms)_ |
| 6 meses | _(1.000)_ | _(600)_ | _(<100)_ | _(<300ms)_ |
| 12 meses | _(10.000)_ | _(3.000)_ | _(<500)_ | _(<300ms)_ |
| 24 meses | _(50.000+)_ | _(20.000+)_ | _(múltiplos TB)_ | _(<300ms)_ |

## Gargalos previstos por horizonte

| Horizonte | Gargalo provável | Sinal para agir | Ação planejada |
|-----------|------------------|------------------|------------------|
| Lançamento | quase nada | — | monitorar custo |
| 6 meses | uploads de mídia | banda saturada | CDN + chunked upload |
| 12 meses | banco em queries de relatório | p95 > 500ms | réplica leitora |
| 24 meses | partições por tenant grande | hot tenant | sharding lógico |

## Estratégias gerais

### Banco
- Réplica leitora para relatórios
- Índices baseados em queries reais (não preventivos)
- Particionamento quando >100M linhas em tabela quente

### Cache
- Cache de leitura para dados quase-imutáveis
- Cache distribuído (Redis) para sessão e rate limit
- Invalidação por evento, não por TTL agressivo

### Filas
- Tudo que não bloqueia resposta vai para fila (email, webhook outbound, geração de PDF)
- DLQ obrigatória + alerta
- Idempotência por chave de domínio

### CDN
- Assets estáticos no CDN desde o dia 1
- Cache de páginas públicas com TTL curto + purge

### Workers
- Horizontalmente escaláveis
- Cada worker processa por tipo, com concorrência limitada por backpressure

### App / API
- Stateless
- Health checks `/healthz` e `/readyz`
- Graceful shutdown

## Custo vs. capacidade

| Capacidade | Custo aproximado/mês |
|-----------|------------------------|
| Lançamento | _(R$ X)_ |
| 6 meses | _(R$ Y)_ |
| 12 meses | _(R$ Z)_ |

Auditar mensalmente. Quando custo / receita > _(faixa)_, revisar.

## Quando NÃO escalar

- Não introduzir microserviços antes de _(número)_ usuários ativos.
- Não introduzir Kubernetes antes de _(número)_ workloads e _(tamanho)_ de time.
- Não introduzir CQRS / event sourcing antes de prova clara de necessidade.

## Load tests

- Ferramenta: _(ex.: k6, Locust)_
- Cadência: _(antes de cada release grande)_
- Cenários: _(checkout, cadastro em massa, exportação)_

## SLOs

| Indicador | Alvo | Janela |
|-----------|------|--------|
| Disponibilidade | 99.5% | mensal |
| Latência p95 | <300ms | 5 min |
| Sucesso de cobrança | 99% | mensal |

SLO baixo é melhor que SLO mentira. Comece humilde.
