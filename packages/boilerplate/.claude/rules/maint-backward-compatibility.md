---
name: maint-backward-compatibility
description: API pública mantém compatibilidade por contrato durante janela documentada. Mudança breaking exige nova versão. Cliente antigo continua funcionando até deprecação ativa.
phase: maintenance
---

# Rule: maint-backward-compatibility

## Princípio

API pública (REST, GraphQL, gRPC, eventos publicados) preserva contrato existente. Mudança aditiva (campo opcional novo) é OK em mesma versão; mudança breaking (remoção, rename, mudança de tipo, mudança de semântica) exige nova versão major + janela de deprecação (cross-link `maint-deprecation-policy`).

## Por que existe

API quebrada em produção destrói integração de cliente. SaaS sério é confiável — promete compatibilidade e cumpre. Mudança breaking sem versionamento empurra custo de migração pro cliente sem aviso. Versionamento explícito mantém contrato previsível.

## Como aplicar

1. Versionar API publicamente: path (`/v1/`), header (`Accept: application/vnd.app.v1+json`), ou subdomain.
2. Cliente especifica versão. Server retorna na versão pedida.
3. Mudança breaking:
   - Cria `v2` (não muda `v1`).
   - Documenta diff.
   - Comunica deprecação de `v1` (cross-link `maint-deprecation-policy`).
   - Mantém ambas em paralelo durante janela.
4. Mudança aditiva (campo opcional, endpoint novo):
   - Pode ir em `v1` desde que não quebre cliente que ignora campo.
   - Documenta em changelog.
5. Eventos publicados: envelope com versão (`event_version: 1`). Consumidor especifica versão suportada.
6. Schema do banco: separado da compatibilidade de API (banco evolui com expand-contract, API segue contrato externo).
7. Contract tests: validar que `v1` continua atendendo specs antigos.

## Exemplos bons

- `GET /v1/users/:id` mantém shape de 2024. `GET /v2/users/:id` adiciona campo novo + remove campo deprecated.
- Evento `order.created` v1 inclui `total_cents`. v2 adiciona `currency`. Consumidor pede `event_version: 1` continua funcionando.
- Contract test em CI valida `v1` contra spec congelado.

## Exemplos ruins

- Adicionar campo obrigatório em response (cliente quebra ao não conhecer).
- Mudar tipo de `int` pra `string` sem versionar.
- Remover endpoint sem deprecação prévia.
- Quebrar semântica silenciosamente (ex.: `status: 'paid'` agora inclui `pending` também).

## Exceções

- API beta explicitamente marcada como "breaking allowed" — documentar e isolar de produção real.
- API interna service-to-service (não exposta externamente) pode evoluir mais rápido com coordenação direta.
- Falha de segurança crítica permite mudança imediata, com comunicação simultânea.

