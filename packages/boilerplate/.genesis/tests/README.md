# Tests

Conjunto de testes do `project-genesis-boilerplate`. Combina:

- **Lint estrutural** (`scripts/lint-docs.sh`) — automatizado. Checa que skills/agents/rules/templates têm formato correto e que links Markdown não estão quebrados.
- **Sanity checks manuais** (este diretório, `.md` por skill/rule/agent) — descrevem comportamento esperado e anti-padrões para uso quando você edita as skills.
- **Readiness check** (`scripts/check-readiness.sh`) — verifica que docs essenciais existem e estão preenchidos. Em estado base do boilerplate, **espera-se que falhe** (templates não preenchidos).

## Filosofia

Os testes aqui **não rodam código** — porque o boilerplate não tem código de aplicação. O que existe é:

1. **Estrutura** — formato dos arquivos. Testável automaticamente.
2. **Comportamento esperado da IA quando uma skill é invocada** — testável manualmente, executando prompts canônicos e comparando com o checklist documentado.
3. **Atritos reais detectados em uso (dogfood)** — registrados em `dogfood-tchr.md` e usados como backlog de fix.

## Como rodar

```bash
# Todos os checks automatizáveis
bash scripts/run-skill-tests.sh

# Só o lint estrutural
bash scripts/lint-docs.sh

# Só o gate de readiness (espera-se falhar no boilerplate base)
bash scripts/check-readiness.sh
```

## Estrutura

```
tests/
├── README.md           (este arquivo)
├── skills/             (1 .md por skill — prompts canônicos + comportamentos esperados)
├── rules/checklist.md  (sanidade das 10 rules — formato + exceções)
├── agents/checklist.md (sanidade dos 10 agents — frontmatter + papel)
└── dogfood-tchr.md     (registro de atritos no uso real)
```

## Quando atualizar

- **Quando editar uma SKILL.md** → rever `tests/skills/<nome>.md` correspondente.
- **Quando editar uma rule ou agent** → atualizar `tests/rules/checklist.md` ou `tests/agents/checklist.md`.
- **Quando rodar dogfood real** → atualizar `tests/dogfood-tchr.md`.

## Limites

Estes não são testes E2E de software. São documentação executável + lint estrutural. Garantia real de comportamento exige uso humano + revisão (por isso o "dogfood" é fase obrigatória).
