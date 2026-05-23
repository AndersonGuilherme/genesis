# Block A — Namespacing + Frontmatter Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Padronizar frontmatter de skills/rules/agents existentes, adicionar campo `phase:`, renomear com prefixos (`disc-/plan-/dev-`), adicionar campo `rules:` + bloco Pré-flight Read nas skills. Sem criar conteúdo dev novo (isso é Bloco B).

**Architecture:** Single commit ao final. Edições em batch via sed quando possível, Edit tool quando precisa precisão. Validação via lint-docs.sh + grep sentinela. Não push.

**Tech Stack:** bash, git, sed, Edit tool.

---

## Spec link

`docs/superpowers/specs/2026-05-23-dev-skills-and-namespacing-design.md`

## Pré-condições

- Working tree limpo.
- Rodando da raiz `/home/anderson/apps/genesis`.
- Em `main`.
- Migração `.genesis/` (commit `3289990`) já aplicada.

## Mapeamento de phase por skill

| Skill atual | phase |
|-------------|-------|
| `discover-business` | discovery |
| `validate-idea` | discovery |
| `init-project` | planning |
| `define-product` | planning |
| `map-users` | planning |
| `design-business-model` | planning |
| `choose-stack` | planning |
| `design-architecture` | planning |
| `plan-modules` | planning |
| `define-module-spec` | planning |
| `create-adr` | planning |
| `create-implementation-plan` | planning |
| `review-readiness` | planning |
| `start-development` | development |

## Mapeamento de `rules:` por skill

| Skill | rules: |
|-------|--------|
| `discover-business` | plan-documentation-first, plan-business-before-technology, plan-explain-tradeoffs |
| `validate-idea` | plan-documentation-first, plan-explain-tradeoffs |
| `init-project` | plan-documentation-first, plan-business-before-technology |
| `define-product` | plan-avoid-overengineering, plan-business-before-technology |
| `map-users` | plan-security-by-design, plan-documentation-first |
| `design-business-model` | plan-explain-tradeoffs, plan-business-before-technology |
| `choose-stack` | plan-stack-neutrality, plan-business-before-technology, plan-avoid-overengineering, plan-explain-tradeoffs |
| `design-architecture` | plan-security-by-design, plan-avoid-overengineering, plan-documentation-first |
| `plan-modules` | plan-module-spec-required, plan-avoid-overengineering |
| `define-module-spec` | plan-module-spec-required, plan-security-by-design, plan-testing-strategy-required |
| `create-adr` | plan-adr-required-for-decisions, plan-explain-tradeoffs, plan-documentation-first |
| `create-implementation-plan` | plan-testing-strategy-required, plan-no-code-before-spec, plan-avoid-overengineering |
| `review-readiness` | plan-no-code-before-spec, plan-module-spec-required, plan-security-by-design |
| `start-development` | plan-no-code-before-spec, plan-testing-strategy-required, plan-documentation-first |

---

### Task 1: Pré-flight

- [ ] **Step 1: Confirmar contexto**

```bash
pwd
git status --short
git branch --show-current
test -f CLAUDE.md && test -d .claude && test -d .genesis && echo "OK"
git log -1 --oneline
```

Esperado: pwd = `/home/anderson/apps/genesis`. Status limpo. Branch `main`. `OK`. Último commit é `b508b66` (spec) ou descendente.

---

### Task 2: Adicionar `phase:` no frontmatter dos 14 skills atuais

**Files:** `.claude/skills/*/SKILL.md` (14)

- [ ] **Step 1: Aplicar phase via sed por skill**

Para cada skill, inserir linha `phase: <valor>` logo após a linha `description:`:

```bash
# discovery
sed -i '/^description:/a phase: discovery' .claude/skills/discover-business/SKILL.md
sed -i '/^description:/a phase: discovery' .claude/skills/validate-idea/SKILL.md

# planning
for s in init-project define-product map-users design-business-model choose-stack design-architecture plan-modules define-module-spec create-adr create-implementation-plan review-readiness; do
  sed -i '/^description:/a phase: planning' ".claude/skills/$s/SKILL.md"
done

# development
sed -i '/^description:/a phase: development' .claude/skills/start-development/SKILL.md
```

- [ ] **Step 2: Verificar**

```bash
grep -L "^phase:" .claude/skills/*/SKILL.md
```

Esperado: vazio (todos têm `phase:`).

---

### Task 3: Adicionar frontmatter completo nos 10 rules atuais

**Files:** `.claude/rules/*.md` (10)

Rules hoje começam direto com `# Rule: <nome>`. Inserir frontmatter no topo de cada um.

- [ ] **Step 1: Mapear descriptions**

Descriptions concisas para cada rule:

