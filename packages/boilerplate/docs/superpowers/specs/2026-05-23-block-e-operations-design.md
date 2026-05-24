# Spec: Block E — Operations phase

> Spec retrospectivo. Bloco shipped em `d254b42` (2026-05-23).

## Contexto

Após development, app gerado precisava virar produto operável. Sem CI/CD, observability, SLO, runbooks, incident response — apps caíam silenciosamente e ninguém sabia. Block E fecha esse gap.

## Objetivo

Phase `operations` após `development`. Define como produção é construída, observada, mantida estável e recupera de incidente.

## Decisões registradas

| Decisão | Escolha |
|---------|---------|
| Observability backbone | OpenTelemetry (portabilidade entre providers) |
| SLO framework | Google SRE — SLI/SLO/error budget/burn rate alerts |
| Skills ops-* shipped | 10 (setup-ci-pipeline, setup-cd-pipeline, define-observability, define-slos-slis, define-runbook, define-incident-response, setup-backup-restore, cost-tracking, feature-flags-strategy, define-deployment-strategy) |
| Rules ops-* shipped | 6 (structured-logging, correlation-id, alert-actionable, runbook-required, rollback-tested, no-prod-debug-flag) |
| Agents | 2 (sre-mentor, incident-commander) |
| Templates | 4 (runbook, incident-playbook, ci-pipeline, slo-sli) |
| Cross-cutting em dev | Rules `ops-structured-logging` + `ops-correlation-id` aplicadas via menção em CLAUDE.md (não via dev variant — overhead seria alto) |

## Out-of-scope

- Implementação específica de provider (Datadog vs Grafana vs Honeycomb).
- Custos de licenciamento.
- IaC (Terraform/Pulumi) — boilerplate é stack-neutral, IaC vira ADR no projeto-filho.

## Cross-link

- Plano-mestre: `~/.claude/plans/fa-a-isso-mantendo-a-wondrous-rabbit.md`
- Commit principal: `d254b42`
- Pre-launch (Block F) depende de ops ativa pra checklist.

## Validação shipped

- `bash .genesis/scripts/lint-docs.sh` APROVADO.
- Counts pós-bloco: 50 skills, 20 agents, 42 rules, 28 templates.
