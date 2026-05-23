# Genesis Namespace Reorg Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move toda infra do boilerplate (scripts/, tests/, templates/, examples/, VERSION, CHANGELOG.md, README.md, docs/skills/) para `.genesis/` hidden namespace. Atualizar todas as refs em CLAUDE.md, .claude/skills, .claude/rules, .claude/hooks, e nos próprios scripts internos.

**Architecture:** Single migration commit. Movimentação via `git mv` (preserva history). Refs atualizadas via `sed` por categoria de arquivo. Validação via 3 scripts existentes + grep sentinela. Não push.

**Tech Stack:** bash, git, sed, grep.

---

## Spec link

`docs/superpowers/specs/2026-05-23-genesis-namespace-design.md`

## Pré-condições

- Working tree limpo.
- Rodando da raiz `/home/anderson/apps/genesis`.
- Em `main`.

---

### Task 1: Pré-flight

**Files:** nenhum.

- [ ] **Step 1: Confirmar working tree limpo, branch main, raiz correta**

```bash
pwd
git status --short
git branch --show-current
test -f CLAUDE.md && test -d .claude && echo "raiz OK"
```

Esperado: `pwd` retorna `/home/anderson/apps/genesis`. `git status --short` vazio. Branch `main`. `raiz OK`.

Se sujo: parar e perguntar.

---

### Task 2: Criar `.genesis/` e mover pastas + arquivos

**Files:**
- Create: `.genesis/` (diretório)
- Move: `scripts/` → `.genesis/scripts/`
- Move: `tests/` → `.genesis/tests/`
- Move: `templates/` → `.genesis/templates/`
- Move: `examples/` → `.genesis/examples/`
- Move: `docs/skills/` → `.genesis/docs/skills/`
- Move: `VERSION` → `.genesis/VERSION`
- Move: `CHANGELOG.md` → `.genesis/CHANGELOG.md`
- Move: `README.md` → `.genesis/README.md`

- [ ] **Step 1: Criar diretórios container**

```bash
mkdir -p .genesis/docs
```

- [ ] **Step 2: Mover pastas via git mv**

```bash
git mv scripts .genesis/scripts
git mv tests .genesis/tests
git mv templates .genesis/templates
git mv examples .genesis/examples
git mv docs/skills .genesis/docs/skills
```

- [ ] **Step 3: Mover arquivos soltos via git mv**

```bash
git mv VERSION .genesis/VERSION
git mv CHANGELOG.md .genesis/CHANGELOG.md
git mv README.md .genesis/README.md
```

- [ ] **Step 4: Verificar resultado**

```bash
ls .genesis/
ls -la
```

Esperado: `.genesis/` contém `scripts/`, `tests/`, `templates/`, `examples/`, `docs/`, `VERSION`, `CHANGELOG.md`, `README.md`. Raiz não contém mais essas pastas/arquivos.

---

### Task 3: Criar novo README.md raiz e CHANGELOG.md raiz

**Files:**
- Create: `README.md`
- Create: `CHANGELOG.md`

- [ ] **Step 1: Criar README.md raiz (template enxuto do projeto)**

Conteúdo exato:
```markdown
# Projeto

> Substituir este parágrafo pela descrição real do projeto.

## Status

Estado vivo: [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md)

## Como começar

1. Leia [docs/START_HERE.md](docs/START_HERE.md).
2. Acompanhe progresso em [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md).
3. Em dúvida sobre termos, consulte [docs/glossary.md](docs/glossary.md).

## Boilerplate

Projeto criado a partir do [project-genesis-boilerplate](.genesis/README.md). Infra do boilerplate (scripts, tests, templates, examples) vive em [.genesis/](.genesis/).
```

- [ ] **Step 2: Criar CHANGELOG.md raiz vazio**

