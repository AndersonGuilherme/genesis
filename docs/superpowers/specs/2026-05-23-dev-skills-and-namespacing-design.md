# Design: padronização de `.claude/` + skills/rules/agents de desenvolvimento

**Data:** 2026-05-23
**Autor:** brainstorm Anderson + Claude
**Status:** aprovado, pendente plano de implementação

## Problema

Hoje o boilerplate Genesis tem `.claude/skills/`, `.claude/rules/` e `.claude/agents/` flat — todas as entidades existentes cobrem só a fase de planejamento, e Claude não distingue por contexto. Dois problemas concretos:

1. **Sem distinção por fase.** Quando adicionarmos skills/rules/agents de desenvolvimento (TDD, DDD, SOLID, Clean Code, Clean Architecture), eles vão conviver flat com os de planejamento. Humano e IA terão dificuldade pra saber qual aplica em que momento.
2. **Rules não estão sendo realmente carregadas.** `CLAUDE.md` lista rules em "Regras carregadas:" com links Markdown, mas links não carregam conteúdo automaticamente. Skills nunca mencionam quais rules aplicar. Resultado: rules são "vibe-applied" pela memória do treinamento + descriptions curtas, não pela leitura literal do conteúdo. Falha em edge cases. Não escala.

## Objetivo

1. Padronizar frontmatter de rules para consistência com skills/agents.
2. Adicionar campo `phase:` (`discovery | planning | development | operations`) em skills, rules e agents.
3. Renomear pastas/arquivos com prefixo de fase pra leitura visual rápida.
4. Adicionar campo `rules:` no frontmatter de skills + bloco "Pre-flight: Read rules" no corpo, garantindo carregamento contextual sob demanda.
5. Criar conjunto inicial de skills, rules, agents e templates para a fase de **development** seguindo TDD pragmático, DDD, SOLID, Clean Code, Clean Architecture, modularização por caso de uso e por módulo (Auth/Student/Professor como ilustrações).

## Não-objetivos

- Reescrever lógica das skills/rules existentes (só padroniza frontmatter + renomeia + adiciona pre-flight).
- Definir stack concreta para os exemplos de desenvolvimento (mantém stack-neutrality).
- Implementar módulos reais de Auth/Student/Professor — eles aparecem apenas como ilustrações nas rules.
- Substituir o `.claude/agents/domain-modeler` existente. Ele continua como `plan-domain-modeler` para modelagem em planning; um novo `dev-ddd-modeler` foca em implementação.

## Decisões registradas

| # | Decisão | Motivação |
|---|---------|-----------|
| D1 | phase enum: `discovery | planning | development | operations` | Cobre todo o ciclo de vida; granular o suficiente sem virar taxonomia inútil. |
| D2 | Prefixo no nome de pasta/arquivo (`plan-`, `dev-`, etc.) | Visualização imediata sem abrir o arquivo. Garante discovery do Claude Code (`name:` no frontmatter bate com pasta). |
| D3 | Campo `rules:` no frontmatter de skills + Pre-flight Read no corpo | Conteúdo de rule entra no contexto só quando skill é invocada. Sem overhead em outras conversas. Lint pode validar que rules existem. |
| D4 | Dev rules stack-neutral | Honra rule existente `stack-neutrality`. Exemplos concretos vivem em templates/exemplos por stack quando o projeto escolher. |
| D5 | Naming de módulo: EN singular kebab-case folder, PascalCase classe | Convenção internacional, evita ambiguidade plural/singular, alinha com DDD clássico. |
| D6 | Clean Architecture com 3 camadas: `domain/`, `application/`, `infra/` | Hexágono enxuto. Cobre 90% dos casos sem verbosidade do clássico 4-layer. |
| D7 | Use case granularity: 1 use case = 1 operação = 1 arquivo | Casa com pedido "modularizado por casos de uso". Testabilidade máxima. Evita service classes god. |
| D8 | TDD pragmático | Teste-first obrigatório em use cases + entities + value objects + business rules. Opcional em controllers/wiring/scripts. Pega 90% do valor com menos atrito. |

## Estrutura de frontmatter padronizada

### Skill

```yaml
---
name: plan-define-module-spec
description: Use para criar a spec completa de um módulo antes da implementação. ...
phase: planning
rules:
  - plan-module-spec-required
  - plan-security-by-design
  - plan-testing-strategy-required
---
```

