---
name: dev-tdd-pragmatic
description: Use cases, entities, value objects e business rules têm teste escrito antes do código. Controllers, wiring e scripts são opcionais.
phase: development
---

# Rule: dev-tdd-pragmatic

## Princípio

Toda lógica de domínio e application (use cases, entities, value objects, business rules) tem teste escrito antes do código de produção. Camadas de infra (controllers, repositórios, wiring) podem ter teste depois ou só smoke test.

## Por que existe

TDD na camada errada vira teatro: testar controller é E2E lento, testar wiring é validar framework. TDD no domínio força design testável, expõe acoplamento e documenta comportamento. Pragmático = pega 90% do valor com menos atrito.

## Como aplicar

1. Antes de criar use case / entity / value object / business rule: escreva o teste primeiro.
2. Rode o teste e confirme que FALHA (red).
3. Implemente o mínimo pra passar (green).
4. Refatore com testes verdes (refactor).
5. Cada use case tem ao menos 1 teste de caminho feliz + 1 teste de erro/borda.
6. Asserts diretos no contrato (entrada → saída esperada). Sem `expect(true).toBe(true)`.

## Exemplos bons

- `register-student.use-case.spec.<ext>` existe e foi commitado ANTES de `register-student.use-case.<ext>`.
- Teste de entity `Student` valida invariante "email único" antes da implementação.
- Value object `Email` tem teste rejeitando formato inválido antes do construtor existir.

## Exemplos ruins

- Use case implementado primeiro, teste "para passar a cobertura" depois.
- Teste de controller HTTP que mocka tudo até o use case (vira teste de framework).
- Asserts vazios ou cobertura cosmética.

## Exceções

- Spike descartável (deletar em ≤ 2 semanas).
- Scripts one-off.
- Wiring / DI puro (montagem de container).
- Migrations de banco.