Conteúdo exato:
```markdown
# Changelog

Todas as mudanças relevantes do **projeto** ficam aqui. Mudanças do boilerplate vivem em [.genesis/CHANGELOG.md](.genesis/CHANGELOG.md).

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Unreleased]
```

- [ ] **Step 3: Verificar criação**

```bash
test -f README.md && test -f CHANGELOG.md && echo "OK"
```

Esperado: `OK`.

---

### Task 4: Atualizar refs em CLAUDE.md (raiz)

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Aplicar sed para paths absolutos**

```bash
sed -i \
  -e 's|`templates/adr-template\.md`|`.genesis/templates/adr-template.md`|g' \
  -e 's|`scripts/check-readiness\.sh`|`.genesis/scripts/check-readiness.sh`|g' \
  -e 's|`scripts/lint-docs\.sh`|`.genesis/scripts/lint-docs.sh`|g' \
  -e 's|`scripts/run-skill-tests\.sh`|`.genesis/scripts/run-skill-tests.sh`|g' \
  -e 's|bash scripts/check-readiness\.sh|bash .genesis/scripts/check-readiness.sh|g' \
  -e 's|bash scripts/lint-docs\.sh|bash .genesis/scripts/lint-docs.sh|g' \
  -e 's|bash scripts/run-skill-tests\.sh|bash .genesis/scripts/run-skill-tests.sh|g' \
  -e 's|\[tests/\](tests/)|[.genesis/tests/](.genesis/tests/)|g' \
  -e 's|\[docs/skills/\](docs/skills/README\.md)|[.genesis/docs/skills/](.genesis/docs/skills/README.md)|g' \
  CLAUDE.md
```

- [ ] **Step 2: Verificar — não devem restar refs vivas pro paths antigos em CLAUDE.md**

```bash
grep -nE '(^|[^./_a-zA-Z])(scripts|templates|tests|examples)/' CLAUDE.md | grep -v '\.genesis/'
```

Esperado: vazio. Se algo aparecer, ler contexto e corrigir manualmente.

---

### Task 5: Atualizar refs em `.claude/skills/*/SKILL.md`

**Files:**
- Modify: todos `.claude/skills/*/SKILL.md` (14 arquivos)

- [ ] **Step 1: Aplicar sed em batch**

```bash
find .claude/skills -name "SKILL.md" -exec sed -i \
  -e 's|`templates/\([^`]*\)`|`.genesis/templates/\1`|g' \
  -e 's|`scripts/\([^`]*\)`|`.genesis/scripts/\1`|g' \
  -e 's|bash scripts/\([a-z-]*\.sh\)|bash .genesis/scripts/\1|g' \
  -e 's|`tests/skills/|`.genesis/tests/skills/|g' \
  -e 's|`examples/tchr/|`.genesis/examples/tchr/|g' \
  -e 's|(templates/\([^)]*\))|(.genesis/templates/\1)|g' \
  -e 's|(scripts/\([^)]*\))|(.genesis/scripts/\1)|g' \
  -e 's|(tests/skills/\([^)]*\))|(.genesis/tests/skills/\1)|g' \
  -e 's|(examples/tchr/\([^)]*\))|(.genesis/examples/tchr/\1)|g' \
  -e 's|\bscripts/check-readiness\.sh|.genesis/scripts/check-readiness.sh|g' \
  {} \;
```

- [ ] **Step 2: Verificar zero refs vivas pra paths antigos**

```bash
find .claude/skills -name "SKILL.md" -exec grep -lEn '(^|[^./_a-zA-Z])(scripts|templates|tests/skills|examples/tchr)/' {} \; | xargs -I{} sh -c 'echo "=== {} ==="; grep -nE "(^|[^./_a-zA-Z])(scripts|templates|tests/skills|examples/tchr)/" {}'
```

Esperado: vazio. Caso restos: editar manualmente.

---

### Task 6: Atualizar refs em `.claude/rules/*.md`

**Files:**
- Modify: `.claude/rules/adr-required-for-decisions.md` (e outros se houver match)

