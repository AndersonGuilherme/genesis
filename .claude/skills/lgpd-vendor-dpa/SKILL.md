---
name: lgpd-vendor-dpa
description: Mapeia fornecedores que processam PII como operadores e exige DPA (Data Processing Agreement). Lista em data-inventory + arquivo. LGPD art. 39.
phase: lgpd
rules:
  - lgpd-processing-registry
  - lgpd-international-transfer-rule
  - lgpd-purpose-limitation
---

# Skill: lgpd-vendor-dpa

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Produzir `docs/security/lgpd/vendor-dpa.md` com lista de operadores externos, escopo de tratamento, DPA assinado + cláusulas mínimas.

## Quando usar

- Antes de adotar SaaS novo que processa PII.
- Em auditoria periódica de fornecedores.
- Quando fornecedor altera escopo de tratamento.

## Pré-condições

- `docs/security/lgpd/data-inventory.md` lista compartilhamento externo.
- Template `.genesis/templates/vendor-dpa-template.md` disponível.

## Processo

1. Listar fornecedores que tocam PII: cloud (AWS, GCP), email (Sendgrid), SMS (Twilio), pagamento (Stripe, gateway), analytics (Mixpanel, GA), observability (Datadog, Sentry), IA (OpenAI, Anthropic), CRM (Hubspot).
2. Pra cada um:
   - Escopo: que dado, finalidade, volume estimado.
   - Papel: operador (controlador continua sendo você) ou controlador (compartilhamento, exige consent).
   - Localização (Brasil ou exterior — cross-link `lgpd-international-transfer-rule`).
   - DPA assinado? Cláusulas mínimas presentes?
   - Subprocessadores listados pelo fornecedor.
   - Plano de exit (como sair sem deixar dado órfão).
3. Cláusulas mínimas no DPA:
   - Finalidade limitada.
   - Sem reuso pra outras finalidades sem autorização.
   - Medidas de segurança técnicas/organizacionais.
   - Notificação de incidente ao controlador (prazo curto).
   - Direito de auditoria.
   - Devolução/deleção ao término.
   - Subprocessadores autorizados.
4. Anexar DPA assinado em pasta interna (não commitar no repo público — referenciar local).
5. Preencher `docs/security/lgpd/vendor-dpa.md` com tabela.

## Restrições

- Adotar SaaS sem DPA = transferência irregular de dado.
- DPA genérico (sem cláusulas mínimas) não basta.
- Fornecedor não auditável = risco — registrar como risco residual.

## Exemplos de uso

- "Mapear DPA dos fornecedores do tchr."
- "Vamos adotar Sentry — preparar DPA + entry no inventory."

## Critérios de conclusão

- [ ] Lista de fornecedores que processam PII completa.
- [ ] DPA assinado por cada (ou plano pra obter).
- [ ] Cláusulas mínimas validadas.
- [ ] Subprocessadores listados.
- [ ] Plano de exit definido.
- [ ] `docs/security/lgpd/vendor-dpa.md` completo.
