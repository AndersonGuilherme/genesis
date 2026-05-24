# Spec: Block D — LGPD phase

> Spec retrospectivo. Bloco shipped em `03e4af5` (2026-05-23).

## Contexto

Boilerplate alvo é Brasil. LGPD (Lei 13.709/2018) é obrigação legal. Antes do Bloco D, conformidade era zero. App gerado expunha controlador a multa ANPD + dano reputacional desde o dia 1.

## Objetivo

Phase `lgpd` entre `security` e `development`. Reutiliza rules `sec-*` quando possível (encryption-at-rest, audit-trail). Adiciona o que é específico de LGPD: ROPA, consent, retenção, direitos do titular, DPIA, DPAs, transferência internacional, notificação ANPD.

## Decisões registradas

| Decisão | Escolha |
|---------|---------|
| Cross-cutting em dev | Variante `dev-define-use-case-with-pii` carrega lgpd-* + sec-* relevantes |
| Skills lgpd-* shipped | 8 (data-inventory, data-minimization-review, define-consent-strategy, define-retention-policy, data-subject-rights-handler, dpia, incident-notification-plan, vendor-dpa) |
| Rules lgpd-* shipped | 8 (data-minimization, explicit-consent, purpose-limitation, retention-limit, subject-rights-respected, pii-encrypted, international-transfer-rule, processing-registry) |
| Agents | 2 (compliance-reviewer, dpo-mentor) |
| Templates | 5 (data-inventory, consent-form, privacy-notice, dpia, vendor-dpa) |
| Pasta saída | `docs/security/lgpd/` (subdir de security, não top-level — LGPD é proteção de dados, complementa security) |
| Dev variant | `dev-define-use-case-with-pii` (carrega 5 rules lgpd-* + 3 rules sec- + 4 rules dev-) |

## Out-of-scope

- LGPD pra B2B com dados de empresa (LGPD foca em pessoa física).
- Auditoria externa (skills preparam organização, não substitui auditor).
- Tradução pra outros frameworks (GDPR, CCPA) — boilerplate é BR.

## Cross-link

- Plano-mestre: `~/.claude/plans/fa-a-isso-mantendo-a-wondrous-rabbit.md`
- Commit principal: `03e4af5`
- Block C (security) provê rules cross-reusadas.

## Validação shipped

- `bash .genesis/scripts/lint-docs.sh` APROVADO.
- Counts pós-bloco: 40 skills, 18 agents, 36 rules, 24 templates.
