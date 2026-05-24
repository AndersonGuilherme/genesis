# Tests: ops-setup-ci-pipeline

## Pré-condição
- Stack escolhida.
- Provider CI escolhido (GitHub Actions, GitLab CI, CircleCI).

## Prompts canônicos
- "configurar CI"
- "pipeline com lint/test/scan"
- "GitHub Actions workflow"

## Comportamentos esperados
- [ ] Estágios: lint → unit test → integration test → build → secret scan → dep scan → SAST.
- [ ] Falha em qualquer estágio bloqueia merge.
- [ ] Cache de dependências configurado.
- [ ] Secrets do CI via vault do provider (não em código).
- [ ] Artefato versionado com `git sha`.
- [ ] Notificação de falha em main.
- [ ] Tempo total alvo < 15min.

## Anti-padrões
- [ ] NÃO usa `continue-on-error` em estágio bloqueante.
- [ ] NÃO hardcoda secrets no workflow.
- [ ] NÃO faz deploy direto no CI (CD separado).
