# project-genesis-boilerplate

> Boilerplate de mentoria para iniciar projetos com disciplina: negócio → produto → arquitetura → spec → código. Stack-neutral. Pensado para usar Claude Code (ou outro cliente compatível com Claude Agent SDK) como mentor sênior.

**Este não é um template de código.** É um sistema de skills, rules, agents e templates que conduz você por 10 fases sequenciais antes da primeira linha de código de aplicação. Quando a IA tenta pular fases, o boilerplate redireciona. Quando você tenta começar a codar cedo demais, os hooks bloqueiam.

---

## TL;DR

```bash
# 1. Clonar e iniciar um projeto novo
git clone https://github.com/AndersonGuilherme/genesis.git
bash genesis/.genesis/scripts/genesis-init.sh meu-projeto ./meu-projeto
cd meu-projeto

# 2. Abrir Claude Code e dizer:
# "vamos iniciar o projeto"
# (A skill plan-init-project assume a condução)

# 3. Checar prontidão a qualquer momento
bash .genesis/scripts/check-readiness.sh
```

---

## As 10 fases

O boilerplate organiza qualquer projeto em fases sequenciais. Você não pula nenhuma — a IA recusa.

| # | Fase | Skill principal | Saída esperada |
|---|------|-----------------|----------------|
| 1 | Identidade do projeto | [plan-init-project](.claude/skills/plan-init-project/SKILL.md) | nome, propósito, problema, público |
| 2 | Público e mercado | [disc-discover-business](.claude/skills/disc-discover-business/SKILL.md) | usuários, compradores, concorrência |
| 3 | Valor e monetização | [disc-discover-business](.claude/skills/disc-discover-business/SKILL.md), [plan-design-business-model](.claude/skills/plan-design-business-model/SKILL.md) | proposta de valor, modelo de receita |
| 4 | Produto | [plan-define-product](.claude/skills/plan-define-product/SKILL.md), [plan-map-users](.claude/skills/plan-map-users/SKILL.md) | visão, MVP, jornadas, roadmap |
| 5 | Domínio e regras | (entra dentro de outras skills) | entidades, regras, permissões |
| 6 | Tecnologia | [plan-choose-stack](.claude/skills/plan-choose-stack/SKILL.md) | stack escolhida (3+ opções avaliadas) |
| 7 | Arquitetura | [plan-design-architecture](.claude/skills/plan-design-architecture/SKILL.md) | visão de alto nível, integrações, dados, segurança |
| 8 | Specs por módulo | [plan-modules-mvp](.claude/skills/plan-modules-mvp/SKILL.md), [plan-define-module-spec](.claude/skills/plan-define-module-spec/SKILL.md) | 1 spec completa por módulo do MVP |
| 9 | Readiness review | [plan-review-readiness](.claude/skills/plan-review-readiness/SKILL.md) | gate aprovado |
| 10 | Implementação | [dev-start-development](.claude/skills/dev-start-development/SKILL.md) e demais `dev-*` | código com TDD + DDD + Clean Architecture |

Skills transversais usadas em várias fases:
- [disc-validate-idea](.claude/skills/disc-validate-idea/SKILL.md) — quando há premissa fatal não validada.
- [plan-create-adr](.claude/skills/plan-create-adr/SKILL.md) — toda decisão relevante vira ADR.
- [plan-create-implementation-plan](.claude/skills/plan-create-implementation-plan/SKILL.md) — spec → plano executável.

---

## Skills por fase

Skills são organizadas por prefixo de phase. Cada skill declara no frontmatter quais rules ela aplica (campo `rules:`) e tem um bloco "Pré-flight" que carrega essas rules sob demanda.

### Discovery — entender o problema antes de propor solução

| Skill | Quando usar |
|-------|-------------|
| [disc-discover-business](.claude/skills/disc-discover-business/SKILL.md) | Fases 2 e 3: público, mercado, concorrência, proposta de valor inicial. |
| [disc-validate-idea](.claude/skills/disc-validate-idea/SKILL.md) | Quando há hipótese central com impacto alto/fatal não validada. |

### Planning — projeto, arquitetura, specs

