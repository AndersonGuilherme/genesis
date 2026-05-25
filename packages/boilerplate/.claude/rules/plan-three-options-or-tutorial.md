---
name: plan-three-options-or-tutorial
description: Quando IA precisa de input do user pra avançar, oferecer 3 opções viáveis OU tutorial pra buscar a resposta. Nunca inventar alternativas só pra preencher resposta.
phase: planning
---

# Rule: plan-three-options-or-tutorial

## Princípio

Toda vez que IA precisar de input do user em pergunta aberta (stack, persona, modelo de negócio, política, ferramenta, processo), apresentar **pelo menos 3 opções viáveis** com trade-offs explícitos. Se IA não tem base concreta pra 3 opções, **dar um tutorial passo-a-passo de como o user busca a resposta** (onde pesquisar, que comparar, que critério usar) ao invés de inventar.

Proibido: inventar 2ª/3ª opção genérica só pra cumprir o formato.

## Por que existe

Pergunta sem opções vira "achômetro" — user responde o que vem à cabeça, sem comparar. Opção única apresentada como recomendação cria bias indevido (anchoring). Opções inventadas pra preencher formulário são ruído e prejudicam decisão.

Tutorial honesto sobre como buscar a resposta é melhor que invenção. User aprende a pesquisar; futura sessão fica mais autônoma.

## Como aplicar

1. Pergunta aberta detectada → IA pausa antes de responder.
2. IA avalia: tenho contexto sólido pra 3+ opções viáveis comparáveis?
   - SIM → apresenta cada opção com: nome, prós, contras, quando faz sentido, fontes/evidência.
   - NÃO → apresenta tutorial:
     - Onde pesquisar (URLs específicas, queries de busca, docs oficiais).
     - O que comparar (critérios concretos).
     - Como validar a resposta (red flags, sinais de qualidade).
     - Tempo estimado pra pesquisa.
3. Sempre marcar opção recomendada (se houver) e o porquê — sem esconder a recomendação atrás de neutralidade falsa.
4. Sempre listar critério: "Mudaria essa recomendação se ___".
5. Apresentar até 4 opções no máx (5+ paralisa decisão).

## Exemplos bons

**Pergunta com 3 opções reais:**
> "Stack pra MVP web SaaS B2B?"
> A) Next.js + Postgres + Vercel — DX ótima, hosting fácil, lock-in moderado.
> B) Astro + Postgres + Railway — leve, full-stack mas menos maduro pra dash interno.
> C) Django + Postgres + Fly.io — produtividade alta em CRUD, MTV opinated, Python ecosystem.
> Recomendo A pra time JS, B pra performance crítica + low-traffic, C pra time Python + lots of forms.
> Mudaria pra D se: time já tem expertise diferente.

**Pergunta sem base — tutorial:**
> "Qual processadora de pagamento usar?"
> Não tenho dados atualizados pra recomendar 3 com confiança. Pra decidir, faça:
> 1. Liste 5 candidatas (Stripe, Adyen, Cielo, PagSeguro, Asaas — pesquise "payment processor brasil 2026").
> 2. Compare em: fee % por transação, tempo de settlement (D+0 a D+30), suporte PIX nativo, fee de chargeback, dashboard quality, SDK Node.
> 3. Cruze com seu ticket médio e volume — Stripe é caro pra ticket baixo, processadoras BR são melhores pra PIX.
> 4. Pergunte em comunidade tech BR (r/brdev, Discord StartSe) por experiências reais de quem já integrou.
> Critério vencedor: menor TCO + ferramenta que time consegue suportar.

## Exemplos ruins

- "Recomendo Next.js." (sem alternativas)
- "Use Stripe, Cielo ou alguma outra." (terceira opção genérica, sem trade-off)
- "Talvez React, talvez Vue, talvez Angular." (sem ranking nem critério)
- Apresentar opção que IA sabe ser ruim só pra ter "3" no formato.
- "Depende do contexto." (sem dar contexto pra decisão).

## Exceções

- Pergunta factual com resposta única conhecida (ex.: "qual versão do Node usar?" → "20 LTS, 22 atual").
- Decisão já tomada pelo user em sessão anterior — só confirmar, não re-perguntar.
- Decisões puramente cosméticas (nome de variável, ordem de import) — pode sugerir 1.
- Quando user explicitamente pediu "decide você" + tem contexto suficiente pra IA defender 1.