| Arquivo | description |
|---------|-------------|
| `adr-required-for-decisions.md` | Toda decisão relevante gera ADR com 2+ alternativas e consequências negativas. Sem ADR, decisão vira folclore. |
| `avoid-overengineering.md` | Sem microserviços/Kubernetes/event-sourcing/cache sem justificativa numérica. Simples primeiro, complexo quando o problema pedir. |
| `business-before-technology.md` | Não escolher stack ou padrão técnico antes de entender problema, usuário, valor e modelo de negócio. |
| `documentation-first.md` | Toda decisão importante atualiza doc antes ou junto com a mudança. Doc é memória externa do projeto. |
| `explain-tradeoffs.md` | Toda recomendação vem com trade-offs explícitos, alternativas consideradas e critério usado. Sem trade-off, vira ordem. |
| `module-spec-required.md` | Nenhum módulo é implementado sem spec completa em docs/specs/<modulo>/. Spec é o contrato. |
| `no-code-before-spec.md` | Nenhum código de aplicação é escrito antes de spec mínima aprovada do módulo. Código sem spec é especulação cara. |
| `security-by-design.md` | Segurança pensada antes do código, em cada decisão. LGPD e auth não se resolvem com patch. |
| `stack-neutrality.md` | Nenhuma stack assumida por default. Sempre 3+ opções avaliadas antes de recomendar. |
| `testing-strategy-required.md` | Todo módulo precisa de estratégia de teste documentada antes do código. Gate de PR reforça. |

- [ ] **Step 2: Inserir frontmatter via Edit tool em cada rule**

Para cada arquivo, usar Edit:

**`.claude/rules/adr-required-for-decisions.md`** — substituir início:

Antes:
```
# Rule: adr-required-for-decisions

## Princípio
```

Depois:
```
---
name: plan-adr-required-for-decisions
description: Toda decisão relevante gera ADR com 2+ alternativas e consequências negativas. Sem ADR, decisão vira folclore.
phase: planning
---

# Rule: plan-adr-required-for-decisions

## Princípio
```

Repetir o mesmo padrão para os outros 9, usando description da tabela do Step 1 e mantendo o nome com prefixo `plan-` (todas as rules atuais são planning).

- [ ] **Step 3: Verificar frontmatter**

```bash
for f in .claude/rules/*.md; do
  head -5 "$f" | grep -q "^name:" || echo "FALTA frontmatter: $f"
  head -5 "$f" | grep -q "^phase:" || echo "FALTA phase: $f"
done
```

Esperado: vazio.

---

### Task 4: Adicionar `phase:` nos 10 agents atuais

**Files:** `.claude/agents/*.md` (10)

Todos são planning.

- [ ] **Step 1: Aplicar via sed**

```bash
sed -i '/^tools:/a phase: planning' .claude/agents/*.md
```

- [ ] **Step 2: Verificar**

```bash
grep -L "^phase:" .claude/agents/*.md
```

Esperado: vazio.

---

### Task 5: Adicionar `rules:` + bloco Pré-flight nas 14 skills

**Files:** `.claude/skills/*/SKILL.md` (14)

Cada skill ganha campo `rules:` no frontmatter + bloco "Pré-flight" logo após `# <nome>`.

- [ ] **Step 1: Inserir `rules:` via Edit em cada skill (14 edições)**

Padrão para cada skill — usar Edit tool, inserir após `phase:`:

Antes:
```yaml
phase: planning
---
```

Depois (exemplo para `define-module-spec`):
```yaml
phase: planning
rules:
  - plan-module-spec-required
  - plan-security-by-design
  - plan-testing-strategy-required
---
```

Repetir para os outros 13, usando o mapeamento da seção "Mapeamento de `rules:` por skill" no topo do plano.

- [ ] **Step 2: Inserir bloco Pré-flight no corpo de cada skill**

Após primeira linha de H1 (`# <nome-skill>`), inserir bloco padronizado. Usar Edit tool por skill.

Exemplo para `define-module-spec`:

Antes (procurar):
```
# define-module-spec

## Quando usar
```

Depois:
```
# define-module-spec

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/plan-module-spec-required.md`
- `.claude/rules/plan-security-by-design.md`
- `.claude/rules/plan-testing-strategy-required.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Quando usar
```

Repetir para todas as 14 skills, listando as rules específicas de cada uma. Use o mapeamento.

Observação: o conteúdo de `# <nome-skill>` ainda usa nome antigo (sem prefixo). Será atualizado na Task 6.

- [ ] **Step 3: Verificar `rules:` presente**

```bash
grep -L "^rules:" .claude/skills/*/SKILL.md
```

Esperado: vazio.

```bash
grep -L "## Pré-flight" .claude/skills/*/SKILL.md
```

Esperado: vazio.

---

### Task 6: Renomear pastas de skills com prefixo

**Files:** `.claude/skills/*/` (14 pastas)

- [ ] **Step 1: git mv todas as pastas**

```bash
git mv .claude/skills/discover-business .claude/skills/disc-discover-business
git mv .claude/skills/validate-idea .claude/skills/disc-validate-idea
git mv .claude/skills/init-project .claude/skills/plan-init-project
git mv .claude/skills/define-product .claude/skills/plan-define-product
git mv .claude/skills/map-users .claude/skills/plan-map-users
git mv .claude/skills/design-business-model .claude/skills/plan-design-business-model
git mv .claude/skills/choose-stack .claude/skills/plan-choose-stack
git mv .claude/skills/design-architecture .claude/skills/plan-design-architecture
git mv .claude/skills/plan-modules .claude/skills/plan-modules-mvp
git mv .claude/skills/define-module-spec .claude/skills/plan-define-module-spec
git mv .claude/skills/create-adr .claude/skills/plan-create-adr
git mv .claude/skills/create-implementation-plan .claude/skills/plan-create-implementation-plan
git mv .claude/skills/review-readiness .claude/skills/plan-review-readiness
git mv .claude/skills/start-development .claude/skills/dev-start-development
```

