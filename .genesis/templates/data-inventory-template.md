# Data Inventory (ROPA): <nome-do-sistema>

> Aplicado pela skill `lgpd-data-inventory`. Cumpre o art. 37 da LGPD (Registro de Operações de Tratamento).
> Mantido vivo: cada PR que toca PII atualiza este arquivo.

## Resumo

- **Controlador**: <razão social + CNPJ>
- **Encarregado (DPO)**: <nome + email público>
- **Última revisão**: <YYYY-MM-DD por NOME>
- **Próxima revisão**: <YYYY-MM-DD>

## Tabela de operações de tratamento

| ID | Finalidade | Categorias de dado | Categorias de titular | Base legal | Retenção | Compartilhamento | Transferência internacional | Sensível |
|----|-----------|-------------------|---------------------|-----------|----------|-----------------|----------------------------|:--------:|
| OP-01 | Cadastro e autenticação | nome, email, password_hash | aluno, professor | execução de contrato | enquanto conta ativa + 6 meses | — | — | ✗ |
| OP-02 | Emissão de NF-e | nome, CPF, endereço | aluno pagante | obrigação legal (NF-e) | 5 anos (fiscal) | contador externo (DPA) | — | ✗ |
| OP-03 | Comunicação transacional (email/SMS) | email, phone | aluno, professor | execução de contrato | enquanto conta ativa | Sendgrid (DPA), Twilio (DPA) | sim — EUA, SCC | ✗ |
| OP-04 | Marketing por email | email, nome | aluno, lead | consent | até revogação ou 2 anos sem interação | Sendgrid (DPA) | sim — EUA, SCC | ✗ |
| OP-05 | Comportamental (analytics) | session_id, page_view, evento (sem PII direta) | qualquer visitante | legítimo interesse | 13 meses (agregado depois) | Mixpanel (DPA) | sim — EUA, SCC | ✗ |
| OP-06 | Decisão automatizada (scoring) | histórico de pagamento, comportamento | aluno | legítimo interesse + direito de revisão | enquanto conta ativa + 1 ano | — | — | ✗ |
| OP-07 | Avaliação de saúde (módulo bem-estar) | sintomas, condições | aluno | consent específico (art. 11) | até revogação | profissional médico contratado (DPA) | — | ✓ |

## Detalhamento por operação

### OP-01 — Cadastro e autenticação

- **Descrição**: criação de conta + login.
- **Fluxo**: form → validação → hash → persiste em `users` → emite token.
- **Salvaguardas técnicas**: encryption at-rest (RDS), hash bcrypt cost 12, audit log.
- **Salvaguardas organizacionais**: acesso a `users` restrito por role.
- **Direitos do titular**: acesso (`GET /me/data`), retificação (`PATCH /me/data`), eliminação (`DELETE /me/account`).
- **Risco residual**: account takeover via reset de senha — mitigado por 2FA opcional.

<!-- Repetir bloco por operação -->

## Glossário (campos PII)

| Campo | Definição | Sensível? |
|-------|-----------|:---------:|
| `email` | endereço de email do titular | ✗ |
| `cpf` | Cadastro de Pessoa Física | ✗ (mas regulado por LGPD com cuidado) |
| `health_condition` | condição de saúde declarada | ✓ |
| ... | ... | ... |

## Mudanças relevantes (histórico)

| Data | Mudança | Responsável |
|------|---------|-------------|
| <YYYY-MM-DD> | Adicionada OP-07 (módulo bem-estar) | DPO |
| <YYYY-MM-DD> | Removido campo `birthdate` (sem finalidade ativa) | DPO |

## Referências

- LGPD art. 37 (registro de operações).
- Resolução CD/ANPD nº 2/2022 (ROPA simplificado pra pequeno porte).
- `docs/security/lgpd/consent-strategy.md`
- `docs/security/lgpd/retention-policy.md`
- `docs/security/lgpd/vendor-dpa.md`
