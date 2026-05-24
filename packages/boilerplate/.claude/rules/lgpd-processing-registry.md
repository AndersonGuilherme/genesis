---
name: lgpd-processing-registry
description: Registro de Operações de Tratamento (ROPA) mantido atualizado. Lista por finalidade: dados, base legal, retenção, compartilhamento, salvaguardas. LGPD art. 37.
phase: lgpd
---

# Rule: lgpd-processing-registry

## Princípio

`docs/security/lgpd/data-inventory.md` é o ROPA (Registro de Operações de Tratamento) exigido pelo art. 37. Vivo, versionado em git, atualizado a cada feature nova que toca PII. Coluna obrigatória: finalidade, categorias de dado, categorias de titular, base legal, retenção, compartilhamento, transferência internacional, medidas de segurança.

## Por que existe

LGPD art. 37 obriga controlador e operador a manter registro das operações. ANPD pode requisitar a qualquer momento. Sem ROPA atualizado, organização não consegue demonstrar conformidade — assume-se irregularidade. Manter como arquivo vivo (não documento isolado revisado anualmente) garante atualização orgânica.

## Como aplicar

1. `docs/security/lgpd/data-inventory.md` segue template `.genesis/templates/data-inventory-template.md`.
2. Cada feature nova que coleta/processa/compartilha PII abre PR atualizando o inventory **junto** com o código.
3. Code review checa: PR com nova entrada PII sem update no inventory → bloqueado.
4. Revisão semestral: DPO/responsável valida que entries refletem realidade.
5. Coluna mínima por entry:
   - Finalidade (1 frase)
   - Categorias de dado (nome, email, CPF, ...)
   - Categorias de titular (aluno, professor, visitante)
   - Base legal (consent, contrato, obrigação legal, legítimo interesse, ...)
   - Retenção (prazo + ação ao expirar)
   - Compartilhamento (com quem, finalidade, base)
   - Transferência internacional (sim/não + cross-link)
   - Medidas de segurança (encryption, access control)
6. ROPA exportável pra ANPD em PDF (script de geração documentado).

## Exemplos bons

- `data-inventory.md` com tabela de 25 entries, cada uma cobrindo as colunas obrigatórias.
- PR que adiciona campo `phone` em `users`: também adiciona entry "Comunicação transacional via phone" no inventory.
- Script `scripts/export-ropa-to-pdf.sh` gera versão pra envio à ANPD.

## Exemplos ruins

- Inventory vazio ou genérico ("coletamos dados pra prestar serviço").
- Inventory atualizado uma vez na auditoria, depois nunca.
- Entries sem base legal explícita.
- Compartilhamento com fornecedor não documentado.

## Exceções

- Microempresa com baixo volume pode ter ROPA simplificado (Resolução ANPD CD/ANPD nº 2/2022). Mesmo assim, manter no repo.
- Dado totalmente anonimizado dispensa entry — mas processo de anonimização documentado em ADR.

