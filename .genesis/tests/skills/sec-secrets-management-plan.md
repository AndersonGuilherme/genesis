# Tests: sec-secrets-management-plan

## Pré-condição
- Stack escolhida + ambientes (dev/staging/prod) identificados.

## Prompts canônicos
- "onde guardamos secrets?"
- "plano de rotação de chaves"
- "secrets management strategy"

## Comportamentos esperados
- [ ] Escolhe vault/KMS por ambiente (justificado).
- [ ] Define como app acessa secret em runtime (env var via vault provider, sidecar, SDK).
- [ ] Política de rotação (frequência + responsável + procedimento).
- [ ] Procedimento emergencial (rotação imediata em caso de vazamento).
- [ ] Produz `docs/security/secrets-management.md`.

## Anti-padrões
- [ ] NÃO aceita secret em arquivo de config commitado.
- [ ] NÃO aceita rotação manual sem cronograma.
- [ ] NÃO usa o mesmo secret entre ambientes.
