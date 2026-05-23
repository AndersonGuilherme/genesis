---
name: lgpd-explicit-consent
description: Consentimento livre, informado, inequívoco e específico por finalidade. Registrado com timestamp + versão de texto. Revogável a qualquer momento. LGPD art. 8.
phase: lgpd
---

# Rule: lgpd-explicit-consent

## Princípio

Consent é por finalidade específica, não bloco genérico. Capturado com ação afirmativa (checkbox desmarcado por default). Registrado com: `user_id`, `purpose`, `text_version`, `timestamp`, `ip`, `granted: bool`. Revogação tem mesmo peso da coleta.

## Por que existe

LGPD art. 8 §1º exige consentimento "livre, informado e inequívoco". Sem registro auditável, organização não consegue provar que coletou consent legítimo (ônus da prova é do controlador). Consent genérico ("aceito tudo") é nulo perante ANPD.

## Como aplicar

1. Cada finalidade = consent separado: cadastro, marketing, compartilhamento com parceiro, cookie analytics. Não agrupar.
2. UI: checkbox **desmarcado** por default. Texto curto + link pra política completa.
3. Backend grava evento `consent.granted` ou `consent.revoked` em store auditável (append-only).
4. Versão do texto de consent é versionada (hash do conteúdo). Mudança de texto exige reconsent.
5. Endpoint `/user/consents` lista consents ativos do user com botão revogar.
6. Revogação imediata: dado parado de ser tratado pra aquela finalidade no próximo request (max latência: 24h pra batch jobs).

## Exemplos bons

- Cadastro: checkbox "Concordo com tratamento de dados pra prestação do serviço" + separado "Quero receber novidades por email" (opt-in marketing).
- Tabela `consents` com `(user_id, purpose, version, granted_at, revoked_at)`.
- Email de boas-vindas só dispara se `marketing` consent = granted.

## Exemplos ruins

- "Ao usar o site, você concorda com tudo" — coercitivo, não livre.
- Checkbox pré-marcado.
- Consent único agrupando "cadastro + marketing + parceiros".
- Revogação que exige email pra suporte (não é imediato nem auditável).

## Exceções

- Finalidades com base legal diferente (cumprimento de obrigação legal, execução de contrato, legítimo interesse) não exigem consent. Mas devem ser documentadas em data-inventory com base legal correta.
- Dado de criança/adolescente: consent do responsável (art. 14).

