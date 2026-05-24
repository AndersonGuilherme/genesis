---
name: dev-define-use-case
description: Use para implementar 1 use case completo com TDD pragmático — escreve teste failing, implementa mínimo, valida. Roda 1 use case por vez.
phase: development
rules:
  - dev-tdd-pragmatic
  - dev-use-case-per-file
  - dev-clean-architecture-layers
  - dev-solid
---

# Skill: dev-define-use-case

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-tdd-pragmatic.md`
- `.claude/rules/dev-use-case-per-file.md`
- `.claude/rules/dev-clean-architecture-layers.md`
- `.claude/rules/dev-solid.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Implementar 1 use case da spec aplicando TDD. Cada chamada da skill cobre 1 use case.

## Quando usar

- Após `dev-scaffold-module` criar o esqueleto.
- Para cada use case da spec, individualmente.

## Pré-condições

- Esqueleto do módulo existe.
- Use case definido na spec com input, output, regra, AC.
- Stack instalada localmente.

## Processo (TDD ciclo curto)

1. **Ler a spec do use case**: input, output, ports usados, regra de negócio, AC.
2. **Aplicar template** `.genesis/templates/use-case-template.md` mentalmente.
3. **RED — escrever teste failing**:
   - Criar `application/use-cases/<verb-noun>.use-case.spec.<ext>`.
   - 1 teste do caminho feliz primeiro: arrange (mocka ports), act (execute(input)), assert (output esperado).
   - Rodar teste, confirmar FAIL com mensagem clara.
4. **GREEN — implementação mínima**:
   - Criar/atualizar `application/use-cases/<verb-noun>.use-case.<ext>` com classe + método `execute`.
   - Mínimo necessário pra passar o teste (sem antecipar features).
   - Rodar teste, confirmar PASS.
5. **REFACTOR**:
   - Eliminar duplicação.
   - Aplicar `dev-clean-code` (nomes, função pequena).
   - Aplicar `dev-solid` (SRP, DIP).
   - Re-rodar teste, deve continuar PASS.
6. **Cobrir erros**:
   - Para cada erro do AC (validação, regra violada, entity ausente), escrever teste failing → implementar → passar.
7. **Commit**: 1 commit por use case completo (teste + impl).

## Restrições

- Não implementar 2+ use cases na mesma chamada da skill.
- Não pular RED (escrever impl antes do teste).
- Não usar mock de colaborador interno (só ports).
- Use case não tem 2 métodos públicos (apenas `execute`).

## Exemplos de uso

- "Implementar use case register-student."
- "Faça o use case enroll-in-course com TDD."

## Critérios de conclusão

- [ ] Teste falha sem implementação (RED comprovado).
- [ ] Teste passa com implementação mínima.
- [ ] Pelo menos 1 teste de caminho feliz + 1 de erro/borda por use case.
- [ ] Mocks apenas em ports.
- [ ] Commit com teste + impl juntos.