- [ ] **Step 2: Atualizar `name:` no frontmatter de cada SKILL.md**

```bash
sed -i 's|^name: discover-business$|name: disc-discover-business|' .claude/skills/disc-discover-business/SKILL.md
sed -i 's|^name: validate-idea$|name: disc-validate-idea|' .claude/skills/disc-validate-idea/SKILL.md
sed -i 's|^name: init-project$|name: plan-init-project|' .claude/skills/plan-init-project/SKILL.md
sed -i 's|^name: define-product$|name: plan-define-product|' .claude/skills/plan-define-product/SKILL.md
sed -i 's|^name: map-users$|name: plan-map-users|' .claude/skills/plan-map-users/SKILL.md
sed -i 's|^name: design-business-model$|name: plan-design-business-model|' .claude/skills/plan-design-business-model/SKILL.md
sed -i 's|^name: choose-stack$|name: plan-choose-stack|' .claude/skills/plan-choose-stack/SKILL.md
sed -i 's|^name: design-architecture$|name: plan-design-architecture|' .claude/skills/plan-design-architecture/SKILL.md
sed -i 's|^name: plan-modules$|name: plan-modules-mvp|' .claude/skills/plan-modules-mvp/SKILL.md
sed -i 's|^name: define-module-spec$|name: plan-define-module-spec|' .claude/skills/plan-define-module-spec/SKILL.md
sed -i 's|^name: create-adr$|name: plan-create-adr|' .claude/skills/plan-create-adr/SKILL.md
sed -i 's|^name: create-implementation-plan$|name: plan-create-implementation-plan|' .claude/skills/plan-create-implementation-plan/SKILL.md
sed -i 's|^name: review-readiness$|name: plan-review-readiness|' .claude/skills/plan-review-readiness/SKILL.md
sed -i 's|^name: start-development$|name: dev-start-development|' .claude/skills/dev-start-development/SKILL.md
```

- [ ] **Step 3: Atualizar H1 no corpo de cada SKILL.md**

```bash
sed -i 's|^# discover-business$|# disc-discover-business|' .claude/skills/disc-discover-business/SKILL.md
sed -i 's|^# validate-idea$|# disc-validate-idea|' .claude/skills/disc-validate-idea/SKILL.md
sed -i 's|^# init-project$|# plan-init-project|' .claude/skills/plan-init-project/SKILL.md
sed -i 's|^# define-product$|# plan-define-product|' .claude/skills/plan-define-product/SKILL.md
sed -i 's|^# map-users$|# plan-map-users|' .claude/skills/plan-map-users/SKILL.md
sed -i 's|^# design-business-model$|# plan-design-business-model|' .claude/skills/plan-design-business-model/SKILL.md
sed -i 's|^# choose-stack$|# plan-choose-stack|' .claude/skills/plan-choose-stack/SKILL.md
sed -i 's|^# design-architecture$|# plan-design-architecture|' .claude/skills/plan-design-architecture/SKILL.md
sed -i 's|^# plan-modules$|# plan-modules-mvp|' .claude/skills/plan-modules-mvp/SKILL.md
sed -i 's|^# define-module-spec$|# plan-define-module-spec|' .claude/skills/plan-define-module-spec/SKILL.md
sed -i 's|^# create-adr$|# plan-create-adr|' .claude/skills/plan-create-adr/SKILL.md
sed -i 's|^# create-implementation-plan$|# plan-create-implementation-plan|' .claude/skills/plan-create-implementation-plan/SKILL.md
sed -i 's|^# review-readiness$|# plan-review-readiness|' .claude/skills/plan-review-readiness/SKILL.md
sed -i 's|^# start-development$|# dev-start-development|' .claude/skills/dev-start-development/SKILL.md
```

- [ ] **Step 4: Verificar**

```bash
for d in .claude/skills/*/; do
  pasta=$(basename "$d")
  nome=$(grep "^name:" "$d/SKILL.md" | head -1 | sed 's/name: //')
  if [ "$pasta" != "$nome" ]; then
    echo "DIVERGE: pasta=$pasta nome=$nome"
  fi
done
```

Esperado: vazio.

---

### Task 7: Renomear arquivos de rules com prefixo `plan-`

**Files:** `.claude/rules/*.md` (10)

- [ ] **Step 1: git mv**

```bash
cd .claude/rules
for f in adr-required-for-decisions.md avoid-overengineering.md business-before-technology.md documentation-first.md explain-tradeoffs.md module-spec-required.md no-code-before-spec.md security-by-design.md stack-neutrality.md testing-strategy-required.md; do
  git mv "$f" "plan-$f"
done
cd /home/anderson/apps/genesis
```

- [ ] **Step 2: Atualizar `name:` no frontmatter (Task 3 já colocou com `plan-` prefix, então este passo só verifica consistência)**

