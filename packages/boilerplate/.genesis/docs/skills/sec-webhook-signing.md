# sec-webhook-signing

## O que faz
HMAC + replay protection em webhooks recebidos e enviados. Produz `docs/security/webhooks.md`.

## Quando você invoca
Quando arquitetura tem webhook (pagamento, integração externa).

## O que a IA faz
1. Recebidos: valida HMAC + timestamp + nonce.
2. Enviados: assina com chave compartilhada.
3. Chaves de signing em vault.
4. Rotação documentada.

## Rules invocadas
- [sec-input-validation](../../../.claude/rules/sec-input-validation.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)

## Próximo passo natural
`sec-idempotency-strategy`.
