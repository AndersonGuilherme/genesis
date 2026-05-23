---
name: sec-webhook-signing
description: Define assinatura HMAC em webhooks (enviados e recebidos) + replay protection (timestamp + nonce). Cobertura para todo webhook de/para terceiro.
phase: security
rules:
  - sec-input-validation
  - sec-audit-trail
---

# Skill: sec-webhook-signing

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Garantir que webhooks (recebidos de terceiros, enviados a terceiros) são autenticados e protegidos contra replay. Produz `docs/security/webhooks.md`.

## Quando usar

- Quando arquitetura tem webhook (gateway de pagamento, notificação, integração externa).

## Processo

1. **Recebidos**: validar assinatura HMAC (header `X-Signature`), validar timestamp (rejeitar mensagens > 5min de delta), guardar nonce (idempotência).
2. **Enviados**: assinar payload com chave compartilhada com receiver, incluir timestamp + nonce.
3. Chaves de signing em vault.
4. Rotação de chave de webhook documentada (com janela de overlap).
5. Audit log de webhook recebido (signature valid/invalid).

## Critérios de conclusão

- [ ] HMAC validation em todo webhook recebido.
- [ ] Timestamp delta máximo definido.
- [ ] Nonce store para replay protection.
- [ ] Webhooks enviados assinados.
- [ ] Rotação de chave documentada.
