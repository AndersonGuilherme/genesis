# Plan: Block F — Pre-launch + Maintenance (retro)

> Plan retrospectivo. Execução real ocorreu em `83cf27f`. Tarefas listadas refletem o que foi shipped.

## Spec link

- `docs/superpowers/specs/2026-05-23-block-f-prelaunch-maint-design.md`
- Plano-mestre: `~/.claude/plans/fa-a-isso-mantendo-a-wondrous-rabbit.md`

## Pré-condições (na data do shipped)

- Blocos C/D/E em main.

## Tasks executadas

1. **4 rules** em `.claude/rules/`
   - prelaunch-gate-complete, maint-deprecation-policy, maint-backward-compatibility, maint-security-patch-sla.
2. **6 skills** em `.claude/skills/`
   - prelaunch-security-final-review, prelaunch-lgpd-compliance-check, prelaunch-performance-baseline, prelaunch-launch-readiness-gate, maint-dependency-update, maint-incident-retrospective.
3. **2 agents** em `.claude/agents/`
   - prelaunch-launch-reviewer, maint-incident-historian.
4. **3 templates** em `.genesis/templates/`
   - launch-readiness-checklist-template, incident-postmortem-template, dependency-update-policy-template.
5. **6 narrativas** em `.genesis/docs/skills/`.
6. **CLAUDE.md** — seções "Regras de pre-launch" + "Regras de maintenance" + 2 agents.
7. **README.md** — blocos Pre-launch + Maintenance + counts finais.
8. **`.genesis/docs/skills/README.md`** — phases Pre-launch + Maintenance adicionadas.
9. **`.genesis/scripts/lint-docs.sh`** — counts finais (56 skills, 22 agents, 46 rules, 31 templates).

## Validação

- `bash .genesis/scripts/lint-docs.sh` → APROVADO.

## Commit

`83cf27f` — `feat(prelaunch+maint): Block F — prelaunch-* + maint-* skills/rules/agents/templates`

## Lifecycle completo

Após este bloco, lifecycle 8-phase fechado:

```
discovery → planning → security → lgpd → development → pre-launch → operations → maintenance
```
