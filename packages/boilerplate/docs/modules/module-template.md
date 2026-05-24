# Módulo: \<nome\>

> Copie este arquivo para `docs/modules/<nome>.md` e preencha. Para spec executável detalhada, use também [../../.genesis/templates/module-spec-template.md](../../.genesis/templates/module-spec-template.md).

## Identificação

| Campo | Valor |
|-------|-------|
| Nome | _(slug em kebab-case)_ |
| Dono | _(papel ou pessoa)_ |
| Status | rascunho / spec / em implementação / produção |
| Versão do contrato | v1 |
| ADRs vinculados | _(lista)_ |

## Objetivo (1 frase)

_(O que esse módulo resolve.)_

## Usuários e papéis

| Papel | O que faz aqui |
|-------|----------------|
| _(ex.: dono da escola)_ | _(ex.: configura turmas)_ |

## Entidades

Lista de entidades principais. Detalhar cada uma em `docs/specs/<nome>/entities.md` usando [../../.genesis/templates/data-model-template.md](../../.genesis/templates/data-model-template.md).

| Entidade | Propósito |
|----------|-----------|
| _(ex.: School)_ | _(ex.: tenant raiz da gestão escolar)_ |
| _(ex.: Class)_ | _(ex.: turma de alunos)_ |

## Regras de negócio críticas

_(usar [../../.genesis/templates/business-rule-template.md](../../.genesis/templates/business-rule-template.md) para cada regra significativa)_

1. _(ex.: aluno não pode ser cadastrado em 2 turmas conflitantes no mesmo horário)_
2. _(ex.: cobrança recorrente sempre no dia 5)_

## Casos de uso

| Caso de uso | Ator | Resultado esperado |
|-------------|------|---------------------|
| _(ex.: criar turma)_ | dono | turma criada e visível para professores |

## Permissões

| Papel | Permissões |
|-------|------------|
| dono | create, read, update, delete, manage_users |
| professor | read, update_grades |
| aluno | read_own |

## APIs expostas

| Método | Path | Auth | Permissão | Descrição |
|--------|------|------|-----------|------------|
| POST | `/classes` | sim | dono | cria turma |
| GET | `/classes` | sim | qualquer | lista turmas |

## Eventos

### Emite
- `class.created`
- `class.updated`

### Consome
- `user.deleted` (para limpar matrículas)

## Integrações

| Serviço externo | Para quê | Fallback |
|------------------|----------|----------|
| _(ex.: gateway de cobrança)_ | gerar boleto | secundário |

## Emails / notificações enviadas

- _(ex.: boas-vindas ao aluno cadastrado)_
- _(ex.: aviso de aula cancelada)_

## Filas e jobs

- _(ex.: `class.recompute_grades` — job noturno)_

## Dados sensíveis

- _(ex.: CPF do aluno — criptografar)_

## Erros previstos

| Código | Significado | Ação esperada |
|--------|-------------|----------------|
| `CLASS_LIMIT_REACHED` | turma cheia | mostrar aviso ao dono |

## Métricas do módulo

- Turmas criadas / dia
- Falha de matrícula / total
- Tempo médio de criação

## Testes obrigatórios

- [ ] Unitário das regras críticas
- [ ] Integração com banco
- [ ] Contract test da API
- [ ] E2E do fluxo principal
- [ ] Teste de evento emitido

## Critérios de aceite

- [ ] Todas as APIs respondem com schema validado
- [ ] Eventos emitidos com schema correto
- [ ] Regras críticas cobertas por teste
- [ ] Observabilidade básica (logs + métrica RED)

## Riscos do módulo

- _(ex.: regra de cobrança no dia 5 não considera fins de semana — definir)_

## Dependências

- _(ex.: módulo `identity` para autenticação)_
- _(ex.: módulo `billing` para checkout)_

## Histórico

| Data | Mudança | Motivo / ADR |
|------|---------|---------------|
