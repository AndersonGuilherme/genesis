---
name: plan-init-project
description: Use ao iniciar um novo projeto. Orquestra as 10 fases (identidade → mercado → valor → produto → domínio → tecnologia → arquitetura → specs → readiness → implementação) sem permitir pulos. É o ponto de entrada de tudo.
phase: planning
rules:
  - plan-documentation-first
  - plan-business-before-technology
  - plan-three-options-or-tutorial
---

# Skill: plan-init-project

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/plan-documentation-first.md`
- `.claude/rules/plan-business-before-technology.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Conduzir o usuário pelas 10 fases do `project-genesis-boilerplate`, garantindo que cada fase termine com documentos preenchidos antes da próxima começar. **Esta skill nunca escreve código de aplicação.** Ela orquestra outras skills.

## Quando usar

- Quando o usuário diz "vamos iniciar o projeto", "começar um projeto novo", "start project".
- Quando `docs/PROJECT_STATE.md` indica fase 1 não concluída.
- Quando o usuário tenta pular para implementação sem readiness aprovado — use esta skill para redirecionar à fase pendente.

## Entradas esperadas

- Repositório criado a partir do `project-genesis-boilerplate`.
- `docs/PROJECT_STATE.md` presente.
- Acesso de escrita em `docs/`, `.claude/`, `.genesis/templates/`.

## Processo passo a passo

1. **Ler `docs/PROJECT_STATE.md`** e identificar a fase atual.
2. Se for fase 1, executar a sequência abaixo. Senão, chamar a skill da fase correspondente e parar.
3. Apresentar ao usuário a fase atual e o que ela exige.
4. Conduzir as perguntas dessa fase **em blocos pequenos** (3–5 perguntas por vez).
5. Registrar as respostas nos arquivos corretos.
6. Atualizar `docs/PROJECT_STATE.md` marcando avanço.
7. Sugerir explicitamente a próxima skill a rodar.

## As 10 fases e suas skills

| Fase | Tema | Skill responsável |
|------|------|---------------------|
| 1 | Identidade do projeto | `init-project` (esta) |
| 2 | Público e mercado | `discover-business` |
| 3 | Valor e monetização | `design-business-model` |
| 4 | Produto e MVP | `define-product` |
| 5 | Domínio e regras | `plan-modules` |
| 6 | Tecnologia | `choose-stack` |
| 7 | Arquitetura | `design-architecture` |
| 8 | Specs | `define-module-spec` |
| 9 | Readiness review | `review-readiness` |
| 10 | Implementação | `start-development` |

## Perguntas da Fase 1 (identidade do projeto)

Faça em ordem. Aprofunde só quando a anterior estiver respondida.

1. Qual é o **nome** do projeto?
2. Como você descreveria o projeto em **uma frase**?
3. Qual **problema** ele resolve?
4. Por que esse problema **importa**?
5. Quem **sofre** com esse problema hoje?
6. O projeto é **B2B, B2C, B2B2C, marketplace, SaaS, comunidade, ferramenta interna** ou outro?
7. Qual é o **estágio atual da ideia** (apenas hipótese, com piloto, com clientes pagantes, etc.)?

## Documentos que cria ou atualiza

- `docs/product/product-vision.md` (preencher tagline + visão + missão + north star inicial)
- `docs/product/problem-statement.md` (problema + quem sofre + evidências iniciais)
- `docs/PROJECT_STATE.md` (marcar Fase 1 concluída)

## Critérios de conclusão da Fase 1

- [ ] `product-vision.md` tem visão, missão e north star
- [ ] `problem-statement.md` tem problema em 1 frase + quem sofre + ao menos 1 evidência
- [ ] PROJECT_STATE atualizado
- [ ] Próxima skill (`discover-business`) sugerida ao usuário

## Restrições

- Não pular fases sob nenhum pretexto.
- Não fazer mais de 5 perguntas por vez.
- Não assumir stack, modelo de negócio ou domínio.
- Se o usuário responder superficialmente, repetir a pergunta pedindo profundidade.
- Se o usuário pedir para "ir direto ao código", redirecionar à fase pendente com explicação do porquê.

## Exemplos de uso

- "Vamos iniciar o projeto."
- "Quero criar uma plataforma de gestão escolar — por onde começo?"
- "Cloná este boilerplate, e agora?"
- "Pode pular para a parte técnica?" → redireciona à fase pendente.

## Saída esperada ao final de cada bloco

> ✅ Fase X concluída.
> Documentos atualizados: \<lista\>.
> Próximo passo: rodar a skill `\<próxima-skill\>`.
