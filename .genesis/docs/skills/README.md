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
