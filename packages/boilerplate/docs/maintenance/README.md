# Maintenance — Produção viva pós-launch

Local de saída das skills `maint-*` + políticas contínuas.

## Documentos esperados

| Arquivo | Skill / Rule | Atualização |
|---------|--------------|-------------|
| `deprecation-policy.md` | rule `maint-deprecation-policy` | Definida 1x, revisada semestralmente |
| `dependency-update-policy.md` | skill `maint-dependency-update` | Definida 1x, revisada semestralmente |
| `cve-history.md` | rule `maint-security-patch-sla` | Atualizada a cada CVE tratada |
| `incident-history-<YYYY-Q>.md` | agent `maint-incident-historian` | Trimestral |

## Rotinas

| Frequência | Atividade | Skill / Agent |
|------------|-----------|---------------|
| Semanal | Update de patches | `maint-dependency-update` |
| Quinzenal | Update de minors | `maint-dependency-update` |
| Mensal | Auditoria de FinOps | `ops-cost-tracking` |
| Mensal | Auditoria de SLA de CVE | rule `maint-security-patch-sla` |
| Trimestral | Histórico de incidentes + padrões | agent `maint-incident-historian` |
| Trimestral | Revisão de runbooks | rule `ops-runbook-required` |
| Trimestral | Restore drill de backup | skill `ops-setup-backup-restore` |
| Semestral | Revisão de DPAs + ROPA | skill `lgpd-vendor-dpa` + `lgpd-data-inventory` |
| Semestral | Auditoria de flag debt | skill `ops-feature-flags-strategy` |
| Semestral | Revisão de SLOs | skill `ops-define-slos-slis` |

## Pós-incidente

`maint-incident-retrospective` produz postmortem blameless em `docs/operations/postmortems/<YYYY-MM-DD>-<slug>.md` em ≤5 dias úteis após resolution (SEV1/SEV2 obrigatório).

## Cross-cutting rules ativas

- `maint-deprecation-policy` — toda mudança breaking em API pública.
- `maint-backward-compatibility` — toda API pública.
- `maint-security-patch-sla` — todo CVE em dependência.
