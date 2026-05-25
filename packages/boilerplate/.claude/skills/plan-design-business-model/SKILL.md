---
name: plan-design-business-model
description: Use para detalhar o modelo de negócio, planos, pricing, custos, canais e go-to-market. Geralmente roda em conjunto com discover-business mas aprofunda a parte financeira.
phase: planning
rules:
  - plan-explain-tradeoffs
  - plan-business-before-technology
  - plan-three-options-or-tutorial
---

# Skill: plan-design-business-model

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/plan-explain-tradeoffs.md`
- `.claude/rules/plan-business-before-technology.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Sair da hipótese "vamos cobrar algo" e chegar em: planos definidos, preço com âncora, custos diretos mapeados, motion de GTM declarada, unit economics estimados.

## Quando usar

- Quando `docs/business/business-model.md` está em alto nível e precisa virar plano.
- Antes da escolha de stack (custos influenciam stack).
- Antes do lançamento.

## Entradas esperadas

- `docs/business/business-model.md`
- `docs/business/monetization.md`
- `docs/product/target-users.md`
- `docs/product/mvp-scope.md`

## Processo passo a passo

1. Revisar fontes de receita existentes.
2. Definir estrutura de planos (Starter / Pro / Business ou equivalente).
3. Definir pricing com âncora.
4. Mapear custos diretos por receita.
5. Calcular unit economics estimados (CAC, LTV, payback).
6. Escolher motion de GTM.
7. Mapear canais e funil.
8. Listar experimentos de pricing.
9. Registrar em docs.
10. Sugerir ADR para a decisão "modelo principal de receita".

## Perguntas guia

1. Quem **paga** quanto, com que frequência?
2. Tem **plano gratuito**? Por quê?
3. Tem **trial**? Por quanto tempo?
4. Tem **comissão de marketplace**? Quanto?
5. **Quanto custa** atender 1 cliente por mês (infra, suporte, gateway)?
6. Qual é a **âncora de preço** (com o que o cliente vai comparar)?
7. Qual é o **motion principal de GTM** (self-service, inside, parceria)?
8. Quais **canais** vamos testar nos primeiros 90 dias?

## Documentos que cria ou atualiza

- `docs/business/business-model.md`
- `docs/business/monetization.md`
- `docs/business/pricing.md`
- `docs/business/go-to-market.md`
- `docs/business/risks.md`
- `docs/adr/NNNN-modelo-de-receita.md` (sugerir criar)

## Critérios de conclusão

- [ ] Estrutura de planos definida
- [ ] Pricing com âncora justificada
- [ ] Unit economics estimados (mesmo que com faixas amplas)
- [ ] Motion de GTM declarada
- [ ] Lista de experimentos de pricing planejados

## Restrições

- Não descontar para "fechar primeiro cliente" — define benchmark eterno.
- Não criar mais de 4 planos.
- Não estimar CAC com base em "achismo de marketing".
- Se LTV/CAC < 3 no cenário esperado, sinalizar como risco crítico.

## Exemplos de uso

- "Vamos definir os planos."
- "Quanto cobrar?"
- "Como vamos vender?"