| Skill | Quando usar |
|-------|-------------|
| [plan-init-project](.claude/skills/plan-init-project/SKILL.md) | Ponto de entrada. Conduz todas as fases. |
| [plan-define-product](.claude/skills/plan-define-product/SKILL.md) | Fase 4: visão, MVP, jornadas, roadmap. |
| [plan-map-users](.claude/skills/plan-map-users/SKILL.md) | Personas, papéis, matriz de permissões. |
| [plan-design-business-model](.claude/skills/plan-design-business-model/SKILL.md) | BMC detalhado, planos, custos, GTM. |
| [plan-choose-stack](.claude/skills/plan-choose-stack/SKILL.md) | Stack-neutral. 3+ opções avaliadas antes de recomendar. |
| [plan-design-architecture](.claude/skills/plan-design-architecture/SKILL.md) | Arquitetura de alto nível, integrações, dados, segurança. |
| [plan-modules-mvp](.claude/skills/plan-modules-mvp/SKILL.md) | Identifica módulos do MVP, fronteiras, dependências. |
| [plan-define-module-spec](.claude/skills/plan-define-module-spec/SKILL.md) | Spec completa de 1 módulo (entidades, APIs, eventos, regras, AC). |
| [plan-create-adr](.claude/skills/plan-create-adr/SKILL.md) | Decisão arquitetural com 2+ alternativas + consequências. |
| [plan-create-implementation-plan](.claude/skills/plan-create-implementation-plan/SKILL.md) | Spec → plano de implementação incremental. |
| [plan-review-readiness](.claude/skills/plan-review-readiness/SKILL.md) | Gate: pode iniciar implementação? |

### Security — postura de segurança antes do código

Phase nova entre planning e development. Define threat model, auth strategy, secrets, encryption, audit, rate limits, multi-tenant, webhooks, idempotency.

| Skill | Quando usar |
|-------|-------------|
| [sec-threat-model](.claude/skills/sec-threat-model/SKILL.md) | STRIDE aplicado à arquitetura. Primeiro da phase. |
| [sec-define-auth-strategy](.claude/skills/sec-define-auth-strategy/SKILL.md) | JWT/OAuth/sessão + RBAC/ABAC + multi-tenant. |
| [sec-secrets-management-plan](.claude/skills/sec-secrets-management-plan/SKILL.md) | Vault/KMS + rotação. |
| [sec-dependency-vuln-scan](.claude/skills/sec-dependency-vuln-scan/SKILL.md) | Scanners + gates em CI. |
| [sec-define-encryption-strategy](.claude/skills/sec-define-encryption-strategy/SKILL.md) | At-rest + in-transit + key management. |
| [sec-define-audit-logging](.claude/skills/sec-define-audit-logging/SKILL.md) | Ações auditadas + retenção legal. |
| [sec-define-rate-limiting](.claude/skills/sec-define-rate-limiting/SKILL.md) | Rate limit por endpoint. |
| [sec-multi-tenant-isolation](.claude/skills/sec-multi-tenant-isolation/SKILL.md) | Tenant_id filter obrigatório. |
| [sec-webhook-signing](.claude/skills/sec-webhook-signing/SKILL.md) | HMAC + replay protection. |
| [sec-idempotency-strategy](.claude/skills/sec-idempotency-strategy/SKILL.md) | Idempotency keys. |

### LGPD — conformidade brasileira antes do código

Phase entre security e development. Define ROPA, consent, retenção, direitos do titular, DPIA, notificação de incidente, DPAs com fornecedores. Cumpre Lei 13.709/2018.

| Skill | Quando usar |
|-------|-------------|
| [lgpd-data-inventory](.claude/skills/lgpd-data-inventory/SKILL.md) | Cria ROPA (art. 37). Primeiro da phase. |
| [lgpd-data-minimization-review](.claude/skills/lgpd-data-minimization-review/SKILL.md) | Auditoria de campos PII sem justificativa. |
| [lgpd-define-consent-strategy](.claude/skills/lgpd-define-consent-strategy/SKILL.md) | Consent granular, versionado, revogável. |
| [lgpd-define-retention-policy](.claude/skills/lgpd-define-retention-policy/SKILL.md) | Prazo por categoria + delete/anonymize + backup. |
| [lgpd-data-subject-rights-handler](.claude/skills/lgpd-data-subject-rights-handler/SKILL.md) | Endpoints art. 18 + SLA 15 dias. |
| [lgpd-dpia](.claude/skills/lgpd-dpia/SKILL.md) | RIPD pra operação de alto risco (art. 38). |
| [lgpd-incident-notification-plan](.claude/skills/lgpd-incident-notification-plan/SKILL.md) | Playbook ANPD + titular (72h convenção interna). |
| [lgpd-vendor-dpa](.claude/skills/lgpd-vendor-dpa/SKILL.md) | DPA com cada operador externo (art. 39). |

