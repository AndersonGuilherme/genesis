---
name: plan-adr-required-for-decisions
description: Toda decisão relevante gera ADR com 2+ alternativas e consequências negativas. Sem ADR, decisão vira folclore.
phase: planning
---

# Rule: plan-adr-required-for-decisions

## Princípio

Toda decisão relevante gera ADR. Sem ADR, decisão se torna folclore.

## Por que existe

Daqui a 6 meses, ninguém vai lembrar exatamente por que uma decisão foi tomada. ADR é a única defesa contra revisões revisitando os mesmos pontos sem ganho de informação.

## Como aplicar

1. Identifique decisões "irreversíveis em tempo curto" (ver `docs/adr/README.md`).
2. Use a skill `create-adr` ou copie `.genesis/templates/adr-template.md`.
3. Pelo menos 2 alternativas reais consideradas e justificadas como rejeitadas.
4. Liste consequências negativas honestamente.
5. Atualize o índice em `docs/adr/README.md`.
6. Linke o ADR do documento de arquitetura ou módulo afetado.

## Exemplos bons

- ADR 0002 — "Escolha de Postgres como banco primário" lista MySQL, MongoDB e SQLite (com motivos de rejeição), data, status.
- ADR 0017 — "Não usar microserviços no MVP" — anti-decisão registrada para reduzir pressão futura.

## Exemplos ruins

- ADR sem alternativas — vira hábito, não decisão.
- ADR sem consequências negativas — desonesto.
- Decisão grande tomada em PR sem ADR.

## Exceções

- Decisões pequenas, reversíveis com 1 PR.
- Convenção de nome.
- Detalhe interno de implementação que não cruza fronteiras.
