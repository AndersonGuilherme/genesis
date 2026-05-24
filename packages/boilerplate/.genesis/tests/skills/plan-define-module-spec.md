# Tests: define-module-spec

## Pré-condição
- `docs/modules/<modulo>.md` existe com visão de alto nível.
- `architecture-overview.md` e `auth-strategy.md` preenchidos.

## Prompts canônicos
- "vamos detalhar o módulo de cobrança"
- "spec do marketplace, por favor"
- "o que esse módulo realmente faz?"

## Comportamentos esperados
- [ ] Confirma com usuário qual módulo será especificado.
- [ ] Cria `docs/specs/<modulo>/overview.md`, `data-model.md`, `api.md`, `events.md`, `business-rules.md`, `acceptance.md`.
- [ ] Cada regra crítica detalhada com `business-rule-template`.
- [ ] Cada API com schema entrada/saída + erros + permissões.
- [ ] Cada evento com schema explícito.
- [ ] Critérios de aceite em Given/When/Then sem palavras vagas.
- [ ] Registra perguntas em aberto em `docs/research/open-questions.md`.

## Anti-padrões
- [ ] NÃO aceita critério com "rápido", "corretamente", "intuitivo".
- [ ] NÃO aceita "vamos ver as permissões depois".
- [ ] NÃO escreve código sem antes terminar a spec.
- [ ] NÃO ignora eventos consumidos (foco só no que emite).
