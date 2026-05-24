# Spec: Block C — Security phase

> Spec retrospectivo. Bloco shipped em `669ccf4` (2026-05-23). Documenta intenção pra auditoria futura.

## Contexto

Plano-mestre `~/.claude/plans/fa-a-isso-mantendo-a-wondrous-rabbit.md` definiu Bloco C como primeira phase nova além de planning/development. Boilerplate tinha apenas 1 rule de segurança superficial. Apps gerados saíam pra produção brasileira sem baseline.

## Objetivo

Phase `security` entre `planning` e `development`. Define postura de segurança (threat model, auth, secrets, encryption, audit, rate limit, multi-tenant, webhooks, idempotência) que skills `dev-*` cross-carregam via `rules:`.

## Decisões registradas

| Decisão | Escolha |
|---------|---------|
| Estrutura cross-cutting | Skill base + variante contextual (`dev-define-use-case-authenticated`) que declara rules `sec-*` no frontmatter + Pre-flight Read |
| Skills sec-* shipped | 10 (threat-model, auth, secrets, dep-scan, encryption, audit, rate-limit, multi-tenant, webhook-signing, idempotency) |
| Rules sec-* shipped | 10 (secrets-no-commit, input-validation, output-encoding, authn-required, authz-enforced, encryption-at-rest, encryption-in-transit, audit-trail, rate-limit-public-api, no-logged-secrets) |
| Agents | 3 (threat-modeler, vuln-scanner-mentor, auth-pattern-reviewer) |
| Templates novos | 4 (threat-model, auth-strategy, secrets-management, audit-logging) |
| Dev variant criado | `dev-define-use-case-authenticated` (carrega 4 rules sec-* + 4 rules dev-*) |

## Out-of-scope

- WAF/DDoS protection (responsabilidade do provider/runtime).
- Pentest/red team execution (skills indicam, não executam).
- Compliance setor-específico (PCI DSS, HIPAA) além de baseline.

## Cross-link

- Plano-mestre: `~/.claude/plans/fa-a-isso-mantendo-a-wondrous-rabbit.md`
- Commit principal: `669ccf4`
- LGPD reusa rules deste bloco (`sec-encryption-at-rest`, `sec-audit-trail`) — ver `block-d-lgpd-design.md`.

## Validação shipped

- `bash .genesis/scripts/lint-docs.sh` APROVADO.
- Counts pós-bloco: 31 skills, 16 agents, 28 rules, 19 templates.
