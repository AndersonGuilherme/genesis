# Tests: prelaunch-launch-readiness-gate

## Pré-condição
- `prelaunch-security-final-review` executada.
- `prelaunch-lgpd-compliance-check` executada.
- `prelaunch-performance-baseline` executada.
- Observability + runbooks + oncall ativos.

## Prompts canônicos
- "launch readiness gate"
- "checklist final pra go-live"
- "reunião go/no-go"

## Comportamentos esperados
- [ ] Checklist consolidado em `docs/launch/launch-readiness.md`.
- [ ] Cada item: responsável + evidência + status (OK/dívida/bloqueante).
- [ ] Cobertura: segurança + LGPD + operations + incident response + produto + negócio.
- [ ] Dívidas não-bloqueantes com owner + deadline.
- [ ] Reunião go/no-go com leads + DPO + IC + product + comms.
- [ ] Assinatura conjunta registrada em ata.

## Anti-padrões
- [ ] NÃO aceita "go" com bloqueante pendente.
- [ ] NÃO toma decisão por 1 pessoa sozinha.
- [ ] NÃO esquece de comunicar decisão pro time.
