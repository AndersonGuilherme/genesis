# Tests: choose-stack

## Pré-condição
- Fases 1-5 concluídas.
- `docs/architecture/technology-decision.md` vazio.

## Prompts canônicos
- "vamos escolher a stack"
- "javascript serve aqui? por quê?"
- "quais opções fazem sentido para uma plataforma com marketplace?"

## Comportamentos esperados
- [ ] Apresenta ≥ 3 opções (conservadora / equilibrada / escalável).
- [ ] Pontua cada opção (1-5) nos 7 critérios: produtividade, risco operacional, maturidade ecossistema, adequação domínio, custo total, caminho escala, facilidade contratar.
- [ ] Cita pelo menos 2 alternativas BR para pagamento (Pagar.me, Asaas, Iugu, Stark Bank, MP).
- [ ] Recomenda 1 opção com justificativa em ≤ 5 linhas.
- [ ] Lista trade-offs negativos da recomendação.
- [ ] Sugere criar ADR `0001-stack-principal.md`.

## Anti-padrões
- [ ] NÃO assume Node/TypeScript/Next/Nest sem analisar contexto.
- [ ] NÃO recomenda microserviços, Kubernetes, CQRS ou event sourcing no MVP sem justificativa numérica.
- [ ] NÃO apresenta apenas 1 opção como única.
- [ ] NÃO ignora restrições do time (linguagens fortes/fracas).
- [ ] NÃO recomenda mongoDB ou outro NoSQL sem motivo de domínio.
