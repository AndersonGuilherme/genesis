# Tests: sec-idempotency-strategy

## Pré-condição
- Lista de operações de escrita não-idempotentes (criar transação, cobrar, enviar email/SMS).

## Prompts canônicos
- "idempotency keys"
- "como evitar duplo charge"
- "retry safe"

## Comportamentos esperados
- [ ] Cliente envia `Idempotency-Key` (UUID) no header.
- [ ] Server armazena key + response por janela (24h+ típico).
- [ ] Mesma key + mesmo payload = mesma response (sem reexecutar).
- [ ] Mesma key + payload diferente = 422 conflict.
- [ ] Cobertura: pagamento, criação de pedido, envio de notificação.

## Anti-padrões
- [ ] NÃO confia em "client não vai mandar duas vezes".
- [ ] NÃO usa request body hash sozinho (cliente pode mudar campos irrelevantes).
- [ ] NÃO esquece TTL do storage de keys (vaza).
