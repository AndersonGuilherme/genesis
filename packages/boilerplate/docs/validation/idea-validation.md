# Idea validation

> Checklist de validação da ideia. Antes de construir, prove que vale construir.

## Por que validar

Construir é caro. Validar é barato. Custo de construir a coisa errada é o maior custo.

## Estágios de validação

### 1. Validação de problema
A dor existe na frequência e intensidade que imaginamos?

- [ ] Pelo menos 10 entrevistas qualitativas com persona primária
- [ ] Documentadas em [user-interviews.md](user-interviews.md)
- [ ] Maioria menciona a dor sem ser perguntada
- [ ] Identificado o "workaround atual"

### 2. Validação de solução
A solução proposta resolve a dor melhor que o workaround?

- [ ] Mockup / protótipo mostrado para ≥ 8 pessoas
- [ ] Maioria entende a proposta em < 30s
- [ ] Maioria diz que substituiria o workaround
- [ ] Ninguém pediu cancelamento do conceito

### 3. Validação de willingness to pay
Pessoas pagariam pelo benefício?

- [ ] Pelo menos 3 pessoas dizem "compraria amanhã" ao preço proposto
- [ ] Pelo menos 1 deposita sinal (preorder, depósito, contrato) — quando aplicável
- [ ] Smoke test: landing page com botão "Comprar" tem CTR ≥ benchmark

### 4. Validação de canal
Existe canal de aquisição viável e econômico?

- [ ] CAC < LTV estimado em pelo menos 1 canal
- [ ] Volume de demanda observado no canal escolhido
- [ ] Capacidade do canal de escalar (não esgota em 200 leads)

### 5. Validação de operação
Conseguimos entregar sem virar refém de processo manual?

- [ ] Caminho feliz documentado
- [ ] Suporte estimado em horas por cliente / mês
- [ ] Pelo menos 1 piloto rodado end-to-end

## Sinais positivos

- Pessoas mandam mensagem perguntando quando lança.
- Aparece concorrente fazendo algo parecido.
- Entrevistados pedem para serem os primeiros.
- NPS de protótipo > 30 em amostra pequena.

## Sinais negativos

- Reações educadas mas sem ação ("interessante, manda quando lançar").
- Pessoas elogiam mas não pagam.
- Conversão de smoke test < 1%.
- Suporte estimado > 5h/cliente/mês.

## Critério final para passar para implementação

A skill `review-readiness` só libera o desenvolvimento se:

- [ ] Problema validado
- [ ] Solução validada (no nível conceitual)
- [ ] Pelo menos 1 sinal forte de willingness to pay
- [ ] Pelo menos 1 canal com economia viável
- [ ] [../research/assumptions.md](../research/assumptions.md) sem premissa fatal aberta

Pular validação para "ir mais rápido" tende a custar 5x mais tempo depois.
