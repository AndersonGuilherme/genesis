---
name: prelaunch-lgpd-compliance-check
description: Checklist final de LGPD antes do go-live. Cruza outputs lgpd-* com código/infra. Bloqueia launch se gap crítico.
phase: pre-launch
rules:
  - prelaunch-gate-complete
  - lgpd-data-minimization
  - lgpd-explicit-consent
  - lgpd-purpose-limitation
  - lgpd-retention-limit
  - lgpd-subject-rights-respected
  - lgpd-pii-encrypted
  - lgpd-international-transfer-rule
  - lgpd-processing-registry
---

# Skill: prelaunch-lgpd-compliance-check

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Validar que conformidade LGPD definida nas skills `lgpd-*` está implementada. Lista gaps bloqueantes.

## Quando usar

- Antes da reunião go/no-go.
- Após adicionar feature que toca PII pós-launch.
- Em auditoria interna ou preparação pra fiscalização ANPD.

## Pré-condições

- Skills `lgpd-*` executadas (`docs/security/lgpd/*` preenchido).
- Sistema buildado e em staging com paridade de prod.

## Processo

1. ROPA (`data-inventory.md`) reflete realidade do código? Cada PII coletada tem entry?
2. Consent: UI implementada, tabela `consents`, endpoint revogação, audit log? Mockup OK?
3. Retenção: job rodando, last execution OK, backup respeitando, restore drill validado?
4. Direitos do titular: endpoints `/me/*` funcionando, SLA monitorado, reautenticação ativa em delete?
5. Encryption: PII at-rest + sensível com camada extra + chave em KMS?
6. Transferência internacional: providers listados, DPAs assinados, privacy notice menciona?
7. ROPA exportável pra PDF (script funcional)?
8. DPIA pra operações de alto risco preenchida e aprovada?
9. Plano de notificação de incidente publicado, contatos atualizados?
10. DPO definido + canal público de contato funcionando?
11. Privacy notice atualizada, versionada, acessível em todo canal?
12. Documentar resultado em `docs/launch/lgpd-compliance-check.md`.

## Restrições

- Bloqueante: ROPA vazio/desatualizado, sem endpoint de direitos, sem encryption PII, DPA crítico não assinado.
- DPO ausente = bloqueante.
- Privacy notice ausente = bloqueante.

## Exemplos de uso

- "Rodar LGPD compliance check do tchr."
- "Re-validar após adicionar módulo de saúde."

## Critérios de conclusão

- [ ] ROPA validado contra código.
- [ ] Consent implementado e testado.
- [ ] Retenção operacional.
- [ ] Direitos do titular acessíveis.
- [ ] Encryption + transfer + DPAs OK.
- [ ] DPIA + plano de incidente publicados.
- [ ] DPO + privacy notice operacionais.
- [ ] `docs/launch/lgpd-compliance-check.md` completo com go/no-go.
