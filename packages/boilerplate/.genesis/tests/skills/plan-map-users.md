# Tests: map-users

## Pré-condição
- `target-users.md` em alto nível.
- `mvp-scope.md` definido.

## Prompts canônicos
- "quem realmente paga, decide, usa?"
- "quais permissões teremos?"
- "como tratar o menor de idade?"

## Comportamentos esperados
- [ ] Diferencia usuário, comprador, decisor e influenciador.
- [ ] Constrói matriz papéis × ações.
- [ ] Identifica conflitos (ex.: menor de idade requer consentimento de responsável).
- [ ] Alimenta `auth-strategy.md` com papéis base.
- [ ] Conecta com permissões esperadas em specs de módulo.

## Anti-padrões
- [ ] NÃO cria papel "só pra ter".
- [ ] NÃO ignora regulação aplicável a menores.
- [ ] NÃO assume hierarquia sem perguntar.
