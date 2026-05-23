---
name: lgpd-data-inventory
description: Use após `plan-design-architecture` + `sec-threat-model`. Cria/atualiza ROPA (Registro de Operações de Tratamento) listando cada PII coletada com finalidade, base legal, retenção, compartilhamento. LGPD art. 37.
phase: lgpd
rules:
  - lgpd-data-minimization
  - lgpd-processing-registry
  - lgpd-purpose-limitation
---

# Skill: lgpd-data-inventory

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Produzir `docs/security/lgpd/data-inventory.md` (ROPA) com cada categoria de PII coletada/processada, base legal, retenção, compartilhamento e medidas de proteção.

## Quando usar

- Antes de iniciar development (LGPD vem antes do código).
- Ao adicionar feature nova que toca PII.
- Em auditoria semestral pra validar que registro reflete realidade.

## Pré-condições

- `docs/architecture/architecture-overview.md` define componentes.
- `docs/specs/<modulo>/data-model.md` lista entidades e campos.
- Template `.genesis/templates/data-inventory-template.md` disponível.

## Processo

1. Listar fontes de PII: formulários (cadastro, perfil, checkout), integrações (login social, importação), eventos (analytics, comportamental), uploads (foto, documento).
2. Para cada campo PII: nome, descrição, categoria de titular (aluno, professor, visitante, criança).
3. Definir finalidade específica (não genérica). Múltiplas finalidades = múltiplas entries.
4. Definir base legal por finalidade: consent, contrato, obrigação legal, legítimo interesse, exercício regular de direito, proteção da vida, política pública, estudo por pesquisa, proteção do crédito.
5. Definir retenção: prazo + ação ao expirar (delete ou anonymize). Cross-link `lgpd-retention-limit`.
6. Listar compartilhamento: com quem (interno por role, externo por parceiro), finalidade, base legal.
7. Listar transferência internacional (cross-link `lgpd-international-transfer-rule`).
8. Medidas de segurança: encryption at-rest, encryption in-transit, access control, audit log.
9. Preencher `docs/security/lgpd/data-inventory.md` com template.

## Restrições

- Cada entry com base legal explícita (nunca em branco).
- Finalidade específica, não "prestação do serviço".
- Toda categoria sensível (art. 11): saúde, biometria, racial, religiosa, política, sexual, filiação sindical → marcada `sensitive: true`.
- Dado de criança/adolescente: marca + processo de consent do responsável.

## Exemplos de uso

- "Criar data inventory inicial do tchr."
- "Adicionar campo `phone` ao inventory pra módulo de notificação."
- "Auditoria semestral: validar que inventory reflete state atual."

## Critérios de conclusão

- [ ] Cada PII coletada listada com finalidade.
- [ ] Base legal explícita por entry.
- [ ] Retenção definida por entry.
- [ ] Compartilhamento mapeado.
- [ ] Transferência internacional mapeada (se aplicável).
- [ ] Categorias sensíveis marcadas.
- [ ] `docs/security/lgpd/data-inventory.md` completo.
