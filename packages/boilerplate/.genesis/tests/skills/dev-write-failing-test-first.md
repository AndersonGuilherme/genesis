# Tests: dev-write-failing-test-first

## Pré-condição
- Use case / entity / VO planejado (spec existe).

## Prompts canônicos
- "escrever teste failing primeiro"
- "RED step pro use case X"
- "TDD helper"

## Comportamentos esperados
- [ ] Cria arquivo `<name>.spec.<ext>` antes de qualquer código de produção.
- [ ] Teste valida contrato (input → output esperado).
- [ ] Roda e confirma FALHA (compilation error ou assertion error).
- [ ] Mensagem de erro do teste é informativa.

## Anti-padrões
- [ ] NÃO escreve impl primeiro.
- [ ] NÃO faz teste passar "por coincidência" sem RED comprovado.
- [ ] NÃO usa `expect(true).toBe(true)` ou assert vazio.
