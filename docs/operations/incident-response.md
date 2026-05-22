# Incident response

> Como reagir quando produção quebra. Sem este documento, cada incidente vira improviso.

## Definição de incidente

Qualquer evento que afete a disponibilidade, performance, integridade ou confidencialidade do serviço para usuários reais.

## Severidades

| Sev | Critério | Tempo alvo de ack | Tempo alvo de mitigação |
|-----|----------|---------------------|--------------------------|
| sev1 | indisponibilidade total ou dados em risco | 5 min | 60 min |
| sev2 | degradação significativa de fluxo crítico | 15 min | 4 h |
| sev3 | problema operacional, sem impacto crítico | 1 h | 1 dia útil |

## Papéis durante incidente

| Papel | Responsabilidade |
|-------|-------------------|
| Incident commander (IC) | comanda, decide, comunica externamente |
| Operações | executa mudanças no sistema |
| Comunicação | atualiza usuários e stakeholders |
| Scribe | registra timeline em tempo real |

Em time pequeno, uma pessoa acumula papéis — mas o IC é claro.

## Fluxo

1. **Detectar** — alerta automatizado ou reporte.
2. **Triagem** — sev definida, IC nomeado.
3. **Comunicar** — abrir canal dedicado (Slack/Discord/equivalente).
4. **Mitigar** — estabilizar primeiro, investigar depois.
5. **Restaurar** — operação normal confirmada.
6. **Postmortem** — em até 5 dias úteis.

## Mitigações comuns (cardápio)

- Rollback de release
- Disable de feature flag
- Aumentar capacidade (autoscale manual)
- Restringir tráfego (WAF, rate limit)
- Failover de banco
- Failover de provedor externo

## Comunicação

### Interna
- Canal dedicado por incidente
- Updates a cada 15 min em sev1, 30 min em sev2

### Externa (usuários)
- Status page atualizada em até 15 min
- Email para clientes pagantes em sev1 com duração > 30 min
- Comunicação final pós-resolução

## Postmortem

Sempre. Sem exceção.

### Estrutura
1. Resumo (5 linhas)
2. Timeline
3. Impacto (quantos usuários, quanto tempo, qual fluxo)
4. Causa raiz (não a culpa)
5. O que funcionou
6. O que não funcionou
7. Ações corretivas (com dono + prazo)

### Princípios
- **Sem busca por culpado.** Sistema falhou, não a pessoa.
- **Aprendizado público interno.** Compartilhar com o time.
- **Toda ação corretiva entra no backlog com prioridade.**

## Runbooks por componente crítico

Manter pasta `docs/operations/runbooks/` com um arquivo por componente. Padrão mínimo:

```
# Runbook: <componente>

## Como verificar saúde
- comando / dashboard / log query

## Sintomas comuns e ações
- sintoma X → ação Y
- sintoma A → ação B

## Como escalar
- métricas a observar
- limites recomendados

## Como degradar gracioso
- circuit breaker, fallback, modo somente-leitura
```

## Game days

Quando time tiver maturidade:
- Simular falha controlada
- Validar runbooks
- Trimestral mínimo

## Métricas de resposta

- MTTA (mean time to ack)
- MTTM (mean time to mitigate)
- MTTR (mean time to recover)
- % postmortems entregues no prazo
- % de ações corretivas concluídas

Auditar mensalmente.