Corpo da skill começa com bloco obrigatório:

```markdown
## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/plan-module-spec-required.md`
- `.claude/rules/plan-security-by-design.md`
- `.claude/rules/plan-testing-strategy-required.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.
```

### Rule

```yaml
---
name: dev-tdd-pragmatic
description: Use cases + entities + value objects + business rules têm teste antes do código. Controllers/wiring podem vir depois.
phase: development
---

# Rule: dev-tdd-pragmatic

## Princípio
...
```

### Agent

```yaml
---
name: dev-clean-architect
description: Revisa estrutura de módulo, fronteiras entre camadas, dependência direction.
tools: Read, Write, Edit, Grep, Glob
phase: development
---
```

## Mapeamento de renames

### Skills (14)

| Atual | Novo | Phase |
|-------|------|-------|
| `discover-business` | `disc-discover-business` | discovery |
| `validate-idea` | `disc-validate-idea` | discovery |
| `init-project` | `plan-init-project` | planning |
| `define-product` | `plan-define-product` | planning |
| `map-users` | `plan-map-users` | planning |
| `design-business-model` | `plan-design-business-model` | planning |
| `choose-stack` | `plan-choose-stack` | planning |
| `design-architecture` | `plan-design-architecture` | planning |
| `plan-modules` | `plan-modules-mvp` | planning |
| `define-module-spec` | `plan-define-module-spec` | planning |
| `create-adr` | `plan-create-adr` | planning |
| `create-implementation-plan` | `plan-create-implementation-plan` | planning |
| `review-readiness` | `plan-review-readiness` | planning |
| `start-development` | `dev-start-development` | development |

`plan-modules` vira `plan-modules-mvp` para evitar duplicação `plan-plan-modules`.

### Rules (10)

Todas as rules existentes são de planning. Prefixar com `plan-`:

| Atual | Novo |
|-------|------|
| `adr-required-for-decisions.md` | `plan-adr-required-for-decisions.md` |
| `avoid-overengineering.md` | `plan-avoid-overengineering.md` |
| `business-before-technology.md` | `plan-business-before-technology.md` |
| `documentation-first.md` | `plan-documentation-first.md` |
| `explain-tradeoffs.md` | `plan-explain-tradeoffs.md` |
| `module-spec-required.md` | `plan-module-spec-required.md` |
| `no-code-before-spec.md` | `plan-no-code-before-spec.md` |
| `security-by-design.md` | `plan-security-by-design.md` |
| `stack-neutrality.md` | `plan-stack-neutrality.md` |
| `testing-strategy-required.md` | `plan-testing-strategy-required.md` |

### Agents (10)

| Atual | Novo | Phase |
|-------|------|-------|
| `business-mentor.md` | `plan-business-mentor.md` | planning |
| `domain-modeler.md` | `plan-domain-modeler.md` | planning |
| `implementation-planner.md` | `plan-implementation-planner.md` | planning |
| `monetization-strategist.md` | `plan-monetization-strategist.md` | planning |
| `product-strategist.md` | `plan-product-strategist.md` | planning |
| `scalability-reviewer.md` | `plan-scalability-reviewer.md` | planning |
| `security-reviewer.md` | `plan-security-reviewer.md` | planning |
| `software-architect.md` | `plan-software-architect.md` | planning |
| `technical-writer.md` | `plan-technical-writer.md` | planning |
| `ux-researcher.md` | `plan-ux-researcher.md` | planning |

## Novas rules `dev-*`

| Rule | Princípio core |
|------|----------------|
| `dev-tdd-pragmatic` | Use cases + entities + VOs + business rules têm teste antes. Controllers/wiring podem vir depois. |
| `dev-ddd-bounded-context` | 1 módulo = 1 bounded context. Linguagem ubíqua local. Sem vazamento de termos entre contextos. |
| `dev-clean-architecture-layers` | 3 camadas: `domain/`, `application/`, `infra/`. Dependência aponta pra dentro. |
| `dev-use-case-per-file` | 1 use case = 1 operação = 1 arquivo. Interface `execute(input): output`. Sem service classes. |
| `dev-solid` | 5 letras resumidas com exemplos de violação comum (god class, herança rasa, etc.). |
| `dev-clean-code` | Nomes intencionais, função pequena, sem comentários explicando o quê, evitar magic numbers. |
| `dev-module-naming` | EN singular, kebab-case folder, PascalCase classe. Ilustração: `auth/`, `student/`, `professor/`. |
| `dev-dependency-direction` | Domain não importa de application/infra. Application só importa de domain via ports. Infra implementa ports. |