### Development — código com disciplina

Toda dev skill aplica TDD pragmático + DDD + Clean Architecture 3-layer + módulo por bounded context.

| Skill | Quando usar |
|-------|-------------|
| [dev-start-development](.claude/skills/dev-start-development/SKILL.md) | Início incremental após readiness aprovada. |
| [dev-scaffold-module](.claude/skills/dev-scaffold-module/SKILL.md) | Gera estrutura `domain/`, `application/`, `infra/` a partir da spec. |
| [dev-define-use-case](.claude/skills/dev-define-use-case/SKILL.md) | 1 use case com TDD pragmático (RED → GREEN → REFACTOR). |
| [dev-design-entity](.claude/skills/dev-design-entity/SKILL.md) | Modela entity/VO com invariantes + teste. |
| [dev-write-failing-test-first](.claude/skills/dev-write-failing-test-first/SKILL.md) | Helper para garantir RED comprovado. |
| [dev-refactor-to-clean-architecture](.claude/skills/dev-refactor-to-clean-architecture/SKILL.md) | Refatora código que viola Clean Arch (testes verdes antes/depois). |
| [dev-review-module-cohesion](.claude/skills/dev-review-module-cohesion/SKILL.md) | Auditoria estrutural de módulo (sem refatorar — só reporta). |
| [dev-define-use-case-authenticated](.claude/skills/dev-define-use-case-authenticated/SKILL.md) | Variante de `dev-define-use-case` que carrega rules sec-* (authn/authz/audit/validation). |
| [dev-define-use-case-with-pii](.claude/skills/dev-define-use-case-with-pii/SKILL.md) | Variante de `dev-define-use-case` que carrega rules lgpd-* + sec-* (minimização/consent/encryption/audit). |

### Operations — produção que não acorda você sem motivo

Phase após development. Define CI/CD, observability, SLO, runbooks, incident response, backup, cost tracking, feature flags, deployment strategy.

| Skill | Quando usar |
|-------|-------------|
| [ops-setup-ci-pipeline](.claude/skills/ops-setup-ci-pipeline/SKILL.md) | CI com lint, test, build, scanners. Primeiro da phase. |
| [ops-setup-cd-pipeline](.claude/skills/ops-setup-cd-pipeline/SKILL.md) | CD com canary + rollback automático. |
| [ops-define-observability](.claude/skills/ops-define-observability/SKILL.md) | Logs estruturados + RED/USE + traces via OpenTelemetry. |
| [ops-define-slos-slis](.claude/skills/ops-define-slos-slis/SKILL.md) | SLO/SLI por CUJ + burn rate alerts + error budget. |
| [ops-define-runbook](.claude/skills/ops-define-runbook/SKILL.md) | Runbook por módulo crítico. |
| [ops-define-incident-response](.claude/skills/ops-define-incident-response/SKILL.md) | Severity, papéis, fluxo, postmortem blameless. |
| [ops-setup-backup-restore](.claude/skills/ops-setup-backup-restore/SKILL.md) | Backup + restore drill + RPO/RTO. |
| [ops-cost-tracking](.claude/skills/ops-cost-tracking/SKILL.md) | Cost export + tags + alertas de billing. |
| [ops-feature-flags-strategy](.claude/skills/ops-feature-flags-strategy/SKILL.md) | Flag debt sob controle. |
| [ops-define-deployment-strategy](.claude/skills/ops-define-deployment-strategy/SKILL.md) | Rolling/blue-green/canary justificado. |

### Pre-launch — gate final antes do go-live

Phase após operations, antes do primeiro acesso público. Valida que cada decisão prometida está implementada.

| Skill | Quando usar |
|-------|-------------|
| [prelaunch-security-final-review](.claude/skills/prelaunch-security-final-review/SKILL.md) | Checklist sec-* + gaps bloqueantes. |
| [prelaunch-lgpd-compliance-check](.claude/skills/prelaunch-lgpd-compliance-check/SKILL.md) | Checklist lgpd-* + bloqueantes. |
| [prelaunch-performance-baseline](.claude/skills/prelaunch-performance-baseline/SKILL.md) | Load test em staging + validação SLO. |
| [prelaunch-launch-readiness-gate](.claude/skills/prelaunch-launch-readiness-gate/SKILL.md) | Gate consolidado + reunião go/no-go. |

