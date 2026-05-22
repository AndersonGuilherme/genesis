---
name: design-architecture
description: Use após choose-stack. Define arquitetura de alto nível, integrações, dados, segurança, escalabilidade, observabilidade, deploy e ambientes. Termina com docs/architecture/* completos.
---

# Skill: design-architecture

## Objetivo

Sair da escolha de stack para uma arquitetura desenhada: containers, fronteiras, integrações, eventos, dados, segurança, observabilidade e deploy.

## Quando usar

- Após `choose-stack` concluir com ADR de stack.
- Antes de `plan-modules`.
- Para revisar arquitetura quando o produto cruzar marco de escala.

## Entradas esperadas

- `docs/architecture/technology-decision.md`
- `docs/product/mvp-scope.md`
- `docs/business/business-model.md`
- `docs/security/security-requirements.md` (rascunho)

## Processo passo a passo

1. Esboçar **system context** (Nível 1 do C4-lite).
2. Esboçar **containers** (Nível 2).
3. Esboçar **componentes principais** (Nível 3) por container chave.
4. Definir **integrações externas** com criticidade e fallback.
5. Definir **estratégia de dados** (modelagem, multi-tenancy, retenção, backups).
6. Definir **estratégia de auth** (alimentado por `map-users`).
7. Definir **estratégia de eventos** (quem emite, quem consome, esquema).
8. Definir **estratégia de cache, fila, jobs**.
9. Definir **estratégia de observabilidade** (logs, métricas, traces, alertas).
10. Definir **estratégia de deploy** e **ambientes**.
11. Listar **ADRs** que sustentam decisões.
12. Atualizar PROJECT_STATE.
13. Sugerir próxima skill: `plan-modules`.

## Perguntas guia

1. **Visão geral** — qual o desenho de alto nível? (mono / mono modular / microserviços?)
2. Quais **sistemas externos críticos**?
3. Qual o **modelo multi-tenant**? (pool / bridge / silo)
4. Quais **eventos** o sistema vai emitir?
5. Há **jobs assíncronos** importantes? Quais?
6. Como tratamos **idempotência**?
7. Qual o **modelo de cache**?
8. Qual a **estratégia de logs e métricas**?
9. Como **deployamos**? Rolling? Blue/Green? Canary? Feature flag?
10. Quais **ambientes** existem?
11. Como tratamos **segredos**?
12. Como tratamos **backups** e **disaster recovery**?
13. Quais requisitos de **LGPD/privacidade** impactam a arquitetura?

## Documentos que cria ou atualiza

- `docs/architecture/architecture-overview.md`
- `docs/architecture/system-context.md`
- `docs/architecture/integration-map.md`
- `docs/architecture/data-strategy.md`
- `docs/architecture/scalability-strategy.md`
- `docs/architecture/observability-strategy.md`
- `docs/security/security-requirements.md`
- `docs/security/auth-strategy.md`
- `docs/security/data-privacy.md`
- `docs/deployment/deployment-strategy.md`
- `docs/deployment/environments.md`
- `docs/deployment/ci-cd.md`
- `docs/operations/monitoring.md`
- `docs/operations/logging.md`
- `docs/operations/incident-response.md`
- ADRs para decisões críticas

## Critérios de conclusão

- [ ] C4 níveis 1 e 2 esboçados
- [ ] Integrações externas registradas
- [ ] Estratégia de dados, eventos, cache, fila documentadas
- [ ] Estratégia de observabilidade documentada
- [ ] Estratégia de deploy + ambientes documentadas
- [ ] Pelo menos 3 ADRs estruturais criados

## Restrições

- Recusar overengineering. Se o usuário pedir microserviços no dia 1 sem justificativa, propor monolito modular.
- Não definir tecnologia que não está no `technology-decision.md`. Se precisar, voltar e atualizar lá + ADR.
- Não pular auth ou observabilidade.

## Exemplos de uso

- "Vamos desenhar a arquitetura."
- "Como estruturamos a parte de pagamentos e marketplace?"
- "Precisamos de microserviços?"
