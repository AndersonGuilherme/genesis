---
name: dev-dependency-direction
description: Domain não importa de application/infra. Application só importa de domain (via ports). Infra implementa ports.
phase: development
---

# Rule: dev-dependency-direction

## Princípio

Setas de dependência apontam pra dentro: `infra → application → domain`. Domain nunca depende de nada do projeto exceto si mesmo. Inversão (Dependency Inversion Principle) acontece via ports definidos no domain e implementados na infra.

## Por que existe

Quando lógica de domínio depende de framework/banco, troca de framework vira reescrita. Inverter direção isola domain e application de detalhes voláteis (banco, HTTP, ORM). É o coração da Clean Architecture/Hexagonal.

## Como aplicar

1. **Domain** importa só de domain (e tipos primitivos da linguagem).
2. **Application** importa de domain (entities, value objects, ports). Nunca de infra.
3. **Infra** importa de domain (para implementar ports) e application (para wirar use cases nos controllers/handlers).
4. **Ports** vivem no domain como interfaces. Implementações concretas vivem no infra.
5. Lint estático (eslint plugin, import-linter Python, etc.) pode reforçar — adicionar quando stack escolhida.

## Exemplos bons

- `domain/ports/student-repository.port.ts` define interface.
- `infra/repositories/student.repository.ts` implementa a interface usando ORM.
- `application/use-cases/register-student.use-case.ts` recebe `StudentRepositoryPort` via construtor — sem saber qual impl.

## Exemplos ruins

- `domain/entities/student.entity.ts` importando `import { Repository } from 'typeorm'`.
- `application/use-cases/register-student.use-case.ts` importando `PostgresStudentRepository` diretamente.
- `infra/repositories/student.repository.ts` importando outro repositório da infra (acoplamento horizontal interno).

## Exceções

- Adapter de DI / wiring vive em camada externa (`main.ts`, `bootstrap.ts`) e conhece todas as camadas — é o local de composição final.
- Eventos de domínio definidos no domain podem ser consumidos por infra (event bus), mas o domain não conhece o bus concreto.
