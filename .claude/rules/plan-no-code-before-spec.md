---
name: plan-no-code-before-spec
description: Nenhum código de aplicação é escrito antes de spec mínima aprovada do módulo. Código sem spec é especulação cara.
phase: planning
---

# Rule: plan-no-code-before-spec

## Princípio

Nenhum código de aplicação é escrito antes de existir spec mínima aprovada do módulo correspondente.

## Por que existe

Código sem spec é especulação cara. Quando entendimento vem depois do código, o código vira o entendimento — e qualquer mudança quebra o que ninguém documentou. Esse é o caminho rápido para projetos travados em 6 meses.

## Como aplicar

1. Antes de criar/editar arquivo de código em um módulo, verificar `docs/specs/<modulo>/`.
2. Se a spec não existe, **parar** e usar a skill `define-module-spec`.
3. Se a spec existe mas está parcial, listar gaps antes de tocar código.
4. Se mudar contrato durante implementação, atualizar a spec **antes** do commit final.

## Exemplos bons

- Antes de criar `BillingService`, rodar `define-module-spec` para `billing` e gerar `docs/specs/billing/`.
- Ao descobrir caso de uso novo durante a implementação, parar, atualizar spec, depois retomar.

## Exemplos ruins

- "Vou começar pelo banco e depois documento."
- "A spec é mental por enquanto, é só uma POC."
- PR de feature sem spec correspondente.

## Exceções

- Spike de exploração descartável (deletado em ≤ 2 semanas). Mesmo assim, documentar a hipótese explorada em `docs/research/`.
- Bugfix pequeno em código já especificado — não exige nova spec, mas atualizar AC se mudou comportamento.
- Geração de scaffolding inicial **uma vez** após o readiness aprovado (e ainda assim atrás da skill `start-development`).
