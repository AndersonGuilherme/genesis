# Module Spec: \<nome do módulo\>

> Spec completa de um módulo. Copie para `docs/specs/<modulo>/overview.md` e detalhe nas subseções `data-model.md`, `api.md`, `events.md`, `business-rules.md`, `acceptance.md`.

## Cabeçalho

| Campo | Valor |
|-------|-------|
| Nome do módulo | _(kebab-case)_ |
| Versão da spec | v0.1 |
| Status | rascunho / em-review / aprovada / implementada |
| Dono | _(nome ou papel)_ |
| Última atualização | _(YYYY-MM-DD)_ |
| ADRs vinculados | _(lista)_ |

## Objetivo (1 frase)

_(...)_

## Usuários e papéis

| Papel | O que faz aqui |
|-------|----------------|
| _(...)_ | _(...)_ |

## Entidades principais

Listar e detalhar em `data-model.md`.

| Entidade | Propósito |
|----------|-----------|
| _(...)_ | _(...)_ |

## Regras de negócio

Detalhar cada regra significativa em `business-rules.md` usando o `business-rule-template.md`.

| ID | Regra | Inegociável? |
|----|-------|---------------|
| BR-001 | _(...)_ | sim/não |

## Casos de uso

| Caso | Ator | Resultado |
|------|------|-----------|
| _(...)_ | _(...)_ | _(...)_ |

## Permissões

Matriz papel × recurso:

| Recurso | create | read | update | delete |
|---------|--------|------|--------|--------|
| _(...)_ | _(...)_ | _(...)_ | _(...)_ | _(...)_ |

## APIs

Resumo. Detalhar em `api.md` com `api-spec-template.md` por endpoint.

| Método | Path | Auth | Permissão | Resumo |
|--------|------|------|-----------|--------|
| _(...)_ | _(...)_ | _(...)_ | _(...)_ | _(...)_ |

## Eventos

### Emite
- `<modulo>.<evento>` — schema em `events.md`

### Consome
- `<outro-modulo>.<evento>` — comportamento

## Integrações

Detalhar cada uma com `integration-spec-template.md`.

| Serviço | Função | Criticidade | Fallback |
|---------|--------|-------------|----------|
| _(...)_ | _(...)_ | _(...)_ | _(...)_ |

## Emails / notificações

| Tipo | Trigger | Destinatário | Conteúdo resumo |
|------|---------|---------------|------------------|
| _(...)_ | _(...)_ | _(...)_ | _(...)_ |

## Jobs e filas

| Job | Trigger | Frequência | Idempotente? |
|-----|---------|------------|---------------|
| _(...)_ | _(...)_ | _(...)_ | _(...)_ |

## Dados sensíveis

| Campo | Tipo | Onde mora | Criptografia | Retenção |
|-------|------|-----------|--------------|----------|
| _(...)_ | PII / financeiro / nenhum | _(...)_ | em-repouso | _(...)_ |

## Erros previstos

| Código | Condição | HTTP | Mensagem ao usuário |
|--------|----------|------|----------------------|
| _(...)_ | _(...)_ | _(...)_ | _(...)_ |

## Logs e métricas

- Eventos de log essenciais
- Métricas RED expostas
- Métricas de negócio relevantes

## Testes obrigatórios

- [ ] Unitário das regras críticas (BR-*)
- [ ] Integração com banco e dependências diretas
- [ ] Contract test da API
- [ ] E2E do fluxo principal
- [ ] Teste de evento emitido (schema + emissão)
- [ ] Teste de permissão por papel

## Critérios de aceite (resumo)

Detalhar em `acceptance.md` (formato Given/When/Then).

- [ ] _(...)_
- [ ] _(...)_

## Riscos

| Risco | Mitigação |
|-------|-----------|
| _(...)_ | _(...)_ |

## Dependências

- Módulo `<x>` precisa estar pronto antes
- Integração `<y>` precisa estar configurada

## Histórico

| Data | Mudança | Motivo / ADR |
|------|---------|---------------|
