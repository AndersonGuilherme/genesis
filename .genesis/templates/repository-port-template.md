# Repository Port + Implementation: <Entity>Repository

> Substitua `<Entity>` (ex.: `Student`). Usado pela skill `dev-scaffold-module`.

## Port (interface no domain)

Vive em `src/<module>/domain/ports/<entity>-repository.port.<ext>`.

```
interface <Entity>RepositoryPort {
  save(entity: <Entity>): Promise<void>;
  findById(id: <IdType>): Promise<<Entity> | null>;
  // ... outros métodos NECESSÁRIOS (Interface Segregation — não infle)
}
```

Princípios:
- Métodos refletem necessidades do use case, não CRUD genérico.
- Tipos vêm do domain (entity, value objects), nunca tipos de framework/ORM.
- Sem método "raw" tipo `query(sql)` — port é abstrato.

## Implementação (no infra)

Vive em `src/<module>/infra/repositories/<entity>.repository.<ext>`.

```
class <Entity>Repository implements <Entity>RepositoryPort {
  constructor(private readonly db: <DbClient>) {}

  async save(entity: <Entity>): Promise<void> {
    // mapeia entity → row, persiste
  }

  async findById(id: <IdType>): Promise<<Entity> | null> {
    // consulta, mapeia row → entity (factory), retorna ou null
  }
}
```

Princípios:
- Implementação conhece ORM/SQL/HTTP/etc.
- Mapeamento row ↔ entity acontece aqui (não vaza pro domain).
- Erros de infra (timeout, constraint violation) são traduzidos pra erros de domain quando relevante.

## Teste

- Port é mockada em testes de use case (use case não conhece impl).
- Impl tem teste de integração próprio (em DB real ou container).
