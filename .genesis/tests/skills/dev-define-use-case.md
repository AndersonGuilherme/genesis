# Tests: dev-define-use-case

## Pré-condição
- Módulo já scaffolded (`dev-scaffold-module`).
- Spec do use case existe.

## Prompts canônicos
- "implementar use case register-student"
- "criar RegisterStudentUseCase"
- "TDD do use case X"

## Comportamentos esperados
- [ ] Escreve teste failing PRIMEIRO (RED).
- [ ] Implementa mínimo pra passar (GREEN).
- [ ] Refatora com testes verdes (REFACTOR).
- [ ] 1 use case = 1 arquivo (`<verbo>-<substantivo>.use-case.<ext>`).
- [ ] Método público único: `execute(input): output`.
- [ ] Construtor recebe ports via DI.
- [ ] Teste irmão (`<name>.use-case.spec.<ext>`).

## Anti-padrões
- [ ] NÃO escreve impl antes do teste.
- [ ] NÃO cria service class com múltiplas operações.
- [ ] NÃO importa ORM direto no use case.
- [ ] NÃO deixa lógica de regra de negócio no controller.
