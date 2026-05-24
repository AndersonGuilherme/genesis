# Tests: dev-refactor-to-clean-architecture

## Pré-condição
- Código existente viola Clean Architecture (dependência errada, lógica no controller, port no infra).
- Testes verdes ANTES da refatoração.

## Prompts canônicos
- "refatorar pra Clean Architecture"
- "mover lógica do controller pro use case"
- "inverter dependência do repository"

## Comportamentos esperados
- [ ] Testes rodam verdes ANTES e DEPOIS da refatoração (sem mudança de comportamento).
- [ ] Domain importa só de domain.
- [ ] Application importa só de domain (via ports).
- [ ] Infra implementa ports do domain.
- [ ] Sem framework em `domain/` ou `application/`.

## Anti-padrões
- [ ] NÃO refatora com testes vermelhos.
- [ ] NÃO muda comportamento na refatoração (mistura refactor + feature).
- [ ] NÃO deixa import circular.