## Novas skills `dev-*`

| Skill | Quando usar |
|-------|-------------|
| `dev-scaffold-module` | Cria estrutura `domain/`, `application/`, `infra/` + arquivos base do módulo a partir da spec. |
| `dev-define-use-case` | Pega 1 use case da spec, escreve `<name>.use-case.<ext>` + teste failing. Aplica TDD pragmático. |
| `dev-design-entity` | Modela entidade de domínio (atributos, invariantes, comportamentos). Sem framework. Aplica DDD. |
| `dev-write-failing-test-first` | Helper: dado um use case ou entity, gera teste failing antes do código. |
| `dev-refactor-to-clean-architecture` | Pega código que viola Clean Arch e refatora. |
| `dev-review-module-cohesion` | Auditoria de um módulo: dependências corretas? camadas respeitadas? use cases isolados? |

## Novos agents `dev-*`

| Agent | Foco |
|-------|------|
| `dev-clean-architect` | Revisa estrutura de módulo, fronteiras, dependência direction. |
| `dev-tdd-mentor` | Revisa teste-first, qualidade dos testes (asserts vazios? mocks excessivos?). |
| `dev-ddd-modeler` | Revisa entidades, value objects, bounded contexts em código. |

## Novos templates dev em `.genesis/templates/`

- `use-case-template.md` — estrutura: input, output, dependências (ports), fluxo principal, fluxos alternativos, eventos emitidos, teste de exemplo.
- `entity-template.md` — atributos, invariantes (constructor validation), métodos de domínio, eventos emitidos, teste de exemplo.
- `value-object-template.md` — propriedades imutáveis, validação no construtor, equality semântica, teste de exemplo.
- `repository-port-template.md` — interface no domain (contrato), exemplo de implementação na infra.
- `module-structure-template.md` — README do módulo com seções: bounded context, use cases, entities, dependências externas, eventos emitidos/consumidos.

## Estrutura de módulo padrão (referência)

```
src/<module>/
├── domain/
│   ├── entities/
│   │   └── student.entity.<ext>
│   ├── value-objects/
│   │   └── email.vo.<ext>
│   ├── events/
│   │   └── student-registered.event.<ext>
│   └── ports/
│       └── student-repository.port.<ext>
├── application/
│   └── use-cases/
│       ├── register-student.use-case.<ext>
│       ├── register-student.use-case.spec.<ext>
│       ├── enroll-in-course.use-case.<ext>
│       └── enroll-in-course.use-case.spec.<ext>
├── infra/
│   ├── repositories/
│   │   └── student.repository.<ext>
│   └── controllers/
│       └── student.controller.<ext>
└── README.md
```

`<ext>` depende da stack escolhida no projeto (`.ts`, `.py`, `.go`, etc.).

## Atualizações em arquivos existentes

- **`CLAUDE.md`**: reorganizar "Regras carregadas" agrupando por phase. Atualizar todas refs aos nomes novos. Mencionar mecanismo `rules:` + Pre-flight Read.
- **`.genesis/scripts/lint-docs.sh`**:
  - Validar frontmatter de rules (`name`, `description`, `phase`)
  - Validar `phase:` em skills + agents
  - Validar campo `rules:` em skills aponta pra rules existentes
  - Atualizar `expected_skills` (14 → 20), `expected_rules` (10 → 18), `expected_agents` (10 → 13)
  - `expected_templates` (9 → 14)
- **`.genesis/docs/skills/`**: criar narrativa pros 6 dev skills (`dev-scaffold-module.md`, `dev-define-use-case.md`, etc.). Renomear narrativas existentes com prefixo de phase (decisão: manter numeração `01-`, `02-` por ordem cronológica de uso, OU prefixar com phase também — ver Bloco A item 9).
- **`.genesis/docs/skills/README.md`**: índice reorganizado por phase.
- **`.claude/hooks/validate-docs-before-implementation.sh`**: case pattern já cobre `.claude/*` e `.genesis/*` (OK, sem mudança).

## Validação

Pós-execução de cada bloco:

- `bash .genesis/scripts/lint-docs.sh` aprovado (com novas validações)
- Cada skill renomeada ainda invocável pelo nome novo (pasta == frontmatter.name)
- Grep sentinela: zero refs vivas pros nomes antigos (excluir `.genesis/docs/superpowers/specs/` e `.genesis/CHANGELOG.md`)
- Spot-check manual: invocar 1 skill renomeada, confirmar que Pre-flight Read funciona (Claude lê as rules declaradas)

## Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| Renomear quebrar slash-commands/refs em outros lugares | Grep sentinela exaustivo antes do commit. Lint roda em todo .md. |
| Campo `rules:` no frontmatter ser ignorado pelo Claude Code (não é campo nativo) | Pre-flight Read no corpo da skill é o mecanismo real de carregamento. Frontmatter é só pra lint + documentação humana. |
| Lint dar warning em narrativas/changelogs que mencionam nomes antigos | Excluir paths específicos (`.genesis/CHANGELOG.md`, `docs/superpowers/specs/`) do grep sentinela. |
| Skill rename quebrar discovery se `name:` no frontmatter divergir do nome da pasta | Garantir consistência sempre: pasta == frontmatter.name. Lint valida. |
| Mecanismo Pre-flight Read aumentar tokens em cada invocação de skill | Trade aceito: rules têm ~50-100 linhas, ler 3-4 delas custa ~3-4k tokens. Vale a pela de aplicação literal vs. "vibe". Skills só leem suas rules declaradas. |
| Implementação fica grande e revisão difícil | Dois commits separados (Bloco A: rename + frontmatter, Bloco B: conteúdo dev novo). Diff revisável. |

## Ordem de execução (entrada do plano)

### Bloco A — pré-trabalho (padronização)

1. Adicionar `phase:` no frontmatter dos 14 skills atuais.
2. Adicionar frontmatter completo (`name`, `description`, `phase`) nos 10 rules atuais.
3. Adicionar `phase:` nos 10 agents atuais.
4. Adicionar campo `rules:` em skills relevantes + bloco "Pré-flight" no corpo de cada skill.
5. Renomear 14 pastas de skills com prefixo (`disc-`, `plan-`, `dev-`).
6. Renomear 10 arquivos de rules com prefixo `plan-`.
7. Renomear 10 arquivos de agents com prefixo `plan-`.
8. Atualizar refs cruzadas (`CLAUDE.md`, hooks, scripts, narrativas em `.genesis/docs/skills/`, descriptions de agents que citam outros agents).
9. Renomear narrativas em `.genesis/docs/skills/` aplicando mesmo prefixo (`01-init-project.md` → `plan-01-init-project.md`, etc.). Atualizar `.genesis/docs/skills/README.md` com índice por phase.
10. Atualizar `.genesis/scripts/lint-docs.sh` com novas validações + expected counts.
11. Rodar lint + grep sentinela. Commit bloco A.

### Bloco B — conteúdo dev

12. Criar 8 rules `dev-*` em `.claude/rules/`.
13. Criar 6 skills `dev-*` em `.claude/skills/`.
14. Criar 3 agents `dev-*` em `.claude/agents/`.
15. Criar 5 templates dev em `.genesis/templates/`.
16. Criar 6 narrativas em `.genesis/docs/skills/dev-*.md`.
17. Atualizar `.genesis/scripts/lint-docs.sh` (expected_skills = 20, expected_rules = 18, expected_agents = 13, expected_templates = 14).
18. Atualizar `CLAUDE.md` mencionando phase development + skills/rules novos.
19. Atualizar `.genesis/docs/skills/README.md` adicionando seção development.
20. Rodar lint + grep sentinela. Commit bloco B.

## Follow-ups (fora deste design)

- Adicionar skills/rules/agents para phase `operations` (deploy, monitoring, incident-response). Brainstorm próprio.
- Avaliar se `.claude/agents/` deveria também ter subpasta por phase. Por enquanto flat com prefixo, igual rules.
- Avaliar se vale criar wrapper de descoberta (`bash .genesis/scripts/list-by-phase.sh dev`) pra humanos.
- Decidir política quando uma skill mudar de phase (ex.: skill criada como `plan-X` que descobrimos ser também útil em `dev`). Default: skill nasce com 1 phase, se virar cross-phase, abrir ADR.