- [ ] **Step 1: Aplicar sed em batch**

```bash
find .claude/rules -name "*.md" -exec sed -i \
  -e 's|`templates/\([^`]*\)`|`.genesis/templates/\1`|g' \
  -e 's|`scripts/\([^`]*\)`|`.genesis/scripts/\1`|g' \
  -e 's|bash scripts/\([a-z-]*\.sh\)|bash .genesis/scripts/\1|g' \
  {} \;
```

- [ ] **Step 2: Verificar**

```bash
grep -rnE '(^|[^./_a-zA-Z])(scripts|templates)/' .claude/rules/ | grep -v '\.genesis/'
```

Esperado: vazio.

---

### Task 7: Atualizar `.claude/hooks/` (3 scripts + README)

**Files:**
- Modify: `.claude/hooks/prevent-code-before-readiness.sh`
- Modify: `.claude/hooks/validate-docs-before-implementation.sh`
- Modify: `.claude/hooks/README.md`

- [ ] **Step 1: Atualizar `prevent-code-before-readiness.sh`**

Substituir `scripts/check-readiness.sh` por `.genesis/scripts/check-readiness.sh` (3 ocorrências):

```bash
sed -i 's|scripts/check-readiness\.sh|.genesis/scripts/check-readiness.sh|g' .claude/hooks/prevent-code-before-readiness.sh
```

- [ ] **Step 2: Atualizar `validate-docs-before-implementation.sh` via Edit tool (3 trocas)**

**Troca A** — atualizar chamada do script (último bloco do arquivo):

Antes:
```
if [ -f scripts/check-readiness.sh ]; then
  if ! bash scripts/check-readiness.sh > /tmp/genesis-readiness.out 2>&1; then
```
Depois:
```
if [ -f .genesis/scripts/check-readiness.sh ]; then
  if ! bash .genesis/scripts/check-readiness.sh > /tmp/genesis-readiness.out 2>&1; then
```

**Troca B** — atualizar `case` pattern de pastas permitidas:

Antes:
```
case "$file_path" in
  *docs/*|*\.claude/*|*templates/*|*tests/*|*scripts/*|*examples/*|*README.md|*CLAUDE.md|*\.gitignore|*\.editorconfig|*LICENSE|*LICENSE.md|*NOTICE|*COPYING|*VERSION|*CHANGELOG.md|*CONTRIBUTING.md|*CODE_OF_CONDUCT.md)
```
Depois:
```
case "$file_path" in
  *docs/*|*\.claude/*|*\.genesis/*|*README.md|*CLAUDE.md|*\.gitignore|*\.editorconfig|*LICENSE|*LICENSE.md|*NOTICE|*COPYING|*CHANGELOG.md|*CONTRIBUTING.md|*CODE_OF_CONDUCT.md)
```

**Troca C** — atualizar comentário cabeçalho + mensagem de erro:

Antes (cabeçalho linha ~5):
```
# Quando Claude tentar criar/editar arquivos fora de docs/, .claude/, templates/, scripts/, examples/,
# verifica se scripts/check-readiness.sh passa. Se falhar, bloqueia.
```
Depois:
```
# Quando Claude tentar criar/editar arquivos fora de docs/, .claude/, .genesis/,
# verifica se .genesis/scripts/check-readiness.sh passa. Se falhar, bloqueia.
```

Antes (mensagem):
```
Tentativa de criar/editar arquivo de código fora de docs/, .claude/, templates/, scripts/ e examples/, mas readiness ainda não foi aprovado.
```
Depois:
```
Tentativa de criar/editar arquivo de código fora de docs/, .claude/ e .genesis/, mas readiness ainda não foi aprovado.
```

Antes (linha em "Saída de"):
```
Saída de scripts/check-readiness.sh:
```
Depois:
```
Saída de .genesis/scripts/check-readiness.sh:
```

