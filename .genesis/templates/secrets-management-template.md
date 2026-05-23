# Secrets Management: <nome-do-sistema>

> Aplicado pela skill `sec-secrets-management-plan`. Define onde secrets vivem, como acessam, como rotacionam.

## Inventário de secrets

| Secret | Tipo | Onde vive (prod) | Onde vive (dev) | Quem acessa | Rotação | Última rotação |
|--------|------|-----------------|----------------|-------------|---------|----------------|
| DB_PASSWORD | senha | <vault path> | .env local | runtime + DBA | <90d> | ___ |
| JWT_SIGNING_KEY | chave | <KMS key id> | dev key local | runtime apenas | <30d com KID> | ___ |
| STRIPE_SECRET_KEY | API key terceiro | <vault path> | test key Stripe | runtime apenas | manual | ___ |
| SMTP_PASSWORD | credencial | <vault path> | mailhog local | runtime | <180d> | ___ |
| OAUTH_CLIENT_SECRET | OAuth | <vault path> | dev app | runtime | manual | ___ |

## Vault / KMS

- **Provider**: <AWS Secrets Manager | HashiCorp Vault | Doppler | GCP Secret Manager>
- **Acesso**: instâncias de runtime via IAM role / service account. Nunca chave de acesso embutida.
- **Audit**: provider gera log de acesso a cada secret.

## Acesso por ambiente

| Ambiente | Como secrets chegam ao app |
|----------|---------------------------|
| dev local | `.env` (gitignored), baseado em `.env.example` |
| CI | secrets do CI provider (GitHub Actions secrets, etc.), nunca commitados |
| staging | injetados via vault sidecar / env var no deploy |
| produção | injetados via vault sidecar / env var no deploy |

## Princípios

- Nenhum secret no git (cross: `sec-secrets-no-commit`).
- Nenhum secret em log (cross: `sec-no-logged-secrets`).
- Acesso mínimo: cada serviço só lê secrets que precisa.
- Rotação automatizada quando provider suportar; manual com calendário quando não.
- Quebra de secret em incidente: procedimento documentado.

## Rotação

### Procedimento padrão

1. Gerar novo secret no provider (mantém antigo ativo).
2. Deploy de aplicação com referência ao novo (cold restart ou hot reload).
3. Confirmar saúde.
4. Revogar antigo após janela de segurança (24h).
5. Atualizar tabela acima com data de rotação.

### Procedimento emergencial (suspeita de vazamento)

1. Revogar secret antigo imediatamente.
2. Gerar novo + deploy.
3. Investigar via audit log do vault: quem acessou nos últimos N dias.
4. Incidente segue `prelaunch-incident-response` / `ops-define-incident-response`.
5. LGPD: se vazamento envolveu PII, gatilho de `lgpd-incident-notification-plan` (72h).

## Secrets em pipeline

- Pre-commit hook: scanner (gitleaks/detect-secrets).
- CI: scan no diff E no histórico inteiro periódico.
- Build/deploy: secrets injetados em runtime, nunca no artefato (imagem Docker, bundle).

## Plano de descomissão

Secret que deixou de ser usado:
1. Identificar referências no código (grep).
2. Remover referências.
3. Revogar no vault.
4. Atualizar inventário.

## Revisão

| Data | Revisor | Mudanças |
|------|---------|----------|
| ___  | ___     | ___ |
