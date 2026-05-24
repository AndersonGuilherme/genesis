# Postmortem: <título-curto>

> Aplicado pela skill `maint-incident-retrospective`. Blameless — foco em sistema, não pessoa.

## Identificação

- **Data do incidente**: <YYYY-MM-DD>
- **Severidade**: <SEV1 | SEV2 | SEV3>
- **Módulos afetados**: <lista>
- **Duração**: <início> até <fim> (≈ <X> minutos)
- **Impacto**: <descrição em linguagem simples + métrica>
- **Detecção**: <quem/o quê detectou>
- **IC**: <nome>
- **Postmortem date**: <YYYY-MM-DD>
- **Participantes**: <lista>

## Resumo executivo

<2-3 parágrafos: o que aconteceu, qual foi o impacto, como foi mitigado, qual a lição principal.>

## Timeline

Todos os horários em UTC.

| Hora | Evento | Ator |
|------|--------|------|
| 14:00 | Deploy de v1.42 em main | CD |
| 14:03 | Alerta `BillingErrorRate > 5%` dispara | Alertmanager |
| 14:04 | Oncall @alice notificada | PagerDuty |
| 14:05 | @alice abre canal `#incident-20260523-1` | @alice |
| 14:07 | @alice declara SEV1, assume IC | @alice |
| 14:10 | @bob assume Tech Lead, inicia investigação | @bob |
| 14:15 | Identificado: deploy v1.42 introduziu null pointer em handler de webhook | @bob |
| 14:18 | Decisão: rollback automático já em curso (canary failure) | @alice |
| 14:22 | Rollback completo, error rate volta ao normal | métricas |
| 14:40 | Observação confirma estabilidade. Incidente resolvido. | @alice |

## Impacto

- **Usuários afetados**: ~1200 (12% do tráfego de checkout).
- **Receita perdida estimada**: R$ 8.500.
- **SLA impactado**: error budget de billing consumiu 0.3% do mês.
- **Comunicação externa**: status page atualizada às 14:08. Email pra clientes B2B afetados às 15:30.

## Causa raiz

### Causa próxima

Deploy de v1.42 introduziu chamada a `payload.metadata.customer_id` sem null-check. Webhook do Stripe começou a enviar payloads sem `metadata` na semana anterior. Pull request não cobriu esse caso com teste.

### Causas contribuintes (5 whys)

1. **Por que** a null pointer chegou em produção? PR não tinha teste cobrindo payload sem metadata.
2. **Por que** não tinha teste? Mudança upstream do Stripe não estava no radar do time.
3. **Por que** não monitoramos mudanças do Stripe? Não temos processo de tracking de changelogs de SaaS críticos.
4. **Por que** não temos? Processo nunca foi formalizado, dependia de cada dev "ficar de olho".
5. **Por que** o canary não pegou? Volume baixo do canary (5%) não acumulou erros suficientes pra disparar burn rate em 1min.

### Causa raiz sistêmica

Ausência de processo formal pra tracking de mudanças em SaaS críticos + canary gate com sensibilidade insuficiente pra erros raros mas críticos.

## O que foi bem

- Alerta disparou em 3min (dentro de SLO).
- IC assumiu rapidamente.
- Rollback automático funcionou.
- Comunicação externa em 8min.

## O que poderia ter ido melhor

- Mudança do Stripe não foi detectada.
- Canary não pegou (volume insuficiente pra erro raro).
- Comunicação pra B2B demorou 1h30 (deveria ser ≤30min).

## Action items

| # | Ação | Owner | Tipo | Deadline | Status |
|--:|------|-------|------|----------|:------:|
| 1 | Adicionar teste cobrindo webhook sem metadata | @bob | prevenção | 2026-05-25 | ☐ |
| 2 | Formalizar processo de tracking de changelog de SaaS críticos | @charlie | prevenção | 2026-06-10 | ☐ |
| 3 | Aumentar sensibilidade do canary gate pra erros raros | @diana | detecção | 2026-06-01 | ☐ |
| 4 | Reduzir SLA interno de comunicação B2B em incidente pra 30min | @eve | processo | 2026-05-30 | ☐ |
| 5 | Atualizar runbook do billing com lição aprendida | @bob | processo | 2026-05-25 | ☐ |

## Lições aprendidas

- Webhooks de terceiros podem mudar sem aviso explícito — defensivo sempre.
- Canary precisa de heurística pra erros raros mas críticos (não só taxa).
- Comunicação externa de incident é parte do incident, não apêndice.

## Histórico relacionado

- Incidente 2026-03-15: também foi falha de validação em webhook (mesma classe de bug).
- Considerar: trabalho estrutural em validação de boundary de webhooks.

## Aprovação

- [x] IC: @alice
- [x] Tech Lead: @bob
- [x] Comms: @eve

## Compartilhamento

- Publicado interno em #engineering em 2026-05-25.
- Versão sanitizada pra status page público (sem dado de cliente) em 2026-05-25.
