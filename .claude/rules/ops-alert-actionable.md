---
name: ops-alert-actionable
description: Alerta sem runbook + sem ação clara é proibido. Cada alerta responde: "o que está acontecendo, por que importa, o que fazer agora". Sem alert fatigue.
phase: operations
---

# Rule: ops-alert-actionable

## Princípio

Todo alerta que paginar ser humano tem: título descritivo, link pro runbook, severity justificada, condição clara, e ação imediata. Alerta sem ação = ruído. Ruído = alert fatigue = incidente ignorado.

## Por que existe

Time desensibiliza com alertas constantes. Quando alerta vira spam, o real fica escondido. Cada alerta precisa pagar seu custo de atenção — tem que importar e tem que ter ação.

## Como aplicar

1. Política: alerta sem runbook não vai pra produção. PR de alerta requer link pro runbook.
2. Alerta tem severidade explícita: P1 (acorda em qualquer hora), P2 (acorda em horário comercial), P3 (revisa em ticket).
3. Mensagem do alerta inclui:
   - O quê (métrica + threshold).
   - Por que importa (impacto ao user/sistema).
   - O que fazer (link pro runbook).
   - Histórico (último alerta semelhante, MTTR médio).
4. Alertas correlacionados são agrupados (Alertmanager grouping, route).
5. Revisão mensal: alertas que dispararam sem ação tomada → revisar threshold ou deletar.
6. SLO-based alerts preferíveis sobre threshold cego (burn rate alerts).

## Exemplos bons

- "P1 — Billing API error rate > 5% por 5min. Impact: clientes não conseguem pagar. Runbook: <link>. Last MTTR: 12min."
- Alertmanager grouping: 50 alertas de "pod restart" viram 1 alerta resumo.
- Mensal: limpou 8 alertas que nunca tinham ação documentada.

## Exemplos ruins

- "CPU > 80%" sem contexto, sem runbook, sem severidade.
- 200 alertas/dia no canal de oncall.
- "Database slow" — slow comparado a quê? que ação? que SLO?
- Alerta criado em incidente passado, nunca limpo.

## Exceções

- Alertas informacionais (não acordam ninguém) podem ser menos rigorosos, mas ainda agrupados.
- Em fase pré-produção (dev/staging), alertas podem ser mais experimentais.

