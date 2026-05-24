---
name: dev-review-module-cohesion
description: Use para auditoria estrutural de um módulo — camadas respeitadas? dependency direction OK? bounded context isolado? Use cases coesos? Retorna findings, sem refatorar.
phase: development
rules:
  - dev-clean-architecture-layers
  - dev-dependency-direction
  - dev-ddd-bounded-context
  - dev-use-case-per-file
---

# Skill: dev-review-module-cohesion

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-clean-architecture-layers.md`
- `.claude/rules/dev-dependency-direction.md`
- `.claude/rules/dev-ddd-bounded-context.md`
- `.claude/rules/dev-use-case-per-file.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Diagnóstico estrutural de 1 módulo. Lista findings com severidade. Não refatora.

## Quando usar

- Periodicamente (a cada N PRs grandes no módulo).
- Antes de adicionar feature significativa.
- Após onboarding de novo dev.

## Pré-condições

- Módulo existe em `src/<module>/`.
- Stack escolhida pra entender extensões de arquivo.

## Processo

1. **Listar arquivos** do módulo agrupados por camada.
2. **Verificar estrutura**: 3 camadas presentes? README do módulo existe e está preenchido?
3. **Mapear imports**:
   - Para cada arquivo, listar imports.
   - Validar direção (domain ↛ application/infra, application ↛ infra, etc.).
4. **Conferir bounded context**:
   - Há import de entity de outro módulo? Listar.
   - Termos do glossário local são usados de forma consistente?
5. **Conferir use cases**:
   - 1 use case por arquivo? Service classes existem?
   - Cada use case tem teste irmão?
6. **Conferir ports**:
   - Ports vivem em `domain/ports/`?
   - Impls vivem em `infra/`?
   - Ports têm método demais (>5)? Interface Segregation?
7. **Retornar findings** com severidade:
   - 🔴 high: viola direção de dependência ou bounded context.
   - 🟡 medium: god class, port inflada.
   - 🟢 low: nome inconsistente, falta README.

## Restrições

- Não refatorar — só reportar.
- Não inventar problema (cada finding referencia arquivo:linha).

## Exemplos de uso

- "Audita o módulo student."
- "Review estrutural do billing."

## Critérios de conclusão

- [ ] Lista de findings em formato `arquivo:linha — severidade — problema — fix sugerido`.
- [ ] Categorizado por severidade.
- [ ] Sem mudança no código.