```bash
for f in .claude/rules/*.md; do
  pasta=$(basename "$f" .md)
  nome=$(grep "^name:" "$f" | sed 's/name: //')
  if [ "$pasta" != "$nome" ]; then
    echo "DIVERGE: arquivo=$pasta name=$nome"
  fi
done
```

Esperado: vazio. Se aparecer, corrigir name: com sed manual.

- [ ] **Step 3: Verificar H1 já bate**

```bash
for f in .claude/rules/*.md; do
  pasta=$(basename "$f" .md)
  h1=$(grep "^# Rule:" "$f" | head -1 | sed 's/# Rule: //')
  if [ "$pasta" != "$h1" ]; then
    echo "DIVERGE H1: arquivo=$pasta h1=$h1"
  fi
done
```

Esperado: vazio. Task 3 já atualizou H1 com prefix.

---

### Task 8: Renomear arquivos de agents com prefixo `plan-`

**Files:** `.claude/agents/*.md` (10)

- [ ] **Step 1: git mv**

```bash
cd .claude/agents
for f in business-mentor.md domain-modeler.md implementation-planner.md monetization-strategist.md product-strategist.md scalability-reviewer.md security-reviewer.md software-architect.md technical-writer.md ux-researcher.md; do
  git mv "$f" "plan-$f"
done
cd /home/anderson/apps/genesis
```

- [ ] **Step 2: Atualizar `name:` no frontmatter**

```bash
sed -i 's|^name: business-mentor$|name: plan-business-mentor|' .claude/agents/plan-business-mentor.md
sed -i 's|^name: domain-modeler$|name: plan-domain-modeler|' .claude/agents/plan-domain-modeler.md
sed -i 's|^name: implementation-planner$|name: plan-implementation-planner|' .claude/agents/plan-implementation-planner.md
sed -i 's|^name: monetization-strategist$|name: plan-monetization-strategist|' .claude/agents/plan-monetization-strategist.md
sed -i 's|^name: product-strategist$|name: plan-product-strategist|' .claude/agents/plan-product-strategist.md
sed -i 's|^name: scalability-reviewer$|name: plan-scalability-reviewer|' .claude/agents/plan-scalability-reviewer.md
sed -i 's|^name: security-reviewer$|name: plan-security-reviewer|' .claude/agents/plan-security-reviewer.md
sed -i 's|^name: software-architect$|name: plan-software-architect|' .claude/agents/plan-software-architect.md
sed -i 's|^name: technical-writer$|name: plan-technical-writer|' .claude/agents/plan-technical-writer.md
sed -i 's|^name: ux-researcher$|name: plan-ux-researcher|' .claude/agents/plan-ux-researcher.md
```

- [ ] **Step 3: Atualizar H1 nos agents**

```bash
sed -i 's|^# Business Mentor$|# Plan Business Mentor|' .claude/agents/plan-business-mentor.md
sed -i 's|^# Domain Modeler$|# Plan Domain Modeler|' .claude/agents/plan-domain-modeler.md
sed -i 's|^# Implementation Planner$|# Plan Implementation Planner|' .claude/agents/plan-implementation-planner.md
sed -i 's|^# Monetization Strategist$|# Plan Monetization Strategist|' .claude/agents/plan-monetization-strategist.md
sed -i 's|^# Product Strategist$|# Plan Product Strategist|' .claude/agents/plan-product-strategist.md
sed -i 's|^# Scalability Reviewer$|# Plan Scalability Reviewer|' .claude/agents/plan-scalability-reviewer.md
sed -i 's|^# Security Reviewer$|# Plan Security Reviewer|' .claude/agents/plan-security-reviewer.md
sed -i 's|^# Software Architect$|# Plan Software Architect|' .claude/agents/plan-software-architect.md
sed -i 's|^# Technical Writer$|# Plan Technical Writer|' .claude/agents/plan-technical-writer.md
sed -i 's|^# UX Researcher$|# Plan UX Researcher|' .claude/agents/plan-ux-researcher.md
```

- [ ] **Step 4: Verificar**

```bash
for f in .claude/agents/*.md; do
  pasta=$(basename "$f" .md)
  nome=$(grep "^name:" "$f" | sed 's/name: //')
  if [ "$pasta" != "$nome" ]; then
    echo "DIVERGE: $pasta vs $nome"
  fi
done
```

Esperado: vazio.

---

### Task 9: Atualizar refs cruzadas em CLAUDE.md

**Files:** `CLAUDE.md`

- [ ] **Step 1: Atualizar refs a rules**

