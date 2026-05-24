# sec-idempotency-strategy

## O que faz
Define idempotency-key em operações não-idempotentes (cobrar, enviar, criar). Produz `docs/security/idempotency.md`.

## Quando você invoca
Quando operações sensíveis a duplicação existem (financeiro, comunicação).

## O que a IA faz
1. Lista operações não-idempotentes.
2. Define header `Idempotency-Key`.
3. Store + TTL escolhidos.
4. Conflict (409) documentado.

## Rules invocadas
- [sec-input-validation](../../../.claude/rules/sec-input-validation.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)

## Próximo passo natural
Iniciar Bloco D (LGPD) ou desenvolvimento se LGPD não aplicar.
