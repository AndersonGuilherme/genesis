---
name: lgpd-incident-notification-plan
description: Define playbook pra notificação ANPD + titulares em incidente de segurança com PII. LGPD art. 48 (prazo razoável). Produz `docs/security/lgpd/incident-notification-plan.md`.
phase: lgpd
rules:
  - lgpd-subject-rights-respected
  - lgpd-processing-registry
  - sec-audit-trail
---

# Skill: lgpd-incident-notification-plan

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Produzir `docs/security/lgpd/incident-notification-plan.md` com fluxo, responsáveis, templates e prazo pra notificação de incidente envolvendo PII.

## Quando usar

- Antes de go-live (incidente pode acontecer dia 1).
- Após mudança de equipe (atualizar contatos/responsáveis).
- Em auditoria de readiness.

## Pré-condições

- DPO ou responsável pela LGPD definido.
- Canal interno de comunicação de incidente (Slack channel, on-call rotation).
- Template `.genesis/templates/incident-playbook-template.md` (referência).

## Processo

1. Definir critérios pra "incidente notificável":
   - Acesso não autorizado a PII.
   - Vazamento (export indevido, configuração pública).
   - Perda de integridade (alteração não autorizada).
   - Indisponibilidade prolongada que impacta titular (ex.: portabilidade).
2. Severidade × volume × sensibilidade = nível (1-4). Cada nível tem fluxo.
3. Fluxo geral:
   - Detecção → contenção → comunicação interna → avaliação de impacto → decisão de notificação → notificação ANPD + titulares.
4. Prazo: "razoável" segundo art. 48 — convenção interna 72h (alinhado com GDPR).
5. Template de comunicação:
   - ANPD: formulário oficial (link).
   - Titular: email + status page + (se massivo) imprensa.
6. Responsáveis: DPO (decisão de notificar), CTO (contenção técnica), CEO/jurídico (comunicação externa).
7. Pós-incidente: postmortem + atualização de controles + auditoria de retenção.
8. Preencher `docs/security/lgpd/incident-notification-plan.md`.

## Restrições

- Não comunicar publicamente sem alinhamento com DPO/jurídico.
- Não destruir evidência durante contenção (preservar pra investigação).
- Audit log do próprio incidente preservado (cross-link `sec-audit-trail`).

## Exemplos de uso

- "Criar plano de notificação de incidente do tchr."
- "Revisar plano após simulação tabletop."

## Critérios de conclusão

- [ ] Critérios de incidente notificável definidos.
- [ ] Severidade × fluxo mapeado.
- [ ] Prazo interno definido (≤72h).
- [ ] Templates de comunicação prontos.
- [ ] Responsáveis nomeados.
- [ ] Pós-incidente documentado.
- [ ] `docs/security/lgpd/incident-notification-plan.md` completo.
