# lgpd-data-inventory

## O que faz
Cria/atualiza ROPA (Registro de Operações de Tratamento) listando cada PII coletada com finalidade, base legal, retenção, compartilhamento. Cumpre LGPD art. 37.

## Quando você invoca
Após `plan-design-architecture` + `sec-threat-model`. Antes de implementar persistência de PII.

## O que a IA faz
1. Lista fontes de PII (forms, integrações, eventos, uploads).
2. Define finalidade específica por entry.
3. Define base legal (consent, contrato, obrigação legal, legítimo interesse, etc.).
4. Define retenção + ação ao expirar.
5. Mapeia compartilhamento + transferência internacional.
6. Marca categorias sensíveis (art. 11).

## Rules invocadas
- [lgpd-data-minimization](../../../.claude/rules/lgpd-data-minimization.md)
- [lgpd-processing-registry](../../../.claude/rules/lgpd-processing-registry.md)
- [lgpd-purpose-limitation](../../../.claude/rules/lgpd-purpose-limitation.md)

## Próximo passo natural
`lgpd-define-consent-strategy` + `lgpd-define-retention-policy`.