- [ ] **Step 3: Atualizar `.claude/hooks/README.md`**

```bash
sed -i \
  -e 's|`scripts/check-readiness\.sh`|`.genesis/scripts/check-readiness.sh`|g' \
  -e 's|fora\*\* de `docs/`, `\.claude/`, `templates/`, `scripts/` ou `examples/`|fora** de `docs/`, `.claude/` ou `.genesis/`|g' \
  .claude/hooks/README.md
```

- [ ] **Step 4: Verificar hooks**

```bash
grep -nE '(^|[^./_a-zA-Z])(scripts|templates|tests|examples)/' .claude/hooks/ -r | grep -v '\.genesis/'
```

Esperado: vazio.

---

### Task 8: Atualizar scripts internos em `.genesis/scripts/`

**Files:**
- Modify: `.genesis/scripts/check-readiness.sh`
- Modify: `.genesis/scripts/lint-docs.sh`
- Modify: `.genesis/scripts/run-skill-tests.sh`
- Modify: `.genesis/scripts/genesis-init.sh`
- Modify: `.genesis/scripts/README.md`

Scripts são chamados pelo usuário a partir da raiz (`bash .genesis/scripts/X.sh`). Paths internos pra `docs/...` continuam funcionando (docs está na raiz). Refs cruzadas entre scripts e refs a `templates/`, `examples/`, `tests/` precisam virar `.genesis/...`.

- [ ] **Step 1: `check-readiness.sh` — atualizar comentário de uso**

```bash
sed -i \
  -e 's|bash scripts/check-readiness\.sh|bash .genesis/scripts/check-readiness.sh|g' \
  .genesis/scripts/check-readiness.sh
```

(Conteúdo de `REQUIRED_DOCS=(...)` aponta pra `docs/...` — não muda.)

- [ ] **Step 2: `lint-docs.sh` — atualizar refs**

