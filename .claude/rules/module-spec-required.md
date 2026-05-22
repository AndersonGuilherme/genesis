# Rule: module-spec-required

## Princípio

Nenhum módulo é implementado sem spec completa em `docs/specs/<modulo>/`.

## Por que existe

Sem spec, módulo vira região nebulosa do código onde regras aparecem implícitas, sem teste, e qualquer mudança gera bug em outro lugar. Spec é o contrato.

## Como aplicar

1. Antes de criar diretório de código de um módulo, garantir spec em `docs/specs/<modulo>/`.
2. Spec deve ter: overview, data-model, api, events, business-rules, acceptance.
3. Permissões e regras críticas precisam estar testáveis.
4. Sem spec, recusar criar arquivo de implementação.

## Exemplos bons

- Antes de criar pasta `src/billing/`, gerar `docs/specs/billing/` completo via `define-module-spec`.
- Adicionar novo evento ao módulo? Atualizar `docs/specs/<modulo>/events.md` antes do código.

## Exemplos ruins

- "Vamos codar e a spec a gente faz no fim."
- Módulo sem `business-rules.md` por "regras serem simples".
- Permissões definidas só no review do PR.

## Exceções

- Bugfix pequeno em módulo já especificado.
- Refatoração interna que não muda contrato.
- Hotfix de produção — neste caso, atualizar spec no PR de follow-up no mesmo dia.