```bash
sed -i \
  -e 's|\[no-code-before-spec\](\.claude/rules/no-code-before-spec\.md)|[plan-no-code-before-spec](.claude/rules/plan-no-code-before-spec.md)|g' \
  -e 's|\[documentation-first\](\.claude/rules/documentation-first\.md)|[plan-documentation-first](.claude/rules/plan-documentation-first.md)|g' \
  -e 's|\[business-before-technology\](\.claude/rules/business-before-technology\.md)|[plan-business-before-technology](.claude/rules/plan-business-before-technology.md)|g' \
  -e 's|\[module-spec-required\](\.claude/rules/module-spec-required\.md)|[plan-module-spec-required](.claude/rules/plan-module-spec-required.md)|g' \
  -e 's|\[adr-required-for-decisions\](\.claude/rules/adr-required-for-decisions\.md)|[plan-adr-required-for-decisions](.claude/rules/plan-adr-required-for-decisions.md)|g' \
  -e 's|\[security-by-design\](\.claude/rules/security-by-design\.md)|[plan-security-by-design](.claude/rules/plan-security-by-design.md)|g' \
  -e 's|\[testing-strategy-required\](\.claude/rules/testing-strategy-required\.md)|[plan-testing-strategy-required](.claude/rules/plan-testing-strategy-required.md)|g' \
  -e 's|\[stack-neutrality\](\.claude/rules/stack-neutrality\.md)|[plan-stack-neutrality](.claude/rules/plan-stack-neutrality.md)|g' \
  -e 's|\[explain-tradeoffs\](\.claude/rules/explain-tradeoffs\.md)|[plan-explain-tradeoffs](.claude/rules/plan-explain-tradeoffs.md)|g' \
  -e 's|\[avoid-overengineering\](\.claude/rules/avoid-overengineering\.md)|[plan-avoid-overengineering](.claude/rules/plan-avoid-overengineering.md)|g' \
  CLAUDE.md
```

- [ ] **Step 2: Atualizar refs a agents (na seção "Agentes especializados")**

```bash
sed -i \
  -e 's|`product-strategist`|`plan-product-strategist`|g' \
  -e 's|`business-mentor`|`plan-business-mentor`|g' \
  -e 's|`software-architect`|`plan-software-architect`|g' \
  -e 's|`domain-modeler`|`plan-domain-modeler`|g' \
  -e 's|`security-reviewer`|`plan-security-reviewer`|g' \
  -e 's|`scalability-reviewer`|`plan-scalability-reviewer`|g' \
  -e 's|`ux-researcher`|`plan-ux-researcher`|g' \
  -e 's|`monetization-strategist`|`plan-monetization-strategist`|g' \
  -e 's|`technical-writer`|`plan-technical-writer`|g' \
  -e 's|`implementation-planner`|`plan-implementation-planner`|g' \
  CLAUDE.md
```

- [ ] **Step 3: Verificar refs CLAUDE.md**

```bash
grep -nE '\[(no-code-before-spec|documentation-first|business-before-technology|module-spec-required|adr-required-for-decisions|security-by-design|testing-strategy-required|stack-neutrality|explain-tradeoffs|avoid-overengineering)\]' CLAUDE.md
```

Esperado: vazio.

```bash
grep -nE '`(product-strategist|business-mentor|software-architect|domain-modeler|security-reviewer|scalability-reviewer|ux-researcher|monetization-strategist|technical-writer|implementation-planner)`' CLAUDE.md
```

Esperado: vazio.

---

### Task 10: Atualizar refs a skill names em hooks e scripts

**Files:**
- `.claude/hooks/prevent-code-before-readiness.sh`
- `.claude/hooks/README.md`
- `.genesis/scripts/lint-docs.sh` (loop conta `.claude/skills/*/SKILL.md` — não menciona nomes)
- `.genesis/scripts/check-readiness.sh` (não menciona skill names)

- [ ] **Step 1: hooks**

```bash
sed -i \
  -e "s|skill 'review-readiness'|skill 'plan-review-readiness'|g" \
  -e 's|skill `review-readiness`|skill `plan-review-readiness`|g' \
  .claude/hooks/prevent-code-before-readiness.sh
sed -i \
  -e 's|skill `review-readiness`|skill `plan-review-readiness`|g' \
  .claude/hooks/README.md
```

- [ ] **Step 2: Verificar**

```bash
grep -nE "review-readiness" .claude/hooks/*.sh .claude/hooks/README.md | grep -v "plan-review-readiness"
```

Esperado: vazio.

---

### Task 11: Renomear narrativas em `.genesis/docs/skills/` + atualizar índice

**Files:** `.genesis/docs/skills/*.md` (15 — README + 14 narrativas)

- [ ] **Step 1: Renomear narrativas com prefixo `<phase>-<skill-name>.md`**

```bash
cd .genesis/docs/skills
git mv 01-init-project.md plan-init-project.md
git mv 02-discover-business.md disc-discover-business.md
git mv 03-define-product.md plan-define-product.md
git mv 04-validate-idea.md disc-validate-idea.md
git mv 05-map-users.md plan-map-users.md
git mv 06-design-business-model.md plan-design-business-model.md
git mv 07-choose-stack.md plan-choose-stack.md
git mv 08-design-architecture.md plan-design-architecture.md
git mv 09-plan-modules.md plan-modules-mvp.md
git mv 10-define-module-spec.md plan-define-module-spec.md
git mv 11-create-adr.md plan-create-adr.md
git mv 12-create-implementation-plan.md plan-create-implementation-plan.md
git mv 13-review-readiness.md plan-review-readiness.md
git mv 14-start-development.md dev-start-development.md
cd /home/anderson/apps/genesis
```

