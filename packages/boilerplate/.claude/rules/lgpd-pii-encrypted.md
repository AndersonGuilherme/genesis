---
name: lgpd-pii-encrypted
description: PII em repouso é criptografado. Campos sensíveis (CPF, dados de saúde, financeiro) cifrados a nível de aplicação com chave separada. Cross-link com sec-encryption-at-rest.
phase: lgpd
---

# Rule: lgpd-pii-encrypted

## Princípio

Storage criptografado at-rest (banco, backup, snapshot) é baseline. Campos sensíveis específicos (CPF, dado de saúde, dado financeiro, biometria, dado de criança) ganham camada extra: encryption a nível de aplicação com chave gerenciada em KMS/Vault. Dado em trânsito segue `sec-encryption-in-transit`.

## Por que existe

LGPD art. 46 exige "medidas técnicas e administrativas" pra proteger PII. Art. 11 trata dado sensível como categoria especial. Encryption at-rest no banco não protege contra acesso de DBA, query maliciosa ou export legítimo. Field-level encryption protege o dado mesmo dentro do sistema autorizado.

## Como aplicar

1. Banco: encryption at-rest do provider (RDS `StorageEncrypted: true`, etc.).
2. Backups: encryption mantida na cópia + restore drill valida.
3. Categorias sensíveis (lista em `docs/security/lgpd/data-inventory.md` com `sensitive: true`):
   - Cifrar a nível de aplicação com biblioteca padrão (libsodium, AWS Encryption SDK).
   - Chave em KMS/Vault. NUNCA no código nem na mesma tabela.
   - Ciphertext + nonce armazenados; chave referenciada por ID.
4. Index: dado sensível não indexado em claro. Se busca exige (ex.: por CPF), usar hash determinístico separado.
5. Logs: cross-link `sec-no-logged-secrets` — PII sensível redacted no logger.
6. Rotação de chave: documentada com janela aceitável + processo testado.

## Exemplos bons

- Campo `cpf` cifrado com AES-256-GCM, chave em AWS KMS.
- Busca por CPF: hash SHA-256(cpf + salt fixo) armazenado em coluna paralela, indexado.
- Backup `pg_dump` rejeitado em CI — só backup nativo do RDS (mantém encryption).

## Exemplos ruins

- CPF, RG, conta bancária em coluna `varchar` sem encryption.
- "Encryption do banco é suficiente" pra dado sensível (não protege contra acesso lógico autorizado).
- Chave de cifragem em env var do app servidor (perde separação chave/dado).
- Dump de banco em laptop de dev "pra debug" — pega dado em claro fora do perímetro.

## Exceções

- Hash de senha não é encryption (é hash); password vai pra bcrypt/argon2, não pra cifra reversível.
- Dado puramente público (nome de produto, descrição) dispensa encryption específica — mas storage default encryption continua valendo.

