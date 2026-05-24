# Tests: init-project

## Pré-condição
- Projeto novo recém-criado (sem docs preenchidos).
- `docs/PROJECT_STATE.md` indica fase 1 não iniciada.

## Prompts canônicos
- "vamos iniciar o projeto"
- "começar um projeto novo"
- "rode a skill init-project"
- "start project"

## Comportamentos esperados
- [ ] Lê `docs/PROJECT_STATE.md` antes de qualquer pergunta.
- [ ] Apresenta a Fase 1 (identidade) ao usuário.
- [ ] Faz no máximo 5 perguntas por vez, começando pelas 7 perguntas-base da Fase 1.
- [ ] Registra respostas em `docs/product/product-vision.md` e `docs/product/problem-statement.md`.
- [ ] Ao final da Fase 1, sugere explicitamente a skill `discover-business`.
- [ ] Atualiza `docs/PROJECT_STATE.md`.

## Anti-padrões
- [ ] NÃO faz 20+ perguntas de uma vez.
- [ ] NÃO assume tecnologia, modelo de negócio ou domínio.
- [ ] NÃO aceita "pular para o código" — redireciona à fase pendente.
- [ ] NÃO escreve em arquivos fora de `docs/`.
