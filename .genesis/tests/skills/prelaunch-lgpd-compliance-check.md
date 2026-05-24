# Tests: prelaunch-lgpd-compliance-check

## Pré-condição
- Skills `lgpd-*` executadas (`docs/security/lgpd/*` preenchido).
- Sistema buildado em staging.

## Prompts canônicos
- "lgpd compliance check"
- "validar conformidade LGPD pré-launch"
- "checklist lgpd antes de lançar"

## Comportamentos esperados
- [ ] ROPA reflete realidade do código (campos PII = entries).
- [ ] Consent: UI testada, tabela `consents`, endpoint revogação, audit log.
- [ ] Retention: job rodando, backup respeitando, restore drill validado.
- [ ] Endpoints `/me/*` funcionando + SLA monitorado + reautenticação em delete.
- [ ] Encryption: PII at-rest + sensível com KMS.
- [ ] DPAs assinados + privacy notice menciona transferência internacional.
- [ ] DPIA pra operações de alto risco preenchida.
- [ ] DPO definido + canal público + privacy notice publicada.
- [ ] Produz `docs/launch/lgpd-compliance-check.md` com go/no-go.

## Anti-padrões
- [ ] NÃO aceita ROPA desatualizado.
- [ ] NÃO aceita DPO ausente.
- [ ] NÃO aceita privacy notice ausente.
- [ ] NÃO aceita DPA crítico não assinado.
