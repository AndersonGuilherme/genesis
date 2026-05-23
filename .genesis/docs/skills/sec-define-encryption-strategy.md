# sec-define-encryption-strategy

## O que faz
Define encryption at-rest + in-transit + key management. Produz `docs/security/encryption-strategy.md`.

## Quando você invoca
Após `sec-threat-model` + `plan-choose-stack`.

## O que a IA faz
1. Lista dados at-rest com método de cifragem.
2. Lista canais in-transit com TLS/mTLS.
3. Escolhe KMS + hierarquia de chaves.
4. Rotação por tipo de chave.

## Rules invocadas
- [sec-encryption-at-rest](../../../.claude/rules/sec-encryption-at-rest.md)
- [sec-encryption-in-transit](../../../.claude/rules/sec-encryption-in-transit.md)

## Próximo passo natural
`sec-define-audit-logging`.
