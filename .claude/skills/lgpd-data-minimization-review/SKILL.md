---
name: lgpd-data-minimization-review
description: Auditoria de campos PII coletados — cada um tem finalidade justificada? Remove o que não tem. Use em revisão semestral ou após cortar feature.
phase: lgpd
rules:
  - lgpd-data-minimization
  - lgpd-purpose-limitation
  - lgpd-processing-registry
---

# Skill: lgpd-data-minimization-review

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Identificar campos PII coletados sem justificativa atual e propor remoção/anonimização. Reduz superfície de incidente + custo de conformidade.

## Quando usar

- Auditoria semestral/anual.
- Após cortar feature que consumia certo dado.
- Antes de DPIA (minimizar reduz risco a avaliar).
- Triagem inicial em projeto legado herdado.

## Pré-condições

- `docs/security/lgpd/data-inventory.md` preenchido.
- Schema do banco e/ou entidades de domínio acessíveis.

## Processo

1. Listar todos os campos PII no banco/entidades (incluindo JSON blobs, metadata).
2. Cruzar com inventory: cada campo tem entry?
3. Para cada entry: a finalidade ainda existe no produto?
4. Para cada campo sem finalidade ativa: propor remoção, anonimização ou justificativa de manutenção.
5. Para cada campo sem entry no inventory: ou adiciona entry ou remove.
6. Gerar relatório `docs/security/lgpd/minimization-review-<YYYY-MM>.md`:
   - Campos auditados
   - Sem justificativa → ação proposta
   - Inventory desatualizado → updates necessários
7. Opcional: gerar PR com remoções/anonimizações + atualização do inventory.

## Restrições

- Não deletar dado em produção sem aprovação do DPO/responsável.
- Anonimização irreversível (hash + descarte de chave) preferida sobre delete quando há valor estatístico agregado.
- Migrar com janela documentada (mudança de schema em produção = rollback testado).

## Exemplos de uso

- "Auditoria Q2 2026: revisar campos PII coletados no tchr."
- "Removemos módulo de gamificação; auditar campos relacionados."

## Critérios de conclusão

- [ ] Lista de campos PII auditados.
- [ ] Ação proposta pra cada campo sem justificativa.
- [ ] Inventory atualizado.
- [ ] Relatório salvo em `docs/security/lgpd/`.
- [ ] PR de remoção (se aplicável) com migration + rollback.
