---
name: create-implementation-plan
description: Use para transformar uma spec de módulo em plano de implementação incremental, com tarefas pequenas, testáveis e ordenadas. Habilita TDD e commits frequentes.
---

# Skill: create-implementation-plan

## Objetivo

Transformar `docs/specs/<modulo>/` em sequência de tarefas pequenas que um desenvolvedor (humano ou agente) consegue executar com confiança e feedback rápido.

## Quando usar

- Após `define-module-spec` concluir spec do módulo.
- Antes de `start-development` para esse módulo.
- Para revisão de plano quando o módulo mudar significativamente.

## Entradas esperadas

- `docs/specs/<modulo>/` completo
- `docs/testing/testing-strategy.md`
- `docs/architecture/architecture-overview.md`

## Processo passo a passo

1. Ler todos os arquivos da spec.
2. Listar **tarefas verticais** (cada uma entrega valor mínimo testável end-to-end).
3. Ordenar tarefas para destravar o caminho feliz primeiro, depois edge cases.
4. Cada tarefa deve ter:
   - Objetivo em 1 frase
   - Arquivos esperados (criar / modificar)
   - Testes esperados (lista, com Given/When/Then quando aplicável)
   - Esforço estimado em faixa (XS/S/M/L/XL)
   - Dependências de outras tarefas
   - Critério de "pronto"
5. Quebrar tarefas > L em sub-tarefas.
6. Identificar **riscos** por tarefa (integração externa, performance, dado novo).
7. Salvar em `docs/specs/<modulo>/implementation-plan.md`.
8. Sugerir commits convencionais por tarefa.

## Princípios do plano

- **TDD quando possível.** Teste primeiro, código depois.
- **Commit pequeno.** Cada tarefa = 1 ou poucos commits.
- **Verticais, não horizontais.** Evite "fazer todo o banco primeiro, depois toda API, depois toda UI".
- **Caminho feliz primeiro.** Edge cases por último.
- **Cada tarefa é independente** o suficiente para revisão isolada.

## Estrutura recomendada do plano

```
# Plano de implementação — <modulo>

## Pré-requisitos
- Spec aprovada: docs/specs/<modulo>/
- ADRs vinculados: ...
- Dependências: módulo Y precisa existir

## Tarefas

### T-01 — <título curto>
- Objetivo: ...
- Arquivos:
  - Criar: ...
  - Modificar: ...
- Testes:
  - cenário 1 (Given/When/Then)
  - cenário 2
- Esforço: S
- Dependências: nenhuma
- Critério de pronto: ...
- Commit sugerido: `feat(<modulo>): ...`

### T-02 — ...
...
```

## Documentos que cria

- `docs/specs/<modulo>/implementation-plan.md`
- Atualização leve em `docs/PROJECT_STATE.md`

## Critérios de conclusão

- [ ] Plano cobre toda a spec
- [ ] Cada tarefa é XS–M (ou quebrada)
- [ ] Cada tarefa tem testes esperados
- [ ] Ordem destrava caminho feliz cedo
- [ ] Riscos por tarefa identificados

## Restrições

- Não pular testes para "ganhar velocidade".
- Não criar tarefa "fazer o módulo X" sem decomposição.
- Não escrever plano que ignora algum critério da spec.
- Não começar implementação até este plano estar aprovado.

## Exemplos de uso

- "Quebra a spec do billing em tarefas."
- "Plano de implementação para o módulo identity."
- "Vamos transformar essa spec em sequência de PRs."
