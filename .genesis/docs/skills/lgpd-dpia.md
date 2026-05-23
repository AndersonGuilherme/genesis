# lgpd-dpia

## O que faz
Data Protection Impact Assessment (RIPD do art. 38) pra operação de alto risco — dado sensível, decisão automatizada, volume grande, criança. Produz `docs/security/lgpd/dpia-<nome>.md`.

## Quando você invoca
Operação envolve: dado sensível (art. 11), decisão automatizada com efeito jurídico, >10k titulares, dado de criança, profiling, transferência internacional de sensível.

## O que a IA faz
1. Descreve operação (fluxo, atores).
2. Justifica necessidade + alternativas.
3. Lista riscos (discriminação, exposição, reidentificação).
4. Prob × impacto = risco. Prioriza.
5. Mitigações técnica + organizacional por risco.
6. Garante revisão humana de decisão automatizada.
7. Plano de revisão da DPIA.

## Rules invocadas
- [lgpd-data-minimization](../../../.claude/rules/lgpd-data-minimization.md)
- [lgpd-explicit-consent](../../../.claude/rules/lgpd-explicit-consent.md)
- [lgpd-purpose-limitation](../../../.claude/rules/lgpd-purpose-limitation.md)
- [lgpd-pii-encrypted](../../../.claude/rules/lgpd-pii-encrypted.md)
- [lgpd-retention-limit](../../../.claude/rules/lgpd-retention-limit.md)
- [sec-encryption-at-rest](../../../.claude/rules/sec-encryption-at-rest.md)

## Próximo passo natural
Aprovação do DPO + implementação das mitigações.
