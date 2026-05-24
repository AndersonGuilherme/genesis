# Monetização

> Como o dinheiro chega. Cada fonte de receita aqui precisa de hipótese, métrica e plano de teste.

## Fontes de receita previstas

| Fonte | Tipo | Quem paga | Quanto (faixa) | Frequência |
|-------|------|-----------|-----------------|-------------|
| _(ex.: mensalidade SaaS)_ | recorrente | dono da escola | R$ 99–R$ 499 | mensal |
| _(ex.: comissão marketplace)_ | variável | criador do curso | 8–15% | por venda |
| _(ex.: plano enterprise)_ | contrato | rede de escolas | R$ 2k+ | mensal/anual |
| _(ex.: serviços profissionais)_ | one-off | escola onboarding | R$ 1.5k | único |

## Plano gratuito (free tier)

- [ ] Existe?
- Limites: _(ex.: até 20 alunos, sem cobrança automática)_
- Objetivo do free: _(aquisição? validação? marketing?)_
- Risco: _(canibalização? carga de suporte?)_

## Trial

- [ ] Existe?
- Duração: _(ex.: 14 dias)_
- Restrições: _(o que limita)_
- Como converter: _(o que sinaliza intent de pagar)_

## Estratégia de pricing

Detalhar em [pricing.md](pricing.md).

Resumo de abordagem:
- _(ex.: value-based — baseado em alunos ativos)_
- _(ex.: feature-based — pacotes Basic/Pro/Business)_

## Modelo de comissão (se houver marketplace)

| Item | Política |
|------|----------|
| % cobrado do vendedor | _(ex.: 10%)_ |
| Cobrança do comprador | _(ex.: nenhuma)_ |
| Pagamento ao vendedor | _(ex.: D+14)_ |
| Estorno e disputa | _(política)_ |
| Limite mínimo de saque | _(R$)_ |
| Quem emite NF para quem | _(definir)_ |

## Métricas financeiras-chave

- MRR (receita recorrente mensal)
- ARR (anualizado)
- ARPU (receita média por conta)
- GMV (volume bruto transacionado no marketplace)
- Take rate (comissão / GMV)
- Churn (mensal e anual, logo e revenue)
- Net revenue retention

## Custos diretos por receita

| Receita | Custo direto | Margem aproximada |
|---------|--------------|--------------------|
| Mensalidade SaaS | _(infra/usuário)_ | _(%)_ |
| Comissão marketplace | _(gateway, antifraude, suporte)_ | _(%)_ |

## Riscos de monetização

- _(ex.: gateway de pagamento bloquear conta)_
- _(ex.: pressão por preço menor de concorrente)_
- _(ex.: churn alto em primeiros 60 dias)_

Mitigações em [risks.md](risks.md).

## Experimentos de monetização planejados

| Experimento | O que testa | Métrica de sucesso | Quando |
|------------|--------------|---------------------|--------|
| _(ex.: aumento de plano básico em 20%)_ | sensibilidade a preço | conversão ≥ 80% do baseline | mês 3 |
