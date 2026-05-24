# Use Case: <verbo>-<substantivo>

> Substitua o nome (ex.: `register-student`). Este template é usado pela skill `dev-define-use-case`.

## Bounded context

Módulo: `<nome-do-modulo>`

## Resumo

1 frase descrevendo o que o use case faz (verbo de ação + objeto).

## Input

```
interface <Name>Input {
  // campos validados — tipo e regra
}
```

## Output

```
interface <Name>Output {
  // campos retornados
}
```

## Dependências (ports injetadas)

- `<EntityRepositoryPort>` — para persistência.
- `<EventBusPort>` — se publica eventos.
- (outros ports conforme necessidade)

## Fluxo principal

1. Validar input.
2. Carregar agregados/entities necessários via ports.
3. Aplicar regra de domínio (delegar à entity/VO).
4. Persistir mudanças via port.
5. Publicar eventos (se aplicável).
6. Retornar output.

## Fluxos alternativos / erros

- `<NotFoundError>` — quando entity referenciada não existe.
- `<DomainRuleViolation>` — quando invariante é violado (ex.: email duplicado).
- (outros erros explícitos)

## Eventos emitidos

- `<event-name>` — payload e quando.

## Critérios de aceite (Given/When/Then)

- Given <estado>, When <ação>, Then <resultado esperado>.
- Given input inválido, When `execute(input)`, Then throw `<ValidationError>`.

## Teste de exemplo (skeleton)

```
describe('<Name>UseCase', () => {
  it('should <verbo> with valid input', async () => {
    // arrange: monta mocks de ports
    // act: chama execute
    // assert: verifica output e side-effects
  });

  it('should throw <Error> when <condition>', async () => {
    // arrange
    // act + assert
  });
});
```
