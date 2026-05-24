# sec-threat-model

## O que faz
Aplica STRIDE à arquitetura do MVP. Produz `docs/security/threat-model.md` com ameaças, risco e mitigação por componente.

## Quando você invoca
Após `plan-design-architecture`, antes de `sec-define-auth-strategy`.

## O que a IA faz
1. Mapeia componentes + trust boundaries + fluxos.
2. STRIDE em cada componente/fluxo.
3. Probabilidade × impacto = risco.
4. Mitigação por risco médio/alto + rule sec-* ligada.

## Rules invocadas
- [sec-authn-required](../../../.claude/rules/sec-authn-required.md)
- [sec-authz-enforced](../../../.claude/rules/sec-authz-enforced.md)
- [sec-encryption-in-transit](../../../.claude/rules/sec-encryption-in-transit.md)
- [sec-encryption-at-rest](../../../.claude/rules/sec-encryption-at-rest.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)
- [sec-rate-limit-public-api](../../../.claude/rules/sec-rate-limit-public-api.md)

## Próximo passo natural
`sec-define-auth-strategy`.
