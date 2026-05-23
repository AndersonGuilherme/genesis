# dev-write-failing-test-first

## O que faz

Helper — gera APENAS o arquivo de teste falhando, sem código de produção. Garante que o RED do TDD foi de fato comprovado.

## Quando você invoca

- Como parte de `dev-define-use-case` ou `dev-design-entity`.
- Quando você (ou outra IA) pulou o RED e quer corrigir.

## O que a IA faz

1. Cria `<name>.spec.<ext>` com 1-2 testes ativos.
2. Roda o teste e confirma FAIL com mensagem clara ("class not defined" tipicamente).
3. NÃO cria arquivo de implementação.

## O que VOCÊ faz

- Aponta a unit (use case, entity, VO) e descrição esperada.
- Confirma que a falha é genuína (não erro de import).

## Rules invocadas

- [dev-tdd-pragmatic](../../../.claude/rules/dev-tdd-pragmatic.md)

## Próximo passo natural

Implementar o código mínimo pra passar (parte do ciclo TDD em `dev-define-use-case`).
