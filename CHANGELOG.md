# Changelog

Histórico de versões do `project-genesis-boilerplate`. Segue [Semantic Versioning](https://semver.org/lang/pt-BR/) simplificado:

- **MAJOR** — mudança incompatível em contrato de skill, rule ou agent (raro).
- **MINOR** — adição de capacidade (skill, rule, agent, template, script).
- **PATCH** — fix em conteúdo existente sem mudar contrato.

## [0.2.0] — 2026-05-23

### Adicionado
- `LICENSE` (MIT).
- `VERSION` para rastreio de versão.
- `CHANGELOG.md` (este arquivo).
- `scripts/genesis-init.sh` — CLI para bootstrap de projeto-filho a partir do boilerplate.
- `scripts/lint-docs.sh` — lint estrutural de skills/agents/rules/templates + audit de links Markdown.
- `scripts/run-skill-tests.sh` — wrapper que roda lint + readiness.
- `tests/` — sanity checks manuais por skill, rule e agent. Inclui `dogfood-tchr.md` com registro de atritos reais.
- `docs/glossary.md` — glossário PT-BR com termos consistentes (tenant, módulo, ADR, MVP, etc.).
- Diagramas Mermaid em `docs/architecture/architecture-overview.md` (níveis 1 e 2).
- Badges no README (status, license, stack, docs).
- Seções no README explicando 3 formas de iniciar projeto (CLI, clone direto, degit).
- Whitelist de arquivos de meta-projeto no hook `validate-docs-before-implementation.sh` (LICENSE, VERSION, CHANGELOG, NOTICE, etc.).

### Corrigido
- Hook bloqueava criação de LICENSE/VERSION na raiz (F-002).
- `check-readiness.sh` agora detecta templates não preenchidos via contagem de placeholders `_(...)`, além de tamanho (F-003).
- Links `../../templates/` em `define-module-spec/SKILL.md` resolviam para pasta inexistente (F-004).
- `technology-decision.md` linkava ADR que ainda não existe (F-005).
- `problem-statement.md` referenciava `../validation/validation-plan.md` no lugar errado (F-006).
- `genesis-init.sh` agora remove a seção "Exemplo: o caso tchr" do README ao apagar `examples/`, evitando link quebrado no projeto-filho (F-001).

### Validado
- CLI `genesis-init.sh` testada em ambiente limpo (`/tmp` e `../tchr-genesis`).
- Lint estrutural passa em zero links quebrados.
- `check-readiness.sh` retorna `1` no boilerplate base (comportamento esperado — templates não preenchidos).

## [0.1.0] — 2026-05-21

### Adicionado
- Estrutura completa do boilerplate:
  - 14 skills em `.claude/skills/` (init-project, discover-business, define-product, validate-idea, map-users, design-business-model, choose-stack, design-architecture, plan-modules, define-module-spec, create-adr, create-implementation-plan, review-readiness, start-development).
  - 10 agents em `.claude/agents/` (product-strategist, business-mentor, software-architect, domain-modeler, security-reviewer, scalability-reviewer, ux-researcher, monetization-strategist, technical-writer, implementation-planner).
  - 10 rules em `.claude/rules/` (no-code-before-spec, documentation-first, business-before-technology, module-spec-required, adr-required-for-decisions, security-by-design, testing-strategy-required, stack-neutrality, explain-tradeoffs, avoid-overengineering).
  - 9 templates em `templates/` (project-brief, module-spec, adr, user-story, business-rule, integration-spec, api-spec, data-model, readiness-checklist).
  - 48 documentos em `docs/` cobrindo product, business, architecture, security, testing, deployment, operations, modules, specs, adr, research, validation.
  - Hooks em `.claude/hooks/` (prevent-code-before-readiness, validate-docs-before-implementation).
  - Script `scripts/check-readiness.sh` (gate automatizado).
  - Exemplo `examples/tchr/` com 3 documentos preenchidos como benchmark de qualidade.
  - `README.md`, `CLAUDE.md`, `.claude/settings.json`, `.gitignore`.
- Conteúdo todo em PT-BR.
- Stack-neutral por padrão.

[0.2.0]: https://github.com/AndersonGuilherme/genesis/releases/tag/v0.2.0
[0.1.0]: https://github.com/AndersonGuilherme/genesis/releases/tag/v0.1.0
