# Specs

> Specs são a ponte entre o que queremos construir e o código que será escrito. Sem spec, módulo não é implementado.

## Filosofia: Spec Driven Development (SDD)

1. **Especificar antes de codificar.** Spec é design pensado no papel, antes do compilador esconder más decisões.
2. **Spec é executável.** Critérios de aceite viram testes. Schemas viram contratos.
3. **Spec é versionada.** Mudança em spec gera ADR quando rompe contrato.
4. **Spec mora junto do código.** Cada módulo tem sua spec em `docs/specs/<modulo>/`.

## Estrutura

```
docs/specs/
├── README.md                 (este arquivo)
├── spec-template.md          (template para copiar)
├── <modulo>/                 (uma pasta por módulo)
│   ├── overview.md
│   ├── api.md
│   ├── data-model.md
│   ├── events.md
│   ├── business-rules.md
│   └── acceptance.md
└── integrations/             (uma spec por integração externa)
    └── <servico>.md
```

## Quando criar spec

- Antes de qualquer linha de código do módulo.
- Quando mudar contrato público (API/eventos).
- Quando introduzir nova integração externa.
- Quando adicionar feature que cruza módulos.

## O que toda spec precisa ter

1. **Contexto** — por que existe.
2. **Escopo IN / OUT** — limites.
3. **Atores e permissões** — quem opera.
4. **Entidades e invariantes** — dados e regras.
5. **APIs e contratos** — entrada e saída.
6. **Eventos emitidos/consumidos** — interações.
7. **Erros previstos** — códigos e comportamento.
8. **Observabilidade** — métricas e alertas relevantes.
9. **Critérios de aceite** — testáveis (Given/When/Then).
10. **Riscos e perguntas em aberto**.

## Critérios de qualidade

| Critério | Boa spec | Spec ruim |
|----------|----------|-----------|
| Ambiguidade | regras testáveis | "deve ser intuitivo" |
| Erros | enumerados | "tratar erro" |
| Eventos | schema definido | "vai sair um evento" |
| Permissões | matriz por papel | "auth required" |
| Volume esperado | número estimado | "alto" |

## Conexão com testes

Cada item em "Critérios de aceite" deve virar pelo menos 1 teste automatizado. Sem teste, o critério não é considerado atendido.

Veja [../testing/acceptance-criteria.md](../testing/acceptance-criteria.md) para formato Given/When/Then padronizado.

## Quem revisa

- `software-architect` aprova arquitetura geral.
- `domain-modeler` aprova regras e modelo.
- `security-reviewer` aprova permissões e dados.
- Outras pessoas, conforme o módulo.
