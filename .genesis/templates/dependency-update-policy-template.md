# Dependency Update Policy — <nome-do-sistema>

> Aplicado pela skill `maint-dependency-update`. Define cadência, triage e SLA pra updates de dependência.

## Identificação

- **Última revisão**: <YYYY-MM-DD>
- **Próxima revisão**: <YYYY-MM-DD (semestral)>
- **Tooling**: <Renovate | Dependabot | scheduled job customizado>

## Cadência

| Tipo de update | Cadência | Triage |
|----------------|----------|--------|
| Patch (`x.y.Z`) | Semanal | Auto-merge se CI verde + sem changelog breaking |
| Minor (`x.Y.z`) | Quinzenal | Review changelog, merge se sem breaking |
| Major (`X.y.z`) | Mensal ou sob demanda | Review profundo, plan migration, testar manualmente |
| Security patch | Imediato (SLA `maint-security-patch-sla`) | Priorizar acima de feature |

## SLA por severidade de CVE

| Severidade (CVSS) | SLA | Bloqueia release? |
|-------------------|-----|:-----------------:|
| CRITICAL (≥ 9.0) | ≤ 24h | ✓ |
| HIGH (7.0-8.9) | ≤ 7 dias | ✓ |
| MEDIUM (4.0-6.9) | ≤ 30 dias | ☐ |
| LOW (< 4.0) | ≤ 90 dias | ☐ |

## Configuração do tooling

### Renovate (exemplo)

```json
{
  "extends": ["config:base"],
  "schedule": ["before 6am on Monday"],
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "automerge": true,
      "automergeType": "branch"
    },
    {
      "matchUpdateTypes": ["minor"],
      "automerge": false,
      "labels": ["dep-update:minor"]
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["dep-update:major", "requires-review"]
    },
    {
      "matchPackagePatterns": ["security"],
      "labels": ["security", "high-priority"],
      "prPriority": 10
    }
  ],
  "vulnerabilityAlerts": {
    "labels": ["security", "blocking"],
    "automerge": false,
    "schedule": ["at any time"]
  }
}
```

### Dependabot (exemplo)

```yaml
version: 2
updates:
  - package-ecosystem: <npm | pip | gomod>
    directory: "/"
    schedule:
      interval: weekly
    groups:
      patches:
        update-types: [patch]
    labels:
      - dep-update
```

## Processo de triage

### Patch
1. PR aberto pelo tooling.
2. CI roda automaticamente.
3. Se verde + sem breaking no changelog → auto-merge.
4. Se falha → revisar, ajustar, manual merge.

### Minor
1. PR aberto pelo tooling.
2. Review do changelog (breaking changes, deprecações).
3. CI verde.
4. Smoke test em staging.
5. Merge.

### Major
1. PR aberto manualmente ou pelo tooling com label `requires-review`.
2. Review do migration guide do upstream.
3. Avaliar custo de migração.
4. Testar em branch isolada com paridade de prod.
5. Se OK → merge + monitorar pós-deploy.
6. Se quebrante demais → adiar + abrir issue com plano.

### Security patch (CVE)
1. Notificação chega (Renovate vulnerabilityAlerts, GitHub Security Advisory).
2. Classificar severidade conforme CVSS.
3. SLA acima.
4. Se CRITICAL → war room mini, patch ASAP.
5. Patch + teste + smoke + canary + full.
6. Comunicar interno se mudança comportamental.
7. Atualizar `docs/maintenance/cve-history.md`.

## Bloqueio de deploy

CI bloqueia deploy se:
- CRITICAL ou HIGH CVE em dep ativa.
- Lockfile inconsistente.
- Dep desatualizada > N meses sem justificativa documentada.

## Auditoria mensal

Mensal, verificar:
- Deps desatualizadas > 6 meses (por que?).
- Deps com licença incompatível.
- Deps abandonadas (sem commit > 1 ano).
- SLA de CVE atendido?

## Substituição de dep abandonada

Quando dep abandonada vira risco:
1. Avaliar alternativas (3+ opções).
2. Ponto de migração + custo.
3. Plano em ADR.
4. Migração incremental quando possível.

## Métricas

- Tempo médio entre patch upstream e merge.
- CVEs abertos por idade.
- % SLA cumprido.
- Updates feitos / atrasados por mês.

Painel em <link dashboard>.

## Histórico de mudanças

| Data | Mudança | Motivo |
|------|---------|--------|
| <YYYY-MM-DD> | SLA de HIGH reduzido de 14d pra 7d | Auditoria interna de segurança |
