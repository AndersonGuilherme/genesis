---
name: dev-define-use-case-with-pii
description: Variante de `dev-define-use-case` pra use cases que tocam PII. Carrega rules lgpd-* + sec-* relevantes. Aplica TDD + minimização + consent + encryption + audit.
phase: development
rules:
  - dev-tdd-pragmatic
  - dev-use-case-per-file
  - dev-clean-architecture-layers
  - dev-solid
  - lgpd-data-minimization
  - lgpd-explicit-consent
  - lgpd-purpose-limitation
  - lgpd-pii-encrypted
  - lgpd-retention-limit
  - sec-encryption-at-rest
  - sec-audit-trail
  - sec-input-validation
---

# Skill: dev-define-use-case-with-pii

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-tdd-pragmatic.md`
- `.claude/rules/dev-use-case-per-file.md`
- `.claude/rules/dev-clean-architecture-layers.md`
- `.claude/rules/dev-solid.md`
- `.claude/rules/lgpd-data-minimization.md`
- `.claude/rules/lgpd-explicit-consent.md`
- `.claude/rules/lgpd-purpose-limitation.md`
- `.claude/rules/lgpd-pii-encrypted.md`
- `.claude/rules/lgpd-retention-limit.md`
- `.claude/rules/sec-encryption-at-rest.md`
- `.claude/rules/sec-audit-trail.md`
- `.claude/rules/sec-input-validation.md`

Aplique todas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Implementar use case que coleta, lê, atualiza ou processa dado pessoal com TDD pragmático + LGPD aplicada por construção.

## Quando usar

- Use case que cria/atualiza entity com PII.
- Use case que lê PII de outro user.
- Use case que compartilha PII com sistema/operador externo.
- Use case que aplica decisão baseada em PII.

## Pré-condições

- `docs/security/lgpd/data-inventory.md` lista a operação com finalidade + base legal.
- `docs/security/lgpd/consent-strategy.md` define consent (se base legal = consent).
- `docs/security/lgpd/retention-policy.md` cobre a categoria.
- Spec do módulo lista o use case (cross-link com `dev-define-use-case`).

## Processo (TDD + LGPD)

1. Ler entry no data-inventory: finalidade, base legal, retenção, sensibilidade.
2. Validar minimização: input do use case contém SÓ os campos justificados.
3. Aplicar `dev-define-use-case` base:
   - RED: teste falhando.
   - GREEN: implementação mínima.
   - REFACTOR.
4. **Adições obrigatórias**:
   - **Validação de input** via schema na boundary (cross-link `sec-input-validation`).
   - **Verificação de consent** quando base legal = consent (checar `user.consents` antes de prosseguir).
   - **Validação de purpose**: use case recebe `purpose` explícito + valida contra inventory.
   - **Encryption a nível de aplicação** pra campos sensíveis (cross-link `lgpd-pii-encrypted`).
   - **Audit log emitido**: actor, action, fields_accessed, purpose, timestamp (cross-link `sec-audit-trail`).
   - **Filter de retenção** se houver lookup de dado antigo (não retornar PII expirada).
5. Testes adicionais obrigatórios:
   - Input com campo não autorizado → `ValidationError`.
   - Consent não concedido (quando aplicável) → `ConsentMissingError`.
   - Audit log emitido (asserção em test).
   - Encryption: dado persistido cifrado (asserção em test de integração).
6. Atualizar inventory se use case introduzir nova finalidade/campo.

## Restrições

- Sem coletar campo "por garantia".
- Sem reuso de PII pra finalidade não declarada.
- Sem PII em log de aplicação (sanitizer cross-link `sec-no-logged-secrets`).
- Sem hard delete de audit log próprio.
- Multi-tenant: filter de `tenant_id` obrigatório (cross-link `sec-authz-enforced` se aplicável).

## Exemplos de uso

- "Implementar `RegisterStudentUseCase` (coleta nome, email, opcional phone)."
- "Implementar `UpdateProfileUseCase` (campos limitados)."
- "Implementar `ExportMyDataUseCase` (direito do titular)."

## Critérios de conclusão

- [ ] Critérios de `dev-define-use-case` + tudo abaixo:
- [ ] Input contém só campos justificados em data-inventory.
- [ ] Validação de schema na boundary.
- [ ] Consent verificado (se base legal = consent).
- [ ] Purpose explícito + validado.
- [ ] Encryption a nível de aplicação aplicada pra sensível.
- [ ] Audit log emitido no happy path E em erro de validação/consent.
- [ ] Teste cobre: campo extra, consent ausente, audit log emitido, encryption persiste cifrado.
- [ ] Inventory atualizado (se mudou).
