# CI/CD

> Como o código sai do laptop e chega na produção. Pipeline definido por arquivo, idempotente, reproduzível.

## Princípios

1. **Pipeline como código.** Versionar no repo, revisar como código normal.
2. **Pipeline mesmo para todos.** Sem etapas manuais escondidas.
3. **Falhar cedo, falhar barato.** Gates rápidos primeiro.
4. **Builds reproduzíveis.** Mesma entrada → mesma saída.

## Estágios do pipeline (típico)

### 1. Setup
- Checkout
- Cache de dependências
- Restauração de toolchain

### 2. Verificação rápida
- Lint
- Format
- Tipos
- Detect secrets

### 3. Testes
- Unitário
- Integração (com test container)
- Contrato (quando contrato mudou)
- E2E (apenas para PR para main ou branches release)

### 4. Segurança
- SCA (dependências)
- SAST (código)
- Scan de imagem (quando container)

### 5. Build
- Compilação / bundling
- Geração de artefato versionado
- Push para registry

### 6. Deploy
- Aplicar migrações expand
- Rolling deploy
- Aplicar feature flags se houver
- Smoke test pós-deploy

### 7. Pós-deploy
- Validar SLOs por janela
- Notificar canal de release

## Convenções

### Branches
- `main` — produção, sempre deployable
- `feat/*`, `fix/*`, `chore/*` — branches de trabalho
- Sem long-lived `develop`

### Commits
- Convencional: `tipo(escopo): mensagem`
- Tipos comuns: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`

### PRs
- Título descritivo
- Descrição com: motivação, mudança, como testar, riscos
- Linkar spec / ADR / issue

## Política de auto-deploy

| Branch | Ambiente |
|--------|----------|
| PR | preview |
| main | staging |
| tag release | produção |

Produção exige tag manual, não merge automático.

## Time-to-prod alvo

- Mudança trivial (typo, doc): minutos
- Mudança comum: dia
- Mudança grande: semana, atrás de feature flag

## Métricas DORA (mínimo monitorar)

- Deployment frequency
- Lead time for changes
- Change failure rate
- Mean time to recovery

## Falhas comuns a prevenir

- Cache envenenado → invalidação por SHA do lockfile
- Race em deploy paralelo → lock de pipeline
- Migração esquecida → checagem de schema no smoke
- Secret em log → scrubber + scan

## Ferramentas (a definir)

| Função | Ferramenta candidata |
|--------|------------------------|
| Runner | _(GitHub Actions / GitLab CI / Buildkite)_ |
| Registry | _(GHCR / ECR / Docker Hub privado)_ |
| Deploy | _(Argo CD / Flux / scripts próprios)_ |
| Feature flags | _(Unleash / Flipt / Statsig)_ |
| Observabilidade | _(ver [../architecture/observability-strategy.md](../architecture/observability-strategy.md))_ |
