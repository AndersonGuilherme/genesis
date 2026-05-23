# Tests: plan-modules

## Pré-condição
- `architecture-overview.md` preenchido.
- `mvp-scope.md` definido.
- `auth-strategy.md` definido.

## Prompts canônicos
- "vamos quebrar o produto em módulos"
- "quais módulos vamos atacar primeiro?"
- "onde mora a regra de cobrança?"

## Comportamentos esperados
- [ ] Identifica módulos coesos do MVP (geralmente identity + 3-6 outros).
- [ ] Para cada módulo: nome, propósito, entidades principais, eventos emitidos/consumidos, dependências.
- [ ] Define ordem de implementação que destrava MVP cedo.
- [ ] Identifica acoplamentos perigosos.
- [ ] Registra em `docs/modules/<modulo>.md` (um por módulo).
- [ ] Atualiza `docs/modules/README.md` com lista mestra.

## Anti-padrões
- [ ] NÃO cria módulo sem dono claro.
- [ ] NÃO permite leitura cruzada de banco entre módulos.
- [ ] NÃO define tecnologia interna do módulo aqui (fica para spec).
- [ ] NÃO infla quantidade de módulos ("module-itis").
