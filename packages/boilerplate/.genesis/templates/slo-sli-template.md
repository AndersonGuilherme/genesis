# SLO/SLI: <nome-do-sistema>

> Aplicado pela skill `ops-define-slos-slis`. Define qualidade alvo + medida por Critical User Journey.

## Visão geral

- **Periodicidade de revisão**: trimestral.
- **Última revisão**: <YYYY-MM-DD por NOME>.
- **Próxima revisão**: <YYYY-MM-DD>.
- **Política de error budget esgotado**: freeze de release novo no módulo afetado até budget recuperar 25%.

## Critical User Journeys (CUJ)

| CUJ | Descrição | Módulos envolvidos | Volume diário |
|-----|-----------|--------------------|--------------:|
| CUJ-01 | Login | auth | 50k |
| CUJ-02 | Checkout | catalog + cart + billing | 5k |
| CUJ-03 | Busca | search | 200k |
| CUJ-04 | Visualizar conteúdo | content | 500k |

## SLI × SLO por CUJ

### CUJ-01 — Login

| SLI | Definição (PromQL/equivalente) | Target | Janela | Error budget |
|-----|--------------------------------|--------|--------|:------------:|
| Disponibilidade | `sum(rate(http_requests_total{path="/auth/login",status!~"5.."}[5m])) / sum(rate(http_requests_total{path="/auth/login"}[5m]))` | 99.9% | 30 dias | 0.1% (43min) |
| Latência | `histogram_quantile(0.95, http_request_duration_seconds_bucket{path="/auth/login"})` | < 800ms | 7 dias | 5% above target |

**Burn rate alerts**:
- 14.4 (consume 2% do budget em 1h) → P1.
- 6 (consume 5% do budget em 6h) → P2.

### CUJ-02 — Checkout

| SLI | Definição | Target | Janela | Error budget |
|-----|-----------|--------|--------|:------------:|
| Disponibilidade | sucesso end-to-end de checkout | 99.5% | 30 dias | 0.5% |
| Latência | p95 do flow completo | < 2s | 7 dias | 5% above target |
| Qualidade | % checkouts sem refund por erro técnico | 99.95% | 30 dias | 0.05% |

<!-- Repetir por CUJ -->

## Métricas de negócio (não SLO, mas observadas)

| Métrica | Owner | Dashboard |
|---------|-------|-----------|
| Conversão checkout | Produto | <link> |
| Receita por hora | Finance | <link> |
| Novos cadastros | Growth | <link> |

## Política de error budget

| Estado | Ação |
|--------|------|
| Budget > 50% | Velocidade normal, releases livres |
| Budget 25-50% | Foco em estabilidade, releases com gate manual |
| Budget < 25% | Freeze de release novo no módulo afetado, foco em recuperar budget |
| Budget esgotado | Freeze + postmortem obrigatório dos drivers |

Decisão tomada por owner do módulo + IC se aplicável.

## Dashboard

Painel central em <link> com:
- SLO atual por CUJ (gauge).
- Error budget restante (gauge + trend).
- Burn rate (alerta visual).
- Histórico mensal (heatmap).

## Histórico de revisão

| Data | Mudança | Motivo |
|------|---------|--------|
| <YYYY-MM-DD> | SLO de checkout subiu de 99.0% para 99.5% | Maturidade da observability + investimento em estabilidade |
