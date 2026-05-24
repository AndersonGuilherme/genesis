---
name: prelaunch-security-final-review
description: Checklist final de segurança antes do go-live. Cruza outputs das skills sec-* com estado real do sistema. Aprovação obrigatória pra prelaunch-launch-readiness-gate.
phase: pre-launch
rules:
  - prelaunch-gate-complete
  - sec-secrets-no-commit
  - sec-authn-required
  - sec-authz-enforced
  - sec-encryption-at-rest
  - sec-encryption-in-transit
  - sec-audit-trail
  - sec-rate-limit-public-api
  - sec-no-logged-secrets
---

# Skill: prelaunch-security-final-review

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Validar que cada decisão de segurança definida nas skills `sec-*` está implementada em código + infra. Lista gaps bloqueantes.

## Quando usar

- Antes da reunião go/no-go.
- Após mudança arquitetural significativa pós-launch (re-validação).

## Pré-condições

- Skills `sec-*` executadas (docs/security/* preenchido).
- Sistema buildado e em staging com paridade de prod.

## Processo

1. Threat model atualizado? Riscos altos mitigados?
2. Auth strategy implementada conforme spec? Endpoints públicos = lista documentada?
3. Authz em use case (não só controller)? Tenant filter em toda query?
4. Secrets em vault, não no código? Gitleaks/scanner verde no main?
5. TLS 1.2+ em todo canal? HSTS ativo?
6. Encryption at-rest no banco + backup?
7. Audit log estruturado, separado, com retenção?
8. Rate limit em endpoints públicos + login + custo monetário?
9. Sanitizer ativo no logger? PII redacted?
10. Vuln scan verde (sem CRITICAL/HIGH abertos)?
11. Pentest/red team (se aplicável) findings tratados?
12. Documentar resultado em `docs/launch/security-final-review.md`.

## Restrições

- Item bloqueante (CRITICAL CVE, auth não implementada, encryption ausente) = no-go.
- Não aceitar "vamos lançar e arrumamos" pra item bloqueante.
- Findings devem ter owner + status atual.

## Exemplos de uso

- "Rodar security final review do tchr antes do lançamento."
- "Re-validar após adicionar pagamento."

## Critérios de conclusão

- [ ] Threat model revalidado.
- [ ] Auth/authz cobertos.
- [ ] Secrets/encryption/audit verificados.
- [ ] Rate limit + sanitizer ativos.
- [ ] Vuln scan verde.
- [ ] `docs/launch/security-final-review.md` completo com go/no-go.
