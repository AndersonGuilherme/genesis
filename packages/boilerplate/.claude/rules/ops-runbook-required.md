---
name: ops-runbook-required
description: Cada módulo crítico tem runbook publicado. Conteúdo mínimo: dependências, alertas associados, procedimentos de recuperação, contatos. Sem runbook = não vai pra produção.
phase: operations
---

# Rule: ops-runbook-required

## Princípio

Cada módulo crítico (no caminho de receita, autenticação, dado regulado, dependência forte) tem runbook em `docs/operations/runbooks/<modulo>.md`. Conteúdo: arquitetura resumida, dependências, alertas associados, procedimentos comuns (deploy, rollback, restart, debug), contatos.

## Por que existe

Incidente às 3h da manhã. Oncall não sabe como reiniciar o serviço. Procura no Slack. Acha thread de 6 meses atrás, parcial. Roda comando errado. Aumenta impacto. Runbook elimina esse caminho. Tribal knowledge mata produção.

## Como aplicar

1. Lista de módulos críticos vive em `docs/operations/critical-modules.md`.
2. Cada crítico tem `docs/operations/runbooks/<modulo>.md` com template padrão.
3. Runbook usa template `.genesis/templates/runbook-template.md`.
4. PR que adiciona alerta novo → link pro runbook (cross-link `ops-alert-actionable`).
5. Revisão trimestral: runbook ainda reflete realidade?
6. Incidente novo → atualizar runbook no postmortem.

## Conteúdo mínimo do runbook

- Propósito do módulo.
- Arquitetura resumida (1 diagrama).
- Dependências (upstream + downstream).
- Alertas associados + thresholds + severidade.
- SLO/SLI atual.
- Procedimentos comuns: deploy, rollback, restart, scale, debug.
- Procedimentos de incidente por severidade.
- Contatos: oncall, owner do módulo, dependências externas.
- Dashboards relevantes (links).

## Exemplos bons

- `docs/operations/runbooks/billing.md` cobrindo todos os pontos acima.
- Postmortem do incidente atualizou runbook na mesma semana.
- Novo membro do time consegue resolver incidente comum sem ajuda.

## Exemplos ruins

- "Tem o Confluence wiki que cobre isso" — desatualizado, ninguém abre.
- Runbook só com "rodar `kubectl restart`" — sem contexto, sem alternativa.
- Runbook criado uma vez, nunca atualizado após mudança de arquitetura.
- Módulo crítico em produção sem runbook.

## Exceções

- Módulos não-críticos (background batch, ferramenta interna) podem ter runbook mais leve.
- POCs/experimentos com flag, vida curta, time pequeno — runbook pode ser comentário no PR.

