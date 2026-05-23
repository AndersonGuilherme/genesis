---
name: lgpd-data-subject-rights-handler
description: Define endpoints + fluxos pra titular exercer direitos do art. 18 (acesso, retificação, exclusão, portabilidade, revogação). SLA 15 dias. Produz `docs/security/lgpd/subject-rights.md`.
phase: lgpd
rules:
  - lgpd-subject-rights-respected
  - lgpd-explicit-consent
  - sec-authn-required
  - sec-audit-trail
---

# Skill: lgpd-data-subject-rights-handler

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Produzir `docs/security/lgpd/subject-rights.md` com endpoints, fluxos, SLA e processo manual pra exceções.

## Quando usar

- Antes de go-live (sem isso, sistema não pode operar com PII em produção).
- Ao adicionar canal novo de relacionamento (mobile app, API B2B).
- Em auditoria.

## Pré-condições

- `docs/security/lgpd/data-inventory.md` preenchido (sabemos o que retornar em export).
- `docs/security/auth-strategy.md` define authn pra endpoints.
- Template `.genesis/templates/privacy-notice-template.md` cita os direitos.

## Processo

1. Mapear cada direito do art. 18 LGPD → endpoint/fluxo:
   - Confirmação de tratamento → `GET /me/data-summary`.
   - Acesso → `GET /me/data` (export JSON/CSV).
   - Retificação → `PATCH /me/data` ou UI de perfil.
   - Anonimização/bloqueio/eliminação → `DELETE /me/account` + processo de bloqueio temporário.
   - Portabilidade → export estruturado em formato comum (JSON com schema documentado).
   - Informação sobre compartilhamento → `GET /me/data-sharing` (lista parceiros).
   - Revogação de consent → `GET /me/consents` + `DELETE /me/consents/:id`.
   - Revisão de decisão automatizada (se aplicável) → endpoint específico + processo manual.
2. Verificação reforçada antes de delete/export sensível: re-autenticação ou OTP.
3. SLA: 15 dias corridos. Dashboard mostra requests pendentes + idade. Alerta D-3.
4. Audit log de cada exercício.
5. Processo manual pra exceção (titular sem conta, requisição via DPO email).
6. Privacy notice cita endpoints + processo.
7. Preencher `docs/security/lgpd/subject-rights.md`.

## Restrições

- Delete que não deleta PII de fato é violação.
- Export que ignora dados relacionados (em outras tabelas/services) é incompleto.
- Sem reautenticação antes de delete = vetor de account takeover.

## Exemplos de uso

- "Implementar direitos do titular no tchr."
- "Mobile app precisa expor os mesmos direitos — planejar."

## Critérios de conclusão

- [ ] Cada direito do art. 18 mapeado pra endpoint ou processo.
- [ ] Verificação reforçada pra delete/export sensível.
- [ ] SLA + monitoramento definidos.
- [ ] Audit log definido.
- [ ] Processo manual pra exceção documentado.
- [ ] `docs/security/lgpd/subject-rights.md` completo.
