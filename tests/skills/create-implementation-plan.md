# Tests: create-implementation-plan

## Pré-condição
- `docs/specs/<modulo>/` completo (overview, data-model, api, events, business-rules, acceptance).
- `testing-strategy.md` definida.

## Prompts canônicos
- "quebra a spec do billing em tarefas"
- "plano de implementação para o módulo identity"
- "vamos transformar essa spec em sequência de PRs"

## Comportamentos esperados
- [ ] Lê todos os arquivos da spec antes de propor.
- [ ] Lista tarefas verticais XS-M (cada uma entrega valor end-to-end mínimo).
- [ ] Cada tarefa tem: objetivo, arquivos a criar/modificar, testes esperados, esforço, dependências, critério de pronto.
- [ ] Ordena para destravar caminho feliz cedo, edge cases ao final.
- [ ] Quebra tarefas L/XL.
- [ ] Salva em `docs/specs/<modulo>/implementation-plan.md`.
- [ ] Sugere mensagens de commit convencionais.

## Anti-padrões
- [ ] NÃO cria tarefa "fazer o módulo X" sem decomposição.
- [ ] NÃO pula testes para "ganhar velocidade".
- [ ] NÃO permite PR gigante.
- [ ] NÃO ignora critérios da spec.
