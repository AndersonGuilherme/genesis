# Tests: sec-define-encryption-strategy

## Pré-condição
- Stack + provider de banco/storage definidos.
- `docs/security/lgpd/data-inventory.md` lista categorias sensíveis.

## Prompts canônicos
- "encryption at-rest e in-transit"
- "qual KMS usar?"
- "estratégia de criptografia"

## Comportamentos esperados
- [ ] At-rest: banco + backup + snapshot + storage de uploads.
- [ ] In-transit: TLS 1.2+ em todo canal + mTLS service-to-service quando aplicável.
- [ ] Field-level encryption pra categorias sensíveis (CPF, saúde, financeiro).
- [ ] KMS/Vault gerencia chaves (NUNCA no código nem na mesma tabela do dado).
- [ ] Plano de rotação de chaves documentado.

## Anti-padrões
- [ ] NÃO confunde hash de senha com encryption.
- [ ] NÃO deixa backup sem encryption "porque o destino é privado".
- [ ] NÃO armazena chave junto do ciphertext.
