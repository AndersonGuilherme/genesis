---
name: lgpd-subject-rights-respected
description: Endpoints e processos para titular exercer acesso, retificação, exclusão, portabilidade, revogação. Resposta em prazo legal (15 dias). LGPD art. 18.
phase: lgpd
---

# Rule: lgpd-subject-rights-respected

## Princípio

Sistema implementa todos os direitos do titular do art. 18 LGPD: confirmação de tratamento, acesso aos dados, retificação, anonimização/bloqueio/eliminação, portabilidade, informação sobre compartilhamento, revogação de consent. Endpoint público autenticado expõe cada um. SLA: 15 dias corridos pra resposta.

## Por que existe

Direitos do titular são pilar central da LGPD. ANPD recebe reclamação quando titular não consegue exercer. Sem endpoint, ônus operacional vira email manual com risco de erro humano (vazar dado pra impostor) e atraso. Automação reduz risco + atende SLA.

## Como aplicar

1. Endpoints autenticados (REST/GraphQL):
   - `GET /me/data` — export estruturado (JSON/CSV) com tudo que o sistema tem do user.
   - `PATCH /me/data` — retificação de campo específico (sujeita a validação).
   - `DELETE /me/account` — eliminação ou anonimização (conforme política).
   - `GET /me/consents` + `DELETE /me/consents/:id` — listar e revogar.
   - `GET /me/data-sharing` — lista parceiros que receberam o dado.
2. Verificação reforçada antes de delete/export: re-autenticação ou confirmação via email/SMS (defesa contra account takeover).
3. SLA configurado: dashboard mostra pending requests + idade. Alerta em D-3 do prazo.
4. Audit log de cada exercício: `(user_id, right_exercised, timestamp, processed_by, latency)`.
5. Processo manual de exceção (titular sem conta ativa) documentado em runbook.

## Exemplos bons

- `/me/data` retorna JSON com todos os campos persistidos do user + descrição da finalidade.
- `DELETE /me/account` faz: anonimiza PII, mantém referências necessárias (NF emitidas), envia confirmação por email.
- Dashboard mostra "5 requests de export pendentes, mais antigo: 3 dias".

## Exemplos ruins

- "Solicite por email pra suporte" — sem automação, sem SLA, sem audit.
- Delete que faz soft delete e mantém PII na tabela.
- Export que retorna só campos da tabela `users`, ignorando relacionados (orders, logs, comments).
- Sem reautenticação antes de delete (impersonação destrói conta).

## Exceções

- Dado retido por obrigação legal (fiscal): explicar ao titular no momento da solicitação, manter o campo legalmente exigido, deletar o resto.
- Account compartilhada (B2B com multiplos users): processo específico documentado.

