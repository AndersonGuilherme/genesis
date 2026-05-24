---
name: sec-output-encoding
description: Toda saída para canal interpretado (HTML, SQL, shell, log estruturado) passa por encoding/escape adequado ao canal. Prevenção de XSS, injection, log forging.
phase: security
---

# Rule: sec-output-encoding

## Princípio

Dado controlado pelo usuário NUNCA é concatenado bruto em canal interpretado. Cada canal tem encoding próprio: HTML (escape de `<`, `>`, `"`, `&`), SQL (parameterized queries), shell (sem concat, usar args array), log JSON (escape de quebras), URL (encodeURIComponent).

## Por que existe

Sem encoding: XSS armazenado (script roda no browser de outro user), SQL injection, command injection, log forging (atacante injeta linha falsa no log), open redirect. Encoding é a defesa, validação de input é segunda camada.

## Como aplicar

1. **HTML**: framework de template (React, Jinja, etc.) escapa por default. Nunca usar `dangerouslySetInnerHTML` / `|safe` / `innerHTML =` com dado de user.
2. **SQL**: parameterized queries / prepared statements / ORM com binding. Nunca string concat.
3. **Shell**: API que aceita array (`spawn(['cmd', arg1, arg2])`), nunca `exec(cmd + ' ' + arg)`.
4. **Log estruturado**: usar logger que escapa (JSON encoding). Nunca `console.log("user=" + userInput)`.
5. **URL params**: `encodeURIComponent` (JS) ou equivalente.
6. **CSV**: escapar `=`, `+`, `-`, `@` no início (formula injection no Excel).

## Exemplos bons

- React renderiza `{user.name}` — escape automático.
- `db.query('SELECT * FROM users WHERE email = $1', [email])`.
- `spawn('ffmpeg', ['-i', userPath, outputPath])`.
- `logger.info({ user_id: userId, action: 'login' })`.

## Exemplos ruins

- `<div dangerouslySetInnerHTML={{ __html: comment }} />` sem sanitizar.
- `db.query("SELECT * FROM users WHERE email = '" + email + "'")`.
- `exec("convert " + userFile)`.
- `console.log("login attempt: " + req.body.username)` (CRLF injection no log).

## Exceções

- Renderização de HTML rico fornecido pelo próprio sistema (não user input). Documentar.
- Sanitizadores especializados (DOMPurify) podem permitir HTML controlado em casos específicos (rich text editor).
