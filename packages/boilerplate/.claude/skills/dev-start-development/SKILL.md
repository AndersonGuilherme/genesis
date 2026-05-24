---
name: dev-start-development
description: Use SOMENTE após review-readiness aprovar. Inicia o desenvolvimento de forma incremental, módulo por módulo, com TDD, commits frequentes e atualização contínua da documentação.
phase: development
rules:
  - plan-no-code-before-spec
  - plan-testing-strategy-required
  - plan-documentation-first
---

# Skill: dev-start-development

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/plan-no-code-before-spec.md`
- `.claude/rules/plan-testing-strategy-required.md`
- `.claude/rules/plan-documentation-first.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Iniciar o desenvolvimento **de fato** seguindo o plano de implementação do primeiro módulo, com TDD e atualização contínua dos documentos.

## Quando usar

- Após `review-readiness` retornar "aprovado".
- Para iniciar um novo módulo cuja spec já está pronta.
- Nunca antes de readiness.

## Entradas esperadas

- `.genesis/scripts/check-readiness.sh` retornando `0`
- `docs/specs/<modulo>/implementation-plan.md` preparado
- Stack instalada localmente (conforme `technology-decision.md`)

## Processo passo a passo

1. **Reconfirmar readiness** chamando `bash .genesis/scripts/check-readiness.sh` — abortar se != 0.
2. Confirmar com o usuário qual módulo será o primeiro.
3. Ler `docs/specs/<modulo>/implementation-plan.md`.
4. Para cada tarefa (T-01, T-02, ...):
   1. Reler a tarefa
   2. Escrever testes que falham (TDD)
   3. Implementar o mínimo para passar
   4. Validar com a suite local
   5. Rodar lint/format
   6. Commit pequeno e descritivo
   7. Atualizar documentação afetada (spec, ADR, módulo)
5. Após N tarefas (definir cadência), abrir PR.
6. Atualizar `docs/PROJECT_STATE.md`.

## Princípios durante desenvolvimento

- **Disciplina TDD** quando possível. Teste antes do código.
- **Commits pequenos** com mensagem convencional.
- **Não improvisar fora do plano.** Se algo do plano estiver errado, **voltar** e atualizar plano + spec antes de prosseguir.
- **Sem feature creep.** Pediu A, faça A. B vai em outra tarefa.
- **Atualizar docs** ao introduzir decisão nova (ADR), tabela nova (data-strategy), evento novo (events.md).

## Perguntas guia (a cada tarefa)

1. O teste falha como esperado antes da implementação?
2. A implementação cobre apenas o critério de aceite atual?
3. Há novo dado pessoal sendo coletado? (atualizar data-privacy)
4. Há nova integração externa? (atualizar integration-map)
5. Há novo evento? (atualizar events.md)
6. A documentação reflete a verdade do código?

## Critérios de cada tarefa concluída

- [ ] Todos os testes da tarefa passam
- [ ] Lint/format ok
- [ ] Documentação atualizada
- [ ] Commit feito com mensagem convencional
- [ ] PROJECT_STATE atualizado quando a tarefa entrega valor visível

## Quando voltar atrás

- Se durante a implementação surgir decisão que muda a arquitetura, **pare** e abra ADR.
- Se um critério de aceite era ambíguo, **pare** e atualize spec.
- Se uma integração se mostrar inviável, **pare** e revise plano.

Pequenas pausas para registrar evitam grandes pausas para refatorar.

## Restrições

- Não começar sem readiness aprovado.
- Não escrever código de feature sem teste correspondente.
- Não fazer commit gigante.
- Não pular atualização de docs.

## Exemplos de uso

- "Vamos começar a implementar o identity."
- "Bora codar."
- "Start develop."
