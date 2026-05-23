# Scripts

Scripts shell utilitários do `project-genesis-boilerplate`. Todos são portáveis (bash, sem dependências exóticas), idempotentes e usam exit codes corretos.

## `check-readiness.sh`

Verifica se os documentos essenciais existem e foram realmente preenchidos.

### Uso

```bash
bash .genesis/scripts/check-readiness.sh
```

### Variáveis de ambiente

- `MIN_BYTES` — tamanho mínimo de cada arquivo em bytes (default `800`). Arquivos menores são tratados como "não preenchidos".
- `MAX_PLACEHOLDERS` — número máximo de marcadores `_(...)` permitidos por arquivo (default `5`). Templates do boilerplate vêm com muitos marcadores que precisam ser substituídos por conteúdo real; um arquivo com placeholders demais é tratado como "template não preenchido".

```bash
MIN_BYTES=1000 MAX_PLACEHOLDERS=3 bash .genesis/scripts/check-readiness.sh
```

### Documentos verificados

- `docs/product/product-vision.md`
- `docs/product/problem-statement.md`
- `docs/product/mvp-scope.md`
- `docs/business/business-model.md`
- `docs/architecture/architecture-overview.md`
- `docs/architecture/technology-decision.md`
- `docs/modules/README.md`
- `docs/specs/README.md`
- `docs/testing/testing-strategy.md`
- `docs/security/security-requirements.md`

### Exit codes

| Código | Significado |
|--------|-------------|
| 0 | Todos os documentos OK — desenvolvimento liberado (após `review-readiness`) |
| 1 | Pelo menos 1 documento faltando ou vazio — bloqueado |

### Saída de exemplo

```
Readiness check — project-genesis-boilerplate
Limites: mínimo 800 bytes, máximo 5 placeholders _(...) por arquivo

  ✓ docs/product/product-vision.md             ok (1234 bytes, 2 placeholders)
  ✗ docs/business/business-model.md            template não preenchido (18 placeholders, 2490 bytes)
  ...

BLOQUEADO — 3 de 10 documento(s) faltando ou vazio(s).
```

### Quando rodar

- Antes de qualquer pedido de implementação.
- Em CI/CD do projeto-filho, como gate de PR (opcional).
- Antes da skill `start-development`.

## Como integrar com hooks

Veja `.claude/hooks/README.md` para usar `check-readiness.sh` como hook do Claude Code (`UserPromptSubmit` ou `PreToolUse`).