### Maintenance — produção viva, atualizada, sob controle

Phase contínua pós-launch.

| Skill | Quando usar |
|-------|-------------|
| [maint-dependency-update](.claude/skills/maint-dependency-update/SKILL.md) | Rotina semanal/quinzenal de updates + SLA de CVE. |
| [maint-incident-retrospective](.claude/skills/maint-incident-retrospective/SKILL.md) | Postmortem blameless após incidente. |

---

## Rules por fase

Rules são princípios que a IA aplica automaticamente. Skills declaram quais rules carregar via `rules:` + leem o conteúdo sob demanda (bloco "Pré-flight").

### Planning

| Rule | Princípio |
|------|-----------|
| [plan-no-code-before-spec](.claude/rules/plan-no-code-before-spec.md) | Nenhum código de aplicação antes de spec mínima aprovada. |
| [plan-module-spec-required](.claude/rules/plan-module-spec-required.md) | Nenhum módulo é implementado sem spec completa em `docs/specs/<modulo>/`. |
| [plan-documentation-first](.claude/rules/plan-documentation-first.md) | Toda decisão importante atualiza doc antes ou junto com a mudança. |
| [plan-business-before-technology](.claude/rules/plan-business-before-technology.md) | Não escolher stack antes de entender problema, usuário, valor. |
| [plan-stack-neutrality](.claude/rules/plan-stack-neutrality.md) | Nenhuma stack assumida por default. 3+ opções avaliadas. |
| [plan-adr-required-for-decisions](.claude/rules/plan-adr-required-for-decisions.md) | Toda decisão relevante gera ADR com alternativas + consequências. |
| [plan-explain-tradeoffs](.claude/rules/plan-explain-tradeoffs.md) | Toda recomendação vem com vantagens, desvantagens, alternativas. |
| [plan-security-by-design](.claude/rules/plan-security-by-design.md) | Segurança pensada antes do código. LGPD não se resolve com patch. |
| [plan-testing-strategy-required](.claude/rules/plan-testing-strategy-required.md) | Estratégia de teste documentada antes do código. |
| [plan-avoid-overengineering](.claude/rules/plan-avoid-overengineering.md) | Sem microserviços/cache/fila sem justificativa numérica. |

### Security

| Rule | Princípio |
|------|-----------|
| [sec-secrets-no-commit](.claude/rules/sec-secrets-no-commit.md) | Secret nunca entra no git. Pre-commit hook + scanner. |
| [sec-input-validation](.claude/rules/sec-input-validation.md) | Toda entrada externa validada na boundary com schema. |
| [sec-output-encoding](.claude/rules/sec-output-encoding.md) | Output codificado por canal (HTML, SQL, shell, log). |
| [sec-authn-required](.claude/rules/sec-authn-required.md) | Endpoints autenticados por default. Públicos são exceção listada. |
| [sec-authz-enforced](.claude/rules/sec-authz-enforced.md) | RBAC/ABAC checado no use case. Multi-tenant filtrado. |
| [sec-encryption-at-rest](.claude/rules/sec-encryption-at-rest.md) | PII e secrets cifrados no banco/backup. |
| [sec-encryption-in-transit](.claude/rules/sec-encryption-in-transit.md) | TLS 1.2+ em todo canal. HSTS habilitado. |
| [sec-audit-trail](.claude/rules/sec-audit-trail.md) | Ações sensíveis logadas em store imutável, retidas por prazo legal. |
| [sec-rate-limit-public-api](.claude/rules/sec-rate-limit-public-api.md) | Rate limit por IP + user. 429 com Retry-After. |
| [sec-no-logged-secrets](.claude/rules/sec-no-logged-secrets.md) | Sanitizer central. Sem secret/PII em log. |

### LGPD

