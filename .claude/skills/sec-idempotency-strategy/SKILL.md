---
name: sec-idempotency-strategy
description: Define idempotency keys em operações de escrita não-idempotentes (criar transação, cobrar, enviar email). Evita duplicação por retry de cliente/network.
phase: security
rules:
  - sec-input-validation
  - sec-audit-trail
---

# Skill: sec-idempotency-strategy

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Listar operações não-idempotentes e definir strategy de idempotency-key. Produz `docs/security/idempotency.md`.

## Quando usar

- Quando arquitetura inclui operações sensíveis a duplicação (financeiro, comunicação cara, criação de recursos custosos).

## Processo

1. Listar operações: criar cobrança, enviar email/SMS, criar pedido, atribuir vaga limitada.
2. Para cada: cliente envia header `Idempotency-Key: <uuid>`.
3. Server armazena `<key, response>` em store com TTL (24h-7d típico).
4. Retry com mesma key retorna response cacheada.
5. Conflito (mesma key, request diferente) → 409.
6. Idempotency store: Redis (TTL automática) ou DB com cleanup job.
7. Audit log de idempotency hit.

## Critérios de conclusão

- [ ] Operações não-idempotentes listadas.
- [ ] Strategy de header `Idempotency-Key` definida.
- [ ] Store + TTL escolhidos.
- [ ] Comportamento de conflict (409) documentado.
- [ ] `docs/security/idempotency.md` completo.
