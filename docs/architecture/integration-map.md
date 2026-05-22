# Integration map

> Toda integração externa em um lugar só. Sem isso, ninguém sabe o real raio de explosão de uma falha externa.

## Como registrar

Cada integração deve ter spec própria em `docs/specs/integrations/<servico>.md` usando [../../templates/integration-spec-template.md](../../templates/integration-spec-template.md). Este arquivo é o **índice**.

## Tabela mestra

| Serviço | Categoria | Direção | Criticidade | Fallback | Dono | Spec |
|---------|-----------|---------|-------------|----------|------|------|
| _(ex.: Stripe)_ | pagamento | bidirecional | alta | _(provedor secundário)_ | _(nome)_ | _(link)_ |
| _(ex.: Resend)_ | email | saída | média | _(SES)_ | _(nome)_ | _(link)_ |
| _(ex.: Twilio)_ | SMS | saída | baixa | nenhum | _(nome)_ | _(link)_ |
| _(ex.: AWS S3)_ | storage | saída | alta | nenhum (lock-in aceito) | _(nome)_ | _(link)_ |
| _(ex.: Google OAuth)_ | auth | entrada | média | login local | _(nome)_ | _(link)_ |
| _(ex.: Sentry)_ | observabilidade | saída | média | logs estruturados | _(nome)_ | _(link)_ |

## Categorias possíveis

- pagamento
- comunicação (email/SMS/push)
- autenticação
- storage
- analytics / BI
- IA (LLM, embeddings)
- terceirização (NF, KYC, fraude)
- DNS / CDN
- monitoramento

## Política de novas integrações

Adicionar integração requer:

1. ADR justificando (alternativas avaliadas, custo, risco)
2. Spec completa pelo template
3. Plano de fallback (se aplicável)
4. Métrica e alerta dedicados
5. Registro nesta tabela

## Vendor lock-in consciente

Integrações que aceitamos não ter fallback (porque o custo de abstração não vale):

- _(ex.: AWS S3 — uso de SDK direto, sem camada de abstração)_

Integrações que **exigem** abstração + fallback:

- _(ex.: gateway de pagamento)_
- _(ex.: provedor de email transacional)_

## Webhooks recebidos

| Origem | Endpoint | Autenticação | Idempotência |
|--------|----------|--------------|---------------|
| Stripe | `/webhooks/stripe` | signing secret | event id |
| _(...)_ | _(...)_ | _(...)_ | _(...)_ |

## Custos por integração

| Serviço | Modelo de custo | Estimado/mês |
|---------|------------------|---------------|
| Stripe | % por transação | _(R$)_ |
| Resend | tier de envio | _(R$)_ |
| _(...)_ | _(...)_ | _(R$)_ |

## Riscos cross-integration

- Falha de webhook Stripe → reconciliação noturna (descrita em [data-strategy.md](data-strategy.md)).
- Bounce alto no email → degrade gracioso para outro provedor.
- Latência de SMS → não usar como caminho crítico.