```bash
sed -i \
  -e 's|`templates/\*\.md`|`.genesis/templates/*.md`|g' \
  -e 's|for f in templates/\*\.md|for f in .genesis/templates/*.md|g' \
  -e 's|bash scripts/lint-docs\.sh|bash .genesis/scripts/lint-docs.sh|g' \
  .genesis/scripts/lint-docs.sh
```

- [ ] **Step 3: `run-skill-tests.sh` — atualizar calls aos outros scripts**

```bash
sed -i \
  -e 's|bash scripts/lint-docs\.sh|bash .genesis/scripts/lint-docs.sh|g' \
  -e 's|bash scripts/check-readiness\.sh|bash .genesis/scripts/check-readiness.sh|g' \
  -e 's|scripts/lint-docs\.sh|.genesis/scripts/lint-docs.sh|g' \
  -e 's|scripts/check-readiness\.sh|.genesis/scripts/check-readiness.sh|g' \
  -e 's|scripts/run-skill-tests\.sh|.genesis/scripts/run-skill-tests.sh|g' \
  .genesis/scripts/run-skill-tests.sh
```

- [ ] **Step 4: `genesis-init.sh` — atualizar refs**

```bash
sed -i \
  -e 's|bash scripts/genesis-init\.sh|bash .genesis/scripts/genesis-init.sh|g' \
  -e 's|bash scripts/check-readiness\.sh|bash .genesis/scripts/check-readiness.sh|g' \
  -e 's|rm -rf examples\b|rm -rf .genesis/examples|g' \
  -e 's|examples/ removido|.genesis/examples/ removido|g' \
  -e 's|apagar `examples/`|apagar `.genesis/examples/`|g' \
  -e 's|mantém examples/|mantém .genesis/examples/|g' \
  -e 's|scripts/genesis-init\.sh|.genesis/scripts/genesis-init.sh|g' \
  .genesis/scripts/genesis-init.sh
```

Verificar manualmente se `genesis-init.sh` tem outras refs (busca de placeholders no README do projeto novo, etc.).

- [ ] **Step 5: `.genesis/scripts/README.md`**

```bash
sed -i \
  -e 's|bash scripts/check-readiness\.sh|bash .genesis/scripts/check-readiness.sh|g' \
  -e 's|bash scripts/lint-docs\.sh|bash .genesis/scripts/lint-docs.sh|g' \
  -e 's|bash scripts/run-skill-tests\.sh|bash .genesis/scripts/run-skill-tests.sh|g' \
  -e 's|bash scripts/genesis-init\.sh|bash .genesis/scripts/genesis-init.sh|g' \
  .genesis/scripts/README.md
```

- [ ] **Step 6: Verificar scripts**

```bash
grep -rnE '(^|[^./_a-zA-Z])(scripts|templates|tests|examples)/' .genesis/scripts/ | grep -v '^[^:]*:[0-9]*:#' | grep -v '\.genesis/'
```

Esperado: vazio (ou só matches em comentários históricos aceitáveis).

---

### Task 9: Atualizar narrativa em `.genesis/docs/skills/*.md`

**Files:**
- Modify: todos `.genesis/docs/skills/*.md`

Paths relativos antigos: `../../scripts/`, `../../templates/`, `../../tests/`, `../../examples/` (relativos a `docs/skills/`).
Novos paths relativos (de `.genesis/docs/skills/` pra `.genesis/scripts/`): `../../scripts/`, `../../templates/`, `../../tests/`, `../../examples/` (sobe 2 níveis → `.genesis/` → entra na pasta irmã). **Mesma string relativa!** Sem alteração necessária pra links relativos.

Refs absolutas (em código bash inline, ex.: `bash scripts/check-readiness.sh`) precisam virar `.genesis/scripts/...`.

- [ ] **Step 1: Atualizar refs absolutas em código inline**

```bash
find .genesis/docs/skills -name "*.md" -exec sed -i \
  -e 's|bash scripts/check-readiness\.sh|bash .genesis/scripts/check-readiness.sh|g' \
  -e 's|bash scripts/lint-docs\.sh|bash .genesis/scripts/lint-docs.sh|g' \
  -e 's|bash scripts/run-skill-tests\.sh|bash .genesis/scripts/run-skill-tests.sh|g' \
  -e 's|`scripts/check-readiness\.sh`|`.genesis/scripts/check-readiness.sh`|g' \
  -e 's|`scripts/lint-docs\.sh`|`.genesis/scripts/lint-docs.sh`|g' \
  -e 's|`scripts/run-skill-tests\.sh`|`.genesis/scripts/run-skill-tests.sh`|g' \
  -e 's|`tests/skills/\([^`]*\)`|`.genesis/tests/skills/\1`|g' \
  -e 's|MAX_PLACEHOLDERS=3 bash scripts/check-readiness\.sh|MAX_PLACEHOLDERS=3 bash .genesis/scripts/check-readiness.sh|g' \
  {} \;
```

- [ ] **Step 2: Verificar**

```bash
grep -rnE 'bash scripts/|`scripts/|`templates/|`examples/|`tests/skills/' .genesis/docs/skills/ | grep -v '\.genesis/'
```

Esperado: vazio.

---

### Task 10: Atualizar `.genesis/templates/readiness-checklist-template.md`

**Files:**
- Modify: `.genesis/templates/readiness-checklist-template.md`

- [ ] **Step 1: Atualizar refs absolutas**

```bash
sed -i \
  -e 's|bash scripts/check-readiness\.sh|bash .genesis/scripts/check-readiness.sh|g' \
  -e 's|`scripts/check-readiness\.sh`|`.genesis/scripts/check-readiness.sh`|g' \
  .genesis/templates/readiness-checklist-template.md
```

- [ ] **Step 2: Verificar refs em outros templates (caso haja)**

```bash
grep -nE '(^|[^./_a-zA-Z])(scripts|templates|tests|examples)/' .genesis/templates/*.md | grep -v '\.genesis/'
```

Esperado: vazio.

---

### Task 11: Atualizar `.genesis/README.md`

**Files:**
- Modify: `.genesis/README.md`

Contém descrição do boilerplate. Refs internas (caminhos como `scripts/check-readiness.sh`) devem virar `.genesis/scripts/...` quando lidos da raiz, OU caminhos relativos a partir de `.genesis/README.md` (ex.: `scripts/check-readiness.sh` ainda funciona como link relativo dentro de `.genesis/`).

Decisão: usar caminhos absolutos a partir da raiz (`.genesis/scripts/...`) pra consistência com o resto da documentação.

- [ ] **Step 1: Atualizar refs**

```bash
sed -i \
  -e 's|bash scripts/check-readiness\.sh|bash .genesis/scripts/check-readiness.sh|g' \
  -e 's|bash scripts/lint-docs\.sh|bash .genesis/scripts/lint-docs.sh|g' \
  -e 's|bash scripts/run-skill-tests\.sh|bash .genesis/scripts/run-skill-tests.sh|g' \
  -e 's|bash scripts/genesis-init\.sh|bash .genesis/scripts/genesis-init.sh|g' \
  -e 's|`scripts/\([a-z-]*\.sh\)`|`.genesis/scripts/\1`|g' \
  -e 's|`templates/\([^`]*\)`|`.genesis/templates/\1`|g' \
  -e 's|`tests/\([^`]*\)`|`.genesis/tests/\1`|g' \
  -e 's|`examples/\([^`]*\)`|`.genesis/examples/\1`|g' \
  .genesis/README.md
```

- [ ] **Step 2: Verificar**

```bash
grep -nE '(^|[^./_a-zA-Z])(scripts|templates|tests|examples)/' .genesis/README.md | grep -v '\.genesis/'
```

Esperado: vazio ou só refs históricas em seções "Changelog" / "History" (aceitável).

---

### Task 12: Atualizar `docs/glossary.md` e `docs/START_HERE.md`

**Files:**
- Modify: `docs/glossary.md`
- Modify: `docs/START_HERE.md`

- [ ] **Step 1: Atualizar refs**

```bash
sed -i \
  -e 's|`scripts/check-readiness\.sh`|`.genesis/scripts/check-readiness.sh`|g' \
  -e 's|`tests/dogfood-tchr\.md`|`.genesis/tests/dogfood-tchr.md`|g' \
  -e 's|bash scripts/check-readiness\.sh|bash .genesis/scripts/check-readiness.sh|g' \
  docs/glossary.md docs/START_HERE.md
```

- [ ] **Step 2: Verificar**

```bash
grep -nE '(^|[^./_a-zA-Z])(scripts|templates|tests|examples)/' docs/glossary.md docs/START_HERE.md | grep -v '\.genesis/'
```

Esperado: vazio.

---

### Task 13: Verificar `docs/PROJECT_STATE.md`, outros docs, `.gitignore`

**Files:**
- Inspect: `docs/PROJECT_STATE.md`, qualquer outro `docs/**/*.md` com ref antiga, `.gitignore`.

- [ ] **Step 1: Buscar refs vivas em `docs/`**

```bash
grep -rnE '(^|[^./_a-zA-Z])(scripts|templates|tests|examples)/' docs/ \
  --exclude-dir=superpowers \
  | grep -v '\.genesis/'
