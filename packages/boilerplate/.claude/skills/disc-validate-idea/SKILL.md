---
name: disc-validate-idea
description: Use quando há premissas centrais não-validadas com impacto alto/fatal. Conduz hipóteses, experimentos, entrevistas e métricas de validação antes de gastar tempo construindo.
phase: discovery
rules:
  - plan-documentation-first
  - plan-explain-tradeoffs
---

# Skill: disc-validate-idea

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/plan-documentation-first.md`
- `.claude/rules/plan-explain-tradeoffs.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Forçar validação das premissas mais arriscadas com método. Pergunta, propõe experimento, define critério de sucesso e ajuda a interpretar resultado.

## Quando usar

- Quando `docs/research/assumptions.md` tem premissas com confiança 1–2 e impacto alto/fatal.
- Antes de uma decisão de escopo grande baseada em achismo.
- Antes de gastar > 4 semanas em qualquer construção.

## Entradas esperadas

- `docs/research/assumptions.md`
- `docs/product/problem-statement.md`
- `docs/product/target-users.md`

## Processo passo a passo

1. Listar premissas críticas pendentes.
2. Para cada uma, perguntar:
   - O que provaria que essa premissa é verdadeira?
   - O que provaria que é falsa?
   - Qual o experimento mais barato que dá essa resposta?
3. Propor formato (entrevista, smoke test, piloto, dado).
4. Definir tamanho da amostra e critério antes de rodar.
5. Registrar em `docs/research/validation-plan.md`.
6. Após resultado, atualizar `assumptions.md` com nova confiança.
7. Se resultado refutar premissa fatal, abrir revisão de fase com o usuário.

## Perguntas guia

1. Qual hipótese, **se errada**, mata o projeto?
2. Quais sinais te fariam **mudar de ideia** sobre o público-alvo?
3. Você já conversou com **quantos** usuários reais? Quem?
4. Tem prova de **willingness to pay** ou é intenção declarada?
5. Existe **comportamento observado** (não apenas declarado) sustentando a premissa?

## Tipos de experimento

- **Entrevista qualitativa** — para entender problema.
- **Smoke test (landing page)** — para medir intent de compra.
- **Concierge MVP** — atendimento manual para entender entrega.
- **Wizard of Oz** — fluxo aparente automatizado, manual nos bastidores.
- **Piloto pago** — produto inicial com cliente real pagando.
- **A/B test** — quando já há tráfego suficiente.

## Documentos que cria ou atualiza

- `docs/research/assumptions.md` (atualizar confiança)
- `docs/research/validation-plan.md` (adicionar experimentos)
- `docs/validation/idea-validation.md` (checklist)
- `docs/validation/user-interviews.md` (registros)
- `docs/validation/success-metrics.md` (métricas usadas)

## Critérios de conclusão

- [ ] Premissas fatais com plano de validação ativo
- [ ] Pelo menos 1 experimento concluído
- [ ] Atualização de confiança nas premissas
- [ ] Decisões impactadas registradas (ADR quando aplicável)

## Restrições

- Não aceitar "minha família achou legal" como validação.
- Critério de sucesso é definido **antes** do experimento, não depois.
- Não pular esta skill para premissas com impacto alto/fatal e confiança baixa.

## Exemplos de uso

- "Como sei se essa ideia tem demanda?"
- "Quero validar willingness to pay."
- "Não sei se o público-alvo é esse mesmo."
