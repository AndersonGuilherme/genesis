---
name: dev-solid
description: SRP, OCP, LSP, ISP, DIP aplicados no domínio e application. Princípios não dogmas — usar com critério.
phase: development
---

# Rule: dev-solid

## Princípio

Aplicar SOLID nas camadas `domain/` e `application/` para preservar coesão e baixar acoplamento. Em infra, aplicar quando facilita teste/troca; sem fundamentalismo.

## Por que existe

Sem SOLID, classes crescem (god class), herança vira armadilha, interfaces ficam infladas e dependências concretas amarram o sistema. Cada letra ataca um sintoma concreto.

## Como aplicar

### S — Single Responsibility

Cada classe / use case / entity tem 1 motivo pra mudar. Se você consegue descrever a classe usando "E" / "OU", divide.

Violação: `StudentService` que registra, envia email, gera relatório, faz cobrança.
OK: `RegisterStudentUseCase` que só registra.

### O — Open/Closed

Aberto pra extensão, fechado pra modificação. Use case novo não exige alterar use case existente.

Violação: `if (input.type === 'undergrad') ... else if (input.type === 'grad') ...` em cada use case.
OK: estratégia/policy por tipo, decidida no construtor.

### L — Liskov Substitution

Subclasses funcionam onde superclasse funciona. Sem `throw new Error('not supported')` em sobrescrita.

Violação: `RetiredProfessor extends Professor` mas `assignCourse()` lança erro.
OK: hierarquia onde toda operação da base faz sentido na subclasse, ou composição.

### I — Interface Segregation

Ports pequenos, focados. Cliente não depende do que não usa.

Violação: `StudentRepositoryPort` com 20 métodos, use case usa 2.
OK: `StudentReader` e `StudentWriter` separados.

### D — Dependency Inversion

Application depende de abstrações (ports no domain), não de implementações (infra).

Violação: `RegisterStudentUseCase` importa `PostgresStudentRepository` diretamente.
OK: Use case recebe `StudentRepositoryPort` via construtor. Container/DI escolhe a impl.

## Exemplos bons

- Use case recebe ports via construtor, testes mockam ports facilmente.
- Adição de novo tipo de cobrança = nova classe que implementa port existente. Use case não muda.

## Exemplos ruins

- Service class de 800 linhas.
- `throw new Error('not implemented')` em métodos de subclasse.
- Use case com `new HttpClient()` no meio do código.

## Exceções

- Scripts one-off, code golf, prototipagem descartável.
- Camada de infra pode acoplar a framework (é seu trabalho).
