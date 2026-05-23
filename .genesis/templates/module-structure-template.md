# Módulo: <module-name>

> README do módulo. Usado pela skill `dev-scaffold-module`. Cada módulo tem este README na raiz da pasta.

## Bounded context

Nome do contexto: `<context-name>` (geralmente igual ao nome do módulo).

Descrição em 2-3 frases: o que esse módulo é responsável por? Qual problema resolve?

## Glossário local

Termos com significado específico aqui:

- **<termo>** — definição neste contexto. Se o termo aparece em outro módulo, deixar claro que pode ter sentido diferente lá.

## Entities

| Entity | Identidade | Responsabilidade |
|--------|-----------|------------------|
| <Name> | <id type> | <1 frase> |

## Value objects

| VO | Encapsula |
|----|-----------|
| <Name> | <conceito> |

## Use cases

| Use case | Trigger | Output | Eventos emitidos |
|----------|---------|--------|------------------|
| <verb-noun> | <quando> | <o que retorna> | <eventos> |

## Ports

| Port | Implementada por |
|------|------------------|
| <EntityRepositoryPort> | infra/repositories/<entity>.repository |
| <EventBusPort> | infra/<external-bus-impl> |

## Eventos publicados

| Evento | Quando | Payload |
|--------|--------|---------|
| <event-name> | <gatilho> | <campos> |

## Eventos consumidos

| Evento | Origem | Ação tomada |
|--------|--------|-------------|
| <event-name> | <módulo origem> | <use case acionado> |

## Dependências externas

- <servico-externo> via port `<XPort>` — uso, SLO esperado, comportamento em falha.

## Estrutura de pastas

```
src/<module-name>/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── events/
│   └── ports/
├── application/
│   └── use-cases/
├── infra/
│   ├── repositories/
│   ├── controllers/
│   └── ...
└── README.md (este arquivo)
```

## Como rodar testes do módulo

```bash
<comando-da-stack-escolhida>
```

## Decisões registradas

- Link pros ADRs relevantes a este módulo.
