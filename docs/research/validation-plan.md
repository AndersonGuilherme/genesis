# Validation plan

> Experimentos planejados para validar as premissas mais arriscadas. Validar é caro, mas errado é mais caro.

## Princípios

1. **Validar antes de escalar.** Não construa rampa de aquisição para hipótese não-validada.
2. **Experimento pequeno e específico.** Cada teste responde 1 pergunta.
3. **Critério antes do experimento.** Defina o que conta como sucesso ANTES.
4. **Tempo-caixa.** Experimento sem prazo morre na gaveta.

## Template de experimento

| Campo | Valor |
|-------|-------|
| ID | EXP-NNNN |
| Hipótese | _(falsificável: "Se fizermos X, então Y acontece")_ |
| Premissa que valida | [A-NNNN](assumptions.md#a-nnnn) |
| Método | entrevista / landing test / smoke test / piloto / A/B / análise de dados |
| Amostra | _(tamanho e perfil)_ |
| Métrica | _(número exato)_ |
| Critério de sucesso | _(ex.: ≥ 30% conversão)_ |
| Critério de falha | _(o que prova que a premissa está errada)_ |
| Duração | _(dias)_ |
| Custo estimado | _(R$ + horas)_ |
| Status | planejado / rodando / concluído |
| Resultado | _(quando terminar)_ |
| Decisão tomada | _(o que mudou após o resultado)_ |

## Experimentos planejados

### EXP-0001 — _(exemplo)_

| Campo | Valor |
|-------|-------|
| Hipótese | _(ex.: "Donas de escola de idiomas pagariam R$ 199/mês por uma plataforma integrada")_ |
| Premissa | A-0001 |
| Método | entrevista + smoke test (landing) |
| Amostra | 15 donas |
| Métrica | % que dizem "pagaria amanhã" + % que clicam em "Comprar" no smoke |
| Critério de sucesso | ≥ 50% dizem sim + ≥ 10% cliques |
| Critério de falha | < 20% dizem sim |
| Duração | 14 dias |
| Custo estimado | R$ 500 ads + 20h |
| Status | planejado |

### EXP-0002 — _(próximo)_

_(Repetir.)_

## Antipatrões de validação

- "Vou perguntar pra família e amigos" — viés de confirmação.
- "Vi alguém falando que esse problema existe" — anedota.
- "Resultado do experimento foi inconclusivo" — sem critério claro definido.
- "Vamos validar quando o produto estiver pronto" — invertido.

## Conexão com decisões

Resultados aprovados:
- Geram ADR quando alteram direção.
- Atualizam [assumptions.md](assumptions.md) com nova confiança.
- Atualizam [../product/mvp-scope.md](../product/mvp-scope.md) quando afetam escopo.

Resultados refutados:
- Fazem premissa virar "refutada".
- Forçam re-discussão da fase impactada.
