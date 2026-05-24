# Tests: sec-webhook-signing

## Pré-condição
- Integração com webhook (enviado ou recebido de terceiro).

## Prompts canônicos
- "webhook signing"
- "HMAC + replay protection"
- "como validar webhook do Stripe"

## Comportamentos esperados
- [ ] HMAC SHA-256 (ou superior) no header.
- [ ] Timestamp do request validado (rejeita > 5min de diferença = replay protection).
- [ ] Nonce/ID único do evento armazenado (idempotência + anti-replay).
- [ ] Segredo de assinatura no vault.
- [ ] Webhooks enviados também assinam.

## Anti-padrões
- [ ] NÃO valida só por IP origem (IP pode mudar, é frágil).
- [ ] NÃO aceita request sem timestamp.
- [ ] NÃO loga payload com PII em claro (cross-link `sec-no-logged-secrets`).
