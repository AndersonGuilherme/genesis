# Tests: prelaunch-security-final-review

## Pré-condição
- Skills `sec-*` executadas (`docs/security/*` preenchido).
- Sistema buildado em staging com paridade de prod.

## Prompts canônicos
- "security final review"
- "checklist sec antes de lançar"
- "validar segurança pré-launch"

## Comportamentos esperados
- [ ] Revalida threat model (riscos altos mitigados).
- [ ] Confirma auth/authz/secrets/encryption/audit implementados.
- [ ] Endpoints públicos = lista documentada.
- [ ] Tenant filter em toda query (multi-tenant).
- [ ] TLS 1.2+ + HSTS ativo.
- [ ] Rate limit em endpoints públicos.
- [ ] Sanitizer ativo no logger.
- [ ] Vuln scan verde (sem CRITICAL/HIGH abertos).
- [ ] Produz `docs/launch/security-final-review.md` com go/no-go.

## Anti-padrões
- [ ] NÃO aceita "vamos lançar e arrumamos" pra bloqueante.
- [ ] NÃO ignora findings sem owner + status.
- [ ] NÃO marca "OK" sem evidência (PR, dashboard, output).
