---
name: review-readiness
description: Use para checar se o projeto pode iniciar implementação. Roda scripts/check-readiness.sh e revisa qualitativamente. Bloqueia código quando falta documentação essencial.
---

# Skill: review-readiness

## Objetivo

Ser o **portão final** antes de qualquer linha de código de aplicação. Roda checagem automática + revisão qualitativa.

## Quando usar

- Sempre que o usuário pedir para "começar a implementar".
- Periodicamente para garantir que documentação não regredia.
- Antes de cada release relevante.

## Entradas esperadas

- Repositório completo (docs/, .claude/, etc.).
- Script `scripts/check-readiness.sh` presente.

## Processo passo a passo

1. Rodar `bash scripts/check-readiness.sh`.
2. Coletar saída e exit code.
3. Verificar qualitativamente cada item:
   - Documento existe **e tem conteúdo real** (não placeholder copiado).
   - ADRs principais criados.
   - Spec do módulo a implementar pronta.
4. Verificar premissas críticas em [docs/research/assumptions.md](../../../docs/research/assumptions.md) — alguma com confiança 1 e impacto fatal ainda aberta?
5. Verificar perguntas em aberto [docs/research/open-questions.md](../../../docs/research/open-questions.md) — alguma crítica ainda aberta?
6. **Decidir:** liberar ou bloquear.
7. Se bloquear, produzir relatório com:
   - O que falta
   - Onde está faltando
   - Qual skill recuperar (`init-project`, `discover-business`, etc.)
8. Se liberar, indicar a próxima skill (`start-development`).

## Checklist de readiness

### Negócio e produto
- [ ] `docs/product/product-vision.md` preenchido
- [ ] `docs/product/problem-statement.md` preenchido com evidências
- [ ] `docs/product/target-users.md` com persona primária clara
- [ ] `docs/product/mvp-scope.md` com IN/OUT e critério de sucesso
- [ ] `docs/business/business-model.md` preenchido
- [ ] `docs/business/monetization.md` com fontes de receita
- [ ] `docs/business/risks.md` com pelo menos 5 riscos

### Arquitetura
- [ ] `docs/architecture/architecture-overview.md` com C4 nível 1 e 2
- [ ] `docs/architecture/technology-decision.md` com decisão + ADR
- [ ] `docs/architecture/integration-map.md` listando externos críticos
- [ ] `docs/architecture/data-strategy.md` com multi-tenancy e retenção
- [ ] `docs/architecture/observability-strategy.md` preenchido

### Segurança
- [ ] `docs/security/security-requirements.md` com checklist mínimo
- [ ] `docs/security/auth-strategy.md` preenchida
- [ ] `docs/security/data-privacy.md` com inventário inicial de PII

### Testes
- [ ] `docs/testing/testing-strategy.md` definida
- [ ] `docs/testing/acceptance-criteria.md` lido
- [ ] `docs/testing/quality-gates.md` definida

### Módulos e specs
- [ ] `docs/modules/README.md` lista os módulos do MVP
- [ ] Spec do **primeiro módulo a implementar** completa
- [ ] Implementation plan do mesmo módulo criado

### Deploy
- [ ] `docs/deployment/deployment-strategy.md` definida
- [ ] `docs/deployment/environments.md` definida

### Pesquisa
- [ ] Premissas fatais com plano de validação (mesmo que ainda em andamento)
- [ ] Sem perguntas críticas em aberto sem responsável

## Documentos que cria ou atualiza

- `docs/PROJECT_STATE.md` (atualizar readiness)
- Relatório qualitativo (output da skill, opcional persistir como `docs/validation/readiness-<data>.md`)

## Critérios de "aprovado"

- `check-readiness.sh` retorna `0`
- Nenhuma premissa fatal aberta sem plano de validação
- Spec + plano do primeiro módulo OK
- Estratégias de segurança, observabilidade, testes definidas

## Critérios de "bloqueado"

- Qualquer um dos itens do checklist falhando

## Restrições

- **Não liberar** desenvolvimento se faltar algo essencial — mesmo sob pressão.
- Não inventar OK. Olhar o conteúdo, não só o nome do arquivo.
- Não aceitar template não-preenchido como "preenchido".

## Exemplos de uso

- "Posso começar a implementar?"
- "Check de readiness."
- "Estamos prontos pro código?"
