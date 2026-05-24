---
name: dev-clean-architecture-layers
description: 3 camadas por módulo — domain/, application/, infra/. Dependência aponta pra dentro. Domain é o núcleo.
phase: development
---

# Rule: dev-clean-architecture-layers

## Princípio

Cada módulo é organizado em exatamente 3 camadas internas:

- `domain/` — entities, value objects, domain events, ports (interfaces). Sem framework, sem I/O.
- `application/` — use cases. Orquestra domain via ports. Sem framework, sem I/O direto.
- `infra/` — adapters (repositórios, controllers HTTP/CLI/handlers, clients externos). Implementa ports do domain. Conhece framework.

Dependências:
- `domain/` não importa de `application/` nem `infra/`.
- `application/` importa só de `domain/`.
- `infra/` importa de `domain/` (para implementar ports) e `application/` (para wirar use cases em controllers).

## Por que existe

Sem fronteiras, lógica de domínio acaba dentro de controllers e o sistema vira "framework-driven". Inverter a dependência (domain no centro) garante que regras de negócio sobrevivem a troca de framework, banco ou interface.

## Como aplicar

1. Pasta do módulo:
   ```
   src/<module>/
   ├── domain/
   ├── application/use-cases/
   ├── infra/repositories/
   ├── infra/controllers/
   └── README.md
   ```
2. Antes de criar arquivo, decidir camada: tem framework? infra. Orquestra? application. Regra pura? domain.
3. Imports respeitam direção: lint pode validar (eslint, ruff, etc. depois da escolha de stack).
4. Repositório no domain como **interface** (port), implementação concreta no infra.

## Exemplos bons

- `domain/entities/student.entity.<ext>` — classe pura, sem framework.
- `application/use-cases/register-student.use-case.<ext>` — injeta `StudentRepositoryPort`, chama `Student.create()`, persiste via port.
- `infra/repositories/student.repository.<ext>` — implementa `StudentRepositoryPort` usando ORM.
- `infra/controllers/student.controller.<ext>` — recebe HTTP, valida input, chama use case.

## Exemplos ruins

- Use case importando ORM diretamente.
- Entity com decorator de framework (`@Entity()` do ORM no domain).
- Controller com lógica de regra de negócio (cálculo, validação semântica).
- Repository importado por entity.

## Exceções

- Módulos triviais (CRUD puro sem regra) podem omitir `application/` se for só passar dado. Documentar a decisão na README do módulo.
