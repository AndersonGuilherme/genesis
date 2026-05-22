# Business model

> Como o projeto ganha dinheiro, com quem, em troca de quê, com qual custo. Sem isso, todo o resto é hobby.

## Modelo (1 frase)

_(ex.: "SaaS B2B com mensalidade por escola + comissão sobre vendas de cursos no marketplace.")_

## Business Model Canvas (resumo textual)

### Segmentos de cliente
- _(quem paga; ver [../product/target-users.md](../product/target-users.md))_

### Proposta de valor
- _(ver [../product/value-proposition.md](../product/value-proposition.md))_

### Canais
- _(como o cliente descobre, avalia, compra e usa)_

### Relacionamento
- _(self-service, atendimento humano, comunidade, etc.)_

### Fontes de receita
- _(detalhar em [monetization.md](monetization.md))_

### Recursos-chave
- _(infra, dados, marca, equipe, propriedade intelectual)_

### Atividades-chave
- _(o que precisa funcionar bem todo dia)_

### Parcerias
- _(provedores críticos, gateways, integrações, distribuição)_

### Estrutura de custos
- _(fixos, variáveis, principais drivers)_

## Unidades econômicas básicas

| Métrica | Valor estimado | Como calcular |
|---------|----------------|----------------|
| CAC (custo de aquisição por cliente) | _(R$)_ | _(gasto marketing + vendas) / novos clientes_ |
| LTV (lifetime value) | _(R$)_ | _(ARPU × meses de retenção)_ |
| Margem bruta | _(%)_ | _(receita − custo direto) / receita_ |
| Payback (meses) | _(n)_ | _(CAC / margem mensal)_ |

Sinal verde para escalar quando: LTV/CAC ≥ 3 e payback ≤ 12 meses.

## Premissas críticas

| Premissa | Confiança (1-5) | Como validar |
|----------|-----------------|---------------|
| _(ex.: ticket médio R$ 199)_ | 3 | _(testes de preço com 10 escolas)_ |
| _(ex.: churn mensal ≤ 5%)_ | 2 | _(cohort após 90 dias)_ |

Registre confiabilidade baixa em [../research/assumptions.md](../research/assumptions.md).

## Sazonalidade e ciclos

- _(ex.: mensalidade escolar é anualizada — fevereiro tem pico)_
- _(ex.: criadores postam mais em janeiro)_

## Restrições legais e fiscais

- _(ex.: emissão de NF, retenção de impostos sobre comissão)_
- _(ex.: LGPD de dados de menores)_

Detalhar em [../security/data-privacy.md](../security/data-privacy.md).

## Cenários

| Cenário | Premissa principal | Receita ano 1 |
|---------|--------------------|-----------------|
| Conservador | _(50 escolas, sem marketplace)_ | _(R$)_ |
| Esperado | _(150 escolas, marketplace inicial)_ | _(R$)_ |
| Otimista | _(400 escolas, marketplace ativo)_ | _(R$)_ |
