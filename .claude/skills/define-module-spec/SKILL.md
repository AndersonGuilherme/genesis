---
name: define-module-spec
description: Use para criar a spec completa de um módulo antes da implementação. Cobre entidades, regras de negócio, APIs, eventos, integrações, jobs, dados, erros, observabilidade, testes, critérios de aceite e dependências.
---

# Skill: define-module-spec

## Objetivo

Gerar uma spec executável para um módulo. Sem spec, módulo não é implementado.

## Quando usar

- Após `plan-modules` ter identificado o módulo.
- Antes de `create-implementation-plan` para esse módulo.
- Para revisão de contrato ou adição de feature relevante.

## Entradas esperadas

- `docs/modules/<modulo>.md` (visão de alto nível)
- `docs/architecture/architecture-overview.md`
- `docs/security/auth-strategy.md`
- Templates de [api](../../../.genesis/templates/api-spec-template.md), [data](../../../.genesis/templates/data-model-template.md), [business-rule](../../../.genesis/templates/business-rule-template.md), [integration](../../../.genesis/templates/integration-spec-template.md)

## Processo passo a passo

1. Confirmar com o usuário **qual módulo** será especificado.
2. Conduzir perguntas em blocos, registrando à medida que respostas chegarem.
3. Para cada item, usar template apropriado.
4. Identificar regras críticas → criar arquivo individual com `business-rule-template`.
5. Identificar integrações → criar spec por integração com `integration-spec-template`.
6. Identificar entidades → modelar com `data-model-template`.
7. Registrar critérios de aceite (Given/When/Then) sem ambiguidade.
8. Identificar perguntas em aberto → registrar em `docs/research/open-questions.md`.
9. Sugerir ADR para decisões importantes do módulo.

## Perguntas guia (por módulo)

1. Qual problema esse módulo resolve?
2. Quem usa esse módulo?
3. Quais **entidades** pertencem a esse módulo?
4. Quais **regras de negócio** existem? Quais são inegociáveis? Quais podem mudar?
5. Quais **casos de uso** existem?
6. Quais **permissões** existem por papel?
7. Quais **eventos** esse módulo emite? Com que payload?
8. Quais eventos esse módulo **consome**? Como reage?
9. Quais **integrações** são necessárias (gateway, email, storage)?
10. Quais **APIs** são expostas? Quais são internas / públicas?
11. Quais **telas ou fluxos** existem?
12. Quais **jobs ou filas** são necessários?
13. Quais **emails/notificações** são enviados?
14. Qual **serviço** será usado para email, fila, storage?
15. Quais **dados precisam ser auditados**?
16. Quais **testes** são obrigatórios?
17. Quais **critérios de aceite** definem que o módulo está pronto?

## Documentos que cria

Em `docs/specs/<modulo>/`:

- `overview.md` (resumo da spec)
- `data-model.md` (entidades)
- `api.md` (endpoints, schemas)
- `events.md` (emitidos + consumidos, com schema)
- `business-rules.md` (lista, cada regra detalhada)
- `acceptance.md` (critérios em Given/When/Then)

E adições em:
- `docs/architecture/integration-map.md`
- `docs/security/data-privacy.md` (se houver PII nova)
- `docs/research/open-questions.md`
- ADRs quando aplicável

## Critérios de conclusão

- [ ] Entidades modeladas
- [ ] APIs especificadas com schemas
- [ ] Eventos com payload definido
- [ ] Regras críticas listadas e testáveis
- [ ] Permissões claras
- [ ] Critérios de aceite testáveis (sem palavras vagas)
- [ ] Riscos e perguntas registrados

## Restrições

- Critério vago é critério rejeitado ("rápido", "corretamente", "intuitivo" não passam).
- Sem spec, sem código.
- Spec longa demais ≠ spec boa — clareza > volume.
- Permissões precisam estar resolvidas; "vamos ver depois" é proibido.

## Exemplos de uso

- "Vamos detalhar o módulo de cobrança."
- "Spec do marketplace, por favor."
- "O que esse módulo realmente faz?"
