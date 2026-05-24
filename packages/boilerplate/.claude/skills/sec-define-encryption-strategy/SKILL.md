---
name: sec-define-encryption-strategy
description: Define encryption at-rest + in-transit + key management. Cobre banco, backup, campos sensíveis específicos, certificados, rotação de chave.
phase: security
rules:
  - sec-encryption-at-rest
  - sec-encryption-in-transit
---

# Skill: sec-define-encryption-strategy

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Definir estratégia completa de cifragem: at-rest (banco, backup, campos sensíveis), in-transit (TLS, mTLS), key management (KMS, rotação). Documenta em `docs/security/encryption-strategy.md` (novo).

## Quando usar

- Após `sec-threat-model` identificar dados sensíveis.
- Após `plan-choose-stack` (provider de DB conhecido).
- Antes de `sec-secrets-management-plan`.

## Pré-condições

- Threat model lista PII e dados sensíveis.
- Provider de infra/DB definido.

## Processo

1. Listar todos os dados que precisam encryption at-rest:
   - DB principal (encryption padrão do provider).
   - Backups (mesma key ou key separada).
   - Cache de PII (Redis/Memcached com encryption se aplicável).
   - Campos especiais (CPF, cartão, conta bancária) com encryption a nível de aplicação.
2. Listar canais que precisam encryption in-transit:
   - Cliente ↔ API (HTTPS/TLS 1.2+).
   - Serviço ↔ serviço (TLS interno ou mTLS).
   - App ↔ banco (sslmode=verify-full ou equivalente).
   - App ↔ terceiros (sempre HTTPS, verify cert).
3. Escolher KMS (AWS KMS, GCP KMS, Vault transit, etc.).
4. Definir hierarquia de chaves: chave mestra → chaves específicas por uso.
5. Procedimento de rotação por tipo de chave.
6. Procedimento emergencial (suspeita de comprometimento).
7. Preencher `docs/security/encryption-strategy.md`.

## Restrições

- TLS 1.0/1.1 proibidos.
- Sem `verify=False` em cliente HTTP.
- Chave de cifragem NUNCA junto do dado cifrado no mesmo storage.
- Password vai pra hash (bcrypt/argon2), não pra cifra reversível.

## Critérios de conclusão

- [ ] Dados at-rest listados com método de encryption.
- [ ] Canais in-transit listados com TLS configurado.
- [ ] KMS escolhido com hierarquia de chaves.
- [ ] Rotação documentada por tipo.
- [ ] `docs/security/encryption-strategy.md` completo.
