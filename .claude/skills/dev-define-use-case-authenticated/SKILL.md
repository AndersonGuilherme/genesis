---
name: dev-define-use-case-authenticated
description: Variante de `dev-define-use-case` para use cases que exigem autenticação + autorização. Carrega rules sec-* necessárias. Aplica TDD + RBAC/ABAC + audit log.
phase: development
rules:
  - dev-tdd-pragmatic
  - dev-use-case-per-file
  - dev-clean-architecture-layers
  - dev-solid
  - sec-authn-required
  - sec-authz-enforced
  - sec-audit-trail
  - sec-input-validation
---

# Skill: dev-define-use-case-authenticated

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-tdd-pragmatic.md`
- `.claude/rules/dev-use-case-per-file.md`
- `.claude/rules/dev-clean-architecture-layers.md`
- `.claude/rules/dev-solid.md`
- `.claude/rules/sec-authn-required.md`
- `.claude/rules/sec-authz-enforced.md`
- `.claude/rules/sec-audit-trail.md`
- `.claude/rules/sec-input-validation.md`

Aplique todas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Implementar use case que exige autenticação + autorização com TDD pragmático + checks de segurança aplicados.

## Quando usar

- Use case que NÃO é público (maioria — `sec-authn-required` é default).
- Use case que muda estado, lê dado de outro user, ou toca recurso restrito.

## Processo (TDD + Sec)

1. Ler spec do use case + matriz role × recurso em `docs/security/auth-strategy.md`.
2. Aplicar `dev-define-use-case` processo base:
   - RED: teste falhando (caminho feliz).
   - GREEN: implementação mínima.
   - REFACTOR.
3. **Adições obrigatórias**:
   - Use case recebe `actor` (id + role + tenant) como parâmetro.
   - Primeira ação: verificar permissão. Falha → throw `UnauthorizedError`.
   - Validação de input via schema (boundary, sec-input-validation).
   - Audit log emitido no happy path E na falha de authz.
   - Em multi-tenant: query filtra `tenant_id = actor.tenant_id`.
4. Testes adicionais obrigatórios:
   - actor sem permissão → `UnauthorizedError`.
   - actor de outro tenant → `UnauthorizedError` (não 404).
   - input inválido → `ValidationError`.
5. Commit com teste + impl juntos.

## Restrições

- Sem authz só no controller — sempre no use case também.
- Sem query sem `tenant_id` em multi-tenant.
- Sem catch silencioso de erro de auth.

## Critérios de conclusão

- [ ] Critérios de `dev-define-use-case` + tudo abaixo:
- [ ] Use case verifica `actor.can(action, resource)` antes de prosseguir.
- [ ] Teste cobre: sem permissão, outro tenant, input inválido.
- [ ] Audit log emitido (sucesso + falha de authz).
- [ ] Query usa filter de tenant (se aplicável).
