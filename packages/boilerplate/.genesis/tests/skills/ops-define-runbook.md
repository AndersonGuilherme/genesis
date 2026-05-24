# Tests: ops-define-runbook

## Pré-condição
- Módulo classificado como crítico em `docs/operations/critical-modules.md`.
- Observability ativa.

## Prompts canônicos
- "criar runbook"
- "documentar procedimentos de incidente"
- "runbook do módulo billing"

## Comportamentos esperados
- [ ] Propósito + arquitetura resumida (1 diagrama mermaid).
- [ ] Dependências upstream + downstream.
- [ ] Alertas associados + threshold + severidade + ação imediata.
- [ ] SLO/SLI atual referenciado.
- [ ] Procedimentos: deploy, rollback, restart graceful, scale, debug top-5.
- [ ] Procedimentos de incidente por severidade.
- [ ] Contatos (oncall + owner + dependências externas).
- [ ] Dashboards linkados.
- [ ] Produz `docs/operations/runbooks/<modulo>.md`.

## Anti-padrões
- [ ] NÃO confia em "ver com fulano" — fulano sai.
- [ ] NÃO publica runbook não testado em staging.
- [ ] NÃO esquece de atualizar após postmortem.
