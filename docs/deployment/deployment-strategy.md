# Deployment strategy

> Como subimos código em produção sem derrubar o produto. Defina estratégia antes da primeira release.

## Princípios

1. **Deploy frequente reduz risco.** Quanto menor a unidade entregue, menos surpresa.
2. **Rollback é direito, não privilégio.** Toda release precisa de plano de volta.
3. **Migração separada de release.** Não acoplar mudança de schema com release de feature.
4. **Sem janela de manutenção como regra.** Janela é exceção justificada.

## Estratégia de release

Escolha 1 (ou combinação):

- [ ] **Rolling** — substituir instâncias gradualmente. Simples, bom default.
- [ ] **Blue/green** — duas pilhas paralelas, trocar tráfego. Bom para rollback rápido.
- [ ] **Canary** — % pequeno do tráfego primeiro, escalar se métricas ok.
- [ ] **Feature flag** — release técnica desacoplada de release de feature. Recomendado para tudo arriscado.

**Padrão deste projeto:** _(combinar rolling + feature flag, p.ex.)_

## Versionamento

- Semantic versioning para artefatos publicados (`MAJOR.MINOR.PATCH`)
- Build identificado por SHA do git + número da release
- Tags imutáveis no registry

## Migração de banco

- Migrações têm sempre 2 etapas separáveis: **expandir** (add coluna, criar tabela) e **contrair** (remover legado).
- Nunca renomear coluna em uma única migração. Use:
  1. Adicionar nova
  2. Backfill
  3. App lê e escreve nova
  4. Remover antiga
- Migração destrutiva exige revisão extra + ADR.

## Feature flags

- Toda feature nova de risco entra atrás de flag.
- Flag morre depois de N semanas em produção (definir cleanup).
- Ferramenta: _(definir — Unleash, Flipt, Statsig, ConfigCat, ou solução simples)_

## Rollback

- Toda release tem botão de rollback documentado
- Tempo alvo de rollback: _(ex.: 5 min)_
- Rollback de banco: usar migração reversa testada, não restore do dump

## Janela de deploy

- Padrão: qualquer horário comercial
- Sextas após 16h: apenas hotfix
- Feriado: bloqueado salvo emergência

## Critérios para promover

Para subir de staging para produção:

- [ ] Smoke test verde
- [ ] Métricas estáveis há 30 min em staging
- [ ] Plano de rollback escrito
- [ ] Owner do deploy designado

## Plano de release típico

| Etapa | Ação | Responsável |
|-------|------|-------------|
| T-1 dia | Migração expand em produção | DBA / dev |
| T0 | Deploy do código novo (rolling) | dev de release |
| T+10 min | Validar métricas e funcional | dev de release |
| T+1 hora | Ativar feature flag para 10% | product |
| T+1 dia | Ativar para 100% se métricas ok | product |
| T+N dias | Migração contract (limpeza) | DBA / dev |

## Pós-deploy

- Atualizar [PROJECT_STATE.md](../PROJECT_STATE.md) se release significativa
- Atualizar changelog
- Comunicar usuários quando relevante

## Disaster recovery

- RPO e RTO definidos em [../architecture/data-strategy.md](../architecture/data-strategy.md)
- Teste de restore: mensal
- Game day: trimestral (quando time tiver maturidade)
