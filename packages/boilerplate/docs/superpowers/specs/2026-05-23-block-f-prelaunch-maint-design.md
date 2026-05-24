# Spec: Block F — Pre-launch + Maintenance phases

> Spec retrospectivo. Bloco shipped em `83cf27f` (2026-05-23).

## Contexto

Após development + operations, app gerado tinha todas as peças, mas faltava (a) gate consolidado que valida que tudo foi mesmo construído antes de go-live, e (b) rotinas pra manter sistema vivo após launch.

## Objetivo

Phases `pre-launch` (gate final) + `maintenance` (rotinas contínuas pós-launch). Fecha o lifecycle de 8 phases.

## Decisões registradas

| Decisão | Escolha |
|---------|---------|
| Phases combinadas no bloco | Pre-launch + maintenance são "fechamento do ciclo". Compactos comparados a C/D/E |
| Skills prelaunch-* shipped | 4 (security-final-review, lgpd-compliance-check, performance-baseline, launch-readiness-gate) |
| Skills maint-* shipped | 2 (dependency-update, incident-retrospective) |
| Rules shipped | 4 (prelaunch-gate-complete, maint-deprecation-policy, maint-backward-compatibility, maint-security-patch-sla) |
| Agents | 2 (prelaunch-launch-reviewer, maint-incident-historian) |
| Templates | 3 (launch-readiness-checklist, incident-postmortem, dependency-update-policy) |
| SLA de patch | CRITICAL ≤24h, HIGH ≤7d, MEDIUM ≤30d, LOW ≤90d |
| Janela de deprecação | 90 dias ou 2 versões major (o maior) |

## Out-of-scope

- Skills de migração entre versões major do produto (cobre por ADR no projeto-filho).
- Skills de feature deprecation específica (genérico em `maint-deprecation-policy`).
- Customer success / support workflows (fora do escopo de engenharia).

## Cross-link

- Plano-mestre: `~/.claude/plans/fa-a-isso-mantendo-a-wondrous-rabbit.md`
- Commit principal: `83cf27f`
- Pre-launch valida outputs de C+D+E.
- Maintenance consome runbooks (Block E) e postmortems (cruzados pelo agent historian).

## Validação shipped

- `bash .genesis/scripts/lint-docs.sh` APROVADO.
- Counts finais: 56 skills, 22 agents, 46 rules, 31 templates.
