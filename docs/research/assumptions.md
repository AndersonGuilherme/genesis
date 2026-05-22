# Assumptions

> Premissas que sustentam o projeto. Cada uma tem nível de confiança e plano de validação. Premissa não-validada é dívida de risco.

## Como registrar

| Campo | Como preencher |
|-------|-----------------|
| ID | A-NNNN |
| Premissa | frase clara, falsificável |
| Confiança | 1 (achismo) a 5 (validado em produção) |
| Impacto se falsa | baixo / médio / alto / fatal |
| Como validar | experimento concreto |
| Status | aberta / validada / refutada |
| Dono | quem persegue a validação |

## Lista atual

### A-0001 — _(exemplo)_

| Campo | Valor |
|-------|-------|
| Premissa | _(ex.: "Escolas pequenas estão dispostas a pagar R$ 200/mês por gestão integrada")_ |
| Confiança | 2 |
| Impacto se falsa | alto |
| Como validar | _(testes de preço com 10 escolas reais)_ |
| Status | aberta |
| Dono | _(nome)_ |
| Vinculada a | [../business/business-model.md](../business/business-model.md), [../business/pricing.md](../business/pricing.md) |

### A-0002 — _(próxima)_

_(Replicar formato.)_

## Premissas globais comuns para revisar

- O usuário primário realmente sofre desse problema todo dia.
- Existe budget alocado para resolver esse problema.
- O comprador é também o usuário (ou não — afeta tudo).
- A tecnologia desejada está madura suficiente.
- O time consegue executar nessa stack.
- O modelo de negócio é compatível com regulação local.
- O canal de aquisição escolhido tem volume real.

Use esta lista como ponto de partida na primeira rodada.

## Conexão com validação

Premissas com confiança 1–2 e impacto alto/fatal **precisam** de experimento documentado em [validation-plan.md](validation-plan.md).
