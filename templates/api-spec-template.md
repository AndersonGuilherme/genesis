# API Spec: \<endpoint\>

| Campo | Valor |
|-------|-------|
| ID | API-NNNN |
| Módulo | _(slug)_ |
| Versão | v1 |
| Status | rascunho / aprovada / implementada / depreciada |
| Última atualização | YYYY-MM-DD |

## Endpoint

- **Método:** `POST` / `GET` / `PUT` / `PATCH` / `DELETE`
- **Path:** `/v1/<recurso>`
- **Tipo:** público / interno / admin

## Resumo

Em 1 frase, o que esse endpoint faz.

## Autenticação

- Obrigatória? sim / não
- Tipo: Bearer JWT / API key / signing secret

## Permissão

Quais papéis podem chamar?

| Papel | Permitido? |
|-------|------------|
| owner | sim |
| admin | sim |
| member | _(...)_ |
| viewer | não |

Verificação multi-tenant: validar `tenant_id` do token contra recurso acessado.

## Request

### Headers obrigatórios
- `Authorization: Bearer <token>`
- `Content-Type: application/json`
- `Idempotency-Key: <uuid>` (quando aplicável)

### Path / Query params

| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| _(...)_ | _(...)_ | _(...)_ | _(...)_ |

### Body (schema)

```json
{
  "field_a": "string",
  "field_b": 0,
  "field_c": {
    "nested": "string"
  }
}
```

Regras:
- `field_a` obrigatório, 1–100 caracteres
- `field_b` inteiro, ≥ 0
- `field_c` opcional

## Response — sucesso

### HTTP 200 / 201

```json
{
  "id": "uuid",
  "field_a": "string",
  "created_at": "ISO-8601"
}
```

## Response — erros

| Código | HTTP | Quando |
|--------|------|--------|
| `VALIDATION_ERROR` | 400 | payload inválido |
| `UNAUTHENTICATED` | 401 | token ausente/inválido |
| `FORBIDDEN` | 403 | sem permissão |
| `NOT_FOUND` | 404 | recurso inexistente |
| `CONFLICT` | 409 | violação de regra de unicidade |
| `RATE_LIMIT` | 429 | excedeu limite |
| `INTERNAL` | 500 | erro inesperado |

Formato de erro:

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Mensagem amigável",
    "details": { }
  }
}
```

## Regras de negócio aplicáveis

- BR-NNNN — _(referência)_

## Idempotência

- Suporta `Idempotency-Key`? sim / não
- Janela de retenção: _(ex.: 24h)_
- Comportamento em re-tentativa com mesma chave: retorna mesmo resultado.

## Rate limit

- Limite: _(ex.: 60 req/min por usuário)_
- Como contabilizar: por user_id + tenant_id

## Exemplos

### Sucesso

```bash
curl -X POST https://api.dominio.com/v1/recurso \
  -H "Authorization: Bearer ..." \
  -H "Content-Type: application/json" \
  -d '{"field_a": "valor"}'
```

### Erro

```bash
curl -X POST https://api.dominio.com/v1/recurso \
  -H "Authorization: Bearer ..." \
  -d '{}'
# 400 VALIDATION_ERROR
```

## Eventos emitidos

- `<modulo>.<acao>` — quando o endpoint conclui com sucesso

## Logs

- Sempre logar: timestamp, request_id, tenant_id, user_id, ação, duração, status
- Nunca logar: token, senha, PII completa

## Testes obrigatórios

- [ ] Sucesso (caminho feliz)
- [ ] Validação (campos faltando / inválidos)
- [ ] Permissão (papel sem acesso)
- [ ] Autenticação (sem token)
- [ ] Conflito (regra de unicidade)
- [ ] Rate limit
- [ ] Idempotência (quando aplicável)
- [ ] Multi-tenant cross-check
- [ ] Contract test (schema)

## Histórico

| Data | Mudança | Motivo / ADR |
|------|---------|---------------|
