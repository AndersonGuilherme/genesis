---
name: sec-encryption-at-rest
description: PII e secrets armazenados criptografados em repouso. Banco com encryption at-rest ativado; campos sensíveis com encryption a nível de aplicação quando regulamentação exigir.
phase: security
---

# Rule: sec-encryption-at-rest

## Princípio

Dado pessoal (PII) e secrets armazenados são criptografados em repouso. Default: encryption a nível de storage (LUKS, AWS RDS encryption, etc.). Para dados sensíveis específicos (CPF, dado de saúde, financial), encryption adicional a nível de aplicação com chave separada.

## Por que existe

Backup vazado, disco roubado, snapshot público acidental, ataque a nível de infra — encryption at-rest é última linha de defesa. LGPD art. 46 exige "medidas de segurança técnicas e administrativas" — encryption at-rest é prática consagrada.

## Como aplicar

1. Banco principal: encryption at-rest ativado no provider (RDS, Aurora, Cloud SQL, etc.). Documentar.
2. Backups: encryption mantida na cópia. Restore drill valida.
3. Campos sensíveis específicos (CPF, conta bancária, token de gateway, password hash não conta — é hash): cifrar a nível de aplicação com biblioteca padrão (libsodium, AWS KMS Encryption SDK).
4. Chave de cifragem: gerenciada em KMS/Vault, NUNCA no código nem no banco junto do dado.
5. Rotação de chave documentada com janela aceitável.

## Exemplos bons

- RDS `StorageEncrypted: true`. Documentado em `docs/security/secrets-management.md`.
- Campo `cpf` cifrado com AES-256-GCM, chave em AWS KMS, ciphertext + nonce no banco.
- Snapshot recente cifrado restaurado em ambiente de teste com sucesso.

## Exemplos ruins

- Banco em provider que oferece encryption mas a flag está `false` (default).
- Backup `pg_dump` baixado e enviado por email "pra debug" — sem encryption no transit nem at rest.
- Chave de cifragem na env var de aplicação (perdeu separação chave/dado).
- Cifrar password com cifra reversível (password vai pra hash, não pra cifra).

## Exceções

- Cache temporário com TTL curto (segundos a minutos) sem PII pode dispensar encryption.
- Dados completamente públicos (catálogo público de produtos, etc.) não exigem encryption — mas o sistema todo deve manter encryption default.
