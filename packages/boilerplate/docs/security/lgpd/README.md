# LGPD — Conformidade brasileira

Local de saída das skills `lgpd-*` do boilerplate. Cumpre Lei 13.709/2018.

## Documentos esperados

| Arquivo | Skill geradora | Cumprimento legal |
|---------|----------------|-------------------|
| `data-inventory.md` | `lgpd-data-inventory` | Art. 37 (ROPA — Registro de Operações de Tratamento) |
| `consent-strategy.md` | `lgpd-define-consent-strategy` | Art. 8 (consentimento livre + informado + inequívoco) |
| `retention-policy.md` | `lgpd-define-retention-policy` | Art. 15-16 (término de tratamento) |
| `subject-rights.md` | `lgpd-data-subject-rights-handler` | Art. 18 (direitos do titular) |
| `dpia-<operacao>.md` | `lgpd-dpia` | Art. 38 (Relatório de Impacto — RIPD) |
| `vendor-dpa.md` | `lgpd-vendor-dpa` | Art. 39 (responsabilidade do operador) |
| `international-transfers.md` | regra `lgpd-international-transfer-rule` | Art. 33-36 (transferência internacional) |
| `incident-notification-plan.md` | `lgpd-incident-notification-plan` | Art. 48 (notificação ANPD em prazo razoável) |

## Validar conformidade

Antes do go-live:

```bash
bash .genesis/scripts/check-readiness.sh --lgpd
```

Skills de auditoria contínua:

- `lgpd-data-minimization-review` — auditoria periódica de campos PII sem justificativa.

## Agents associados

- `lgpd-compliance-reviewer` — audita conformidade cruzando docs com código. Gaps por artigo violado.
- `lgpd-dpo-mentor` — orienta decisões no papel de DPO (base legal, DPIA, fiscalização ANPD).

## Rules cross-cutting em development

Skills `dev-*` que tocam PII carregam automaticamente:

- `lgpd-data-minimization`, `lgpd-explicit-consent`, `lgpd-purpose-limitation`, `lgpd-retention-limit`
- `lgpd-subject-rights-respected`, `lgpd-pii-encrypted`, `lgpd-international-transfer-rule`, `lgpd-processing-registry`

Use `dev-define-use-case-with-pii` quando o use case coleta/lê/processa dado pessoal.
