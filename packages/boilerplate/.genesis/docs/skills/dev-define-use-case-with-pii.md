# dev-define-use-case-with-pii

## O que faz
Variante de `dev-define-use-case` pra use cases que tocam PII. Carrega rules lgpd-* + sec-* relevantes. Aplica TDD + minimização + consent + encryption + audit.

## Quando você invoca
Use case que cria/atualiza/lê PII de outro user, compartilha PII com externo, ou aplica decisão baseada em PII.

## O que a IA faz
1. Lê entry no data-inventory (finalidade, base legal, retenção, sensibilidade).
2. Valida minimização do input.
3. TDD base de `dev-define-use-case` (RED → GREEN → REFACTOR).
4. **Adições**: validação de schema, verificação de consent, purpose explícito, encryption a nível de aplicação pra sensível, audit log.
5. Testes adicionais: campo não autorizado, consent ausente, audit emitido, encryption persiste cifrado.

## Rules invocadas
- [dev-tdd-pragmatic](../../../.claude/rules/dev-tdd-pragmatic.md)
- [dev-use-case-per-file](../../../.claude/rules/dev-use-case-per-file.md)
- [dev-clean-architecture-layers](../../../.claude/rules/dev-clean-architecture-layers.md)
- [dev-solid](../../../.claude/rules/dev-solid.md)
- [lgpd-data-minimization](../../../.claude/rules/lgpd-data-minimization.md)
- [lgpd-explicit-consent](../../../.claude/rules/lgpd-explicit-consent.md)
- [lgpd-purpose-limitation](../../../.claude/rules/lgpd-purpose-limitation.md)
- [lgpd-pii-encrypted](../../../.claude/rules/lgpd-pii-encrypted.md)
- [lgpd-retention-limit](../../../.claude/rules/lgpd-retention-limit.md)
- [sec-encryption-at-rest](../../../.claude/rules/sec-encryption-at-rest.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)
- [sec-input-validation](../../../.claude/rules/sec-input-validation.md)

## Próximo passo natural
Próximo use case do módulo, mantendo PII honrado.
