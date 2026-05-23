---
name: lgpd-purpose-limitation
description: Dado coletado para uma finalidade NÃO é usado para outra sem novo consent ou base legal. Reuso secundário exige reconsent. LGPD art. 6, I.
phase: lgpd
---

# Rule: lgpd-purpose-limitation

## Princípio

Cada operação de tratamento (read/write/share) verifica que a finalidade é compatível com o consent/base legal original. Use case que processa PII recebe `purpose` explícito e valida contra inventory.

## Por que existe

LGPD art. 6, I (princípio da finalidade): tratamento ligado a propósito legítimo, específico, informado. Reusar email coletado pra cadastro como lista de marketing é violação clássica. Reuso secundário sem reconsent expõe a multa + dano reputacional.

## Como aplicar

1. `docs/security/lgpd/data-inventory.md` lista: campo × finalidade × base legal × consentimento (se aplicável).
2. Use case que toca PII recebe `purpose` (enum). Valida que `(field, purpose)` está autorizado no inventory.
3. Compartilhamento externo (export, API com terceiro) exige autorização explícita pra `(field, purpose, recipient)`.
4. Mudança de finalidade = nova versão de consent + reconsent ativo de quem já está cadastrado.
5. Audit log registra: `(actor, action, fields_accessed, purpose, timestamp)`.

## Exemplos bons

- `SendMarketingEmailUseCase` recebe `purpose: 'marketing.newsletter'`. Valida `user.consents` tem `marketing.newsletter = granted`.
- Export de relatório pra fornecedor anonimiza CPF (não autorizado pra fornecedor).
- Mudança de "newsletter mensal" pra "newsletter semanal + parceiros" exige reconsent.

## Exemplos ruins

- Time de marketing puxa email da tabela `users` direto, sem checar consent.
- Reuso de base de cadastro pra "campanha-surpresa" porque "eles já são clientes".
- Compartilhamento com parceiro novo sem atualizar inventory nem reconsent.

## Exceções

- Cumprimento de obrigação legal (envio de NF-e com CPF) — base legal própria, não exige consent.
- Anonimização real (sem reidentificação) libera reuso, mas precisa de avaliação técnica documentada.

