---
name: lgpd-dpia
description: Data Protection Impact Assessment (Relatório de Impacto) para operações de alto risco — dado sensível, decisão automatizada, volume grande, criança. Produz `docs/security/lgpd/dpia-<nome>.md`.
phase: lgpd
rules:
  - lgpd-data-minimization
  - lgpd-explicit-consent
  - lgpd-purpose-limitation
  - lgpd-pii-encrypted
  - lgpd-retention-limit
  - sec-encryption-at-rest
---

# Skill: lgpd-dpia

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Produzir `docs/security/lgpd/dpia-<operacao>.md` com avaliação de risco + mitigações pra operação que envolve dado sensível ou de alto risco.

## Quando usar

- Operação envolve dado sensível (art. 11): saúde, biometria, religião, política, racial, sexual, sindical.
- Operação envolve decisão automatizada com efeito jurídico (scoring de crédito, moderação, ranqueamento que vira benefício).
- Volume grande de PII (>10k titulares).
- Dado de criança/adolescente.
- Combinação de fontes (profiling).
- Transferência internacional de dado sensível.

## Pré-condições

- `docs/security/lgpd/data-inventory.md` lista a operação.
- `docs/security/lgpd/consent-strategy.md` cobre consent aplicável.
- Template `.genesis/templates/dpia-template.md` disponível.

## Processo

1. Descrever a operação: o quê, finalidade, quem decide, quem é afetado.
2. Necessidade: por que essa operação é necessária? Alternativa menos intrusiva considerada?
3. Categorias de dado e titulares envolvidos.
4. Base legal por finalidade.
5. Identificar riscos ao titular:
   - Discriminação (decisão automatizada).
   - Exposição (vazamento de dado sensível).
   - Reidentificação (anonimização fraca).
   - Perda de controle (consent confuso).
6. Probabilidade × impacto = risco. Priorizar alto/médio.
7. Mitigações por risco: técnica (encryption, pseudonimização) + organizacional (treinamento, audit).
8. Revisão humana de decisões automatizadas (direito do titular).
9. Plano de revisão da DPIA (anual ou quando operação muda).
10. Preencher `docs/security/lgpd/dpia-<operacao>.md`.

## Restrições

- DPIA não substitui base legal — é avaliação adicional.
- Decisão automatizada exige sempre direito de revisão humana (art. 20 LGPD).
- DPIA inadequada = risco operacional + risco de multa.

## Exemplos de uso

- "DPIA pra módulo de moderação automatizada de conteúdo."
- "DPIA pra coleta de dado de saúde no app de bem-estar."

## Critérios de conclusão

- [ ] Operação descrita.
- [ ] Necessidade justificada + alternativas avaliadas.
- [ ] Riscos identificados + priorizados.
- [ ] Mitigações concretas por risco.
- [ ] Revisão humana garantida (se decisão automatizada).
- [ ] Plano de revisão definido.
- [ ] `docs/security/lgpd/dpia-<operacao>.md` completo.
