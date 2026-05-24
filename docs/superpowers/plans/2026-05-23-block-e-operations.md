# Plan: Block E — Operations (retro)

> Plan retrospectivo. Execução real ocorreu em `d254b42`. Tarefas listadas refletem o que foi shipped.

## Spec link

- `docs/superpowers/specs/2026-05-23-block-e-operations-design.md`
- Plano-mestre: `~/.claude/plans/fa-a-isso-mantendo-a-wondrous-rabbit.md`

## Pré-condições (na data do shipped)

- Blocos C (security) + D (lgpd) em main.

## Tasks executadas

1. **6 rules ops-*** em `.claude/rules/ops-*.md`
   - structured-logging, correlation-id, alert-actionable, runbook-required, rollback-tested, no-prod-debug-flag.
2. **10 skills ops-*** em `.claude/skills/ops-*/SKILL.md`
   - setup-ci-pipeline, setup-cd-pipeline, define-observability, define-slos-slis, define-runbook, define-incident-response, setup-backup-restore, cost-tracking, feature-flags-strategy, define-deployment-strategy.
3. **2 agents ops-*** em `.claude/agents/ops-*.md`
   - sre-mentor, incident-commander.
4. **4 templates** em `.genesis/templates/`
   - runbook-template, incident-playbook-template, ci-pipeline-template, slo-sli-template.
5. **10 narrativas** em `.genesis/docs/skills/`.
6. **CLAUDE.md** — nova seção "Regras de operations" + 2 agents.
7. **README.md** — novo bloco Operations + counts.
8. **`.genesis/docs/skills/README.md`** — phase Operations adicionada.
9. **`.genesis/scripts/lint-docs.sh`** — counts atualizados (50 skills, 20 agents, 42 rules, 28 templates).

## Validação

- `bash .genesis/scripts/lint-docs.sh` → APROVADO.

## Commit

`d254b42` — `feat(ops): Block E — ops-* skills/rules/agents/templates`
