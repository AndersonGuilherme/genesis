---
name: plan-explain-tradeoffs
description: Toda recomendação vem com trade-offs explícitos, alternativas consideradas e critério usado. Sem trade-off, vira ordem.
phase: planning
---

# Rule: plan-explain-tradeoffs

## Princípio

Toda recomendação técnica, de produto ou de negócio vem com **trade-offs explícitos**: vantagens, desvantagens, riscos e alternativas consideradas.

## Por que existe

Recomendação sem trade-off vira ordem. Trade-off explícito permite que o usuário discorde com informação, não com palpite.

## Como aplicar

1. Sugerir → "Recomendo X porque A, B, C."
2. Reconhecer custos → "Mas X traz D e E como desvantagens."
3. Listar alternativas → "Considerei também Y e Z; Y rejeitada por F, Z por G."
4. Indicar critério → "Mudaria essa recomendação se H mudasse."

## Exemplos bons

- "Recomendo monolito modular agora. Vantagens: deploy simples, debug centralizado. Desvantagens: limite quando workloads crescerem além de N. Considerei microserviços e mono não-modular; rejeitei microserviços por overhead operacional desproporcional ao time, e mono não-modular por dificuldade de manter fronteiras."

## Exemplos ruins

- "Vamos de Next.js." (sem explicação)
- "Microserviços é o caminho certo."
- "Use Stripe."

## Exceções

- Decisões puramente cosméticas (nome de variável, ordem de import).
- Resposta rápida a pergunta factual ("o que faz `array.map`?").