- [ ] **Step 2: Atualizar refs cruzadas entre narrativas (links `12-create-implementation-plan.md` etc.)**

```bash
find .genesis/docs/skills -name "*.md" -exec sed -i \
  -e 's|01-init-project\.md|plan-init-project.md|g' \
  -e 's|02-discover-business\.md|disc-discover-business.md|g' \
  -e 's|03-define-product\.md|plan-define-product.md|g' \
  -e 's|04-validate-idea\.md|disc-validate-idea.md|g' \
  -e 's|05-map-users\.md|plan-map-users.md|g' \
  -e 's|06-design-business-model\.md|plan-design-business-model.md|g' \
  -e 's|07-choose-stack\.md|plan-choose-stack.md|g' \
  -e 's|08-design-architecture\.md|plan-design-architecture.md|g' \
  -e 's|09-plan-modules\.md|plan-modules-mvp.md|g' \
  -e 's|10-define-module-spec\.md|plan-define-module-spec.md|g' \
  -e 's|11-create-adr\.md|plan-create-adr.md|g' \
  -e 's|12-create-implementation-plan\.md|plan-create-implementation-plan.md|g' \
  -e 's|13-review-readiness\.md|plan-review-readiness.md|g' \
  -e 's|14-start-development\.md|dev-start-development.md|g' \
  {} \;
```

- [ ] **Step 3: Atualizar refs a skill folders em narrativas**

```bash
find .genesis/docs/skills -name "*.md" -exec sed -i \
  -e 's|\.claude/skills/discover-business/|.claude/skills/disc-discover-business/|g' \
  -e 's|\.claude/skills/validate-idea/|.claude/skills/disc-validate-idea/|g' \
  -e 's|\.claude/skills/init-project/|.claude/skills/plan-init-project/|g' \
  -e 's|\.claude/skills/define-product/|.claude/skills/plan-define-product/|g' \
  -e 's|\.claude/skills/map-users/|.claude/skills/plan-map-users/|g' \
  -e 's|\.claude/skills/design-business-model/|.claude/skills/plan-design-business-model/|g' \
  -e 's|\.claude/skills/choose-stack/|.claude/skills/plan-choose-stack/|g' \
  -e 's|\.claude/skills/design-architecture/|.claude/skills/plan-design-architecture/|g' \
  -e 's|\.claude/skills/plan-modules/|.claude/skills/plan-modules-mvp/|g' \
  -e 's|\.claude/skills/define-module-spec/|.claude/skills/plan-define-module-spec/|g' \
  -e 's|\.claude/skills/create-adr/|.claude/skills/plan-create-adr/|g' \
  -e 's|\.claude/skills/create-implementation-plan/|.claude/skills/plan-create-implementation-plan/|g' \
  -e 's|\.claude/skills/review-readiness/|.claude/skills/plan-review-readiness/|g' \
  -e 's|\.claude/skills/start-development/|.claude/skills/dev-start-development/|g' \
  {} \;
```

- [ ] **Step 4: Atualizar refs a rules em narrativas**

```bash
find .genesis/docs/skills -name "*.md" -exec sed -i \
  -e 's|\.claude/rules/no-code-before-spec\.md|.claude/rules/plan-no-code-before-spec.md|g' \
  -e 's|\.claude/rules/documentation-first\.md|.claude/rules/plan-documentation-first.md|g' \
  -e 's|\.claude/rules/business-before-technology\.md|.claude/rules/plan-business-before-technology.md|g' \
  -e 's|\.claude/rules/module-spec-required\.md|.claude/rules/plan-module-spec-required.md|g' \
  -e 's|\.claude/rules/adr-required-for-decisions\.md|.claude/rules/plan-adr-required-for-decisions.md|g' \
  -e 's|\.claude/rules/security-by-design\.md|.claude/rules/plan-security-by-design.md|g' \
  -e 's|\.claude/rules/testing-strategy-required\.md|.claude/rules/plan-testing-strategy-required.md|g' \
  -e 's|\.claude/rules/stack-neutrality\.md|.claude/rules/plan-stack-neutrality.md|g' \
  -e 's|\.claude/rules/explain-tradeoffs\.md|.claude/rules/plan-explain-tradeoffs.md|g' \
  -e 's|\.claude/rules/avoid-overengineering\.md|.claude/rules/plan-avoid-overengineering.md|g' \
  {} \;
```

- [ ] **Step 5: Atualizar refs a agents em narrativas**

```bash
find .genesis/docs/skills -name "*.md" -exec sed -i \
  -e 's|\.claude/agents/business-mentor\.md|.claude/agents/plan-business-mentor.md|g' \
  -e 's|\.claude/agents/domain-modeler\.md|.claude/agents/plan-domain-modeler.md|g' \
  -e 's|\.claude/agents/implementation-planner\.md|.claude/agents/plan-implementation-planner.md|g' \
  -e 's|\.claude/agents/monetization-strategist\.md|.claude/agents/plan-monetization-strategist.md|g' \
  -e 's|\.claude/agents/product-strategist\.md|.claude/agents/plan-product-strategist.md|g' \
  -e 's|\.claude/agents/scalability-reviewer\.md|.claude/agents/plan-scalability-reviewer.md|g' \
  -e 's|\.claude/agents/security-reviewer\.md|.claude/agents/plan-security-reviewer.md|g' \
  -e 's|\.claude/agents/software-architect\.md|.claude/agents/plan-software-architect.md|g' \
  -e 's|\.claude/agents/technical-writer\.md|.claude/agents/plan-technical-writer.md|g' \
  -e 's|\.claude/agents/ux-researcher\.md|.claude/agents/plan-ux-researcher.md|g' \
  {} \;
```

