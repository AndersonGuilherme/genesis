---
name: sec-audit-trail
description: Ações sensíveis (login, mudança de permissão, acesso a PII, alteração de dado financeiro, deleção) geram audit log estruturado, imutável, retido por prazo legal.
phase: security
---

# Rule: sec-audit-trail

## Princípio

Toda ação sensível é registrada em audit log: quem, quando, o quê, em qual recurso, qual resultado, qual origem (IP, user-agent). Audit log é separado do log de aplicação, imutável (append-only), retido por prazo legal mínimo (varia por setor; default 5 anos).

## Por que existe

LGPD art. 37 exige registro de operações de tratamento. Compliance (PCI, ISO 27001, SOC 2) exige audit trail. Investigação de incidente sem audit log é impossível. Auditoria de comportamento interno (insider threat) também depende.

## Como aplicar

1. Lista de ações sensíveis em `docs/security/audit-logging.md`. Mínimo: login (sucesso/falha), logout, mudança de senha, mudança de role, acesso a PII de terceiros, criação/alteração/deleção de registro financeiro, export de dado, alteração de configuração crítica.
2. Cada ação emite evento estruturado: `{ timestamp, actor_id, actor_role, action, resource_type, resource_id, tenant_id, ip, user_agent, result }`.
3. Store separado do log de aplicação: append-only (DynamoDB stream, S3 imutável, banco com WORM, etc.).
4. Retenção: mínimo 5 anos (verificar regulação do domínio).
5. Acesso ao audit log restrito (read-only para auditor, ninguém escreve direto).
6. Audit log é INPUT em retrospectivas de incidente.

## Exemplos bons

- Use case sensível chama `auditLog.record({ ... })` ao final do happy path E no caso de falha de authz.
- Audit log em DynamoDB com stream ativado; replicação para S3 com Object Lock (WORM).
- Dashboards mostram top atores, top ações, anomalias.

## Exemplos ruins

- Audit log misturado no `app.log` (rotaciona, deletado depois de 7 dias).
- Audit log gravado pelo próprio user (pode falsificar).
- Apenas log de "sucesso" — falhas de autorização sem registro escondem ataques.
- Audit sem `tenant_id` em sistema multi-tenant (não filtra por cliente).

## Exceções

- Read-only de dado não sensível (catálogo público) pode não exigir audit.
- Métricas agregadas (count de logins/dia) podem ter retenção menor; granular fica em audit.
