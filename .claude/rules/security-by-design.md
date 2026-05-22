# Rule: security-by-design

## Princípio

Segurança é pensada **antes** do código, em cada decisão de arquitetura e em cada nova feature.

## Por que existe

Segurança colada no final é cara, falha e gera incidentes. LGPD e confiança não se resolvem com patch. Pequenas decisões cedo evitam grandes consertos depois.

## Como aplicar

1. Toda spec de módulo passa por checklist mínimo de segurança (permissões, PII, auditoria).
2. Toda nova integração externa atualiza `integration-map.md` e `threat-model.md`.
3. Toda nova coleta de PII atualiza `data-privacy.md`.
4. Logs nunca contêm senha, token, CPF, cartão.
5. Multi-tenant: filtrar `tenant_id` em **todas** as queries por padrão.

## Exemplos bons

- Novo evento `payment.succeeded` é desenhado com webhook signing e idempotência desde a spec.
- Cadastro de aluno menor força workflow de consentimento do responsável.
- Logs estruturados com sanitizer central.

## Exemplos ruins

- "Vamos colocar autenticação depois."
- API pública sem rate limit.
- Token sem expiração ou expirando em 1 ano.
- Backup sem criptografia.

## Exceções

- Endpoints público e estáticos (status page, healthcheck) sem PII — auth não obrigatório.
- Ambiente de dev local — controle mais relaxado, mas nunca com dado real de produção.
