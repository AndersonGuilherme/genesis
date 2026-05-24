---
name: maint-incident-retrospective
description: Conduz postmortem blameless após incidente. Timeline factual, análise de causa raiz, action items com owner + deadline. Produz `docs/operations/postmortems/<date>-<slug>.md`.
phase: maintenance
rules:
  - ops-alert-actionable
  - ops-runbook-required
  - sec-audit-trail
---

# Skill: maint-incident-retrospective

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Postmortem estruturado, blameless, que extrai aprendizado e gera ações concretas.

## Quando usar

- Após cada incidente SEV1 ou SEV2.
- Em SEV3 recorrente (terceira ocorrência do mesmo sintoma).
- Em near-miss significativo (escape detectado a tempo, mas merecia análise).

## Pré-condições

- Incidente resolvido.
- Timeline registrada no canal #incident-* (cross-link `ops-define-incident-response`).
- Template `.genesis/templates/incident-postmortem-template.md`.

## Processo

1. Marcar postmortem meeting em ≤5 dias úteis do resolution.
2. Reconstruir timeline:
   - Detecção (quem/o quê detectou, em que timestamp).
   - Resposta (quem assumiu IC, quando, quais decisões).
   - Mitigação (o que parou o sangramento, timestamp).
   - Resolução (sistema normal).
3. Análise:
   - Causa próxima (o quê causou diretamente o sintoma).
   - Causas contribuintes (5 whys, fatores sistêmicos).
   - O que detectou mais cedo? O que poderia ter detectado mais cedo?
   - O que mitigou? O que poderia ter mitigado mais rápido?
4. **Blameless**: foco em sistema, não pessoa. Nomes só para contexto factual.
5. Action items (cada um):
   - **Owner** (nome).
   - **Deadline** (data).
   - **Tipo** (prevenção / detecção / recovery / processo).
   - Trackeado até conclusão (não some no Slack).
6. Aprendizado compartilhado:
   - Postmortem público interno.
   - SEV1 externo: versão sanitizada publicada (status page, blog).
7. Atualizar runbook do módulo (cross-link `ops-define-runbook`).
8. Preencher `docs/operations/postmortems/<YYYY-MM-DD>-<slug>.md`.

## Restrições

- Sem culpabilização individual.
- Sem action item sem owner + deadline.
- Sem fechamento sem timeline + análise + ações.
- Sem confidencialidade desnecessária (compartilhar internamente acelera aprendizado).

## Exemplos de uso

- "Conduzir postmortem do incidente de 2026-05-20 (auth down 30min)."
- "Postmortem do near-miss do data corruption de 2026-04-15."

## Critérios de conclusão

- [ ] Meeting realizada.
- [ ] Timeline completa.
- [ ] Análise de causa + contribuintes.
- [ ] Action items com owner + deadline.
- [ ] Postmortem compartilhado.
- [ ] Runbook atualizado.
- [ ] `docs/operations/postmortems/<arquivo>.md` completo.
