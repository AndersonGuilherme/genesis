# Incident Playbook

> Aplicado pela skill `ops-define-incident-response`. Define como o time responde a incidentes.
> Treinar via tabletop drill trimestral.

## Severity Matrix

| Severity | Definição | Resposta | Comunicação |
|:--------:|-----------|----------|-------------|
| **SEV1** | Caminho de receita parado; dado vazado; segurança crítica | War room imediata, IC ativo, comms cada 15min | Status page imediata, email cliente conforme escopo, ANPD se PII (cross-link `lgpd-incident-notification-plan`) |
| **SEV2** | Degradação significativa; feature crítica indisponível | War room horário comercial estendido | Status page, comms interna |
| **SEV3** | Bug recorrente; alerta sem impacto direto | Ticket prioridade alta | Comms interna |

## Papéis durante incidente

| Papel | Responsabilidades |
|-------|-------------------|
| **IC** (Incident Commander) | Coordena, decide, NÃO codifica. Mantém calma, foca em contenção. |
| **Tech Lead** | Investigação técnica, executa mudanças (com OK do IC). |
| **Comms** | Status page, email cliente, comunicação interna. Alinhado com IC + jurídico se externo. |
| **Scribe** | Timeline em tempo real no canal. Tudo registrado com timestamp. |

Pra SEV3 e SEV2 pequenos, mesmas pessoas podem acumular papéis. Pra SEV1, separados.

## Fluxo

```
Detectar → Declarar → War room → Contenção → Mitigação → Resolução → Postmortem
```

### 1. Detectar

- Alerta automatizado.
- Report de usuário.
- Time interno observando degradação.

### 2. Declarar

- Quem detecta abre `/incident open` no Slack #incidents.
- Bot cria canal `#incident-YYYYMMDD-N`.
- Notifica oncall + lead do módulo afetado.

### 3. War room

- Canal Slack dedicado.
- Bridge call opcional (SEV1 obrigatório).
- IC se identifica: "I am IC".
- IC nomeia papéis: "TL: <pessoa>, Comms: <pessoa>, Scribe: <pessoa>".
- Status inicial postado: "SEV<N> declared. Impact: <descrição>. Investigating."

### 4. Contenção

- Primeira prioridade: parar sangramento.
- Opções: rollback, feature flag, circuit breaker, scale, restart.
- Aceita mitigar sem entender causa raiz (entendimento vem na fase de mitigação).

### 5. Mitigação

- Restaurar serviço normal.
- Validar com métrica (não "achismo").
- Comunicar progresso.

### 6. Resolução

- Confirmar SLI voltou ao normal por janela mínima (15-30min).
- IC declara "Incident resolved at <timestamp>".
- Agenda postmortem em ≤5 dias úteis (SEV1/SEV2 obrigatório).
- Fecha canal após 24h.

### 7. Postmortem

Ver template separado (`incident-postmortem-template.md`).

## Templates de comunicação

### Status page (SEV1)

> [INVESTIGATING] Estamos investigando relatos de <sintoma>. Atualizaremos em até 15 minutos.

> [IDENTIFIED] Identificamos a causa: <descrição em linguagem simples>. Trabalhando na correção.

> [MONITORING] Correção aplicada. Monitorando por <X> minutos antes de marcar como resolvido.

> [RESOLVED] Incidente resolvido às <timestamp>. Publicaremos postmortem em <link> em até <prazo>.

### Email cliente (SEV1 com impacto direto)

```
Assunto: [Importante] Incidente em <produto> — atualização

Caro(a) cliente,

Identificamos um incidente que afetou <funcionalidade> entre <início> e <fim>.

Impacto: <descrição>.
Causa: <descrição>.
Ação tomada: <descrição>.
Próximos passos: <descrição>.

Pedimos desculpas pelo transtorno. Publicaremos postmortem completo em <link>.

Equipe <produto>
```

### Comunicação interna

Atualização em #incidents cada 15min em SEV1:
```
🟡 SEV1 incident-20260523-1 — 14:30 UTC
Impact: 12% of checkout requests failing (5xx)
Status: ROLLBACK in progress
ETA: 5min until validation
TL: @alice IC: @bob Comms: @carol Scribe: @dan
```

## Drills

- Tabletop trimestral: cenário simulado, time pratica fluxo.
- Lição aprendida → atualização deste playbook.
- Drill calendarizado, não improvisado.

## Pós-incidente: checklist

- [ ] Timeline completa.
- [ ] Postmortem agendado em ≤5 dias úteis.
- [ ] Comms externa publicada (se aplicável).
- [ ] Status page atualizada com resolved.
- [ ] Lições compartilhadas com time.
- [ ] Action items abertos com owner + deadline.