| Rule | Princípio |
|------|-----------|
| [lgpd-data-minimization](.claude/rules/lgpd-data-minimization.md) | Coletar só o estritamente necessário. Campo sem finalidade = bloqueado. |
| [lgpd-explicit-consent](.claude/rules/lgpd-explicit-consent.md) | Consent granular, livre, informado, registrado, revogável. |
| [lgpd-purpose-limitation](.claude/rules/lgpd-purpose-limitation.md) | Dado coletado pra X não vira insumo pra Y sem reconsent. |
| [lgpd-retention-limit](.claude/rules/lgpd-retention-limit.md) | Retenção declarada + job de delete/anonymize + backup respeitado. |
| [lgpd-subject-rights-respected](.claude/rules/lgpd-subject-rights-respected.md) | Endpoints pros 8 direitos do art. 18 + SLA 15 dias. |
| [lgpd-pii-encrypted](.claude/rules/lgpd-pii-encrypted.md) | PII at-rest cifrada. Sensível com camada extra (KMS). |
| [lgpd-international-transfer-rule](.claude/rules/lgpd-international-transfer-rule.md) | Transferência fora do Brasil exige base legal + DPA + privacy notice. |
| [lgpd-processing-registry](.claude/rules/lgpd-processing-registry.md) | ROPA vivo, atualizado em cada PR que toca PII. |

### Operations

| Rule | Princípio |
|------|-----------|
| [ops-structured-logging](.claude/rules/ops-structured-logging.md) | Logs em JSON com campos canônicos. Sem string livre. |
| [ops-correlation-id](.claude/rules/ops-correlation-id.md) | trace_id em log + métrica + trace + job assíncrono. W3C propagação. |
| [ops-alert-actionable](.claude/rules/ops-alert-actionable.md) | Alerta sem runbook + sem ação = proibido. |
| [ops-runbook-required](.claude/rules/ops-runbook-required.md) | Cada módulo crítico tem runbook publicado e vivo. |
| [ops-rollback-tested](.claude/rules/ops-rollback-tested.md) | Rollback exercitado em staging. Migration reversível. |
| [ops-no-prod-debug-flag](.claude/rules/ops-no-prod-debug-flag.md) | Sem DEBUG=true, sem endpoint /debug em produção. |

### Pre-launch

| Rule | Princípio |
|------|-----------|
| [prelaunch-gate-complete](.claude/rules/prelaunch-gate-complete.md) | Go-live só após checklist completo + assinatura go/no-go. |

### Maintenance

| Rule | Princípio |
|------|-----------|
| [maint-deprecation-policy](.claude/rules/maint-deprecation-policy.md) | Deprecação anunciada com antecedência (90 dias / 2 majors). |
| [maint-backward-compatibility](.claude/rules/maint-backward-compatibility.md) | API pública preserva contrato. Breaking exige nova versão. |
| [maint-security-patch-sla](.claude/rules/maint-security-patch-sla.md) | CVE patchado conforme SLA (CRITICAL 24h, HIGH 7d, MEDIUM 30d, LOW 90d). |

### Development

| Rule | Princípio |
|------|-----------|
| [dev-tdd-pragmatic](.claude/rules/dev-tdd-pragmatic.md) | Use cases, entities, VOs e business rules têm teste antes. Controllers opcionais. |
| [dev-ddd-bounded-context](.claude/rules/dev-ddd-bounded-context.md) | 1 módulo = 1 bounded context. Sem vazamento de entidades. |
| [dev-clean-architecture-layers](.claude/rules/dev-clean-architecture-layers.md) | 3 camadas: `domain/`, `application/`, `infra/`. Dependência aponta pra dentro. |
| [dev-dependency-direction](.claude/rules/dev-dependency-direction.md) | Domain não importa nada. Application só importa domain via ports. |
| [dev-use-case-per-file](.claude/rules/dev-use-case-per-file.md) | 1 use case = 1 operação = 1 arquivo. Sem service classes. |
| [dev-solid](.claude/rules/dev-solid.md) | SRP, OCP, LSP, ISP, DIP aplicados no domain e application. |
| [dev-clean-code](.claude/rules/dev-clean-code.md) | Nomes intencionais, funções pequenas, sem comentário óbvio. |
| [dev-module-naming](.claude/rules/dev-module-naming.md) | EN singular, kebab-case folder, PascalCase classe. Ex: `auth/`, `student/`, `professor/`. |

---

## Agents especializados

Agents são revisores invocáveis quando uma área precisa de profundidade. Skills sugerem qual agent usar.

### Planning

