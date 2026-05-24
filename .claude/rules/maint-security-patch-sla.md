---
name: maint-security-patch-sla
description: CVE em dependência tem SLA de patch por severidade. CRITICAL ≤ 24h, HIGH ≤ 7d, MEDIUM ≤ 30d, LOW ≤ 90d. Triage automatizado + tracking.
phase: maintenance
---

# Rule: maint-security-patch-sla

## Princípio

Vulnerabilidade reportada (CVE em dependência, achado de SAST/DAST) tem SLA de remediação por severidade. SLA é prazo máximo da detecção à versão patchada em produção. Tracking público interno (dashboard) + auditoria mensal.

## Por que existe

CVE conhecido + não patchado = brecha aberta. Atacante sabe o vetor antes do time saber que é vulnerável. SLA cria pressão visível pra manter sistema atualizado. Sem SLA, patch fica "pra próxima sprint" e nunca acontece.

## Como aplicar

1. SLA por severidade:
   - **CRITICAL** (CVSS ≥ 9.0): ≤ 24h.
   - **HIGH** (7.0-8.9): ≤ 7 dias.
   - **MEDIUM** (4.0-6.9): ≤ 30 dias.
   - **LOW** (< 4.0): ≤ 90 dias.
2. Source de CVE:
   - Scanner em CI (cross-link com `sec-dependency-vuln-scan`).
   - Watchlist de GitHub Security Advisory + provider de runtime.
   - Bug bounty (se aplicável).
3. Dashboard interno com CVEs abertos + idade + dono.
4. Bloqueio de deploy se CRITICAL/HIGH em release nova (não introduzir + obrigado a patchar antes).
5. Excepcionalidade: CVE sem patch disponível → mitigação compensatória documentada + monitoramento. Comunicar caso a caso.
6. Auditoria mensal: SLA cumprido? Atrasados → escalar.

## Exemplos bons

- log4shell (CVSS 10.0) patchado em 12h em todos os serviços.
- Dashboard mostra "3 CVEs abertos, 0 atrasados".
- CI bloqueia merge se PR introduz dep com CRITICAL conhecido.

## Exemplos ruins

- CVE crítico em produção há 6 meses "porque é difícil testar".
- "Vamos patchar no próximo sprint planning" sem tracking.
- Mitigação compensatória sem documentação (vira folclore).
- Atualizar dep só quando dev se lembra.

## Exceções

- CVE sem patch upstream: mitigação compensatória documentada (WAF rule, isolamento, downgrade temporário).
- CVE em componente sem exposição (caminho não chamado) pode ter SLA estendido com justificativa.
- Janela de freeze (Black Friday, lançamento crítico) permite atraso pequeno + plano explícito.

