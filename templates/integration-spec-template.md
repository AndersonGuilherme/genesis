# Integration Spec: \<serviço externo\>

| Campo | Valor |
|-------|-------|
| Serviço | _(ex.: Stripe, Resend, AWS S3)_ |
| Categoria | pagamento / email / SMS / storage / auth / analytics / IA |
| Direção | entrada / saída / bidirecional |
| Criticidade | alta / média / baixa |
| Dono | _(papel)_ |
| Data | YYYY-MM-DD |
| ADR vinculado | _(link)_ |

## Motivo da integração

Por que precisamos desse serviço? Que problema do produto/operação ele resolve?

## Alternativas avaliadas

| Alternativa | Por que não foi escolhida |
|-------------|-----------------------------|
| _(...)_ | _(...)_ |

## Dados enviados

| Campo | Tipo | PII? | Quando enviado |
|-------|------|------|----------------|
| _(...)_ | _(...)_ | sim / não | _(...)_ |

## Dados recebidos

| Campo | Tipo | Como tratado |
|-------|------|---------------|
| _(...)_ | _(...)_ | _(...)_ |

## Autenticação

- Tipo: _(API key, OAuth, JWT, signing secret)_
- Onde mora o segredo: _(gerenciador de segredos)_
- Rotação: _(política)_

## Limites e quotas

| Limite | Valor | Plano |
|--------|-------|-------|
| Requisições/s | _(...)_ | _(...)_ |
| Volume mensal | _(...)_ | _(...)_ |

## Fallback / degrade

- O que fazer se o serviço estiver fora?
- Há provedor secundário?
- Há filas para retry?

## Custos

- Modelo: _(% por transação, por chamada, por GB, mensal)_
- Estimado / mês: _(R$)_
- Quando reavaliar: _(condição)_

## Webhooks (se aplicável)

- URL pública: `/webhooks/<servico>`
- Verificação: signing secret
- Idempotência: chave do evento (`event.id`)
- Retry policy do provedor: _(...)_

## Riscos

| Risco | Mitigação |
|-------|-----------|
| _(serviço fora do ar)_ | _(fallback, circuit breaker)_ |
| _(mudança de TOS)_ | _(revisão trimestral)_ |
| _(custo escalando)_ | _(alerta + revisão de plano)_ |

## Testes

- [ ] Sandbox configurado para dev/staging
- [ ] Testes de contrato com schema do provedor
- [ ] Teste de retry e idempotência
- [ ] Teste de webhook (válido + inválido)

## Conformidade

- LGPD: PII em trânsito? Acordo com fornecedor?
- Transferência internacional: registrado em [data-privacy.md](../docs/security/data-privacy.md)

## Observabilidade

- Métricas: taxa de sucesso, latência, custo
- Logs: requests, falhas (sem PII em payload de log)
- Alertas: taxa de falha > X, latência > Y

## Histórico

| Data | Mudança | Motivo |
|------|---------|--------|
