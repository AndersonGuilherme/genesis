---
name: maint-dependency-update
description: Rotina de atualização de dependências — periodicidade, triage de CVE, teste, deploy. Mantém sistema com baseline de segurança e funcional.
phase: maintenance
rules:
  - maint-security-patch-sla
  - ops-rollback-tested
---

# Skill: maint-dependency-update

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Processo periódico (semanal/quinzenal) de update de deps + triage de CVE + validação por teste + deploy. Evita acumular dívida.

## Quando usar

- Rotina periódica (recomendado: semanal pra patch, mensal pra minor).
- Ao receber CVE notification com SLA estrito.
- Antes de major release (limpar deps obsoletas).

## Pré-condições

- CI verde com pipeline rodando lint/test/scan (cross-link `ops-setup-ci-pipeline`).
- Tooling de update automatizado (Renovate, Dependabot, scheduled job).
- Política de update em `docs/maintenance/dependency-update-policy.md` (template `.genesis/templates/dependency-update-policy-template.md`).

## Processo

1. Ferramenta abre PR automático por update (Renovate/Dependabot com config).
2. Triage:
   - Patch (`x.y.Z`): low risk, merge se CI verde.
   - Minor (`x.Y.z`): review breaking changes em changelog, merge.
   - Major (`X.y.z`): review profundo, testar manualmente, considerar adiar se quebrante.
3. CVE com severidade definida no `maint-security-patch-sla`:
   - CRITICAL/HIGH: priorizar acima de feature.
   - MEDIUM/LOW: incluir no batch semanal.
4. Validar:
   - CI completo.
   - Smoke test em staging.
   - Canary em produção (cross-link `ops-setup-cd-pipeline`).
5. Documentar updates relevantes em changelog interno.
6. Auditoria mensal: deps desatualizadas > N meses? deps com licença incompatível? deps abandonadas (sem commit há > 1 ano)?
7. Considerar substituição de deps abandonadas com risco crescente.

## Restrições

- Sem merge de update sem CI verde.
- Sem skip de triage de major (quebrante pode aparecer).
- CVE crítico não espera batch semanal.
- Configuração de Renovate/Dependabot revisada periodicamente.

## Exemplos de uso

- "Rodar dependency update do tchr — batch semanal."
- "Atualizar deps com CVE alto antes do release."

## Critérios de conclusão

- [ ] PRs de update revisados e mergeados.
- [ ] CVE com SLA atendido.
- [ ] Changelog atualizado.
- [ ] Auditoria de deps obsoletas (mensal).
- [ ] Substituições programadas pra deps abandonadas.