- [ ] **Step 6: Reescrever `.genesis/docs/skills/README.md` com índice por phase**

Substituir o conteúdo todo. Estrutura nova:

```markdown
# Skills (versão narrativa)

Documentação humana das skills do boilerplate. A versão consumida pela IA está em `.claude/skills/<nome>/SKILL.md`.

## Discovery

- [disc-discover-business](disc-discover-business.md) — público, mercado, valor inicial.
- [disc-validate-idea](disc-validate-idea.md) — hipóteses, experimentos, entrevistas.

## Planning

- [plan-init-project](plan-init-project.md) — identidade do projeto.
- [plan-define-product](plan-define-product.md) — visão, MVP, jornadas.
- [plan-map-users](plan-map-users.md) — personas, papéis, permissões.
- [plan-design-business-model](plan-design-business-model.md) — BMC, planos, custos, GTM.
- [plan-choose-stack](plan-choose-stack.md) — escolha de stack com 3+ opções.
- [plan-design-architecture](plan-design-architecture.md) — arquitetura de alto nível.
- [plan-modules-mvp](plan-modules-mvp.md) — identificação e fronteiras de módulos.
- [plan-define-module-spec](plan-define-module-spec.md) — spec completa de módulo.
- [plan-create-adr](plan-create-adr.md) — decisão arquitetural registrada.
- [plan-create-implementation-plan](plan-create-implementation-plan.md) — spec → plano de implementação.
- [plan-review-readiness](plan-review-readiness.md) — gate antes de codar.

## Development

- [dev-start-development](dev-start-development.md) — início incremental, módulo por módulo.

(Demais skills `dev-*` chegam no Bloco B — TDD, DDD, SOLID, Clean Arch, modularização por caso de uso.)

## Recursos relacionados

- [START_HERE.md](../../../docs/START_HERE.md) — guia de entrada do repositório.
- [PROJECT_STATE.md](../../../docs/PROJECT_STATE.md) — painel de progresso.
- [glossary.md](../../../docs/glossary.md) — termos consistentes em PT-BR.
- [.genesis/tests/](../../tests/) — sanity checks por skill.
- [.claude/rules/](../../../.claude/rules/) — princípios aplicados.
- [.claude/agents/](../../../.claude/agents/) — agentes especializados.
```

- [ ] **Step 7: Verificar**

```bash
ls .genesis/docs/skills/
```

Esperado: 14 narrativas com prefixo + README.md. Nenhum arquivo `NN-*.md` antigo.

---

### Task 12: Atualizar `.genesis/scripts/lint-docs.sh` com novas validações

**Files:** `.genesis/scripts/lint-docs.sh`

Adicionar validação de `phase:` em skills/agents/rules e validação de campo `rules:` em skills.

- [ ] **Step 1: Adicionar validação `phase:` no loop de skills**

Encontrar bloco que valida skills (loop `for d in .claude/skills/*/`). Adicionar check de phase.

Encontrar trecho:
```bash
for d in .claude/skills/*/; do
  [ -d "$d" ] || continue
```

Inserir validação após verificação de frontmatter `name:` e `description:`:

```bash
  # phase obrigatório
  if ! grep -q "^phase:" "$d/SKILL.md"; then
    err "$d/SKILL.md sem phase: no frontmatter"
  fi
```

Procurar pelo trecho usando Read + Edit.

- [ ] **Step 2: Adicionar seção de validação de rules (frontmatter)**

Encontrar bloco que valida rules (hoje só checa "6 seções obrigatórias"). Adicionar antes:

```bash
section "Rules — frontmatter"
for f in .claude/rules/*.md; do
  [ -f "$f" ] || continue
  if ! head -5 "$f" | grep -q "^name:"; then
    err "$f sem name: no frontmatter"
  fi
  if ! head -5 "$f" | grep -q "^description:"; then
    err "$f sem description: no frontmatter"
  fi
  if ! head -10 "$f" | grep -q "^phase:"; then
    err "$f sem phase: no frontmatter"
  fi
done
```

- [ ] **Step 3: Adicionar validação `phase:` no loop de agents**

Encontrar bloco que valida agents. Adicionar check:

```bash
  if ! grep -q "^phase:" "$f"; then
    err "$f sem phase: no frontmatter"
  fi
```

- [ ] **Step 4: Adicionar validação `rules:` em skills aponta pra rules existentes**

Adicionar bloco novo após validação de skills:

