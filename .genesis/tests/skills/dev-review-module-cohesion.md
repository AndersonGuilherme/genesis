# Tests: dev-review-module-cohesion

## Pré-condição
- Módulo existe com estrutura `domain/application/infra/`.

## Prompts canônicos
- "review do módulo billing"
- "auditoria estrutural"
- "checar coesão"

## Comportamentos esperados
- [ ] Camadas respeitadas (domain/application/infra).
- [ ] Dependency direction OK (inversão via ports).
- [ ] Bounded context isolado (sem import cross-module direto).
- [ ] Use cases coesos (1 por arquivo, método único `execute`).
- [ ] README do módulo atualizado com entidades + use cases + eventos.
- [ ] Reporta findings sem refatorar (somente diagnóstico).

## Anti-padrões
- [ ] NÃO refatora durante o review (separado).
- [ ] NÃO aceita violação como "ok temporariamente" sem justificativa.
- [ ] NÃO ignora cross-import com `shared/`.
