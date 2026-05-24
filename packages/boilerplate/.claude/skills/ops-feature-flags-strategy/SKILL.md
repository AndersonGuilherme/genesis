---
name: ops-feature-flags-strategy
description: Define como flags são criadas, nomeadas, ramped e removidas. Evita "flag debt". Permite rollout gradual + kill switch. Produz `docs/operations/feature-flags.md`.
phase: operations
rules:
  - ops-rollback-tested
  - ops-no-prod-debug-flag
---

# Skill: ops-feature-flags-strategy

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Estratégia de feature flags que permite rollout gradual, kill switch e A/B test sem virar dívida técnica.

## Quando usar

- Antes do primeiro rollout gradual.
- Ao adotar provider de flag novo.
- Em auditoria de flag debt.

## Pré-condições

- Provider escolhido (LaunchDarkly, Unleash, GrowthBook, ConfigCat, Flagsmith) ou build próprio simples.

## Processo

1. Tipos de flag:
   - **Release flag** (curta vida, ramped, removida pós-100%).
   - **Operational flag** (kill switch, permanente).
   - **Permission flag** (controle de acesso por user/segmento).
   - **Experiment flag** (A/B test, mata após análise).
2. Convenção de nome: `<tipo>.<modulo>.<feature>` (`release.billing.new-checkout`).
3. Cada flag tem:
   - Owner (pessoa/squad).
   - Tipo + propósito.
   - Data de criação + deadline de remoção (release/experiment).
   - Default value (off em prod, on em dev).
   - Plano de rollout (5% → 25% → 50% → 100%).
   - Plano de remoção (PR programado quando 100%).
4. Auditoria mensal: flags vencidas → remover ou justificar.
5. Limite: máximo de X% flags ativas (ex.: 5% do código atrás de flag). Acima = debt.
6. Audit log de mudança de flag (quem, quando, valor).
7. Documentar em `docs/operations/feature-flags.md`.

## Restrições

- Sem flag sem owner.
- Sem flag de release sem deadline de remoção.
- Sem flag operacional sem documentação do que faz quando ativada.
- Sem rollback dependendo APENAS de flag (deploy precisa também ser revertível).

## Exemplos de uso

- "Configurar feature flags strategy do tchr (LaunchDarkly)."
- "Limpar flag debt — listar flags > 90 dias."

## Critérios de conclusão

- [ ] Provider escolhido + integrado.
- [ ] Convenção de nome definida.
- [ ] Política de owner + deadline.
- [ ] Audit log de mudança.
- [ ] Limite de flag debt.
- [ ] Revisão mensal agendada.
- [ ] `docs/operations/feature-flags.md` completo.
