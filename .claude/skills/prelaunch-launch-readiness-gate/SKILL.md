---
name: prelaunch-launch-readiness-gate
description: Gate final consolidado. Wrapper que invoca security final, LGPD check, performance baseline + valida observability/runbooks ativos. Produz checklist + go/no-go.
phase: pre-launch
rules:
  - prelaunch-gate-complete
  - ops-runbook-required
  - ops-alert-actionable
---

# Skill: prelaunch-launch-readiness-gate

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Consolidar resultado de pre-launch em checklist único + reunião go/no-go com leads + DPO + IC oncall.

## Quando usar

- Última etapa antes do go-live.
- Re-validação anual ou pós-mudança arquitetural significativa.

## Pré-condições

- `prelaunch-security-final-review` executada.
- `prelaunch-lgpd-compliance-check` executada.
- `prelaunch-performance-baseline` executada.
- Observability ativa, runbooks publicados, oncall configurado.
- Template `.genesis/templates/launch-readiness-checklist-template.md`.

## Processo

1. Preencher checklist em `docs/launch/launch-readiness.md`:
   - **Segurança**: vincular `security-final-review.md`.
   - **LGPD**: vincular `lgpd-compliance-check.md`.
   - **Performance**: vincular `performance-baseline.md`.
   - **Operations**: SLOs ativos, runbooks publicados, observability validada, backup com restore drill, CI/CD com gates, feature flags configuradas.
   - **Incident response**: oncall rotation ativa, playbook publicado, drill recente.
   - **Produto**: suporte preparado, comunicação pré/durante/pós-launch pronta, status page funcional.
   - **Negócio**: pricing publicado, T&C + privacy notice acessíveis, billing testado.
2. Cada item com responsável + evidência (link) + status (OK / dívida / bloqueante).
3. Listar dívidas não-bloqueantes com deadline pós-launch.
4. Reunião go/no-go: leads + DPO + IC oncall + produto. Assinatura conjunta.
5. Decisão registrada em ata + commit no repo.
6. Comunicar resultado ao time.

## Restrições

- Item bloqueante pendente = no-go. Sem exceção por pressão de prazo.
- Dívidas não-bloqueantes com owner + deadline registrado (cross-link `maint-*`).
- Assinatura conjunta obrigatória (não decisão de 1 pessoa).

## Exemplos de uso

- "Rodar launch readiness gate do tchr."
- "Re-validar após adicionar pagamento."

## Critérios de conclusão

- [ ] Checklist completo + evidências.
- [ ] Dívidas não-bloqueantes documentadas.
- [ ] Reunião go/no-go executada.
- [ ] Ata assinada.
- [ ] Time comunicado.
- [ ] `docs/launch/launch-readiness.md` finalizado com go/no-go.
