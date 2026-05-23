# CI Pipeline: <nome-do-sistema>

> Aplicado pela skill `ops-setup-ci-pipeline`. Workflow stack-neutral com seções por ferramenta.

## Visão geral

```
push/PR → lint → unit test → integration test → build → security scans → coverage gate
                                                                              ↓
                                                                       merge habilitado
```

Tempo total alvo: **< 15min**. Acima disso, paralelizar.

## Estágios

### 1. Lint (formatter + linter)

- Falha = bloqueia merge.
- Roda paralelo com unit tests.

| Stack | Ferramenta |
|-------|-----------|
| TypeScript/JS | eslint + prettier |
| Python | ruff (substitui black + flake8) |
| Go | go vet + gofmt + staticcheck |
| Rust | clippy + rustfmt |

### 2. Unit test

- Falha = bloqueia.
- Tempo alvo < 2min.
- Coverage gate (cross-link com `docs/testing/testing-strategy.md`).

### 3. Integration test

- Containers efêmeros pra deps (postgres, redis, etc.) via testcontainers/docker-compose.
- Tempo alvo < 5min.

### 4. Build

- Artefato versionado: `<imagem>:<git-sha>` + tag semver se release.
- Push para registry (ECR/GHCR/Artifact Registry).
- Multi-stage Dockerfile recomendado.

### 5. Secret scan

- Ferramenta: gitleaks ou trufflehog.
- Roda no diff (rápido).
- Falha = bloqueia (cross-link `sec-secrets-no-commit`).

### 6. Dep vuln scan

- Ferramenta: snyk, npm audit, safety, govulncheck, cargo audit.
- Threshold: CRITICAL = bloqueia, HIGH = warning até X dias, MEDIUM = informa.

### 7. SAST

- Ferramenta: semgrep, codeql.
- Regras: top 10 OWASP + custom rules do projeto.
- Threshold: CRITICAL/HIGH = bloqueia.

## Exemplo GitHub Actions

```yaml
name: ci

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read
  pull-requests: write

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: setup runtime
        uses: <stack-specific>
      - name: lint
        run: <stack-specific>

  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: setup
        uses: <stack-specific>
      - name: test
        run: <stack-specific>
      - name: coverage
        run: <stack-specific>

  integration-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: ci
        options: >-
          --health-cmd pg_isready
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v4
      - name: setup
        uses: <stack-specific>
      - name: integration
        run: <stack-specific>

  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: gitleaks
        uses: gitleaks/gitleaks-action@v2

  dep-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: dep scan
        run: <stack-specific>

  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: returntocorp/semgrep-action@v1

  build:
    needs: [lint, unit-test, integration-test, secret-scan, dep-scan, sast]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: build image
        run: <stack-specific>
      - name: push to registry
        run: <stack-specific>
```

## Cache de dependências

Cada stack tem mecanismo próprio. Cachear:
- Diretório de deps (`node_modules`, `.venv`, `~/.cargo`, etc.).
- Build cache do compilador quando aplicável.
- Imagens Docker base.

## Notificação

- Falha em main → Slack/Discord canal de eng.
- Falha em PR → comment no PR.

## Secrets do CI

- Vault do provider (GitHub Secrets, GitLab CI Variables).
- Nunca em código nem em log (cross-link `sec-secrets-no-commit`).

## Métricas do pipeline

- Tempo total (deve ficar < 15min).
- Taxa de falha por estágio.
- Flakiness rate (testes intermitentes).

Revisão mensal: tempo crescendo? flakes? atuar.
