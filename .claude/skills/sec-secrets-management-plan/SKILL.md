---
name: sec-secrets-management-plan
description: Define onde secrets vivem (vault/KMS), como acessam por ambiente, rotação, procedimento emergencial. Produz `docs/security/secrets-management.md`.
phase: security
rules:
  - sec-secrets-no-commit
  - sec-no-logged-secrets
  - sec-encryption-at-rest
---

# Skill: sec-secrets-management-plan

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Inventário de secrets + estratégia de gerenciamento + procedimento de rotação. Produz `docs/security/secrets-management.md`.

## Quando usar

- Após `plan-design-architecture` (sabe quais secrets o sistema precisa).
- Antes de qualquer deploy (mesmo staging).
- Quando integração nova adiciona secret.

## Pré-condições

- `docs/architecture/integration-map.md` lista integrações externas.
- Template `.genesis/templates/secrets-management-template.md` disponível.

## Processo

1. Listar todos secrets necessários (DB password, JWT key, API keys de terceiros, SMTP, OAuth client secret, etc.).
2. Para cada secret: tipo, onde vive em prod/staging/dev, quem acessa, frequência de rotação.
3. Escolher vault/KMS provider (AWS Secrets Manager, Vault, Doppler, etc.).
4. Definir como app obtém secrets: IAM role + SDK, sidecar, env var injetada no deploy.
5. Documentar `.gitignore` + pre-commit scanner setup.
6. Definir procedimento de rotação (padrão + emergencial).
7. Preencher `docs/security/secrets-management.md`.

## Restrições

- Nenhum secret hardcoded no código mesmo "pra teste rápido".
- Nenhum secret em log (cross: `sec-no-logged-secrets`).
- Dev local usa `.env` gitignored com valores fake/teste.

## Exemplos de uso

- "Define gerenciamento de secrets pra MVP."
- "Adicionou gateway Pagar.me — atualizar secrets management."

## Critérios de conclusão

- [ ] Inventário completo de secrets.
- [ ] Vault/KMS escolhido e justificado.
- [ ] Procedimento de rotação documentado.
- [ ] Procedimento emergencial documentado.
- [ ] `.gitignore` e pre-commit scanner configurados (ou plano de configurar).
