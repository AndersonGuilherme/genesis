# Tests: design-architecture

## Pré-condição
- `technology-decision.md` preenchida com ADR de stack.
- `mvp-scope.md` definido.

## Prompts canônicos
- "vamos desenhar a arquitetura"
- "como estruturamos a parte de pagamentos e marketplace?"
- "precisamos de microserviços?"

## Comportamentos esperados
- [ ] Esboça C4-lite níveis 1 e 2.
- [ ] Preenche `integration-map.md` com criticidade e fallback.
- [ ] Preenche `data-strategy.md` com multi-tenancy e retenção.
- [ ] Preenche `auth-strategy.md`, `security-requirements.md`, `data-privacy.md`.
- [ ] Preenche `deployment-strategy.md`, `environments.md`, `ci-cd.md`.
- [ ] Preenche `monitoring.md`, `logging.md`, `incident-response.md`.
- [ ] Cria ≥ 3 ADRs estruturais.
- [ ] Sugere `plan-modules`.

## Anti-padrões
- [ ] NÃO recomenda microserviços sem volume justificável.
- [ ] NÃO aceita "vamos definir depois" para auth, observabilidade ou backup.
- [ ] NÃO endossa Kubernetes "pra estar preparado".
- [ ] NÃO ignora multi-tenancy quando o produto exige.
