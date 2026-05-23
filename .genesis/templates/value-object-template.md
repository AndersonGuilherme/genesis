# Value Object: <Name>

> Substitua `<Name>` (ex.: `Email`, `Money`, `CPF`). Usado pela skill `dev-design-entity` quando o conceito é VO, não entity.

## O que é

VO encapsula um valor com regra e/ou unidade. Imutável. Igualdade é estrutural (mesmo valor = mesmo VO).

## Quando usar VO vs Entity

- VO: sem identidade própria, definido pelo valor (Email = "a@x.com" igual a outro Email = "a@x.com").
- Entity: tem identidade que sobrevive a mudanças de atributo (Student com id=1 é o mesmo Student mesmo que email mude).

## Atributos imutáveis

| Campo | Tipo | Validação no construtor |
|-------|------|------------------------|
| ... | ... | ... |

## Validação

Todas as regras de formato/valor aplicadas no construtor. Construtor inválido → exceção.

## Equality

Implementar `equals(other)` baseado em valores, não em referência.

## Construtor

```
class <Name> {
  private readonly _value: <tipo>;
  constructor(value: <tipo>) {
    // validar — throw se inválido
    this._value = value;
  }
  get value(): <tipo> { return this._value; }
  equals(other: <Name>): boolean {
    return this._value === other._value;
  }
}
```

## Teste de exemplo

```
describe('<Name>', () => {
  it('should accept valid value', () => {
    const vo = new <Name>('<valid>');
    expect(vo.value).toBe('<valid>');
  });

  it('should reject invalid value', () => {
    expect(() => new <Name>('<invalid>')).toThrow();
  });

  it('should be equal when values match', () => {
    expect(new <Name>('a').equals(new <Name>('a'))).toBe(true);
  });
});
```
