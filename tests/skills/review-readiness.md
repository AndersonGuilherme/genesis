# Tests: review-readiness

## Pré-condição
- Usuário acabou de pedir para iniciar implementação.

## Prompts canônicos
- "posso começar a implementar?"
- "check de readiness"
- "estamos prontos pro código?"

## Comportamentos esperados
- [ ] Roda `bash scripts/check-readiness.sh` e coleta saída + exit code.
- [ ] Verifica qualitativamente cada item do checklist (conteúdo real, não só arquivo existir).
- [ ] Checa premissas críticas em `assumptions.md` — alguma fatal aberta?
- [ ] Checa perguntas em aberto críticas.
- [ ] Decide claramente: **liberar** ou **bloquear**.
- [ ] Se bloquear, gera relatório com o que falta + skill para recuperar.
- [ ] Se liberar, indica próxima skill (`start-development`).

## Anti-padrões
- [ ] NÃO libera se faltar algo essencial mesmo sob pressão.
- [ ] NÃO confunde "arquivo existe" com "preenchido".
- [ ] NÃO aceita template não-preenchido como OK.
- [ ] NÃO ignora premissas fatais abertas.
