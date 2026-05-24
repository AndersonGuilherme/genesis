# Tests: dev-design-entity

## Pré-condição
- Módulo scaffolded.
- Spec da entidade existe (atributos + invariantes + comportamentos).

## Prompts canônicos
- "modelar entity Student"
- "criar value object Email"
- "design DDD da entity"

## Comportamentos esperados
- [ ] Teste primeiro (RED): invariantes + métodos de linguagem ubíqua.
- [ ] Entity em `domain/entities/<name>.entity.<ext>`.
- [ ] VO em `domain/value-objects/<name>.<ext>`.
- [ ] Sem framework no `domain/`.
- [ ] Invariantes validados no construtor/factory.
- [ ] Métodos expressam linguagem ubíqua (não getters/setters genéricos).

## Anti-padrões
- [ ] NÃO usa decorator de ORM no `domain/`.
- [ ] NÃO expõe estado interno mutável.
- [ ] NÃO permite criar entity em estado inválido.
