---
name: dev-scaffold-module
description: Use após `plan-define-module-spec` aprovado, para criar a estrutura inicial do módulo (domain/, application/, infra/) com arquivos base + README. Aplica Clean Architecture 3-layer + DDD bounded context.
phase: development
rules:
  - dev-clean-architecture-layers
  - dev-module-naming
  - dev-ddd-bounded-context
  - dev-dependency-direction
---

# Skill: dev-scaffold-module

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-clean-architecture-layers.md`
- `.claude/rules/dev-module-naming.md`
- `.claude/rules/dev-ddd-bounded-context.md`
- `.claude/rules/dev-dependency-direction.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Gerar a estrutura inicial de um módulo a partir da spec aprovada. Sem código de negócio ainda — só esqueleto + README.

## Quando usar

- Após `plan-define-module-spec` produzir `docs/specs/<modulo>/` completo.
- Antes de qualquer use case ou entity ser implementado.

## Pré-condições

- `docs/specs/<modulo>/overview.md` existe e está aprovado.
- Stack escolhida (`docs/architecture/technology-decision.md` preenchido).
- `<ext>` (extensão de arquivo) deriva da stack.

## Processo

1. Ler spec do módulo: entities, value objects, use cases, eventos, ports.
2. Decidir nome do módulo seguindo `dev-module-naming` (EN singular kebab-case).
3. Criar estrutura de pastas:
   ```
   src/<module>/
   ├── domain/
   │   ├── entities/
   │   ├── value-objects/
   │   ├── events/
   │   └── ports/
   ├── application/
   │   └── use-cases/
   ├── infra/
   │   ├── repositories/
   │   └── controllers/
   └── README.md
   ```
4. Para cada entity da spec → criar `domain/entities/<entity>.entity.<ext>` esqueleto (classe vazia ou sketched conforme template).
5. Para cada VO → criar `domain/value-objects/<vo>.vo.<ext>` esqueleto.
6. Para cada port → criar `domain/ports/<entity>-repository.port.<ext>` esqueleto baseado em `.genesis/templates/repository-port-template.md`.
7. Para cada use case → criar arquivo vazio `application/use-cases/<verb-noun>.use-case.<ext>` (implementação fica para `dev-define-use-case`).
8. Para cada repository port → criar impl esqueleto em `infra/repositories/<entity>.repository.<ext>`.
9. Criar `README.md` do módulo baseado em `.genesis/templates/module-structure-template.md`, preenchendo a partir da spec.

## Restrições

- Não implementar regra de negócio neste passo — só estrutura.
- Não criar use case sem entity correspondente.
- Não criar entity de outro bounded context (rule `dev-ddd-bounded-context`).

## Exemplos de uso

- "Scaffold do módulo student."
- "Criar estrutura do módulo billing baseado na spec."

## Critérios de conclusão

- [ ] Pasta `src/<module>/` com 3 camadas e subpastas corretas.
- [ ] README do módulo preenchido com seções da spec.
- [ ] Esqueletos de entities, VOs, ports, use cases criados.
- [ ] Repository impl esqueleto em infra/.
- [ ] Imports respeitam `dev-dependency-direction` (verificar manualmente neste passo).
