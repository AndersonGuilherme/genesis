---
name: dev-use-case-per-file
description: 1 use case = 1 operação = 1 arquivo. Interface `execute(input): output`. Sem service classes com múltiplos métodos.
phase: development
---

# Rule: dev-use-case-per-file

## Princípio

Cada use case da application layer mora em um arquivo dedicado, expõe uma única operação pública `execute(input): output` e tem teste correspondente no mesmo lugar (`<name>.use-case.spec.<ext>`). Sem service classes que agrupam múltiplas operações.

## Por que existe

Service classes ("god classes") acumulam responsabilidades e violam SRP. Testes ficam acoplados, refactor cascateia. 1-use-case-por-arquivo força fronteiras claras, simplifica testes e facilita reuso (use case é unidade de orquestração reutilizável).

## Como aplicar

1. Para cada operação distinta da spec → 1 use case → 1 arquivo.
2. Nome: `<verbo>-<substantivo>.use-case.<ext>` em kebab-case (ex.: `register-student.use-case.ts`).
3. Estrutura mínima:
   - Input type/interface explícito.
   - Output type/interface explícito.
   - Construtor recebe ports (interfaces) como dependências.
   - Método `execute(input): Promise<output>` (ou síncrono se aplicável).
4. Teste irmão: `<name>.use-case.spec.<ext>`.
5. Use case que precisa orquestrar outros use cases recebe-os via construtor (composição, não herança).

## Exemplos bons

- `register-student.use-case.ts` com `class RegisterStudentUseCase { execute(input: RegisterStudentInput): Promise<RegisterStudentOutput> }`.
- `enroll-in-course.use-case.ts` recebe `StudentRepositoryPort` e `CourseRepositoryPort` via construtor.

## Exemplos ruins

- `student.service.ts` com `register()`, `getProfile()`, `update()`, `delete()`.
- Use case com 2 métodos públicos.
- Use case implementando interface "service" genérica.

## Exceções

- Queries de leitura simples (CQRS read-side) podem agrupar em `<entity>.query.<ext>` se ficar excessivo ter 1 arquivo por consulta trivial. Documentar a decisão na README do módulo.
