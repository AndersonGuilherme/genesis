---
name: disc-discover-business
description: Use após init-project (Fase 1). Conduz Fases 2 e 3 — público, mercado, concorrência, proposta de valor e monetização inicial. Termina com docs/business/* e docs/product/value-proposition.md preenchidos.
phase: discovery
rules:
  - plan-documentation-first
  - plan-business-before-technology
  - plan-explain-tradeoffs
---

# Skill: disc-discover-business

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/plan-documentation-first.md`
- `.claude/rules/plan-business-before-technology.md`
- `.claude/rules/plan-explain-tradeoffs.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Entender mercado, público, concorrência e valor antes de definir produto. Pressiona premissas e identifica riscos cedo.

## Quando usar

- Após `init-project` concluir Fase 1.
- Quando `docs/product/problem-statement.md` está preenchido mas `docs/business/market-analysis.md` ainda não.
- Para revisão profunda de negócio em projeto existente.

## Entradas esperadas

- `docs/product/product-vision.md`
- `docs/product/problem-statement.md`

## Processo passo a passo

1. Ler arquivos de entrada.
2. Conduzir Fase 2 — perguntas de público e mercado.
3. Conduzir Fase 3 — perguntas de valor e monetização.
4. Após cada bloco de respostas, preencher os documentos correspondentes.
5. Identificar premissas críticas e registrar em `docs/research/assumptions.md`.
6. Identificar riscos e registrar em `docs/business/risks.md`.
7. Sugerir ADRs para decisões importantes (ex.: "modelo de receita primário").
8. Atualizar PROJECT_STATE.
9. Sugerir próxima skill: `define-product`.

## Perguntas — Fase 2 (público e mercado)

1. Quem é o **usuário principal**?
2. Quem é o **comprador**?
3. Quem é o **decisor**? (pode ser o mesmo do comprador, pode não ser)
4. Quem são os **concorrentes diretos**?
5. Quem são os **concorrentes indiretos**?
6. Como as pessoas **resolvem esse problema hoje**?
7. O que faria alguém **trocar a solução atual** pela sua?

## Perguntas — Fase 3 (valor e monetização)

1. Qual é a **proposta de valor** em 1 frase no formato "Para X que sofre com Y, somos Z que entrega W"?
2. Como o projeto pode **ganhar dinheiro**? (uma fonte ou várias?)
3. Existe **assinatura**?
4. Existe **comissão**?
5. Existe **pagamento único**?
6. Existe **plano gratuito**?
7. Existe **marketplace**?
8. Existe **venda enterprise**?
9. Quais **métricas** indicam que o projeto está dando certo?

## Documentos que cria ou atualiza

- `docs/product/target-users.md` (personas + anti-personas)
- `docs/business/market-analysis.md` (TAM/SAM/SOM, tendências)
- `docs/business/competitors.md` (matriz comparativa)
- `docs/product/value-proposition.md` (proposta + diferenciais)
- `docs/business/monetization.md` (fontes de receita)
- `docs/business/business-model.md` (BMC resumido)
- `docs/business/risks.md` (riscos de negócio)
- `docs/research/assumptions.md` (premissas surgidas)
- `docs/PROJECT_STATE.md` (avanço de fases)

## Critérios de conclusão

- [ ] Persona primária clara, com JTBD e dor aguda
- [ ] Pelo menos 3 concorrentes (diretos + indiretos) mapeados
- [ ] Proposta de valor passou no "teste do crítico"
- [ ] Pelo menos 1 fonte de receita definida com hipóteses
- [ ] Pelo menos 3 premissas críticas registradas
- [ ] Pelo menos 3 riscos de negócio registrados

## Restrições

- Não recomendar stack aqui — Fase 6 cuida disso.
- Pressione respostas vagas. "Para todo mundo" não é persona.
- Se o usuário declarar concorrente como "não existe ninguém igual", explicar que **inércia também é concorrente**.
- Se a proposta de valor for genérica, oferecer 2 alternativas mais específicas.

## Exemplos de uso

- "Concluí a Fase 1, e agora?"
- "Vamos pensar mercado e monetização."
- "Quero revisar o modelo de negócio com mais profundidade."

## Saída esperada

Documentos preenchidos, premissas e riscos listados, próxima skill (`define-product`) indicada.
