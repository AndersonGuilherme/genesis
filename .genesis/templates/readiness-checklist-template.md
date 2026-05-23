# Readiness Checklist

> Checklist usada pela skill `review-readiness` antes de liberar desenvolvimento. Cada item marca um sinal mínimo de prontidão.

## Como usar

1. Rodar `bash .genesis/scripts/check-readiness.sh` para o gate automático.
2. Marcar abaixo o que está realmente preenchido (não apenas o arquivo existir).
3. Itens em vermelho bloqueiam o início do desenvolvimento.

## Negócio e produto

- [ ] Visão de produto clara em [docs/product/product-vision.md](../../docs/product/product-vision.md)
- [ ] Problema bem definido em [docs/product/problem-statement.md](../../docs/product/problem-statement.md), com evidências
- [ ] Persona primária identificada em [docs/product/target-users.md](../../docs/product/target-users.md)
- [ ] Pelo menos 1 jornada crítica em [docs/product/user-journeys.md](../../docs/product/user-journeys.md)
- [ ] Proposta de valor passa no "teste do crítico" em [docs/product/value-proposition.md](../../docs/product/value-proposition.md)
- [ ] MVP com IN/OUT, critério de sucesso e fracasso em [docs/product/mvp-scope.md](../../docs/product/mvp-scope.md)
- [ ] Modelo de negócio em [docs/business/business-model.md](../../docs/business/business-model.md)
- [ ] Pelo menos 1 fonte de receita em [docs/business/monetization.md](../../docs/business/monetization.md)
- [ ] Pelo menos 5 riscos de negócio em [docs/business/risks.md](../../docs/business/risks.md)

## Arquitetura e tecnologia

- [ ] Visão geral em [docs/architecture/architecture-overview.md](../../docs/architecture/architecture-overview.md)
- [ ] Contexto do sistema em [docs/architecture/system-context.md](../../docs/architecture/system-context.md)
- [ ] Decisão de stack + ADR em [docs/architecture/technology-decision.md](../../docs/architecture/technology-decision.md)
- [ ] Integrações mapeadas em [docs/architecture/integration-map.md](../../docs/architecture/integration-map.md)
- [ ] Estratégia de dados em [docs/architecture/data-strategy.md](../../docs/architecture/data-strategy.md)
- [ ] Estratégia de escalabilidade em [docs/architecture/scalability-strategy.md](../../docs/architecture/scalability-strategy.md)
- [ ] Estratégia de observabilidade em [docs/architecture/observability-strategy.md](../../docs/architecture/observability-strategy.md)

## Segurança e privacidade

- [ ] Requisitos em [docs/security/security-requirements.md](../../docs/security/security-requirements.md)
- [ ] Auth strategy em [docs/security/auth-strategy.md](../../docs/security/auth-strategy.md)
- [ ] Inventário de PII em [docs/security/data-privacy.md](../../docs/security/data-privacy.md)
- [ ] Threat model inicial em [docs/security/threat-model.md](../../docs/security/threat-model.md)

## Testes e qualidade

- [ ] Estratégia em [docs/testing/testing-strategy.md](../../docs/testing/testing-strategy.md)
- [ ] Formato de critérios em [docs/testing/acceptance-criteria.md](../../docs/testing/acceptance-criteria.md)
- [ ] Quality gates em [docs/testing/quality-gates.md](../../docs/testing/quality-gates.md)

## Deploy e operação

- [ ] Estratégia em [docs/deployment/deployment-strategy.md](../../docs/deployment/deployment-strategy.md)
- [ ] Ambientes em [docs/deployment/environments.md](../../docs/deployment/environments.md)
- [ ] CI/CD em [docs/deployment/ci-cd.md](../../docs/deployment/ci-cd.md)
- [ ] Monitoramento em [docs/operations/monitoring.md](../../docs/operations/monitoring.md)
- [ ] Logging em [docs/operations/logging.md](../../docs/operations/logging.md)
- [ ] Incident response em [docs/operations/incident-response.md](../../docs/operations/incident-response.md)

## Módulos e specs

- [ ] Lista de módulos do MVP em [docs/modules/README.md](../../docs/modules/README.md)
- [ ] Spec completa do primeiro módulo em `docs/specs/<modulo>/`
- [ ] Plano de implementação do primeiro módulo
- [ ] Pelo menos 3 ADRs estruturais em [docs/adr/](../../docs/adr/)

## Pesquisa e validação

- [ ] Premissas críticas identificadas em [docs/research/assumptions.md](../../docs/research/assumptions.md)
- [ ] Plano de validação para premissas fatais em [docs/research/validation-plan.md](../../docs/research/validation-plan.md)
- [ ] Nenhuma pergunta crítica em aberto sem responsável em [docs/research/open-questions.md](../../docs/research/open-questions.md)
- [ ] Checklist de validação de ideia em [docs/validation/idea-validation.md](../../docs/validation/idea-validation.md)
- [ ] Métricas de sucesso em [docs/validation/success-metrics.md](../../docs/validation/success-metrics.md)

## Resultado

| Item | Estado |
|------|--------|
| `bash .genesis/scripts/check-readiness.sh` | aprovado / reprovado |
| Decisão | **liberar** / **bloquear** |
| Responsável pela decisão | _(nome)_ |
| Data | YYYY-MM-DD |

## Próximo passo

Se aprovado: usar a skill `start-development` e escolher o primeiro módulo.
Se bloqueado: voltar à skill da fase pendente.
