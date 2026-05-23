# Tests: discover-business

## Pré-condição
- `docs/product/product-vision.md` e `docs/product/problem-statement.md` preenchidos.

## Prompts canônicos
- "vamos pensar mercado e monetização"
- "concluí a fase 1, e agora?"
- "quero revisar o modelo de negócio"

## Comportamentos esperados
- [ ] Conduz Fase 2 (público/mercado) com no máximo 5 perguntas por bloco.
- [ ] Conduz Fase 3 (valor/monetização) após Fase 2 concluída.
- [ ] Preenche `target-users.md`, `market-analysis.md`, `competitors.md`, `value-proposition.md`, `monetization.md`, `business-model.md`.
- [ ] Registra ≥ 3 premissas em `docs/research/assumptions.md`.
- [ ] Registra ≥ 3 riscos em `docs/business/risks.md`.
- [ ] Sugere próxima skill `define-product`.

## Anti-padrões
- [ ] NÃO recomenda stack (isso é Fase 6).
- [ ] NÃO aceita "para todo mundo" como persona.
- [ ] NÃO aceita "não tem concorrente" (inércia é concorrente).
- [ ] NÃO endossa proposta de valor genérica.
