---
name: sec-multi-tenant-isolation
description: Define como tenant_id é propagado e filtrado em toda query. Helper central, testes de isolamento, monitoramento de tentativas cross-tenant.
phase: security
rules:
  - sec-authz-enforced
  - sec-audit-trail
---

# Skill: sec-multi-tenant-isolation

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Garantir isolamento entre tenants em sistema multi-tenant. Produz `docs/security/multi-tenant-isolation.md`.

## Quando usar

- Após `sec-define-auth-strategy` confirmar multi-tenant.
- Antes de qualquer use case que leia/escreva dado de tenant.

## Processo

1. Decidir onde `tenant_id` vive: claim JWT, header, path.
2. Implementar helper central que injeta filter `tenant_id = actor.tenant_id` em toda query.
3. Repositórios contractually exigem `tenant_id` como parâmetro.
4. Testes de integração: actor de tenant A não vê dado de tenant B (ou tentativa retorna 403, não 404 vazio).
5. Audit log de tentativas cross-tenant: alert.
6. Monitoramento de queries sem filter (review estatístico).

## Critérios de conclusão

- [ ] Tenant_id em claim/header definido.
- [ ] Helper central implementado/planejado.
- [ ] Repositórios com contrato `tenant_id` obrigatório.
- [ ] Testes de isolamento incluídos no quality gate.
- [ ] Audit de tentativa cross-tenant configurado.
