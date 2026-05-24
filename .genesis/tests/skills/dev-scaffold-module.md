# Tests: dev-scaffold-module

## Pré-condição
- `docs/specs/<modulo>/` aprovada (output de `plan-define-module-spec`).
- Stack escolhida.

## Prompts canônicos
- "scaffold módulo billing"
- "criar estrutura do módulo"
- "começar implementação"

## Comportamentos esperados
- [ ] Cria pasta `src/<module>/` com subdirs `domain/`, `application/use-cases/`, `infra/repositories/`, `infra/controllers/`.
- [ ] Cria `README.md` do módulo com nome do bounded context + glossário local + entidades + use cases + eventos.
- [ ] Aplica Clean Architecture 3-layer (cross-link `dev-clean-architecture-layers`).
- [ ] Aplica DDD bounded context (cross-link `dev-ddd-bounded-context`).
- [ ] Naming kebab-case singular em inglês (cross-link `dev-module-naming`).

## Anti-padrões
- [ ] NÃO importa cross-bounded-context direto (só via events/DTOs públicos).
- [ ] NÃO coloca framework em `domain/`.
- [ ] NÃO cria arquivo "shared" sem documentar.