```

Esperado: vazio. Se aparecer algo, editar manualmente com sed equivalente ao das tasks anteriores.

- [ ] **Step 2: Conferir `.gitignore`**

```bash
cat .gitignore
```

Se houver entradas tipo `scripts/build-output/`, `tests/coverage/` etc., decidir caso-a-caso: paths do projeto continuam, paths que antes apontavam pra infra do boilerplate viram `.genesis/...`. Provavelmente sem mudança (gitignore atual é genérico).

---

### Task 14: Rodar validação completa

- [ ] **Step 1: lint-docs**

```bash
bash .genesis/scripts/lint-docs.sh
```

Esperado: exit 0, zero links quebrados, zero falhas estruturais.

- [ ] **Step 2: check-readiness**

```bash
bash .genesis/scripts/check-readiness.sh
```

Esperado: exit 1 (boilerplate base não tem docs preenchidos — comportamento esperado). O importante é o script **rodar sem erro de sintaxe ou path quebrado**.

- [ ] **Step 3: run-skill-tests**

```bash
bash .genesis/scripts/run-skill-tests.sh
```

Esperado: exit 0 (lint passou; readiness informativo).

- [ ] **Step 4: Grep sentinela — zero refs vivas pra paths antigos**

```bash
grep -rnE '(^|[^./_a-zA-Z])(scripts|templates|tests|examples)/' \
  --include="*.md" --include="*.sh" \
  --exclude-dir=.git \
  --exclude-dir=.genesis \
  --exclude-dir=node_modules \
  . \
  | grep -v 'docs/superpowers/specs/' \
  | grep -v 'docs/superpowers/plans/' \
  | grep -vE ':\s*#'
