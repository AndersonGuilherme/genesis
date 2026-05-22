# Data strategy

> Como dados nascem, vivem, são protegidos e morrem. Decisões de dados são caras de reverter.

## Princípios

1. _(ex.: dados de produção nunca em ambiente de dev)_
2. _(ex.: dado pessoal só persiste se há base legal LGPD)_
3. _(ex.: chaves de cliente como tenant id em todas as tabelas multi-tenant)_
4. _(ex.: nada de soft delete invisível — auditoria sempre)_

## Modelo de armazenamento

| Tipo de dado | Tecnologia | Por quê |
|--------------|------------|---------|
| Transacional (OLTP) | _(ex.: PostgreSQL)_ | ACID, JSONB, ecossistema |
| Cache | _(ex.: Redis)_ | latência baixa, TTL nativo |
| Filas | _(ex.: SQS/RabbitMQ/BullMQ)_ | durabilidade + retry |
| Arquivos | _(ex.: S3)_ | escala + custo |
| Eventos analíticos | _(ex.: ClickHouse / BigQuery / DuckDB)_ | colunar, agregação rápida |
| Search | _(ex.: Postgres FTS / Meilisearch)_ | conforme volume |

## Multi-tenancy

- [ ] Pool (1 banco, tenant id) — recomendado para começo
- [ ] Bridge (schema por tenant) — quando isolamento aumenta
- [ ] Silo (banco por tenant) — apenas enterprise / regulação

**Escolha:** _(qual e por quê)_

## Modelagem

- ER de alto nível: _(diagrama em [system-context.md](system-context.md) ou exportado)_
- Convenções de nome: _(snake_case, plural, ids como uuid)_
- Soft delete: _(usar `deleted_at`?)_
- Tracing de auditoria: _(coluna `created_by`, `updated_by`, tabela de eventos)_

## Retenção

| Categoria | Tempo | Justificativa | Como apagar |
|-----------|-------|----------------|-------------|
| Logs de auditoria | _(7 anos)_ | _(regulação financeira)_ | rotina mensal |
| Dados de aluno após cancelamento | _(2 anos)_ | _(LGPD + obrigação contábil)_ | rotina trimestral |
| Tokens de refresh expirados | _(30 dias)_ | _(higiene)_ | rotina diária |

## Backups

| Item | Frequência | Retenção | RPO | RTO |
|------|------------|----------|-----|-----|
| Banco principal | snapshot diário + WAL contínuo | 30 dias | 5 min | 30 min |
| Storage | versionamento + lifecycle | 90 dias | imediato | imediato |

Testar restore: _(mensal — registrar no runbook)_

## Migrações

- Ferramenta: _(ex.: Flyway, Prisma migrate, Atlas)_
- Política: _(zero-downtime; quebrar mudanças destrutivas em 2 deploys)_

## Conformidade LGPD

Ver [../security/data-privacy.md](../security/data-privacy.md). Resumo:

- Inventário de dados pessoais
- Base legal por finalidade
- Atendimento a direitos do titular (acesso, retificação, exclusão)
- DPO designado

## Dados sensíveis

| Tipo | Local | Criptografia |
|------|-------|--------------|
| Senha | banco | hash bcrypt/argon2 |
| Token de acesso | banco | hash + expiração curta |
| Documento de aluno | storage | criptografia em repouso |
| Dados de cartão | **não armazenamos** | tokenização no gateway |

## Importação e exportação

- Importação CSV: _(planejada para fase 2 — não MVP)_
- Exportação por tenant: _(disponível em conta com download direto)_
- Portabilidade: _(formato padrão CSV + JSON)_

## Telemetria de dados

- Logs sensíveis nunca registram CPF, senha, token.
- IDs internos podem aparecer.
- Sampling de eventos com PII: nunca.
