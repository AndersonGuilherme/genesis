---
name: lgpd-data-minimization
description: Coletar apenas o dado pessoal estritamente necessário pra finalidade declarada. Cada campo justificado em data-inventory. LGPD art. 6, III.
phase: lgpd
---

# Rule: lgpd-data-minimization

## Princípio

Cada campo de dado pessoal coletado precisa de finalidade declarada e justificada. "Pode ser útil depois" não é justificativa. Schema de coleta = subset mínimo da entidade. Campos opcionais marcados explicitamente.

## Por que existe

LGPD art. 6, III (princípio da necessidade): tratamento limitado ao mínimo necessário. Coletar dado a mais expande superfície de incidente, aumenta custo de DPIA, exige consentimento mais amplo, complica retenção. Minimização é defesa preventiva.

## Como aplicar

1. Antes de adicionar campo PII em qualquer entidade/formulário: declarar finalidade em `docs/security/lgpd/data-inventory.md`.
2. Schema de entrada na boundary (controller) rejeita campos não declarados.
3. Code review checa: PR que adiciona campo PII sem entrada correspondente no inventory → bloqueado.
4. Campo opcional: marcado como `optional` no schema + UI sinaliza claramente.
5. Auditoria periódica (trimestral): listar campos coletados, validar que ainda são necessários, remover obsoletos.

## Exemplos bons

- Cadastro de aluno coleta: `name`, `email`, `cpf` (para nota fiscal), `phone` (opcional, para comunicação urgente). Cada um listado em data-inventory com finalidade.
- Form não tem campo "data de nascimento" porque não há finalidade declarada.

## Exemplos ruins

- "Vamos coletar CPF, RG, endereço completo, profissão e renda — depois decidimos pra que serve."
- Campo escondido no JSON (`metadata: {...}`) que armazena tudo que vem do frontend.
- Reuso de schema "completo" de outro contexto que carrega campos extras.

## Exceções

- Dado anonimizado/agregado (sem reidentificação possível) não conta como PII.
- Logs operacionais que não persistem (TTL curto) com finalidade técnica documentada.

