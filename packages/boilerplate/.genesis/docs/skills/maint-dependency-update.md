# maint-dependency-update

## O que faz
Rotina de update de dependências — periodicidade, triage de CVE, teste, deploy. SLA de patch por severidade.

## Quando você invoca
Rotina semanal/quinzenal. Ao receber CVE com SLA estrito. Antes de major release.

## O que a IA faz
1. Renovate/Dependabot abre PRs automáticos.
2. Triage por tipo (patch/minor/major).
3. CVE com severidade dispara SLA (cross-link `maint-security-patch-sla`).
4. Valida CI + smoke staging + canary prod.
5. Auditoria mensal de deps obsoletas/abandonadas/licença.

## Rules invocadas
- [maint-security-patch-sla](../../../.claude/rules/maint-security-patch-sla.md)
- [ops-rollback-tested](../../../.claude/rules/ops-rollback-tested.md)

## Próximo passo natural
Próximo batch ou triage de CVE novo.
