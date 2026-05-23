# Skills (versão narrativa)

Documentação humana das skills do boilerplate. A versão consumida pela IA está em `.claude/skills/<nome>/SKILL.md`.

## Discovery

- [disc-discover-business](disc-discover-business.md) — público, mercado, valor inicial.
- [disc-validate-idea](disc-validate-idea.md) — hipóteses, experimentos, entrevistas.

## Planning

- [plan-init-project](plan-init-project.md) — identidade do projeto.
- [plan-define-product](plan-define-product.md) — visão, MVP, jornadas.
- [plan-map-users](plan-map-users.md) — personas, papéis, permissões.
- [plan-design-business-model](plan-design-business-model.md) — BMC, planos, custos, GTM.
- [plan-choose-stack](plan-choose-stack.md) — escolha de stack com 3+ opções.
- [plan-design-architecture](plan-design-architecture.md) — arquitetura de alto nível.
- [plan-modules-mvp](plan-modules-mvp.md) — identificação e fronteiras de módulos.
- [plan-define-module-spec](plan-define-module-spec.md) — spec completa de módulo.
- [plan-create-adr](plan-create-adr.md) — decisão arquitetural registrada.
- [plan-create-implementation-plan](plan-create-implementation-plan.md) — spec → plano de implementação.
- [plan-review-readiness](plan-review-readiness.md) — gate antes de codar.

## Security

- [sec-threat-model](sec-threat-model.md) — STRIDE aplicado à arquitetura.
- [sec-define-auth-strategy](sec-define-auth-strategy.md) — authn/z + multi-tenant + lifecycle.
- [sec-secrets-management-plan](sec-secrets-management-plan.md) — vault/KMS + rotação.
- [sec-dependency-vuln-scan](sec-dependency-vuln-scan.md) — scanners + gates CI.
- [sec-define-encryption-strategy](sec-define-encryption-strategy.md) — at-rest + in-transit + KMS.
- [sec-define-audit-logging](sec-define-audit-logging.md) — ações auditadas + store + retenção.
- [sec-define-rate-limiting](sec-define-rate-limiting.md) — rate limits por endpoint.
- [sec-multi-tenant-isolation](sec-multi-tenant-isolation.md) — tenant_id filter obrigatório.
- [sec-webhook-signing](sec-webhook-signing.md) — HMAC + replay protection.
- [sec-idempotency-strategy](sec-idempotency-strategy.md) — idempotency keys.

## LGPD

- [lgpd-data-inventory](lgpd-data-inventory.md) — ROPA com finalidade, base legal, retenção, compartilhamento.
- [lgpd-data-minimization-review](lgpd-data-minimization-review.md) — auditoria de campos PII sem justificativa.
- [lgpd-define-consent-strategy](lgpd-define-consent-strategy.md) — consent granular, versionado, revogável.
- [lgpd-define-retention-policy](lgpd-define-retention-policy.md) — prazo por categoria + delete/anonymize + backup.
- [lgpd-data-subject-rights-handler](lgpd-data-subject-rights-handler.md) — endpoints art. 18 + SLA 15 dias.
- [lgpd-dpia](lgpd-dpia.md) — RIPD pra operação de alto risco.
- [lgpd-incident-notification-plan](lgpd-incident-notification-plan.md) — playbook ANPD + titular (72h).
- [lgpd-vendor-dpa](lgpd-vendor-dpa.md) — DPA com cada operador externo.

## Development

- [dev-start-development](dev-start-development.md) — início incremental, módulo por módulo.
- [dev-scaffold-module](dev-scaffold-module.md) — gera estrutura 3-layer do módulo a partir da spec.
- [dev-define-use-case](dev-define-use-case.md) — implementa 1 use case com TDD pragmático.
- [dev-design-entity](dev-design-entity.md) — modela entity/VO com invariantes + teste.
- [dev-write-failing-test-first](dev-write-failing-test-first.md) — helper para RED comprovado.
- [dev-refactor-to-clean-architecture](dev-refactor-to-clean-architecture.md) — refatora código que viola Clean Arch.
- [dev-review-module-cohesion](dev-review-module-cohesion.md) — auditoria estrutural de módulo.
- [dev-define-use-case-authenticated](dev-define-use-case-authenticated.md) — variante para use case que exige auth (cross-cutting com sec-*).
- [dev-define-use-case-with-pii](dev-define-use-case-with-pii.md) — variante para use case que toca PII (cross-cutting com lgpd-* + sec-*).

## Recursos relacionados

- [START_HERE.md](../../../docs/START_HERE.md) — guia de entrada do repositório.
- [PROJECT_STATE.md](../../../docs/PROJECT_STATE.md) — painel de progresso.
- [glossary.md](../../../docs/glossary.md) — termos consistentes em PT-BR.
- [.genesis/tests/](../../tests/) — sanity checks por skill.
- [.claude/rules/](../../../.claude/rules/) — princípios aplicados.
- [.claude/agents/](../../../.claude/agents/) — agentes especializados.
