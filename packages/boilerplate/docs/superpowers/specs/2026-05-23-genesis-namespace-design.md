# Design: namespace `.genesis/` para infra do boilerplate

**Data:** 2026-05-23
**Autor:** brainstorm Anderson + Claude
**Status:** aprovado, pendente plano de implementação

## Problema

O repositório `project-genesis-boilerplate` mistura, na raiz, dois tipos de arquivo distintos:

1. **Infra do boilerplate** — `scripts/`, `tests/`, `examples/`, `templates/`, `VERSION`, `CHANGELOG.md`, `README.md` atual. Esses arquivos servem ao próprio boilerplate (validação de readiness, lint de docs, sanity tests das skills, templates aplicados por skills, exemplos de docs preenchidos, versionamento do boilerplate).
2. **Conteúdo do projeto** — `docs/` (product, business, architecture, modules, specs, adr, etc.), `.claude/` (skills/agents/rules que a Claude usa), e futuramente `src/`, manifest da stack escolhida, `tests/` do projeto, `scripts/` do projeto.

Quando o usuário avança para a fase 10 (implementação), arquivos do projeto começam a coexistir com a infra do boilerplate na mesma raiz. Isso gera:

- **Poluição visual no root** — humano abre o repo e vê 10+ itens misturando dois domínios.
- **Risco futuro de colisão de nomes** — `tests/` do boilerplate vs. `tests/` do projeto; `scripts/` idem.
- **Confusão sobre ownership** — `README.md` atual descreve o boilerplate, não o projeto que será construído ali.

## Objetivo

Reorganizar o repositório para que:

- A IA continue lendo skills, rules, agents e infra normalmente (sem regressão funcional).
- O root fique enxuto, separando claramente o que é infra do boilerplate do que é conteúdo do projeto.
- Não haja colisão de nomes com pastas convencionais (`tests/`, `scripts/`) que projetos costumam ter.
- README e CHANGELOG da raiz nasçam como artefatos do **projeto**, não do boilerplate.

## Não-objetivos

- Reescrever skills, rules ou docs internos.
- Mudar a forma como Claude Code descobre skills (`.claude/` permanece).
- Separar boilerplate em repositório próprio (decisão deliberada: continua mesmo repo).
- Renomear conceitos (skills continuam skills, etc.).

## Abordagem escolhida

**Namespace hidden `.genesis/`** abriga toda a infra do boilerplate. Análogo a `.git/`, `.claude/` — convenção Unix de "infra que serve mas não polui o root".

Abordagens descartadas:
- `genesis/` (visível) — descoberta marginalmente melhor, mas ocupa slot no root e parece "outro projeto" dentro do projeto. Custo > benefício.
- Empurrar tudo para `.claude/scripts/`, `.claude/tests/`, etc. — quebra a convenção do Claude Code de que `.claude/` é para skills/agents/rules, não infra arbitrária.

## Estrutura alvo

```
/
├── .claude/                  Claude Code: skills, agents, rules (sem mudança)
├── .genesis/                 Infra do boilerplate (NOVA pasta hidden)
│   ├── README.md             Descreve o boilerplate
│   ├── CHANGELOG.md          Versões do boilerplate
│   ├── VERSION
│   ├── scripts/
│   │   ├── check-readiness.sh
│   │   ├── genesis-init.sh
│   │   ├── lint-docs.sh
│   │   └── run-skill-tests.sh
│   ├── tests/                Sanity tests das skills + dogfood-tchr.md
│   ├── templates/            adr-template, module-spec-template, etc.
│   ├── examples/             tchr e futuros exemplos
│   └── docs/skills/          Narrativa humana das skills
├── docs/                     CONTEÚDO DO PROJETO (sem mudança estrutural interna)
│   ├── START_HERE.md
│   ├── PROJECT_STATE.md
│   ├── glossary.md
│   ├── product/
│   ├── business/
│   ├── architecture/
│   ├── modules/
│   ├── specs/
│   ├── adr/
│   ├── security/
│   ├── testing/
│   ├── deployment/
│   ├── operations/
│   ├── research/
│   └── validation/
├── CLAUDE.md                 Operação da Claude (raiz, sem mudança)
├── README.md                 Template enxuto do PROJETO (1 parágrafo + link)
├── CHANGELOG.md              Vazio, do projeto
├── LICENSE
└── .gitignore
```

Após o início da implementação, juntam-se ao root: `src/`, manifest da stack, `tests/` do projeto, `scripts/` do projeto. Sem conflito com a infra (que está sob `.genesis/`).

## Mudanças necessárias

### Movimentações (`git mv`)
- `scripts/` → `.genesis/scripts/`
- `tests/` → `.genesis/tests/`
- `templates/` → `.genesis/templates/`
- `examples/` → `.genesis/examples/`
- `docs/skills/` → `.genesis/docs/skills/`
- `VERSION` → `.genesis/VERSION`
- `CHANGELOG.md` (raiz) → `.genesis/CHANGELOG.md`
- `README.md` (raiz) → `.genesis/README.md`

### Arquivos novos na raiz
- `README.md` — template enxuto:
  ```markdown
  # <nome-do-projeto>

  <1 parágrafo: o que é>

  ## Status
  Estado vivo: [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md)

  ## Boilerplate
  Projeto usa [project-genesis-boilerplate](.genesis/README.md).
  ```
- `CHANGELOG.md` — vazio com cabeçalho `# Changelog`.

### Refs cross-link a atualizar

