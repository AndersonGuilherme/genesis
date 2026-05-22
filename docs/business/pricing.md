# Pricing

> Quanto cobrar, como cobrar e por quê. Pricing é design, não cálculo de custo.

## Princípios de pricing deste projeto

1. _(ex.: precificar pelo valor entregue, não pelo custo da infra)_
2. _(ex.: simplicidade > completude — máximo 3 planos)_
3. _(ex.: ancorar em comparáveis que o cliente já conhece)_

## Estrutura de planos

| Plano | Preço | Para quem | Limites | Diferenciais |
|-------|-------|-----------|---------|---------------|
| Starter | _(R$ X/mês)_ | escolas até 50 alunos | 50 alunos, sem marketplace | onboarding self-service |
| Pro | _(R$ Y/mês)_ | escolas 51–200 | 200 alunos, marketplace, relatórios | suporte prioritário |
| Business | _(R$ Z/mês)_ | redes / grandes | ilimitado | SLA, API |

Definir cada plano em detalhe (features, limites técnicos) só depois da arquitetura.

## Cobrança variável (comissão)

| Item | Valor |
|------|-------|
| % sobre venda no marketplace | _(ex.: 10%)_ |
| Mínimo por transação | _(R$)_ |
| Custo de gateway repassado | _(sim/não)_ |

## Add-ons

- _(ex.: domínio próprio + R$ 20/mês)_
- _(ex.: SMS automático + custo por SMS)_
- _(ex.: white-label sob consulta)_

## Descontos e promocional

| Tipo | Política |
|------|----------|
| Anual | _(2 meses grátis)_ |
| Indicação | _(R$ X de crédito)_ |
| Estudante / instituição | _(50%)_ |
| Black Friday | _(definir por edição)_ |

## Ancoragem

Como o cliente vai comparar o preço?

- _(ex.: contra Hotmart — somos mais baratos em transação grande)_
- _(ex.: contra Conta Azul + Eduzz somados — somos mais simples)_

## Política de reajuste

- Frequência: _(anual)_
- Indexador: _(IGP-M / IPCA / contratual)_
- Aviso prévio: _(60 dias)_

## Testes de preço previstos

| Teste | Hipótese | Tamanho amostra | Métrica |
|-------|----------|------------------|---------|
| _(ex.: Pro a R$ 299 vs. R$ 349)_ | _(elasticidade baixa)_ | 50 leads cada | conversão e churn 30d |

## Erros a evitar

- _(ex.: descontar para fechar primeiros clientes — vira referência de mercado)_
- _(ex.: criar 10 planos para "atender todo mundo")_
- _(ex.: cobrar por usuário em produto multi-aluno — atrita)_
