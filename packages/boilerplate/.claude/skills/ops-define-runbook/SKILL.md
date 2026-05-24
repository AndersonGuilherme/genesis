---
name: ops-define-runbook
description: Cria runbook por módulo crítico — arquitetura, dependências, alertas, procedimentos comuns, contatos. Produz `docs/operations/runbooks/<modulo>.md`.
phase: operations
rules:
  - ops-runbook-required
  - ops-alert-actionable
---

# Skill: ops-define-runbook

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Produzir runbook completo pra módulo crítico — oncall consegue resolver incidente comum sem ajuda externa.

## Quando usar

- Antes de módulo crítico entrar em produção.
- Após mudança significativa na arquitetura do módulo.
- Após incidente novo (atualizar com aprendizado).

## Pré-condições

- Módulo classificado como crítico em `docs/operations/critical-modules.md`.
- Observability ativa (métricas + logs + traces).
- Template `.genesis/templates/runbook-template.md` disponível.

## Processo

1. Propósito do módulo (1 parágrafo).
2. Arquitetura resumida (1 diagrama mermaid).
3. Dependências upstream (quem chama) + downstream (quem é chamado).
4. Alertas associados: lista + threshold + severidade + ação imediata.
5. SLO/SLI atual.
6. Procedimentos comuns:
   - Deploy.
   - Rollback.
   - Restart graceful.
   - Scale up/down.
   - Debug comum (top 5 sintomas).
7. Procedimentos de incidente:
   - P1 (caminho de receita parado).
   - P2 (degradação).
   - P3 (alerta sem impacto direto).
8. Contatos: oncall rotation, owner do módulo, dependências externas (com SLA).
9. Dashboards relevantes (links).
10. Preencher `docs/operations/runbooks/<modulo>.md`.

## Restrições

- Sem "ver com fulano" — fulano sai, conhecimento vai junto.
- Procedimento testado em staging antes de virar canônico.
- Atualizar após cada incidente que revele gap.

## Exemplos de uso

- "Criar runbook do módulo billing."
- "Atualizar runbook do auth após incidente de quota expirada."

## Critérios de conclusão

- [ ] Arquitetura + dependências documentadas.
- [ ] Alertas mapeados com ação.
- [ ] SLO atual referenciado.
- [ ] Procedimentos comuns descritos.
- [ ] Procedimentos de incidente por severidade.
- [ ] Contatos atualizados.
- [ ] Dashboards linkados.
- [ ] `docs/operations/runbooks/<modulo>.md` completo.
