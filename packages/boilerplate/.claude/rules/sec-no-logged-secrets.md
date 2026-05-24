---
name: sec-no-logged-secrets
description: Logs nunca contêm secret, senha, token, CPF, cartão, PII em claro. Sanitizer central obrigatório. Mascaramento de campos sensíveis padronizado.
phase: security
---

# Rule: sec-no-logged-secrets

## Princípio

Logs (aplicação, acesso, erro, debug, trace) NUNCA contêm dado sensível em claro. Campos sensíveis são mascarados ou redacted no logger antes da escrita. Sanitizer central define a lista. Logs vão pra storage com retenção e podem vazar via export/backup/observability platform.

## Por que existe

Logs vazam: ferramenta de observability comprometida, export para terceiro (debug com fornecedor), backup vazado, dev com `tail -f` em produção. Cada um desses caminhos expõe PII se logger não sanitiza. LGPD trata isso como tratamento indevido de dado.

## Como aplicar

1. Sanitizer central com lista de campos sensíveis: `password`, `token`, `secret`, `authorization`, `cpf`, `card_number`, `cvv`, `pix_key`, `email` (parcial), `phone` (parcial), etc.
2. Logger wrapper substitui valores: `password` → `[REDACTED]`, `cpf` → `***.***.***-XX` (últimos 2 dígitos), `email` → `a***@domain.com`.
3. Validação automática em CI/teste: tentativa de logar campo sensível em claro = falha.
4. Code review checa `logger.info({ user })` (objeto inteiro) — preferir campos explícitos.
5. Exceções (request body completo no erro) passam pelo sanitizer antes de virar log.

## Exemplos bons

- `logger.info({ user_id: user.id, action: 'login' })` — só id.
- Logger wrapper: `logger.info({ user })` → sanitiza recursivamente.
- Erro 500 captura request body, mas sanitiza antes de logar.

## Exemplos ruins

- `console.log("Login attempt: " + JSON.stringify(req.body))` — vaza senha.
- `logger.error("Failed for user", user)` onde `user` tem `password_hash` ou `cpf`.
- Stack trace que inclui args de função com PII (linguagens que mostram args no traceback).

## Exceções

- Audit log (cross-link `sec-audit-trail`) pode conter dado sensível MAS está em storage isolado com acesso restrito, retenção legal, e mesmo assim PII pseudonimizada quando possível.
- Logs locais de dev em ambiente isolado podem ser menos restritos; nunca em CI/prod.
