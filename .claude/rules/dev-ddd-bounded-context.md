---
name: dev-ddd-bounded-context
description: 1 módulo = 1 bounded context. Linguagem ubíqua local. Sem vazamento de termos ou entidades entre contextos.
phase: development
---

# Rule: dev-ddd-bounded-context

## Princípio

Cada módulo do sistema implementa exatamente 1 bounded context do DDD. Termos, entidades e regras vivem dentro do contexto. Comunicação entre contextos é via eventos ou contratos públicos explícitos, nunca import direto de entidades alheias.

## Por que existe

Sem fronteiras explícitas, módulos compartilham entidades "úteis" e o sistema vira monolito acoplado. "Aluno" em billing (alguém que paga) ≠ "Aluno" em academic (alguém que cursa) — mesma palavra, contextos distintos. Forçar separação preserva clareza e permite evolução independente.

## Como aplicar

1. Cada módulo tem README.md com:
   - Nome do bounded context.
   - Glossário local (termos que significam algo específico aqui).
   - Lista de entidades e use cases.
   - Eventos publicados/consumidos.
2. Nenhum `import` cruza fronteira de módulo (exceto via contratos públicos: events, DTOs públicos).
3. Se um termo é usado em 2 contextos com sentidos diferentes, manter duplicação intencional documentada.
4. Use case de um módulo nunca chama use case de outro módulo diretamente — usa evento ou interface pública.

## Exemplos bons

- `auth/` define `User` com email + password hash. `billing/` define `Customer` com email + payment method. Não compartilham classe `User`.
- `student/` publica evento `student-registered`. `billing/` consome evento e cria `Customer` próprio.

## Exemplos ruins

- `import { Student } from '../student/domain/student.entity'` dentro de `billing/`.
- "Entidade global" `User` em pasta `shared/` usada por todos os módulos.
- Use case `billing.charge()` chamando `student.activate()` diretamente.

## Exceções

- Value objects genéricos sem regra de negócio (ex.: `Money`, `Email` como tipo primitivo) podem viver em `shared/`.
- Eventos e DTOs públicos vivem em camada de contratos compartilhada com versionamento explícito.
