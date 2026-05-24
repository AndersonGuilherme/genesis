# Tests: dev-define-use-case-with-pii

## Pré-condição
- Mesmas de `dev-define-use-case`.
- `docs/security/lgpd/data-inventory.md` lista a operação com finalidade + base legal.
- `docs/security/lgpd/consent-strategy.md` (se base legal = consent).
- `docs/security/lgpd/retention-policy.md` cobre a categoria.

## Prompts canônicos
- "use case com PII"
- "TDD pra register-student (coleta dado pessoal)"
- "implementar com LGPD"

## Comportamentos esperados
- [ ] Carrega rules lgpd-* + sec-* declaradas.
- [ ] Input contém só campos justificados em data-inventory (minimização).
- [ ] Validação de schema na boundary.
- [ ] Consent verificado quando base legal = consent.
- [ ] Purpose explícito + validado contra inventory.
- [ ] Encryption a nível de aplicação pra sensível.
- [ ] Audit log emitido (happy path + erro validação/consent).
- [ ] Testes: campo extra → ValidationError, consent ausente → ConsentMissingError, audit emitido, encryption persiste cifrado.

## Anti-padrões
- [ ] NÃO coleta campo "por garantia".
- [ ] NÃO reusa PII pra finalidade não declarada.
- [ ] NÃO loga PII em claro.
- [ ] NÃO faz hard delete de audit log próprio.