```bash
section "Skills — rules: aponta pra arquivos existentes"
for d in .claude/skills/*/; do
  [ -d "$d" ] || continue
  # Extrai lista de rules do frontmatter
  in_rules=0
  while IFS= read -r line; do
    if [ "$line" = "rules:" ]; then
      in_rules=1
      continue
    fi
    if [ "$in_rules" = "1" ]; then
      if [[ "$line" =~ ^[[:space:]]*-[[:space:]]+(.+) ]]; then
        rule_name="${BASH_REMATCH[1]}"
        rule_file=".claude/rules/${rule_name}.md"
        if [ ! -f "$rule_file" ]; then
          err "$d/SKILL.md declara rule inexistente: $rule_name"
        fi
      else
        in_rules=0
      fi
    fi
  done < <(awk '/^---$/{c++; next} c==1' "$d/SKILL.md")
done
```

Esse bloco usa awk pra extrair só o frontmatter, depois parseia bloco `rules:` list.

- [ ] **Step 5: Atualizar contagens esperadas (mantém 14/10/10/9 em Bloco A — Bloco B muda)**

Confirmar que `expected_skills=14`, `expected_templates=9` permanecem corretos. Se forem hardcoded, manter.

- [ ] **Step 6: Verificar lint roda sem erro de sintaxe**

```bash
bash -n .genesis/scripts/lint-docs.sh && echo "sintaxe OK"
```

---

### Task 13: Rodar validação completa

- [ ] **Step 1: lint-docs**

```bash
bash .genesis/scripts/lint-docs.sh
```

Esperado: APROVADO. Todos skills/rules/agents com frontmatter completo. Todos `rules:` apontam pra arquivos existentes.

Se falhar: ler output, identificar arquivo problemático, corrigir.

- [ ] **Step 2: check-readiness ainda roda**

```bash
bash .genesis/scripts/check-readiness.sh
```

Esperado: exit 1 (boilerplate base não tem docs preenchidos) — roda sem erro de path/sintaxe.

- [ ] **Step 3: run-skill-tests passa**

```bash
bash .genesis/scripts/run-skill-tests.sh
```

Esperado: Lint OK na seção final.

- [ ] **Step 4: Grep sentinela — zero refs vivas pros nomes antigos**

```bash
grep -rnE '\.claude/(skills/(discover-business|validate-idea|init-project|define-product|map-users|design-business-model|choose-stack|design-architecture|plan-modules|define-module-spec|create-adr|create-implementation-plan|review-readiness|start-development)/|rules/(no-code-before-spec|documentation-first|business-before-technology|module-spec-required|adr-required-for-decisions|security-by-design|testing-strategy-required|stack-neutrality|explain-tradeoffs|avoid-overengineering)\.md|agents/(business-mentor|domain-modeler|implementation-planner|monetization-strategist|product-strategist|scalability-reviewer|security-reviewer|software-architect|technical-writer|ux-researcher)\.md)' \
  --include="*.md" --include="*.sh" \
  --exclude-dir=.git \
  . \
  | grep -vE 'docs/superpowers/(specs|plans)/' \
  | grep -v '\.genesis/CHANGELOG.md'
```

Esperado: vazio. Se aparecer: ler contexto e corrigir.

---

### Task 14: Commit Bloco A (sem push)

- [ ] **Step 1: Revisar status**

```bash
git status
```

Esperado: ~50+ arquivos mudados (renames + frontmatter updates).

- [ ] **Step 2: Stage + commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
refactor(.claude): namespace by phase + standardize frontmatter

Bloco A do spec dev-skills-and-namespacing-design.md.

- Adiciona campo `phase:` (discovery|planning|development|operations)
  em skills, rules e agents.
- Adiciona frontmatter completo (name, description, phase) nas 10
  rules existentes.
- Adiciona campo `rules:` no frontmatter de skills + bloco Pré-flight
  Read no corpo para carregamento contextual real das rules.
- Renomeia 14 skills com prefixo disc-/plan-/dev-.
- Renomeia 10 rules com prefixo plan-.
- Renomeia 10 agents com prefixo plan-.
- Renomeia 14 narrativas em .genesis/docs/skills/ aplicando mesmo
  prefixo. README.md reorganizado por phase.
- lint-docs.sh: valida phase: em skills/rules/agents, valida que
  campo rules: aponta para arquivos existentes.
- Atualiza refs cruzadas em CLAUDE.md, hooks, narrativas.

Validação: lint-docs.sh APROVADO, check-readiness roda sem erro
de path, grep sentinela zero.

Próximo: Bloco B (conteúdo dev novo).

Spec: docs/superpowers/specs/2026-05-23-dev-skills-and-namespacing-design.md
Plan: docs/superpowers/plans/2026-05-23-block-a-namespacing.md
EOF
)"
```

- [ ] **Step 3: Verificar**

```bash
git log -1 --stat | head -50
git status
```

Esperado: working tree limpo. **Não rodar `git push`.**

---

## Notas de execução

- Se algum sed quebrar formato (yaml inválido por exemplo), parar e corrigir com Edit tool.
- Se lint-docs.sh falhar com erro de sintaxe bash após mudanças, rodar `bash -n` pra identificar.
- Após commit, próximo passo é gerar Plan B (conteúdo dev) via writing-plans skill em sessão subsequente.

## Rollback

```bash
git reset --hard HEAD~1
```
