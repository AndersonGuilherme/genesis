---
name: maint-deprecation-policy
description: Deprecação anunciada com antecedência mínima (N versões ou X meses). Aviso visível no contrato + changelog + comunicação ativa. Sem breaking silent.
phase: maintenance
---

# Rule: maint-deprecation-policy

## Princípio

API/feature/contrato deprecado é anunciado com antecedência mínima documentada (default: 90 dias ou 2 versões major, o que for maior). Aviso aparece em: changelog, response header de API, dashboard de admin, email pra cliente afetado. Remoção só após período + comunicação ativa.

## Por que existe

Quebra silenciosa de contrato destrói confiança. Cliente B2B integra com API e descobre quebra em produção. Time interno também depende — biblioteca interna removida sem aviso vira incidente. Política pública de deprecação cria contrato previsível.

## Como aplicar

1. Política em `docs/maintenance/deprecation-policy.md`:
   - Período mínimo (default: 90 dias).
   - Canais de comunicação (changelog, header, email, dashboard).
   - Critério pra extensão (cliente crítico, regulação).
2. Cada deprecação:
   - Marcar como deprecated no código (decorator, atributo, header).
   - Adicionar em changelog com data de remoção planejada.
   - Response header em API: `Deprecation: true, Sunset: <date>, Link: <docs>`.
   - Email pra clientes que ainda usam (telemetria mostra quem).
   - Tracking de uso até remoção.
3. Remoção:
   - Só após período mínimo.
   - Só com uso restante validado (telemetria zero ou apenas teste).
   - Migration guide publicado.
4. Auditoria semestral: items deprecated há mais de N meses → remover ou estender (com nova justificativa).

## Exemplos bons

- API v1 deprecated em 2026-01, removida em 2026-07 (6 meses, telemetria zerada em 2026-05).
- Response header `Sunset: Sun, 01 Jul 2026 00:00:00 GMT`.
- Email enviado pra 32 clientes B2B em janeiro, follow-up em abril.
- Migration guide com diff antes/depois + script de migração automatizada.

## Exemplos ruins

- API removida sem aviso ("estava deprecated há muito tempo").
- Aviso só em changelog escondido — cliente não viu.
- Período de deprecação ignorado pra "simplificar arquitetura".
- Telemetria de uso ausente — não sabe quem ainda chama.

## Exceções

- Falha de segurança crítica que exige remoção imediata: comunicação simultânea com mitigação, sem prazo padrão.
- Beta features marcadas explicitamente como "breaking allowed" podem mudar mais rápido — documentar.

