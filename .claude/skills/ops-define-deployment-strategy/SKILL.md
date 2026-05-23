---
name: ops-define-deployment-strategy
description: Escolhe estratégia de deploy (rolling, blue-green, canary) com justificativa por trade-off. Produz `docs/deployment/deployment-strategy.md`.
phase: operations
rules:
  - ops-rollback-tested
  - ops-runbook-required
---

# Skill: ops-define-deployment-strategy

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Escolha justificada de estratégia de deploy + procedimentos canônicos + runbook.

## Quando usar

- Antes de primeiro deploy em produção.
- Ao mudar runtime/orquestrador (k8s → ECS, etc.).
- Ao identificar limitação da estratégia atual.

## Pré-condições

- Runtime/orquestrador escolhido (ECS, k8s, Lambda, App Runner, etc.).
- CI funcionando (cross-link `ops-setup-ci-pipeline`).
- Template `.genesis/templates/runbook-template.md` disponível.

## Processo

1. Avaliar 3 estratégias com trade-offs:
   - **Rolling**: simples, sem overhead de capacidade. Bom pra mudanças backward-compatible.
   - **Blue-green**: switch instantâneo, rollback rápido. Custo 2x infra durante transição.
   - **Canary**: rollout gradual, validação por amostra. Exige observability boa + métrica de qualidade.
2. Recomendar baseado em: maturidade de observability, volume de tráfego, custo aceitável, risco de mudança.
3. Definir gates (qual métrica autoriza próximo step do canary).
4. Estratégia de migration de schema (separada do deploy de código, expand-contract preferido).
5. Janelas de deploy aceitáveis (evitar pico de tráfego se possível).
6. Procedimento de hotfix (atalho controlado pra urgência).
7. Documentar em `docs/deployment/deployment-strategy.md` + runbook de deploy/rollback.

## Restrições

- Sem deploy direto em prod sem staging.
- Sem canary sem métrica de validação.
- Sem migration acoplada a deploy de código quando há risco.
- Sem deploy em sexta tarde sem motivo (folclore mas economiza dor).

## Exemplos de uso

- "Definir deployment strategy do tchr (ECS)."
- "Migrar de rolling pra canary após maturidade de observability."

## Critérios de conclusão

- [ ] 3 estratégias avaliadas com trade-off.
- [ ] Recomendação justificada.
- [ ] Gates definidos.
- [ ] Migration strategy resolvida.
- [ ] Janela + hotfix definidos.
- [ ] Runbook de deploy + rollback.
- [ ] `docs/deployment/deployment-strategy.md` completo.
