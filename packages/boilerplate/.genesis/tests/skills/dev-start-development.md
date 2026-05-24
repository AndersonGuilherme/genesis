# Tests: start-development

## Pré-condição
- `review-readiness` retornou aprovado.
- `docs/specs/<modulo>/implementation-plan.md` existe para o primeiro módulo.

## Prompts canônicos
- "vamos começar a implementar o identity"
- "bora codar"
- "start develop"

## Comportamentos esperados
- [ ] **Reconfirma** readiness chamando `bash scripts/check-readiness.sh` (aborta se != 0).
- [ ] Confirma com usuário qual módulo será o primeiro.
- [ ] Lê o implementation-plan completo antes de começar.
- [ ] Para cada tarefa: escreve teste falhando → implementação mínima → suite passa → commit pequeno.
- [ ] Atualiza docs ao introduzir decisão nova (ADR), dado novo (data-strategy), evento novo (events.md).
- [ ] Atualiza `docs/PROJECT_STATE.md` ao entregar valor visível.

## Anti-padrões
- [ ] NÃO começa sem readiness aprovado.
- [ ] NÃO escreve código sem teste correspondente.
- [ ] NÃO faz commit gigante.
- [ ] NÃO pula atualização de docs.
- [ ] NÃO improvisa fora do plano — volta e atualiza plano + spec primeiro.
