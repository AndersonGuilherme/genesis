# Spec: \<feature ou módulo\>

> Template de spec funcional. Copie e renomeie para `docs/specs/<modulo>/<feature>.md`.

## Cabeçalho

| Campo | Valor |
|-------|-------|
| Spec ID | _(ex.: SPEC-0007)_ |
| Título | _(curto e claro)_ |
| Módulo | _(slug do módulo)_ |
| Versão | v0.1 |
| Status | rascunho / em-review / aprovada / implementada |
| Autor | _(nome)_ |
| Última atualização | _(YYYY-MM-DD)_ |

## Contexto

Por que esta spec existe? Que problema do usuário ou do negócio ela resolve? Link para [problem-statement](../product/problem-statement.md) ou ADR relevante.

## Escopo

### IN
- _(o que entra)_

### OUT
- _(o que NÃO entra — explicitamente)_

## Atores e permissões

| Ator / papel | Pode |
|--------------|------|
| _(ex.: dono)_ | criar, editar, excluir |
| _(ex.: professor)_ | apenas ler |

## Entidades envolvidas

| Entidade | Papel nesta spec |
|----------|-------------------|
| _(ex.: Class)_ | objeto sendo manipulado |
| _(ex.: Student)_ | relacionada |

Detalhe em `data-model.md` do mesmo módulo.

## APIs envolvidas

| Método | Path | Auth | Permissão | Resumo |
|--------|------|------|-----------|--------|
| POST | `/classes` | sim | dono | criar |

Detalhar em `api.md` do mesmo módulo usando [../../templates/api-spec-template.md](../../templates/api-spec-template.md).

## Regras de negócio críticas

1. _(ex.: nome da turma único por escola)_
2. _(ex.: limite de 50 alunos por turma para plano Starter)_

## Eventos

### Emite
- `class.created` — schema: _(campos)_
- `class.updated` — schema: _(campos)_

### Consome
- `tenant.suspended` — comportamento esperado

## Erros previstos

| Código | Condição | HTTP | Mensagem ao usuário |
|--------|----------|------|----------------------|
| `CLASS_NAME_TAKEN` | nome já existe | 409 | "Já existe uma turma com esse nome" |

## Observabilidade

- Métrica RED para endpoint principal
- Log estruturado em sucesso e erro
- Métrica de negócio: turmas criadas / dia

## Critérios de aceite (Given/When/Then)

```
Cenário: criar turma com sucesso
  Dado um dono autenticado com plano Pro
  Quando ele cria turma com nome único e capacidade válida
  Então a turma é criada
  E o evento class.created é emitido
  E a turma aparece na listagem do dono
```

```
Cenário: criar turma com nome duplicado
  Dado um dono com turma "Turma A" já existente
  Quando ele tenta criar outra turma com nome "Turma A"
  Então a API retorna 409 com código CLASS_NAME_TAKEN
  E nenhum evento é emitido
```

## Dependências

- Spec depende de SPEC-_(id)_ — _(por quê)_
- Módulo X precisa estar implementado

## Riscos e perguntas em aberto

| Item | Estado |
|------|--------|
| _(ex.: como tratar turma sem professor?)_ | aberto |
| _(ex.: integração com calendário externo?)_ | fora de escopo |

Registrar abertas em [../research/open-questions.md](../research/open-questions.md).

## Plano de implementação

Linkar plano em `docs/specs/<modulo>/implementation-plan.md` quando criado pela skill `create-implementation-plan`.

## Histórico

| Data | Mudança | Motivo |
|------|---------|--------|
