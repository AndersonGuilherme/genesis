# Tests: lgpd-vendor-dpa

## Pré-condição
- `docs/security/lgpd/data-inventory.md` lista compartilhamentos externos.

## Prompts canônicos
- "vendor DPA"
- "DPA com Sendgrid/Stripe/AWS"
- "fornecedores que processam PII"

## Comportamentos esperados
- [ ] Lista de providers que tocam PII (cloud, email, SMS, pagamento, analytics, observability, IA, CRM).
- [ ] Pra cada: escopo, papel (operador/controlador), país, DPA assinado, subprocessadores.
- [ ] Cláusulas mínimas validadas (finalidade limitada, notificação de incidente, audit, deleção).
- [ ] Plano de exit por fornecedor.
- [ ] Cross-link com `lgpd-international-transfer-rule` quando aplicável.
- [ ] Produz `docs/security/lgpd/vendor-dpa.md`.

## Anti-padrões
- [ ] NÃO adota SaaS novo sem DPA assinado.
- [ ] NÃO aceita DPA genérico sem cláusulas mínimas.
- [ ] NÃO esquece subprocessadores do fornecedor.
