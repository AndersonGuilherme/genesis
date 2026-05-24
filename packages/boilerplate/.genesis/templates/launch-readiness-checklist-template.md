# Launch Readiness Checklist — <nome-do-sistema>

> Aplicado pela skill `prelaunch-launch-readiness-gate`. Bloqueia go-live até todos os itens críticos OK.

## Identificação

- **Sistema/feature**: <nome>
- **Data alvo do launch**: <YYYY-MM-DD>
- **Tipo**: <go-live inicial | re-launch | feature rollout>
- **Responsável geral**: <nome>
- **Reunião go/no-go agendada para**: <YYYY-MM-DD HH:MM>

## Status final

- [ ] Aprovado para go-live (assinatura de leads + DPO + IC oncall)
- [ ] Adiado (motivo: ___________)
- [ ] No-go (motivo: ___________)

---

## 1. Segurança

Vincula `docs/launch/security-final-review.md` (skill `prelaunch-security-final-review`).

| Item | Responsável | Status | Evidência |
|------|-------------|:------:|-----------|
| Threat model atualizado | <nome> | ☐ | `docs/security/threat-model.md` |
| Auth strategy implementada | <nome> | ☐ | `docs/security/auth-strategy.md` + PR |
| Endpoints públicos = lista documentada | <nome> | ☐ | <link> |
| Authz no use case + tenant filter | <nome> | ☐ | <link teste de integração> |
| Secrets em vault (gitleaks verde) | <nome> | ☐ | <CI run> |
| TLS 1.2+ + HSTS | <nome> | ☐ | <ssllabs report> |
| Encryption at-rest (banco + backup) | <nome> | ☐ | <provider config> |
| Audit log estruturado + retenção | <nome> | ☐ | `docs/security/audit-logging.md` |
| Rate limit em endpoints públicos | <nome> | ☐ | <config> |
| Sanitizer ativo no logger | <nome> | ☐ | <teste> |
| Vuln scan verde (sem CRITICAL/HIGH) | <nome> | ☐ | <CI run> |

## 2. LGPD

Vincula `docs/launch/lgpd-compliance-check.md` (skill `prelaunch-lgpd-compliance-check`).

| Item | Responsável | Status | Evidência |
|------|-------------|:------:|-----------|
| ROPA atualizado | <DPO> | ☐ | `docs/security/lgpd/data-inventory.md` |
| Consent implementado + UI testada | <DPO + dev> | ☐ | <screenshot> |
| Retenção: job rodando + backup respeitando | <ops> | ☐ | <log última execução> |
| Direitos do titular: endpoints `/me/*` funcionais | <dev> | ☐ | <teste e2e> |
| Encryption PII (default + sensível com KMS) | <dev> | ☐ | <config + teste> |
| Transferência internacional: DPAs + privacy notice | <DPO + jurídico> | ☐ | `docs/security/lgpd/vendor-dpa.md` |
| DPIA pra operações de alto risco | <DPO> | ☐ | `docs/security/lgpd/dpia-*.md` |
| Plano notificação incidente + contatos | <DPO + IC> | ☐ | `docs/security/lgpd/incident-notification-plan.md` |
| DPO definido + canal público | <legal> | ☐ | <página /privacy> |
| Privacy notice publicada | <legal + product> | ☐ | <URL> |

## 3. Operations

| Item | Responsável | Status | Evidência |
|------|-------------|:------:|-----------|
| SLOs definidos + medidos | <ops> | ☐ | `docs/operations/slos.md` |
| Observability ativa (logs+métricas+traces) | <ops> | ☐ | <dashboard> |
| Runbook publicado pra cada módulo crítico | <ops + owners> | ☐ | `docs/operations/runbooks/` |
| Alertas configurados com runbook link | <ops> | ☐ | <alertmanager config> |
| Backup automático + último restore drill OK | <ops> | ☐ | <log restore drill> |
| CI verde + secret/dep/SAST scans ativos | <ops> | ☐ | <CI history> |
| CD configurado com canary + rollback automático | <ops> | ☐ | `docs/deployment/cd-pipeline.md` |
| Feature flags strategy definida | <ops> | ☐ | `docs/operations/feature-flags.md` |
| Cost tracking + alertas de billing | <ops + finance> | ☐ | <dashboard> |
| Performance baseline executada | <ops> | ☐ | `docs/launch/performance-baseline.md` |

## 4. Incident response

| Item | Responsável | Status | Evidência |
|------|-------------|:------:|-----------|
| Oncall rotation ativa | <ops> | ☐ | <PagerDuty/Opsgenie> |
| Playbook publicado | <IC> | ☐ | `docs/operations/incident-response.md` |
| Drill recente (≤90 dias) | <IC> | ☐ | <ata do drill> |
| Status page funcional | <ops> | ☐ | <URL> |
| Templates de comunicação prontos | <comms> | ☐ | <link> |

## 5. Produto + suporte

| Item | Responsável | Status | Evidência |
|------|-------------|:------:|-----------|
| Suporte treinado + FAQ pronto | <product> | ☐ | <link FAQ> |
| Canal de contato com user funcional | <product> | ☐ | <email + chat> |
| Comunicação pré-launch enviada | <marketing> | ☐ | <preview> |
| Comunicação no dia do launch agendada | <marketing> | ☐ | <calendar> |
| Comunicação pós-launch (D+1, D+7) planejada | <marketing> | ☐ | <plan> |
| Onboarding/empty state testados | <product> | ☐ | <user testing> |

## 6. Negócio

| Item | Responsável | Status | Evidência |
|------|-------------|:------:|-----------|
| Pricing publicado | <product + finance> | ☐ | <URL> |
| T&C + privacy notice acessíveis | <legal> | ☐ | <URL> |
| Billing testado end-to-end (incluindo refund) | <dev + finance> | ☐ | <transação teste> |
| Cancelamento + downgrade funcionais | <dev + product> | ☐ | <teste e2e> |
| Integração com gateway estável (test mode validado) | <dev> | ☐ | <log testes> |

## 7. Dívidas não-bloqueantes

Itens importantes mas que não impedem launch — registrar com owner + deadline pós-launch.

| Item | Owner | Deadline | Razão de não ser bloqueante |
|------|-------|----------|------------------------------|
| <descrição> | <nome> | <YYYY-MM-DD> | <justificativa> |

## 8. Bloqueantes pendentes (se houver)

Itens que impedem go-live. Listar com plano de remediação.

| Item | Owner | Plano | ETA |
|------|-------|-------|-----|
| <descrição> | <nome> | <ações> | <YYYY-MM-DD> |

## Reunião go/no-go

- **Data/hora**: <YYYY-MM-DD HH:MM>
- **Participantes**:
  - Tech Lead: <nome> — assinatura ☐
  - DPO: <nome> — assinatura ☐
  - IC oncall: <nome> — assinatura ☐
  - Product: <nome> — assinatura ☐
  - Comms/marketing: <nome> — assinatura ☐
- **Decisão**: <go | no-go | adiado>
- **Ata**: <link>
- **Comunicada para o time em**: <data + canal>

## Pós-launch — primeiras 24h

- [ ] War room ativa nas primeiras 4h.
- [ ] Métricas validadas a cada 30min nas primeiras 4h.
- [ ] Status report no dia seguinte (D+1).
- [ ] Postmortem leve no dia seguinte com aprendizados.
