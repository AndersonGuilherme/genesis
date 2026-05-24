# lgpd-define-consent-strategy

## O que faz
Define como sistema captura, registra, versiona e revoga consent. Granular por finalidade. Produz `docs/security/lgpd/consent-strategy.md`.

## Quando você invoca
Após `lgpd-data-inventory` lista finalidades com base legal = consent. Antes de implementar form/checkout.

## O que a IA faz
1. Lista finalidades que dependem de consent.
2. Define granularidade (1 por finalidade).
3. Define UI (checkbox desmarcado por default).
4. Modelo de dados de `consents` (append-only).
5. Versionamento de texto (hash).
6. Endpoint de revogação + SLA de propagação.

## Rules invocadas
- [lgpd-explicit-consent](../../../.claude/rules/lgpd-explicit-consent.md)
- [lgpd-purpose-limitation](../../../.claude/rules/lgpd-purpose-limitation.md)
- [lgpd-processing-registry](../../../.claude/rules/lgpd-processing-registry.md)
- [sec-audit-trail](../../../.claude/rules/sec-audit-trail.md)

## Próximo passo natural
`lgpd-data-subject-rights-handler` + implementação dos forms.
