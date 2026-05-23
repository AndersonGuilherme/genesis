---
name: sec-authz-enforced
description: Autorização (RBAC/ABAC) checada em todo use case sensível, no domain ou application — não só no controller. Multi-tenant: tenant_id filtrado em toda query.
phase: security
---

# Rule: sec-authz-enforced

## Princípio

Authn diz "quem é você", authz diz "você pode fazer isso?". Authz é checada no use case (camada application), não apenas no controller — porque use cases podem ser reusados por múltiplos canais (HTTP, CLI, evento) e cada canal precisaria repetir o check.

Multi-tenant: toda query filtra `tenant_id` do user autenticado. Sem exceção. Esquecimento = vazamento entre tenants.

## Por que existe

Authz só no controller falha em: chamada interna entre use cases, jobs assíncronos, reuso de use case em outro canal, alteração de rota. Authz no use case é fonte única da verdade.

Multi-tenant sem filtro = vazamento massivo. Conhecido como IDOR ou "broken object level authorization" (OWASP top 1 em APIs).

## Como aplicar

1. Use case recebe `actor` (usuário autenticado + roles + tenant) como parâmetro explícito.
2. Primeira ação do use case: verificar permissão. Falha → `UnauthorizedError`.
3. Toda query a repository inclui `tenant_id = actor.tenant_id`. Helper/middleware centraliza.
4. Testes de use case incluem: actor sem permissão → throw, actor de outro tenant → throw.
5. Documentar matriz role × use case em `docs/security/auth-strategy.md`.

## Exemplos bons

- `EnrollInCourseUseCase.execute({ actor, studentId, courseId })` valida `actor.can('student.enroll', studentId)` antes de prosseguir.
- `StudentRepository.findById(id, tenantId)` — tenantId obrigatório no contrato.
- Teste: `actor=studentB` tenta operar sobre `studentA` → throw `UnauthorizedError`.

## Exemplos ruins

- Authz só em middleware HTTP — job assíncrono que chama o mesmo use case escapa.
- Query sem `tenant_id` "porque a UI sempre passa o id certo" (UI é cliente, não controle).
- Role como string mágica em `if (user.role === 'admin')` espalhada (centralizar em policy).

## Exceções

- Use cases de admin/super-admin pode ter authz simplificada (apenas role check). Documentar.
- Use cases puramente computacionais (sem dado de tenant) podem pular tenant filter. Documentar e justificar.
