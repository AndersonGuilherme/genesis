---
name: dev-design-entity
description: Use para modelar uma entidade de domínio com invariantes validados, métodos de linguagem ubíqua e teste. Sem framework. Aplica DDD + TDD pragmático.
phase: development
rules:
  - dev-ddd-bounded-context
  - dev-tdd-pragmatic
  - dev-clean-code
  - dev-solid
---

# Skill: dev-design-entity

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-ddd-bounded-context.md`
- `.claude/rules/dev-tdd-pragmatic.md`
- `.claude/rules/dev-clean-code.md`
- `.claude/rules/dev-solid.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Modelar 1 entity (ou VO) do domínio: atributos, invariantes, métodos. Com teste. Sem framework.

## Quando usar

- Após `dev-scaffold-module` ou quando spec do módulo evoluir com nova entity.
- Antes de implementar use cases que dependem dela.

## Pré-condições

- Spec do módulo lista a entity com atributos, invariantes e métodos.
- Pasta `domain/entities/` existe.

## Processo

1. **Decidir entity vs VO**:
   - Tem identidade própria que sobrevive a mudanças? → Entity.
   - É definida pelo valor, imutável? → VO.
2. **Aplicar template apropriado**:
   - Entity: `.genesis/templates/entity-template.md`.
   - VO: `.genesis/templates/value-object-template.md`.
3. **Escrever teste failing** (TDD):
   - Construção válida.
   - Rejeição de cada invariante violado.
   - Métodos de domínio (1 teste por método).
4. **Implementar entity/VO**:
   - Construtor privado + factory `create()` para validação centralizada.
   - Métodos com nomes da linguagem ubíqua (não `setX`, `updateData`).
   - Invariantes validados no construtor/factory.
5. **Aplicar `dev-clean-code`**: nomes, função pequena, sem comentário óbvio.
6. **Verificar `dev-ddd-bounded-context`**: entity não importa de outro módulo.
7. **Commit**: 1 commit por entity (teste + código).

## Restrições

- Sem decorator de framework (`@Entity`, etc.) na classe — domain é puro.
- Sem setter público que viole invariante.
- Sem método anêmico tipo `getData()` — entity tem comportamento.
- Não criar entity que outro módulo importa (rule `dev-ddd-bounded-context`).

## Exemplos de uso

- "Design da entity Student."
- "Modelar VO Email."
- "Criar entity Course com invariante de capacidade máxima."

## Critérios de conclusão

- [ ] Teste cobre construção válida + cada invariante.
- [ ] Construtor valida; tentativa de criação inválida throw error de domínio.
- [ ] Métodos usam linguagem ubíqua do módulo.
- [ ] Sem import de framework.
- [ ] Commit com teste + entity juntos.