| Agent | Foco |
|-------|------|
| [plan-product-strategist](.claude/agents/plan-product-strategist.md) | Visão de produto, MVP, posicionamento, roadmap. |
| [plan-business-mentor](.claude/agents/plan-business-mentor.md) | BMC, unit economics, viabilidade de mercado. |
| [plan-monetization-strategist](.claude/agents/plan-monetization-strategist.md) | Pricing, planos, comissão, marketplace. |
| [plan-software-architect](.claude/agents/plan-software-architect.md) | Arquitetura, stack, módulos, integrações. |
| [plan-domain-modeler](.claude/agents/plan-domain-modeler.md) | Entidades, regras de negócio, bounded contexts. |
| [plan-security-reviewer](.claude/agents/plan-security-reviewer.md) | Auth, LGPD, privacidade, threat modeling. |
| [plan-scalability-reviewer](.claude/agents/plan-scalability-reviewer.md) | Performance, filas, cache, custo de operação. |
| [plan-ux-researcher](.claude/agents/plan-ux-researcher.md) | Personas, jornadas, fricções, métricas de adoção. |
| [plan-technical-writer](.claude/agents/plan-technical-writer.md) | Clareza dos docs, consistência cruzada, rastreabilidade. |
| [plan-implementation-planner](.claude/agents/plan-implementation-planner.md) | Quebrar specs em tarefas pequenas e testáveis. |

### Security

| Agent | Foco |
|-------|------|
| [sec-threat-modeler](.claude/agents/sec-threat-modeler.md) | STRIDE aplicado à arquitetura. Identifica vetores + sugere mitigação. |
| [sec-vuln-scanner-mentor](.claude/agents/sec-vuln-scanner-mentor.md) | Configura scanners + triage de CVE. |
| [sec-auth-pattern-reviewer](.claude/agents/sec-auth-pattern-reviewer.md) | Revisa padrões authn/z em código + multi-tenant. |

### LGPD

| Agent | Foco |
|-------|------|
| [lgpd-compliance-reviewer](.claude/agents/lgpd-compliance-reviewer.md) | Audita conformidade LGPD cruzando docs com código. Gaps por artigo violado. |
| [lgpd-dpo-mentor](.claude/agents/lgpd-dpo-mentor.md) | Orienta decisões no papel de DPO — base legal, DPIA, fiscalização ANPD. |

### Operations

| Agent | Foco |
|-------|------|
| [ops-sre-mentor](.claude/agents/ops-sre-mentor.md) | SLO/SLI, observability, runbooks, deploy strategy, error budget. SRE pragmático. |
| [ops-incident-commander](.claude/agents/ops-incident-commander.md) | Coordena incidente, mantém timeline, conduz postmortem blameless. |

### Pre-launch + Maintenance

| Agent | Foco |
|-------|------|
| [prelaunch-launch-reviewer](.claude/agents/prelaunch-launch-reviewer.md) | Revisão final pré-launch com perspectiva externa. Cruza segurança, LGPD, operations, produto, negócio. |
| [maint-incident-historian](.claude/agents/maint-incident-historian.md) | Memória institucional de incidentes. Identifica padrão recorrente. Sugere mudança estrutural. |

### Development

| Agent | Foco |
|-------|------|
| [dev-clean-architect](.claude/agents/dev-clean-architect.md) | Estrutura de módulo, fronteiras entre camadas, dependency direction. |
| [dev-tdd-mentor](.claude/agents/dev-tdd-mentor.md) | Adesão a teste-first, qualidade dos testes, cobertura crítica. |
| [dev-ddd-modeler](.claude/agents/dev-ddd-modeler.md) | Entities, VOs, bounded contexts em código (não só conceitual). |

---

## Templates

Templates ficam em [.genesis/templates/](.genesis/templates/) e são aplicados pelas skills.

### Planning

- [project-brief-template](.genesis/templates/project-brief-template.md), [user-story-template](.genesis/templates/user-story-template.md), [business-rule-template](.genesis/templates/business-rule-template.md), [data-model-template](.genesis/templates/data-model-template.md), [api-spec-template](.genesis/templates/api-spec-template.md), [integration-spec-template](.genesis/templates/integration-spec-template.md), [module-spec-template](.genesis/templates/module-spec-template.md), [adr-template](.genesis/templates/adr-template.md), [readiness-checklist-template](.genesis/templates/readiness-checklist-template.md)

### Development

- [use-case-template](.genesis/templates/use-case-template.md), [entity-template](.genesis/templates/entity-template.md), [value-object-template](.genesis/templates/value-object-template.md), [repository-port-template](.genesis/templates/repository-port-template.md), [module-structure-template](.genesis/templates/module-structure-template.md)

---

## Estrutura do repositório