**CLAUDE.md raiz**:
- `scripts/check-readiness.sh` → `.genesis/scripts/check-readiness.sh`
- `scripts/lint-docs.sh` → `.genesis/scripts/lint-docs.sh`
- `scripts/run-skill-tests.sh` → `.genesis/scripts/run-skill-tests.sh`
- `tests/` → `.genesis/tests/`
- `[docs/skills/](docs/skills/README.md)` → `[.genesis/docs/skills/](.genesis/docs/skills/README.md)`

**`.claude/skills/*/SKILL.md`**:
- Refs a `templates/<algo>.md` → `.genesis/templates/<algo>.md`
- Refs a `scripts/<algo>.sh` → `.genesis/scripts/<algo>.sh`
- Refs a `tests/` → `.genesis/tests/`
- Refs a `examples/` → `.genesis/examples/`
- Skills conhecidas que tocam: `create-adr` (adr-template), `define-module-spec` (module-spec-template e outros), `review-readiness` (check-readiness.sh), `start-development` (check-readiness.sh). Confirmar via grep no momento da execução.

**Rules em `.claude/rules/*.md`**:
- Conferir refs (algumas rules linkam pra `templates/adr-template.md`).

**Scripts internos** (`.genesis/scripts/*.sh`):
- `check-readiness.sh` busca paths sob `docs/...` — paths relativos seguem ok se script roda da raiz.
- `lint-docs.sh` mesmo — verifica refs em arquivos `.md`.
- `run-skill-tests.sh` aponta pra `tests/` → mudar para `.genesis/tests/`.
- `genesis-init.sh` — inspecionar se cria/refere paths antigos.

**Narrativa em `.genesis/docs/skills/*.md`**:
- Conferir e atualizar links pra `scripts/`, `templates/`, `tests/`.

**`docs/START_HERE.md`**:
- Conferir links (provavelmente menciona `scripts/check-readiness.sh`).

**`.gitignore`**:
- Revisar; provavelmente sem mudança.

## Validação pós-migração

Após aplicar todas as mudanças, rodar (todos da raiz):

1. `bash .genesis/scripts/check-readiness.sh` — termina sem erro.
2. `bash .genesis/scripts/lint-docs.sh` — zero links quebrados.
3. `bash .genesis/scripts/run-skill-tests.sh` — todas skills passam.
4. Grep sentinela:
   ```bash
   grep -rE "(^|[^./])(scripts|templates|tests|examples)/" \
     --include="*.md" --include="*.sh" \
     --exclude-dir=.git --exclude-dir=.genesis . \
     | grep -v "src/" | grep -v "node_modules"
   ```
   Esperado: zero matches (ou só matches semanticamente intencionais que apontem para pastas futuras do projeto).

Critério de sucesso: os 3 scripts passam **e** o grep não encontra refs vivas pra caminhos antigos.

## Risco principal e mitigação

**Risco:** Refs internas em scripts ou skills que escapem do sed/replace e quebrem silenciosamente. Algumas skills podem usar paths em texto narrativo ou em exemplos de comando.

**Mitigação:**
- Rodar os 3 scripts de validação após cada bloco de mudanças.
- Rodar o grep sentinela com `--exclude-dir=.genesis` para garantir que nenhuma ref viva fora de `.genesis/` aponta pros nomes antigos.
- Commit único da migração; se quebrar, `git reset --hard HEAD~1` reverte.

## Ordem de execução (entrada do plano)

1. `git mv` das 4 pastas + `VERSION` + `CHANGELOG.md` + `README.md` para `.genesis/`.
2. Criar novo `README.md` raiz (template enxuto) + `CHANGELOG.md` raiz vazio.
3. Atualizar refs em `CLAUDE.md` (sed por padrão).
4. Atualizar refs em `.claude/skills/*/SKILL.md` (sed por padrão para cada nome de pasta movida).
5. Atualizar refs em `.claude/rules/*.md` (se houver).
6. Atualizar refs em scripts internos (`run-skill-tests.sh` aponta pra `.genesis/tests/`; conferir os outros).
7. Atualizar refs em `.genesis/docs/skills/*.md`.
8. Atualizar refs em `docs/START_HERE.md` (se houver).
9. Rodar os 3 scripts de validação + grep sentinela.
10. Commit único: `chore: namespace boilerplate infra under .genesis/`.

## Decisões registradas

- **Hidden namespace `.genesis/` (não visível)** — convenção Unix, paralelo a `.git`/`.claude`. Reduz clutter sem perder funcionalidade.
- **README e CHANGELOG da raiz pertencem ao projeto** — começam como template enxuto e vazio respectivamente. Versões originais do boilerplate vão para `.genesis/`.
- **`docs/` continua na raiz** — é conteúdo do projeto, não infra do boilerplate. Mas `docs/skills/` (narrativa humana das skills do boilerplate) move para `.genesis/docs/skills/` porque descreve a infra, não o projeto.
- **`START_HERE.md`, `PROJECT_STATE.md`, `glossary.md` ficam em `docs/`** — são entrada/estado/léxico do projeto, não do boilerplate.

## Follow-ups (fora deste design)

- Brainstorm separado: criar novas skills + rules para fase de desenvolvimento (TDD, DDD, SOLID, Clean Code, Clean Architecture, modularização por caso de uso e por módulo Auth/Student/Professor). Será conduzido em ciclo próprio.
- Eventualmente: atualizar ADR documentando a decisão de namespace `.genesis/` (registrar como decisão arquitetural do próprio boilerplate).
