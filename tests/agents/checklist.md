# Agents: checklist

Cada agent em `.claude/agents/` deve ter frontmatter com `name:`, `description:`, `tools:` (verificado pelo `lint-docs.sh`).

Checks **semânticos** adicionais:

## Agents e seus aspectos críticos

| Agent | Foco principal | Documentos que deve observar | Sinal de regressão |
|-------|----------------|-------------------------------|---------------------|
| `product-strategist` | Visão, MVP, posicionamento, roadmap. | `docs/product/*` | Aceita "tudo é crítico" no MVP. |
| `business-mentor` | BMC, unit economics, riscos. | `docs/business/*` | Aceita LTV/CAC sem cálculo. |
| `software-architect` | Arquitetura, stack, fronteiras de módulo. | `docs/architecture/*`, `docs/adr/*` | Endossa microserviços no MVP. |
| `domain-modeler` | Entidades, regras, bounded contexts. | `docs/modules/*`, `docs/specs/<m>/*` | Aceita "tudo numa tabela". |
| `security-reviewer` | Auth, LGPD, threat modeling. | `docs/security/*` | Aceita "vamos botar HTTPS e ficou bom". |
| `scalability-reviewer` | Performance, filas, cache, escala. | `docs/architecture/scalability-strategy.md`, `docs/operations/*` | Endossa cache sem invalidação. |
| `ux-researcher` | Personas, jornadas, entrevistas. | `docs/product/target-users.md`, `docs/validation/*` | Aceita "perguntei pra família". |
| `monetization-strategist` | Pricing, planos, comissão. | `docs/business/pricing.md`, `monetization.md` | Endossa 10 planos. |
| `technical-writer` | Clareza, consistência, links. | Todos os `.md` do repo | Aceita documento sem dono. |
| `implementation-planner` | Quebrar spec em tarefas. | `docs/specs/<m>/*`, `docs/testing/*` | Aceita PR gigante. |

## Como usar

Ao editar um agent, reler:
1. A linha aqui (atualizar se foco mudou).
2. A seção "O que NUNCA faz" do arquivo do agent.

## Sinais de regressão

- Dois agents com responsabilidade idêntica → fundir ou clarificar.
- Agent sem "O que NUNCA faz" claro → tende a aceitar más decisões silenciosamente.
- Agent sem lista de documentos a observar → não sabe onde olhar.

Lista atual considerada coerente em 2026-05-23.
