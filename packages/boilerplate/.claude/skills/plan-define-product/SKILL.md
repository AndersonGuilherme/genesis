---
name: plan-define-product
description: Use após discover-business. Conduz Fase 4 — visão de produto detalhada, MVP, jornadas, roadmap inicial. Termina com docs/product/* completos.
phase: planning
rules:
  - plan-avoid-overengineering
  - plan-business-before-technology
  - plan-three-options-or-tutorial
---

# Skill: plan-define-product

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/plan-avoid-overengineering.md`
- `.claude/rules/plan-business-before-technology.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Traduzir o entendimento de negócio em decisões concretas de produto: o que entra no MVP, o que fica de fora, quais jornadas críticas, qual o roadmap em horizontes.

## Quando usar

- Após `discover-business` concluir.
- Para revisar escopo de MVP em projeto existente.
- Quando o usuário quer pensar funcionalidades específicas.

## Entradas esperadas

- `docs/product/product-vision.md`
- `docs/product/problem-statement.md`
- `docs/product/target-users.md`
- `docs/product/value-proposition.md`
- `docs/business/business-model.md`

## Processo passo a passo

1. Ler entradas.
2. Conduzir perguntas em blocos de 3–5.
3. Documentar progressivamente.
4. Quando alguma funcionalidade tiver risco alto ou complexidade alta, **pedir justificativa** para entrar no MVP.
5. Recomendar cortar agressivamente — MVP é decisão dolorosa.
6. Atualizar PROJECT_STATE.
7. Sugerir próxima skill: `validate-idea` (se hipóteses precisarem de teste) ou `plan-modules` (se já validado).

## Perguntas — Fase 4 (produto)

1. Quais são os **principais fluxos do usuário**?
2. Qual é o **MVP mínimo**? (regra: corte até doer)
3. O que **não deve entrar** no MVP?
4. Quais funcionalidades são **críticas**?
5. Quais funcionalidades são **desejáveis**?
6. Quais funcionalidades são **perigosas ou prematuras**?
7. Quais **personas** devem ser atendidas primeiro?

## Documentos que cria ou atualiza

- `docs/product/user-journeys.md` (jornadas detalhadas por persona)
- `docs/product/mvp-scope.md` (IN, OUT, critérios de "pronto")
- `docs/product/roadmap.md` (now/next/later)
- `docs/research/open-questions.md` (perguntas que apareceram)
- `docs/PROJECT_STATE.md`

## Critérios de conclusão

- [ ] Pelo menos 2 jornadas críticas mapeadas
- [ ] MVP IN/OUT explícito e justificado
- [ ] Anti-MVP listado (o que **não** entra mesmo se gostarmos)
- [ ] Critério de sucesso e fracasso do MVP definido
- [ ] Roadmap nos 3 horizontes (Now/Next/Later)

## Restrições

- Não definir tecnologia.
- Pressionar para cortar MVP — se entrou mais que 5 features, pedir 1 a sair.
- Se o usuário disser "tudo é crítico", recusar e exigir priorização.
- Toda feature IN precisa apontar para uma persona e uma dor mapeada.

## Exemplos de uso

- "Vamos definir o MVP."
- "Quais funcionalidades vão entrar primeiro?"
- "Preciso planejar a jornada do aluno."

## Saída esperada

MVP claro, jornadas mapeadas, roadmap em horizontes, próxima skill indicada.
