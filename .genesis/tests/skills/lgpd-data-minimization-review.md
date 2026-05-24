# Tests: lgpd-data-minimization-review

## Pré-condição
- `docs/security/lgpd/data-inventory.md` preenchido.
- Schema do banco/entidades acessíveis.

## Prompts canônicos
- "auditoria de minimização"
- "campos PII sem justificativa"
- "review semestral LGPD"

## Comportamentos esperados
- [ ] Lista todos os campos PII no banco/entidades.
- [ ] Cruza com data-inventory (entry existe?).
- [ ] Identifica campos sem finalidade ativa (feature cortada, finalidade obsoleta).
- [ ] Propõe ação (remover, anonimizar, justificar).
- [ ] Gera relatório `docs/security/lgpd/minimization-review-<YYYY-MM>.md`.

## Anti-padrões
- [ ] NÃO propõe deletar dado em produção sem aprovação DPO.
- [ ] NÃO confunde soft delete com anonimização.
- [ ] NÃO ignora campos em JSON blobs (`metadata: {...}`).
