# PROJECT_STATE

> Estado vivo do projeto. Atualize ao final de cada fase. Este é o painel que a IA usa para decidir o que perguntar a seguir.

## Identificação

| Campo | Valor |
|-------|-------|
| Nome do projeto | _(preencher)_ |
| Tagline (1 frase) | _(preencher)_ |
| Estágio | ideia / discovery / spec / implementação / pre-launch / lançado / manutenção |
| Data de início | _(preencher)_ |
| Última atualização | _(preencher)_ |

## Lifecycle (8 phases)

Avance fase por fase sem pular. Cada phase tem skills/rules/agents próprios. Multi-gate em `.genesis/scripts/check-readiness.sh` valida por phase.

- [ ] **1. discovery** — validar premissas (`disc-*`). Termina com problema/usuário validados.
- [ ] **2. planning** — visão, MVP, modelo de negócio, stack, arquitetura, specs (`plan-*`). Gate: `bash .genesis/scripts/check-readiness.sh --planning`.
- [ ] **3. security** — threat model, auth, encryption, audit, rate limit (`sec-*`). Gate: `--security`.
- [ ] **4. lgpd** — ROPA, consent, retenção, direitos do titular, DPIA, DPAs (`lgpd-*`). Gate: `--lgpd`.
- [ ] **5. development** — TDD + DDD + Clean Architecture (`dev-*`). Variants pra PII + authenticated.
- [ ] **6. pre-launch** — checklists final + load test + go/no-go (`prelaunch-*`). Gate: `--pre-launch`.
- [ ] **7. operations** — CI/CD, observability, SLO, runbooks, incident response, backup (`ops-*`).
- [ ] **8. maintenance** — dependency update, postmortem, deprecation, compatibility (`maint-*`).

**Phase ativa agora:** _(preencher)_

## Documentos por estado

Legenda: `vazio` (não tocado), `em-progresso`, `revisado`.

### Produto
| Arquivo | Estado |
|---------|--------|
| `docs/product/product-vision.md` | vazio |
| `docs/product/problem-statement.md` | vazio |
| `docs/product/target-users.md` | vazio |
| `docs/product/user-journeys.md` | vazio |
| `docs/product/value-proposition.md` | vazio |
| `docs/product/mvp-scope.md` | vazio |
| `docs/product/roadmap.md` | vazio |

### Negócio
| Arquivo | Estado |
|---------|--------|
| `docs/business/business-model.md` | vazio |
| `docs/business/monetization.md` | vazio |
| `docs/business/market-analysis.md` | vazio |
| `docs/business/competitors.md` | vazio |
| `docs/business/pricing.md` | vazio |
| `docs/business/go-to-market.md` | vazio |
| `docs/business/risks.md` | vazio |

### Arquitetura
| Arquivo | Estado |
|---------|--------|
| `docs/architecture/architecture-overview.md` | vazio |
| `docs/architecture/system-context.md` | vazio |
| `docs/architecture/technology-decision.md` | vazio |
| `docs/architecture/integration-map.md` | vazio |
| `docs/architecture/data-strategy.md` | vazio |
| `docs/architecture/scalability-strategy.md` | vazio |
| `docs/architecture/observability-strategy.md` | vazio |

### Security
| Arquivo | Estado |
|---------|--------|
| `docs/security/security-requirements.md` | vazio |
| `docs/security/threat-model.md` | vazio |
| `docs/security/auth-strategy.md` | vazio |
| `docs/security/secrets-management.md` | vazio |
| `docs/security/vuln-scan-strategy.md` | vazio |
| `docs/security/audit-logging.md` | vazio |

### LGPD
| Arquivo | Estado |
|---------|--------|
| `docs/security/lgpd/data-inventory.md` | vazio |
| `docs/security/lgpd/consent-strategy.md` | vazio |
| `docs/security/lgpd/retention-policy.md` | vazio |
| `docs/security/lgpd/subject-rights.md` | vazio |
| `docs/security/lgpd/vendor-dpa.md` | vazio |
| `docs/security/lgpd/incident-notification-plan.md` | vazio |

### Operations
| Arquivo | Estado |
|---------|--------|
| `docs/operations/observability.md` | vazio |
| `docs/operations/slos.md` | vazio |
| `docs/operations/incident-response.md` | vazio |
| `docs/operations/backup-restore.md` | vazio |
| `docs/operations/cost-tracking.md` | vazio |
| `docs/operations/feature-flags.md` | vazio |
| `docs/operations/runbooks/` (1+ runbook por módulo crítico) | vazio |

### Deployment
| Arquivo | Estado |
|---------|--------|
| `docs/deployment/ci-pipeline.md` | vazio |
| `docs/deployment/cd-pipeline.md` | vazio |
| `docs/deployment/deployment-strategy.md` | vazio |

### Launch
| Arquivo | Estado |
|---------|--------|
| `docs/launch/launch-readiness.md` | vazio |
| `docs/launch/security-final-review.md` | vazio |
| `docs/launch/lgpd-compliance-check.md` | vazio |
| `docs/launch/performance-baseline.md` | vazio |

### Maintenance
| Arquivo | Estado |
|---------|--------|
| `docs/maintenance/deprecation-policy.md` | vazio |
| `docs/maintenance/dependency-update-policy.md` | vazio |

### Outros pilares
| Categoria | Status |
|-----------|--------|
| Módulos definidos | 0 |
| Specs prontas | 0 |
| ADRs criados | 0 |
| Riscos documentados | 0 |
| Perguntas em aberto | 0 |
| Postmortems | 0 |

## Gates de readiness

Rodar incrementalmente conforme phase atual.

- [ ] **`--planning`** — produto + negócio + arquitetura + testing + segurança baseline.
- [ ] **`--security`** — threat model + auth + secrets + encryption + audit + rate limit.
- [ ] **`--lgpd`** — ROPA + consent + retenção + direitos do titular.
- [ ] **`--pre-launch`** — checklist final + outputs de cada phase prévia.

**Resultado de `bash .genesis/scripts/check-readiness.sh`:** _(rodar e colar)_

## Bloqueios atuais

_(liste o que está travando o avanço)_

## Próxima ação

_(o que a IA vai conduzir no próximo passo)_
