---
name: plan-stack-neutrality
description: Nenhuma stack assumida por default. Sempre 3+ opções avaliadas antes de recomendar.
phase: planning
---

# Rule: plan-stack-neutrality

## Princípio

Nenhuma linguagem, framework ou stack é assumida por padrão. A escolha é sempre justificada pelo contexto do projeto.

## Por que existe

Hábito não é decisão. Cada projeto novo é uma oportunidade de avaliar o que serve melhor — não de repetir o que foi feito antes. JavaScript, TypeScript, Node, Next, Nest, React, Python, Go, Elixir, Rust ou qualquer outra opção só entra com motivo.

## Como aplicar

1. A skill `choose-stack` apresenta **ao menos 3 opções** (conservadora, equilibrada, escalável).
2. Cada opção é pontuada nos mesmos critérios.
3. Recomendação cita trade-offs negativos.
4. Decisão vira ADR.
5. Se o usuário insistir em uma stack específica, ainda apresentar alternativas e registrar a decisão como **consciente**.

## Exemplos bons

- "Para esse produto (marketplace + tempo real moderado), avaliei Node, Go e Elixir. Recomendo X porque... mas considere que Y traria Z benefício."
- ADR cita 3 opções, pontuação, custo e ecosistema.

## Exemplos ruins

- "Vamos usar Next + Nest porque é o que está em alta."
- Recomendação de stack sem analisar restrições do time.
- Apresentar apenas uma opção como se fosse a única possível.

## Exceções

- Time com restrição forte (ex.: só temos devs de Go) — ainda assim, registrar a restrição como input do ADR. A decisão é consciente, não default.
- Reescrita de produto que precisa coexistir com sistema legado já em produção — registrar como restrição.
