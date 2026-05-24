# Tests: create-adr

## Pré-condição
- Decisão importante em discussão (stack, padrão arquitetural, escolha de fornecedor crítico).

## Prompts canônicos
- "vamos registrar a decisão sobre Postgres"
- "cria ADR para a escolha de Stripe vs. Pagar.me"
- "documenta que não vamos usar microserviços agora"

## Comportamentos esperados
- [ ] Confirma com usuário que a decisão merece ADR.
- [ ] Determina próximo número (lendo `docs/adr/` e somando 1).
- [ ] Cria `docs/adr/NNNN-titulo-kebab.md` usando template.
- [ ] Lista ≥ 2 alternativas reais com motivo de rejeição.
- [ ] Lista consequências negativas honestamente.
- [ ] Inclui campo "Como reverter" e "Validação em 3-6 meses".
- [ ] Atualiza índice em `docs/adr/README.md`.

## Anti-padrões
- [ ] NÃO cria ADR sem alternativas (vira hábito, não decisão).
- [ ] NÃO cria ADR sem consequências negativas listadas.
- [ ] NÃO edita ADR antigo — cria novo com `supersedes`.
- [ ] NÃO usa ADR para decisão pequena/reversível.
