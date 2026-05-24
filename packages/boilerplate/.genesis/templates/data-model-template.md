# Data Model: \<entidade\>

| Campo | Valor |
|-------|-------|
| Entidade | _(PascalCase)_ |
| Módulo | _(slug)_ |
| Tabela / coleção | _(snake_case)_ |
| Versão | v1 |
| Última atualização | YYYY-MM-DD |

## Propósito

Em 1 frase, o que essa entidade representa no domínio.

## Campos

| Campo | Tipo | Obrigatório | Único | Default | Descrição |
|-------|------|-------------|-------|---------|-----------|
| `id` | uuid | sim | sim | `gen_uuid()` | identificador |
| `tenant_id` | uuid | sim | não | — | multi-tenant key |
| `created_at` | timestamp | sim | não | `now()` | criação |
| `updated_at` | timestamp | sim | não | `now()` | última atualização |
| `created_by` | uuid | sim | não | — | autor (auditoria) |
| `<custom>` | _(...)_ | _(...)_ | _(...)_ | _(...)_ | _(...)_ |

## Relacionamentos

| Tipo | Entidade alvo | Cardinalidade | Cascata em delete |
|------|----------------|----------------|---------------------|
| FK | _(...)_ | 1:N / N:1 / N:M | restrict / set null / cascade |

## Invariantes

Regras que **nunca** podem ser violadas:

1. _(ex.: `tenant_id` igual em todas as FKs do mesmo registro)_
2. _(ex.: `created_at` ≤ `updated_at`)_
3. _(ex.: `email` único dentro do mesmo tenant)_

Cada invariante precisa de:
- Enforcement em uma camada (banco preferencial via constraint)
- Teste automatizado

## Índices

| Nome | Colunas | Tipo | Motivo |
|------|---------|------|--------|
| `idx_<tabela>_<col>` | _(...)_ | btree / gin / unique | _(...)_ |

## Soft delete

- [ ] Usa `deleted_at`?
- [ ] Como queries default tratam isso?
- [ ] Há job para purga após N dias?

## Auditoria

| Campo | Como auditar |
|-------|---------------|
| _(...)_ | trigger + tabela `audit_events` |

Eventos de mudança importantes:
- create
- update (campos sensíveis)
- delete (soft / hard)

## Retenção

| Categoria | Tempo | Motivo |
|-----------|-------|--------|
| Registros ativos | indefinido (enquanto tenant ativo) | execução do contrato |
| Soft-deleted | _(ex.: 90 dias)_ | restauração + compliance |
| Após cancelamento do tenant | _(ex.: 2 anos)_ | LGPD + obrigação fiscal |

## Privacidade / LGPD

- Contém PII? _(quais campos)_
- Base legal: _(consentimento / contrato / obrigação legal / legítimo interesse)_
- Pode ser exportada pelo titular? sim
- Pode ser anonimizada / excluída? sim — processo em `data-privacy.md`

## Crescimento esperado

| Horizonte | Linhas estimadas |
|-----------|------------------|
| 6 meses | _(número)_ |
| 12 meses | _(número)_ |
| 24 meses | _(número)_ |

Limite para reavaliar (partição / sharding): _(número)_

## Migrações

- Estratégia: expand → backfill → contract
- Migrações destrutivas exigem ADR
- Testar rollback em staging antes de prod

## Histórico

| Data | Mudança | ADR |
|------|---------|-----|
