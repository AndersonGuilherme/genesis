---
name: sec-secrets-no-commit
description: Nenhum secret (.env, chave, token, certificado privado) entra no git. Pre-commit hook + .gitignore + secret scanner obrigatórios.
phase: security
---

# Rule: sec-secrets-no-commit

## Princípio

Secrets nunca são commitados. Ponto. Mesmo "só pra testar". Mesmo "vou tirar depois". Mesmo em branch local. Histórico do git é permanente — secret commitado é secret vazado.

## Por que existe

Secret no git é vazamento via clone, fork, mirror, CI logs, backup. Rotação custa caro e nem sempre é possível (ex.: chave embutida em token de cliente). Único caminho seguro é nunca entrar.

## Como aplicar

1. `.gitignore` cobre `.env`, `.env.*`, `*.pem`, `*.key`, `*credentials*`, `*secret*`.
2. Pre-commit hook (`gitleaks`, `detect-secrets`, equivalente) bloqueia commit com padrão de secret.
3. CI valida em PR (mesmo scanner).
4. Secrets vivem em vault (AWS Secrets Manager, Vault, Doppler, etc.) ou env var de runtime.
5. `.env.example` (sem valores reais) commitado como referência.

## Exemplos bons

- `.env` em `.gitignore`, `.env.example` commitado com `DB_PASSWORD=changeme`.
- Pre-commit gitleaks bloqueia PR que continha `AWS_ACCESS_KEY_ID=AKIA...`.
- CI pipeline roda secret scanner no diff antes de build.

## Exemplos ruins

- `config.json` com `"api_key": "sk_live_..."` no repo.
- Token de teste hardcoded "vou substituir antes de deploy".
- Chave privada `.pem` em pasta `secrets/` "que não está pública" (mas está no git).

## Exceções

- Chaves públicas (`*.pub`) podem entrar.
- Secrets dummy declaradamente fake em fixtures de teste (com comentário `// FAKE`).
- Secrets criptografados com sops/git-crypt + chave de descriptografia em vault.
