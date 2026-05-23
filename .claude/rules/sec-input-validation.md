---
name: sec-input-validation
description: Toda entrada externa (HTTP, CLI, evento, fila) validada na boundary com schema explícito. Rejeição cedo, erro tipado.
phase: security
---

# Rule: sec-input-validation

## Princípio

Input do mundo externo é hostil até prova em contrário. Validação acontece na boundary (controller, handler, consumer), com schema declarativo, ANTES de chegar ao use case do domain. Use case recebe input já tipado e validado.

## Por que existe

Sem validação na boundary: SQL injection, deserialização malformada, XSS armazenado, type confusion, NoSQL injection, command injection, path traversal. Domain confia no que recebe — boundary é o filtro.

## Como aplicar

1. Validador na entrada: zod/joi/pydantic/struct tag/etc. (depende da stack).
2. Schema cobre: tipo, formato, range, length, allowed values, regex se aplicável.
3. Falha de validação → erro tipado (4xx HTTP), nunca 5xx ou crash.
4. Sanitização para campos que viram output (HTML, SQL via parameterized only).
5. Whitelist > blacklist (definir o que aceita, não o que rejeita).
6. Validar também: headers, query params, path params, body, payload de evento.

## Exemplos bons

- `RegisterStudentController` valida `{ email: string.email, age: int.min(0).max(120) }` antes de chamar use case.
- DTO declarativo com biblioteca de schema; falha gera 400 com mensagem clara.
- Webhook handler valida payload + assinatura HMAC (cross-link `sec-webhook-signing`).

## Exemplos ruins

- Use case recebe `any` / `dict` e checa campos no meio do código.
- Concatenar input em SQL ("WHERE id = " + req.body.id).
- Validação só no frontend (frontend é controlado pelo cliente; sempre validar no backend também).
- Aceitar campos extras silenciosamente (use case usa só o que conhece, mas armazena tudo).

## Exceções

- Endpoints internos service-to-service via mTLS podem ter validação mais leve, ainda assim com schema.
- Validação adicional no domain (invariantes de entity) é complementar, não substitui boundary.
