---
name: lgpd-define-consent-strategy
description: Define como o sistema captura, registra, versiona e revoga consent. Granular por finalidade. Use após `lgpd-data-inventory`. Produz `docs/security/lgpd/consent-strategy.md`.
phase: lgpd
rules:
  - lgpd-explicit-consent
  - lgpd-purpose-limitation
  - lgpd-processing-registry
  - sec-audit-trail
---

# Skill: lgpd-define-consent-strategy

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Produzir `docs/security/lgpd/consent-strategy.md` com estratégia operacional de consent: granularidade, UI, modelo de dados, versionamento de texto, revogação.

## Quando usar

- Após `lgpd-data-inventory` listar finalidades que exigem consent.
- Antes de implementar formulários de cadastro/checkout.
- Ao adicionar finalidade nova que exige reconsent.

## Pré-condições

- `docs/security/lgpd/data-inventory.md` lista finalidades por base legal.
- Template `.genesis/templates/consent-form-template.md` disponível.

## Processo

1. Listar finalidades cuja base legal é **consent** (não confundir com contrato/obrigação legal).
2. Definir granularidade: 1 consent por finalidade (cadastro, marketing, parceiros, cookies analytics, etc.).
3. Definir UI:
   - Checkbox **desmarcado** por default.
   - Texto curto + link pra política completa.
   - Mobile-friendly.
4. Modelo de dados:
   - Tabela `consents` com `(user_id, purpose, version, granted_at, revoked_at, ip, user_agent)`.
   - Append-only ou versionado (não sobrescrever).
5. Versionamento de texto: hash do conteúdo. Mudança de texto exige reconsent ativo.
6. Endpoint de revogação: `DELETE /me/consents/:id` ou `PATCH` com `granted: false`.
7. SLA de propagação: consent revogado deve parar processamento em até X horas (definir, max 24h pra batch).
8. Audit log emitido em grant + revoke (cross-link `sec-audit-trail`).
9. Plano pra reconsent quando texto muda (banner no próximo login + email).
10. Preencher `docs/security/lgpd/consent-strategy.md` + template `consent-form-template.md` pra cada finalidade.

## Restrições

- Sem checkbox pré-marcado.
- Sem consent agrupado ("aceito tudo").
- Revogação sem mais fricção que a coleta.
- Dado de criança: consent do responsável (art. 14).

## Exemplos de uso

- "Definir consent strategy do tchr (cadastro + marketing + parceiros)."
- "Mudamos texto de marketing — planejar reconsent."

## Critérios de conclusão

- [ ] Finalidades com consent listadas.
- [ ] Granularidade definida (1 por finalidade).
- [ ] UI especificada (mockup ou descrição).
- [ ] Modelo de dados de consent definido.
- [ ] Versionamento de texto resolvido.
- [ ] Endpoint de revogação definido.
- [ ] SLA de propagação definido.
- [ ] `docs/security/lgpd/consent-strategy.md` completo.
