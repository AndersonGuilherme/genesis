# Entity: <Name>

> Substitua `<Name>` (ex.: `Student`). Usado pela skill `dev-design-entity`.

## Bounded context

Módulo: `<nome-do-modulo>`. Esta entity vive aqui e não é compartilhada com outros módulos.

## Identidade

- Como é identificada (id natural? UUID?).
- Tipo do id.

## Atributos

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | <tipo> | sim | Identidade. |
| ... | ... | ... | ... |

## Invariantes (validados no construtor/factory)

- Lista de regras que SEMPRE valem. Ex.: "email é único no módulo", "idade >= 0".

## Métodos de domínio

| Método | Recebe | Retorna | Regra |
|--------|--------|---------|-------|
| `<verbo>` | <input> | <output> | <regra aplicada> |

Linguagem ubíqua: usar verbos do domínio (`enroll`, `graduate`), não CRUD (`update`).

## Eventos emitidos

- `<event-name>` — quando o método X é chamado com sucesso.

## Construtor / factory

```
class <Name> {
  private constructor(...) { /* validação de invariantes */ }
  static create(...): <Name> { /* factory que valida e retorna instância */ }
}
```

Construtor privado, criação via `create()` (factory) — garante validação centralizada.

## Teste de exemplo

```
describe('<Name>', () => {
  it('should create with valid attributes', () => {
    const entity = <Name>.create({ /* ... */ });
    expect(entity).toBeInstanceOf(<Name>);
  });

  it('should reject creation when <invariant violado>', () => {
    expect(() => <Name>.create({ /* invalid */ })).toThrow(<DomainError>);
  });
});
```
