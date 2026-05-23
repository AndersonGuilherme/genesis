---
name: ops-setup-cd-pipeline
description: Configura CD com gates (canary, manual approval em prod), rollback automático e estratégia de deployment justificada. Produz workflow + runbook.
phase: operations
rules:
  - ops-rollback-tested
  - ops-no-prod-debug-flag
  - ops-runbook-required
---

# Skill: ops-setup-cd-pipeline

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Pipeline CD que entrega versão nova com gates, observabilidade ativa e rollback automático se métrica-chave degradar.

## Quando usar

- Após CI estável (ops-setup-ci-pipeline).
- Antes de primeiro deploy em produção.
- Ao mudar estratégia de deploy.

## Pré-condições

- CI verde + artefato versionado.
- `docs/deployment/deployment-strategy.md` escolhida (`ops-define-deployment-strategy`).
- Observabilidade mínima ativa (`ops-define-observability`).
- Template `.genesis/templates/runbook-template.md` disponível.

## Processo

1. Estágios CD:
   - Deploy em staging (auto após CI verde em main).
   - Smoke test em staging (auto).
   - Deploy em canary (auto, 5-10% tráfego).
   - Validação de canary (auto: error rate, latência, custom metrics).
   - Promoção pra full rollout (manual ou auto se gates OK).
2. Estratégia: blue-green, canary, rolling — conforme `deployment-strategy.md`.
3. Rollback automático: SLO burn rate alto em janela curta → rollback sem intervenção.
4. Approval manual pra produção em release de alta exposição (release de marketing, mudança de schema).
5. Audit log do deploy: actor, commit sha, timestamp, resultado, métricas pós.
6. Runbook de deploy + rollback no módulo.
7. Documentar em `docs/deployment/cd-pipeline.md`.

## Restrições

- Sem deploy direto em produção sem passar por staging + canary.
- Sem rollback manual exclusivo (sempre ter automação como rede).
- Sem deploy fora de janela definida (a menos que hotfix declarado).
- Migration de schema separada do deploy de código quando viável.

## Exemplos de uso

- "Configurar CD canary do tchr."
- "Migrar de deploy manual para CD com gates."

## Critérios de conclusão

- [ ] Staging auto-deployed em main verde.
- [ ] Canary com validação automática.
- [ ] Rollback automático configurado.
- [ ] Approval gate pra prod (quando aplicável).
- [ ] Audit log do deploy.
- [ ] Runbook completo.
- [ ] `docs/deployment/cd-pipeline.md` completo.
