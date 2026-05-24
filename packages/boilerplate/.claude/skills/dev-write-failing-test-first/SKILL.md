---
name: dev-write-failing-test-first
description: Helper — dado um use case, entity ou VO planejado, gera o arquivo de teste failing antes de qualquer código de produção. Garante RED comprovado.
phase: development
rules:
  - dev-tdd-pragmatic
---

# Skill: dev-write-failing-test-first

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-tdd-pragmatic.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Gerar o arquivo de teste failing para 1 unit (use case, entity, VO) antes que código de produção exista. Saída: arquivo `<name>.spec.<ext>` que falha por "<class/function> not defined".

## Quando usar

- Como parte do ciclo TDD em `dev-define-use-case` ou `dev-design-entity`.
- Quando o desenvolvedor pular RED e quiser corrigir.

## Pré-condições

- Spec da unit (input, output, comportamento esperado, casos de erro) clara.
- Localização do arquivo de teste definida.

## Processo

1. Ler descrição da unit (caminho feliz + casos de erro).
2. Determinar nome de classe/função a testar e arquivo onde vai morar.
3. Gerar arquivo `<name>.spec.<ext>` com:
   - `describe('<Name>', ...)`.
   - Pelo menos 1 `it` de caminho feliz: arrange + act + assert.
   - Pelo menos 1 `it` de erro/borda.
4. Rodar teste e confirmar FAIL — capturar mensagem.
5. Se passar (não devia), revisar — provavelmente import errado ou impl já existe.
6. NÃO criar arquivo de implementação.

## Restrições

- Sem implementação stub no arquivo de teste só pra fazer compilar — manter falha genuína.
- Sem `xit`, `it.skip` — testes ativos.
- Não escrever 5 testes de uma vez — comece com 1 ou 2, expanda no ciclo.

## Exemplos de uso

- "Gera o teste failing pro use case register-student."
- "Teste failing pra entity Student."

## Critérios de conclusão

- [ ] Arquivo `<name>.spec.<ext>` criado.
- [ ] Rodando o teste → FAIL com mensagem indicando classe/função não existe.
- [ ] Nenhum arquivo de implementação foi criado nesta etapa.
