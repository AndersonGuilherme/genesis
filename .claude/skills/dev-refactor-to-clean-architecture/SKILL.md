---
name: dev-refactor-to-clean-architecture
description: Use quando código existente viola Clean Architecture (dependência errada, lógica no controller, port no infra). Refatora preservando comportamento (testes verdes antes e depois).
phase: development
rules:
  - dev-clean-architecture-layers
  - dev-dependency-direction
  - dev-solid
  - dev-tdd-pragmatic
---

# Skill: dev-refactor-to-clean-architecture

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-clean-architecture-layers.md`
- `.claude/rules/dev-dependency-direction.md`
- `.claude/rules/dev-solid.md`
- `.claude/rules/dev-tdd-pragmatic.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Refatorar código existente que viola Clean Architecture sem mudar comportamento observável. Testes verdes antes → verdes depois.

## Quando usar

- Code review apontou violação de layer/direção.
- Onboarding em módulo legado.
- Antes de adicionar feature em módulo bagunçado (limpar o caminho).

## Pré-condições

- Suite de teste cobre comportamento atual (se não, escrever teste de caracterização primeiro).
- Suite passa antes de começar refactor.

## Processo

1. **Capturar estado verde**: rodar testes, confirmar PASS, anotar.
2. **Mapear violações**:
   - Lógica de negócio dentro de controller? Extrair pra use case.
   - Use case importando ORM? Inverter via port no domain.
   - Entity com decorator de framework? Separar mapeamento DTO/entity na infra.
   - Service class god? Quebrar em use cases por operação.
3. **Refatorar incrementalmente**:
   - 1 violação por vez.
   - Após cada extração: rodar testes, confirmar VERDE.
   - Commit pequeno.
4. **Atualizar testes** se interface mudou (mas comportamento não).
5. **Atualizar README do módulo** se estrutura mudou.

## Restrições

- Nunca refatorar sem cobertura de teste do trecho afetado.
- Não introduzir feature nova durante refactor (manter o objetivo limpo).
- Não fazer "big bang refactor" — incremental.

## Exemplos de uso

- "Refatorar módulo student que está com lógica no controller."
- "Mover regra de negócio do billing.service pra use cases."

## Critérios de conclusão

- [ ] Testes verdes antes E depois.
- [ ] Cada commit isolado e revertível.
- [ ] Estrutura final respeita 3 camadas + dependency direction.
- [ ] README do módulo atualizado se aplicável.
