---
name: create-adr
description: Use para registrar uma decisão arquitetural ou estratégica importante. Aplica o adr-template, lista alternativas reais consideradas, consequências positivas e negativas, e atualiza o índice em docs/adr/README.md.
---

# Skill: create-adr

## Objetivo

Persistir decisões importantes em formato consistente, para que daqui a 6 meses ninguém pergunte "por que decidimos isso?".

## Quando usar

- Decisão de stack
- Padrão arquitetural significativo
- Escolha de banco / fila / cache
- Política de auth / autorização
- Escolha de fornecedor crítico
- Decisão de **não** fazer algo importante

Não usar para: decisões pequenas, reversíveis com 1 PR, ou puramente táticas de implementação.

## Entradas esperadas

- Contexto da decisão a documentar
- Pelo menos 2 alternativas avaliadas
- Indicação de impacto e consequências

## Processo passo a passo

1. Confirmar com usuário que a decisão merece ADR.
2. Determinar próximo número (lendo `docs/adr/` e somando 1).
3. Copiar `templates/adr-template.md` ou `docs/adr/adr-template.md`.
4. Renomear para `docs/adr/NNNN-titulo-kebab-case.md`.
5. Preencher todos os campos do template.
6. Garantir que pelo menos 2 alternativas reais foram consideradas e justificadas como rejeitadas.
7. Listar consequências negativas e riscos honestamente.
8. Atualizar índice em `docs/adr/README.md`.
9. Linkar do documento de arquitetura ou módulo afetado.

## Perguntas guia

1. Em uma frase, o que foi **decidido**?
2. Qual o **contexto** que forçou essa decisão?
3. Quais foram as **alternativas** consideradas?
4. Por que cada alternativa foi rejeitada?
5. Quais são as **consequências positivas**?
6. Quais são as **negativas**?
7. Quais **riscos** vêm junto?
8. Como **reverter** se a decisão se mostrar errada?
9. Como saberemos em 3-6 meses se foi uma boa decisão?

## Documentos que cria ou atualiza

- `docs/adr/NNNN-<titulo>.md` (novo)
- `docs/adr/README.md` (atualizar índice)
- Documentos de arquitetura ou módulo que referenciam a decisão

## Critérios de conclusão

- [ ] ADR criado com todos os campos preenchidos
- [ ] Mínimo 2 alternativas com motivo de rejeição
- [ ] Consequências negativas listadas
- [ ] Índice atualizado
- [ ] Status correto (`accepted` na maioria dos casos)

## Restrições

- Sem alternativas → não é decisão, é hábito. Recusar criar ADR.
- Sem consequências negativas listadas → revisar honestamente.
- Não editar ADR antigo. Criar novo que `supersedes` o anterior.
- ADR sem data é ADR sem contexto.

## Exemplos de uso

- "Vamos registrar a decisão sobre Postgres."
- "Cria ADR para a escolha de Stripe vs. Pagar.me."
- "Documenta que não vamos usar microserviços agora."
