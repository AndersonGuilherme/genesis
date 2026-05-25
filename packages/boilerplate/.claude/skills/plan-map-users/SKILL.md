---
name: plan-map-users
description: Use para detalhar personas, mapear papéis, decisores e definir matriz de permissões. Fornece base para auth-strategy e permissões dos módulos.
phase: planning
rules:
  - plan-security-by-design
  - plan-documentation-first
  - plan-three-options-or-tutorial
---

# Skill: plan-map-users

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/plan-security-by-design.md`
- `.claude/rules/plan-documentation-first.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Garantir que o produto tem clareza sobre:
- Quem **usa** (operador / consumidor)
- Quem **decide** (comprador)
- Quem **paga** (fonte da receita)
- Quem **influencia** (referência, conselho)
- Quais **papéis** cada persona assume no sistema
- Quais **permissões** cada papel terá

## Quando usar

- Após `discover-business` ter mapeado público em alto nível.
- Antes de `design-architecture`, para alimentar `auth-strategy`.
- Em projetos com múltiplos atores (escola, professor, aluno, responsável, etc.).

## Entradas esperadas

- `docs/product/target-users.md`
- `docs/product/user-journeys.md`
- `docs/product/mvp-scope.md`

## Processo passo a passo

1. Listar todas as pessoas envolvidas em uma decisão típica de compra e uso.
2. Para cada uma, perguntar:
   - É **usuário**, **comprador**, **decisor** ou **influenciador**?
   - Que **papel** ela terá no sistema (owner, admin, member, viewer, custom)?
   - Que **permissões** específicas precisa?
3. Construir **matriz de papéis vs. recursos**.
4. Identificar **conflitos de papel** (ex.: aluno menor + responsável paga).
5. Registrar em docs e abrir tópico de auth-strategy quando relevante.

## Perguntas guia

1. Quem **usa o sistema todo dia**?
2. Quem **decide a compra**?
3. Quem **assina o contrato e paga**?
4. Quem **influencia** sem aparecer no fluxo (advisor, esposo, contador)?
5. Quais **papéis** existem dentro do tenant?
6. Algum papel **administra outros** (hierarquia)?
7. Existe **caso de menor de idade**? (consentimento de responsável)
8. Algum papel pode ser **suspenso** ou **convidado externamente** (guest)?

## Documentos que cria ou atualiza

- `docs/product/target-users.md` (refinar)
- `docs/security/auth-strategy.md` (matriz de papéis inicial)
- `docs/specs/<modulo>/...` (permissões específicas por módulo)

## Critérios de conclusão

- [ ] Matriz de papéis × ações documentada
- [ ] Conflitos identificados (ex.: menor de idade)
- [ ] Casos de uso multi-tenant claros
- [ ] Permissões base definidas para o módulo `identity`

## Restrições

- Não inventar papel "só pra ter".
- Cada papel deve ter usuário real arquetípico no produto.
- Atenção a regulação (LGPD para menores).

## Exemplos de uso

- "Quem realmente paga, decide, usa?"
- "Quais permissões teremos?"
- "Como tratar o menor de idade?"
