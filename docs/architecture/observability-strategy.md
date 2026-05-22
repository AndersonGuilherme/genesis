# Observability strategy

> Saber o que está acontecendo em produção sem precisar ligar para usuário. Logs, métricas, traces e alertas em conjunto.

## Pilares

### Logs

- Formato: JSON estruturado
- Campos obrigatórios: `timestamp`, `level`, `service`, `request_id`, `tenant_id` (quando aplicável), `user_id` (quando aplicável)
- Níveis: `debug` (dev), `info` (eventos), `warn` (anomalia), `error` (falha)
- Nunca registrar: senha, token, CPF, dados de cartão
- Retenção: ver [../operations/logging.md](../operations/logging.md)

### Métricas

- Stack: _(ex.: OpenTelemetry → Grafana / Honeycomb / Datadog)_
- Modelo: RED (Rate, Errors, Duration) para serviços; USE (Utilization, Saturation, Errors) para infra
- Cardinalidade: limites por label. Não emitir métrica por `user_id`.

### Traces

- Distributed tracing desde o início.
- Propagação: `traceparent` em todas as chamadas internas.
- Sampling: 100% em dev, _(10%)_ em produção, _(100% para erros)_.

### Alertas

- Definir SLOs e alertar **em violação iminente**, não em qualquer pico.
- Alertas devem ser **acionáveis**. Cada alerta tem runbook em [../operations/incident-response.md](../operations/incident-response.md).

## Métricas-chave do produto

| Métrica | Tipo | Alarme |
|---------|------|--------|
| Sucesso de cobrança (%) | gauge | < 95% por 15 min |
| Login fail rate | counter | crescimento súbito |
| Worker queue depth | gauge | > X por > 5 min |
| Latência p95 endpoints críticos | histogram | > 500ms por 5 min |
| Erros 5xx | counter | > 1% das requisições |
| Webhooks recebidos vs. esperados | gauge | divergência > 1% / dia |

## Dashboards mínimos

1. **Saúde geral** — RED por serviço, erros, latência.
2. **Negócio** — signups, cobranças, retenção 7d.
3. **Infra** — CPU/memória/disco por serviço.
4. **Workers** — fila, throughput, falhas.
5. **Integrações** — taxa de sucesso por provedor externo.

## Tracing por jornada crítica

Cada jornada crítica do produto deve ter span dedicado:

- Cadastro
- Login
- Geração de cobrança
- Pagamento (do webhook ao update no banco)
- Envio de email

## Tags por tenant

- Permitir filtrar métricas, logs e traces por `tenant_id`.
- Necessário para diagnosticar problemas isolados.

## Erros não-fatais

Captura via Sentry/similar:

- Coletar contexto: usuário, tenant, ação.
- Agrupar por fingerprint.
- Política: zero erros em produção é mentira. Alvo é **conhecidos < threshold** e **novos = 0** após 24h.

## Custo de observabilidade

| Item | Estimado/mês |
|------|---------------|
| Logs | _(R$)_ |
| Métricas | _(R$)_ |
| Traces | _(R$)_ |
| APM/erros | _(R$)_ |

Auditar trimestralmente. Cardinalidade descontrolada é a causa #1 de explosão.

## Checklist mínimo de observabilidade por feature nova

- [ ] Logs estruturados no caminho feliz e nos erros
- [ ] Métricas RED para o endpoint principal
- [ ] Trace span coberto
- [ ] Alerta para a métrica de negócio principal
- [ ] Runbook básico se a feature for crítica