```
/
├── .claude/                  Claude Code: skills, agents, rules, hooks
│   ├── skills/               56 skills (2 disc-, 11 plan-, 10 sec-, 8 lgpd-, 10 ops-, 4 prelaunch-, 2 maint-, 9 dev-)
│   ├── agents/               22 agents (10 plan-, 3 sec-, 2 lgpd-, 2 ops-, 1 prelaunch-, 1 maint-, 3 dev-)
│   ├── rules/                46 rules (10 plan-, 10 sec-, 8 lgpd-, 6 ops-, 1 prelaunch-, 3 maint-, 8 dev-)
│   └── hooks/                hooks de gate (readiness, no-code-before-spec)
├── .genesis/                 Infra do boilerplate (hidden namespace)
│   ├── scripts/              check-readiness, lint-docs, run-skill-tests, genesis-init
│   ├── tests/                sanity tests por skill/rule/agent
│   ├── templates/            31 templates (planning + security + lgpd + operations + prelaunch + maintenance + development)
│   ├── examples/             tchr (caso real, removido em projeto novo)
│   ├── docs/skills/          narrativa humana das skills
│   ├── README.md             documentação do boilerplate
│   ├── CHANGELOG.md          versões do boilerplate
│   └── VERSION
├── docs/                     CONTEÚDO DO PROJETO (vai sendo preenchido pelas fases)
│   ├── START_HERE.md, PROJECT_STATE.md, glossary.md
│   ├── product/, business/, architecture/, modules/
│   ├── specs/, adr/
│   ├── security/, testing/, deployment/, operations/
│   ├── research/, validation/
│   └── superpowers/specs|plans/  artefatos do workflow brainstorm→spec→plan→execute
├── CLAUDE.md                 instruções operacionais da IA
├── README.md                 este arquivo (vira template enxuto em projeto-filho)
├── CHANGELOG.md              changelog do projeto (vazio no boilerplate)
└── LICENSE
```

Após `genesis-init.sh`:
- `.genesis/examples/` é removido.
- Este `README.md` é substituído por um template enxuto do projeto.
- Placeholders `__PROJECT_NAME__` são preenchidos.
- `docs/PROJECT_STATE.md` é zerado.
- `git init` limpo com branch `main`.
- O projeto-filho ainda enxerga tudo de `.claude/` e `.genesis/` para que a IA siga conduzindo.

---

## Princípios inegociáveis

1. **Documentação antes de código.** Nenhuma linha de aplicação até `plan-review-readiness` aprovar.
2. **Negócio antes de tecnologia.** Stack só após problema/usuário/valor entendidos.
3. **Toda decisão importante vira ADR** com 2+ alternativas e consequências honestas.
4. **Stack-neutral.** Nenhuma linguagem ou framework assumido por default.
5. **Spec por módulo é o contrato.** Sem spec, sem código.
6. **TDD pragmático na fase development.** Use cases, entities, VOs com teste antes.
7. **Clean Architecture 3-layer.** `domain/` → `application/` → `infra/`. Dependência aponta pra dentro.
8. **Bounded context por módulo.** Sem vazamento de entidades entre módulos.

---

## Comandos úteis

```bash
# Gate de readiness (passa quando docs mínimos estão preenchidos)
bash .genesis/scripts/check-readiness.sh

# Lint estrutural: frontmatter de skills/rules/agents + links markdown
bash .genesis/scripts/lint-docs.sh

# Wrapper: lint + readiness
bash .genesis/scripts/run-skill-tests.sh

# Bootstrap de novo projeto-filho a partir deste boilerplate
bash .genesis/scripts/genesis-init.sh <nome-do-projeto> [destino]

# Desligar hooks de gate temporariamente
export GENESIS_HOOKS_DISABLE=1
```

---

## Documentação adicional

- [docs/START_HERE.md](docs/START_HERE.md) — guia de entrada pro projeto.
- [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md) — painel vivo de progresso.
- [docs/glossary.md](docs/glossary.md) — termos consistentes em PT-BR.
- [.genesis/docs/skills/README.md](.genesis/docs/skills/README.md) — narrativa humana de cada skill, com walkthrough passo a passo.
- [.genesis/README.md](.genesis/README.md) — overview da infra do boilerplate (paths internos, contratos de hooks, etc.).
- [.genesis/CHANGELOG.md](.genesis/CHANGELOG.md) — versões do boilerplate.

---

## Licença

[MIT](LICENSE).