```

Esperado: vazio. Spec e plan ficam excluídos (descrevem a migração com paths antigos). Comentários puros também.

Se aparecer match: ler contexto, corrigir, repetir.

---

### Task 15: Commit (NÃO push)

- [ ] **Step 1: Revisar status**

```bash
git status
```

Esperado: lista de renames (8 movimentos) + modificações em CLAUDE.md, .claude/skills/, .claude/rules/, .claude/hooks/, docs/glossary.md, docs/START_HERE.md, eventuais outros docs, e dois arquivos novos (README.md raiz, CHANGELOG.md raiz).

- [ ] **Step 2: Stage tudo**

```bash
git add -A
```

(Aqui `git add -A` é seguro: working tree estava limpo antes da migração, todas as mudanças são intencionais.)

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
chore: namespace boilerplate infra under .genesis/

Move scripts/, tests/, templates/, examples/, docs/skills/, VERSION,
CHANGELOG.md e README.md (do boilerplate) para .genesis/. Root passa
a hospedar apenas conteúdo do projeto (docs/, CLAUDE.md, novo
README.md/CHANGELOG.md). Evita poluição visual no root e previne
colisão futura com tests/, scripts/ do projeto.

Refs atualizadas em CLAUDE.md, .claude/skills/, .claude/rules/,
.claude/hooks/, scripts internos, narrativas em .genesis/docs/skills/,
templates e docs/glossary.md + docs/START_HERE.md.

Validação: lint-docs verde, check-readiness roda sem erro de path,
run-skill-tests verde, grep sentinela zero.

Spec: docs/superpowers/specs/2026-05-23-genesis-namespace-design.md
Plan: docs/superpowers/plans/2026-05-23-genesis-namespace.md
EOF
)"
```

- [ ] **Step 4: Verificar commit**

```bash
git log -1 --stat | head -40
git status
```

Esperado: working tree limpo após o commit. Commit `chore: namespace boilerplate infra under .genesis/`. **Não rodar `git push`.**

---

## Notas de execução

- Se algum sed falhar (path com caractere especial não previsto), parar e editar manualmente com `Edit` tool.
- Se `lint-docs.sh` falhar com link quebrado, ler o caminho que ele aponta e adicionar sed para esse padrão específico.
- Hooks do Claude Code: após esta migração, `.claude/hooks/validate-docs-before-implementation.sh` permite mexer em `.genesis/` sem readiness. Se quiser fechar isso, editar a case statement depois.
- Não há push neste plano. Push é decisão posterior do usuário.

## Rollback

Se algo quebrar irrecuperavelmente:

```bash
git reset --hard HEAD~1   # antes do commit
# ou
git checkout HEAD -- .    # depois do staging mas antes do commit
```
