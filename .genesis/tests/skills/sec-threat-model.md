# Tests: sec-threat-model

## Pré-condição
- `docs/architecture/architecture-overview.md`, `system-context.md`, `integration-map.md` preenchidos.

## Prompts canônicos
- "vamos modelar ameaças"
- "rode threat model do MVP"
- "STRIDE em cima da arquitetura"

## Comportamentos esperados
- [ ] Lê arquitetura + componentes + fluxos.
- [ ] Aplica STRIDE em cada componente / fluxo.
- [ ] Prob × impacto = risco priorizado.
- [ ] Mitigações concretas com link a rule `sec-*` correspondente.
- [ ] Produz `docs/security/threat-model.md` estruturado.
- [ ] Sugere próxima skill `sec-define-auth-strategy`.

## Anti-padrões
- [ ] NÃO pula categorias do STRIDE sem justificar.
- [ ] NÃO aceita "trust internal network" sem boundary.
- [ ] NÃO inventa ameaça sem componente real.
