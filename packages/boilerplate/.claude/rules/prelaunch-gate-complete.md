---
name: prelaunch-gate-complete
description: Go-live só após checklist completo de pre-launch — security final review, LGPD compliance, performance baseline, runbooks publicados, observability ativa. Sem atalho.
phase: pre-launch
---

# Rule: prelaunch-gate-complete

## Princípio

Antes do primeiro acesso público em produção, time roda checklist completo de pre-launch + assina go/no-go. Sem item pendente. Sem "ajustamos depois". Cada item tem responsável + evidência (link, screenshot, output de comando).

## Por que existe

Go-live é o pior momento pra descobrir que falta encryption, runbook, alerta crítico ou processo de incident response. Custo de remediar em produção com user ativo é múltiplas vezes maior. Checklist consolida o que cada phase prometeu.

## Como aplicar

1. Checklist em `docs/launch/launch-readiness.md` baseado em `.genesis/templates/launch-readiness-checklist-template.md`.
2. Cobrir mínimo: security (sec-* outputs), LGPD (lgpd-* outputs), operations (observability, SLOs, runbooks, backup, CI/CD), produto (suporte preparado, comunicação pronta).
3. Cada item com:
   - Responsável.
   - Evidência (link ou comando).
   - Status: pendente / em progresso / OK.
4. Go/no-go meeting com leads + DPO + IC oncall: assinatura conjunta.
5. Item bloqueante pendente = sem go-live (sem "vamos lançar com workaround").
6. Itens não-bloqueantes documentados como dívida pós-launch com deadline.

## Exemplos bons

- Reunião go/no-go com 24 itens, 22 OK + 2 dívida documentada (não-bloqueante).
- Cada item linka pra evidência (PR, dashboard, runbook publicado).
- Lançamento adiado 1 semana porque restore drill não tinha rodado.

## Exemplos ruins

- "Lança e a gente arruma" — sem checklist, sem evidência.
- Checklist com 50% "em progresso" no dia do launch.
- Item bloqueante (encryption at-rest, audit log) ignorado pra cumprir prazo de marketing.
- Go/no-go meeting que vira pressão pra aprovar sem revisar.

## Exceções

- Launch interno (alpha pra time, beta fechado) pode rodar checklist reduzido — documentar.
- Re-launch ou feature flag rollout de feature já em produção segue checklist proporcional ao escopo.

