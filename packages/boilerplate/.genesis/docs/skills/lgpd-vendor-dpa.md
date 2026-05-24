# lgpd-vendor-dpa

## O que faz
Mapeia fornecedores que processam PII como operadores. Exige DPA (Data Processing Agreement) + cláusulas mínimas. Cumpre LGPD art. 39.

## Quando você invoca
Antes de adotar SaaS novo que processa PII. Em auditoria. Quando provider muda escopo.

## O que a IA faz
1. Lista providers que tocam PII (cloud, email, SMS, pagamento, analytics, observability, IA, CRM).
2. Pra cada: escopo, papel, país, DPA assinado.
3. Cláusulas mínimas validadas (finalidade limitada, notificação de incidente, audit, deleção ao término).
4. Subprocessadores listados.
5. Plano de exit por fornecedor.

## Rules invocadas
- [lgpd-processing-registry](../../../.claude/rules/lgpd-processing-registry.md)
- [lgpd-international-transfer-rule](../../../.claude/rules/lgpd-international-transfer-rule.md)
- [lgpd-purpose-limitation](../../../.claude/rules/lgpd-purpose-limitation.md)

## Próximo passo natural
Assinatura/coleta de DPAs pendentes + atualização do inventory.
