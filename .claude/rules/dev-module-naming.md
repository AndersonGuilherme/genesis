---
name: dev-module-naming
description: EN singular, kebab-case folder, PascalCase classe. Ilustração — auth/, student/, professor/.
phase: development
---

# Rule: dev-module-naming

## Princípio

Módulos e arquivos seguem convenção uniforme: nome em inglês singular, pasta em kebab-case, classes em PascalCase, funções em camelCase (ou snake_case se a stack assim exigir).

## Por que existe

Padrão único elimina debate em PR, facilita grep, reduz fricção em onboarding e evita o caos de `Students/`, `professores/`, `Auth/`, `course_module/` convivendo. Singular reflete a unidade conceitual (módulo = 1 bounded context).

## Como aplicar

1. **Módulo**: inglês, singular, kebab-case. `auth/`, `student/`, `professor/`, `course/`, `billing/`.
2. **Arquivo dentro do módulo**: kebab-case com sufixo de papel. Ex.:
   - `student.entity.<ext>`
   - `register-student.use-case.<ext>`
   - `student-repository.port.<ext>`
   - `student.repository.<ext>` (impl)
   - `student.controller.<ext>`
3. **Classe / interface / type**: PascalCase. `Student`, `RegisterStudentUseCase`, `StudentRepositoryPort`.
4. **Função / método / variável**: camelCase (TS/JS/Java) ou snake_case (Python/Rust/Go) conforme idioma.
5. **Constante**: SCREAMING_SNAKE_CASE para constantes verdadeiramente constantes.

## Exemplos bons

- `src/student/domain/entities/student.entity.ts` exportando `class Student`.
- `src/billing/application/use-cases/charge-monthly-fee.use-case.ts` exportando `class ChargeMonthlyFeeUseCase`.

## Exemplos ruins

- `Students/` (plural em pasta).
- `Aluno/` (PT-BR em código).
- `studentService.ts` (camelCase em nome de arquivo).
- `Auth_Module/` (snake + PascalCase em pasta).

## Exceções

- Restrição forte de framework que exige outra convenção (ex.: Next.js `app/` router) — documentar e isolar.
- Termos consagrados específicos do domínio em PT-BR podem aparecer como **string** no glossário, mas nunca como identificador de código.
