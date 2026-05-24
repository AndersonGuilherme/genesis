# Changelog

Histórico de versões do `project-genesis-boilerplate`. Segue [Semantic Versioning](https://semver.org/lang/pt-BR/) simplificado:

- **MAJOR** — mudança incompatível em contrato de skill, rule ou agent (raro).
- **MINOR** — adição de capacidade (skill, rule, agent, template, script).
- **PATCH** — fix em conteúdo existente sem mudar contrato.

## [0.4.0] — 2026-05-23

Release consolidado dos blocos A-F do plano-mestre. Lifecycle completo
de 8 phases shipped + remediação de gaps.

### Adicionado

- **Namespacing por phase** (Bloco A, commit `ea6b549`) — Skills/rules/agents
  agora têm prefixo `disc-`, `plan-`, `sec-`, `lgpd-`, `dev-`, `prelaunch-`,
  `ops-`, `maint-`. Frontmatter padronizado com campo `phase:`.
- **Phase development** (Bloco B, commit `507a1a6`) — 7 skills + 8 rules +
  3 agents + 5 templates para TDD + DDD + Clean Architecture. Skills
  declaram `rules:` no frontmatter + Pre-flight Read.
- **Phase security** (Bloco C, commit `669ccf4`) — 10 skills + 10 rules +
  3 agents + 4 templates para threat model, auth, encryption, audit,
  rate limit, multi-tenant, webhooks, idempotência. Inclui dev variant
  `dev-define-use-case-authenticated`.
- **Phase lgpd** (Bloco D, commit `03e4af5`) — 8 skills + 8 rules + 2
  agents + 5 templates para ROPA (art. 37), consent (art. 8), retenção
  (art. 15-16), direitos do titular (art. 18), DPIA (art. 38), DPAs
  (art. 39). Inclui dev variant `dev-define-use-case-with-pii`.
- **Phase operations** (Bloco E, commit `d254b42`) — 10 skills + 6 rules
  + 2 agents + 4 templates para CI/CD, observability (OpenTelemetry),
  SLO/SLI, runbooks, incident response, backup, cost tracking, feature
  flags, deployment.
- **Phase pre-launch** (Bloco F, commit `83cf27f`) — 4 skills + 1 rule
  + 1 agent + 1 template para gate final + reunião go/no-go.
- **Phase maintenance** (Bloco F, commit `83cf27f`) — 2 skills + 3 rules
  + 1 agent + 2 templates para dependency update, postmortem blameless,
  deprecação, backward compatibility, SLA de CVE.
- **Multi-gate em `check-readiness.sh`** (commit `39e553f`) — modes
  `--planning`, `--security`, `--lgpd`, `--pre-launch`, `--all`. Default
  backcompat: `--planning`.
- **Test coverage 100%** (commit `e1724ee`) — 56 testes sanity em
  `.genesis/tests/skills/` (1 por skill). Renomeação de 14 testes
  pré-namespace + 42 testes novos.
- **Specs + plans retrospectivos** (commit `2265c2c`) — 4 specs + 4 plans
  em `docs/superpowers/` para blocos C/D/E/F.
- **Skeleton dirs no boilerplate** (commit `60c06e6`) —
  `docs/security/lgpd/`, `docs/launch/`, `docs/maintenance/`,
  `docs/operations/postmortems/` com READMEs índice.

### Modificado

- **`docs/PROJECT_STATE.md`** (commit `893aad6`) — checklist linear "1-10"
  substituído por lifecycle 8-phase + 4 gates + tabelas de estado de
  docs para todas as phases.
- **`docs/START_HERE.md`** (commit `893aad6`) — tabela das 8 phases com
  skill prefix + modes do multi-gate.
- **`CLAUDE.md`** (commits `893aad6` + blocos C/D/E/F) — "Fluxo padrão"
  usa "phase" + enumera lifecycle + exige validação de gate antes de
  avançar. Seções de rules para security, lgpd, operations, pre-launch,
  maintenance + 9 agents novos.
- **`README.md`** (root) — blocos novos: Security, LGPD, Operations,
  Pre-launch, Maintenance. Counts atualizados: 56 skills, 22 agents,
  46 rules, 31 templates.
- **`.genesis/scripts/lint-docs.sh`** — counts finais (56/22/46/31).
- **`.genesis/docs/skills/README.md`** — phases Security, LGPD,
  Operations, Pre-launch, Maintenance adicionadas + 42 narrativas novas.

### Totais finais (delta vs v0.3.0)

| | v0.3.0 | v0.4.0 |
|---|--:|--:|
| Skills | 20 | **56** |
| Rules | 18 | **46** |
| Agents | 13 | **22** |
| Templates | 14 | **31** |
| Narrativas | 14 | **56** |
| Testes sanity | 14 | **56** |

### Validado

- `bash .genesis/scripts/lint-docs.sh` → APROVADO em todos os blocos.
- `bash .genesis/scripts/run-skill-tests.sh` → Lint OK.
- `bash .genesis/scripts/check-readiness.sh --planning` → backcompat preservado.
- `bash .genesis/scripts/check-readiness.sh --security|--lgpd|--pre-launch` → novos modes funcionais.

## [0.3.0] — 2026-05-23

### Adicionado
- **`docs/skills/`** — trilha narrativa completa para humanos, 1 página por skill:
  - `README.md` — índice navegacional + mapa do fluxo em Mermaid + tabela mestra + trilha recomendada + FAQ.
  - `01-init-project.md` até `14-start-development.md` — 14 walkthroughs detalhados.
  - Cada documento segue schema consistente: contexto, quando invocar, pré-condições, passo a passo, perguntas da mentora, documentos produzidos, critérios de conclusão, anti-padrões, exemplo aplicado (tchr), troubleshooting, próximo passo, referências cruzadas.
  - Exemplos aplicados ao `tchr` em todas as skills onde fizer sentido.
- Links cruzados entre [`docs/skills/`](docs/skills/README.md), os arquivos AI-facing em `.claude/skills/`, e os checks canônicos em `tests/skills/`.

### Modificado
- `README.md` — seção "Skills disponíveis" agora aponta para a trilha narrativa em `docs/skills/`.
- `CLAUDE.md` — adicionada referência a `docs/skills/` como fonte humana das skills.
- `docs/START_HERE.md` — novo item apontando para `docs/skills/` em caso de dúvida sobre skill específica.
- `docs/skills/11-create-adr.md` — exemplo de link ajustado para evitar link quebrado a um ADR ainda não criado.

### Validado
- `bash scripts/lint-docs.sh` continua verde — 0 links quebrados em todo o repo.
- 15 arquivos novos em `docs/skills/` (1 índice + 14 walkthroughs).
- ~5.000 linhas de documentação narrativa em PT-BR adicionadas.

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
