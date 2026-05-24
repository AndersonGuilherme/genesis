# Launch — Gate final antes do go-live

Local de saída das skills `prelaunch-*` + ata da reunião go/no-go.

## Documentos esperados

| Arquivo | Skill geradora | Quando |
|---------|----------------|--------|
| `launch-readiness.md` | `prelaunch-launch-readiness-gate` | Última etapa antes do go-live (checklist consolidado) |
| `security-final-review.md` | `prelaunch-security-final-review` | Validação cross sec-* + bloqueantes |
| `lgpd-compliance-check.md` | `prelaunch-lgpd-compliance-check` | Validação cross lgpd-* + bloqueantes |
| `performance-baseline.md` | `prelaunch-performance-baseline` | Load test em staging + comparação com SLO |
| `launch-review-<YYYY-MM-DD>.md` | agent `prelaunch-launch-reviewer` | Revisão externa cross-disciplinar |

## Validar antes de lançar

```bash
bash .genesis/scripts/check-readiness.sh --pre-launch
```

Bloqueante = no-go. Sem exceção por pressão de prazo.

## Reunião go/no-go

Participantes obrigatórios (assinatura conjunta):
- Tech Lead
- DPO
- IC oncall
- Product
- Comms/marketing

Cobertura: segurança + LGPD + operations + produto + negócio + comms.

## Pós-launch — primeiras 24h

- War room ativa nas primeiras 4h.
- Métricas validadas a cada 30min.
- Status report D+1.
- Postmortem leve D+1 com aprendizados.

Incidente real após launch → `maint-incident-retrospective`.
