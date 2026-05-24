---
name: lgpd-international-transfer-rule
description: Transferência internacional de PII exige base legal (país com nível adequado, cláusula contratual, consent específico). Listada em data-inventory + DPA com provider. LGPD art. 33-36.
phase: lgpd
---

# Rule: lgpd-international-transfer-rule

## Princípio

Toda transferência internacional de PII (incluindo uso de SaaS hosted fora do Brasil) é registrada em `docs/security/lgpd/international-transfers.md` com: provider, país, finalidade, base legal (art. 33 LGPD), salvaguardas contratuais (DPA + cláusulas padrão). Sem registro = transferência irregular.

## Por que existe

LGPD art. 33 restringe transferência internacional. Maioria dos SaaS (AWS us-east, Vercel, Datadog, Sentry, OpenAI) processa fora do Brasil — cada um exige base legal documentada. ANPD começou em 2024 a publicar lista de países com nível adequado; até lá, cláusulas contratuais padrão são caminho.

## Como aplicar

1. Inventário de todos os providers/SaaS que processam PII fora do Brasil: cloud (AWS, GCP, Azure), observability (Datadog, Sentry, NewRelic), comunicação (Sendgrid, Twilio), IA (OpenAI, Anthropic), CDN com edge cache (Cloudflare, Fastly).
2. Para cada um: base legal + DPA assinado + cláusulas padrão da ANPD (quando publicadas).
3. Preferir regiões brasileiras quando disponíveis (AWS sa-east-1, GCP southamerica-east1) — reduz superfície de transferência.
4. Documentar em `docs/security/lgpd/international-transfers.md` + atualizar quando provider novo entra.
5. Privacy notice ao titular menciona transferência internacional + finalidade.
6. DPIA pra transferência de dado sensível em volume alto.

## Exemplos bons

- AWS us-east-1 pra produto: DPA assinado, cláusulas SCC, justificativa de custo/latência documentada em ADR.
- Sendgrid: DPA assinado, transferência limitada a `email + name`, finalidade `transacional`.
- Privacy notice cita "podemos transferir seu dado pros EUA via AWS/Sendgrid sob cláusulas contratuais padrão".

## Exemplos ruins

- "Cloud é internacional, todo mundo faz" — sem registro, sem DPA, sem privacy notice.
- DPA não assinado mas serviço usado "porque é o padrão de mercado".
- Privacy notice silente sobre transferência (titular não sabe).
- Transferência pra país sem nível adequado sem cláusulas contratuais.

## Exceções

- Dado totalmente anonimizado (sem reidentificação) não é PII, dispensa registro.
- Provider que provisivelmente processa só no Brasil (ex.: AWS sa-east-1 com data residency confirmada) — documentar mesmo assim.

