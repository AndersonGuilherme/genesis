# Tests: define-product

## Pré-condição
- Docs de product/ e business/ preenchidos pelo menos parcialmente após `discover-business`.

## Prompts canônicos
- "vamos definir o MVP"
- "quais funcionalidades vão entrar primeiro?"
- "preciso planejar a jornada do aluno"

## Comportamentos esperados
- [ ] Lê `target-users.md`, `value-proposition.md`, `problem-statement.md`.
- [ ] Mapeia ≥ 2 jornadas críticas em `user-journeys.md`.
- [ ] Preenche `mvp-scope.md` com IN/OUT, anti-MVP, critério de sucesso e fracasso.
- [ ] Cria `roadmap.md` em horizontes Now/Next/Later.
- [ ] Sugere `validate-idea` (se premissas críticas pendentes) ou `plan-modules`.

## Anti-padrões
- [ ] NÃO define tecnologia.
- [ ] NÃO aceita "tudo é crítico".
- [ ] NÃO permite mais de ~5 features IN sem corte forçado.
- [ ] NÃO escreve feature sem persona + dor associada.
