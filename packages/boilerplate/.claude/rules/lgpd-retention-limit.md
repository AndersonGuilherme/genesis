---
name: lgpd-retention-limit
description: PII tem prazo de retenção declarado por categoria. Após prazo, deletada ou anonimizada automaticamente. Job de retenção rodando + logado. LGPD art. 15-16.
phase: lgpd
---

# Rule: lgpd-retention-limit

## Princípio

Toda categoria de PII tem retenção máxima declarada em `docs/security/lgpd/retention-policy.md`. Job automático aplica: deletar OU anonimizar conforme política. Sem retenção indefinida "porque pode ser útil". Backup também respeita (mais lento, mas obrigatório).

## Por que existe

LGPD art. 15-16 exige término de tratamento quando finalidade alcançada, consent revogado, ou prazo legal vencido. Reter dado indefinidamente = tratamento sem base legal + superfície ampliada de incidente. Audit da ANPD checa retention policy aplicada na prática.

## Como aplicar

1. `docs/security/lgpd/retention-policy.md` lista: categoria × retenção × ação ao expirar (delete | anonymize) × base legal.
2. Cada tabela com PII tem coluna `created_at` ou similar pra calcular vencimento.
3. Job diário/semanal: identifica registros expirados, executa ação, loga em audit (`retention.applied`).
4. Soft delete não basta — exige hard delete ou anonimização real (CPF → null, email → `deleted-{hash}@anonymized.local`).
5. Backup: política inclui janela máxima de retenção de backup (ex.: 90 dias). Restore drill valida que dado expirado não volta.
6. Categorias com obrigação legal de retenção (fiscal: 5 anos; trabalhista: 30 anos): documentar e justificar.

## Exemplos bons

- Lead que não converteu em 6 meses: email + nome anonimizados; comportamental anônimo mantido pra métrica.
- Aluno inativo há 5 anos: dados acadêmicos arquivados em storage frio com encryption, PII direta removida.
- Backup com retenção 90 dias + processo de purge documentado.

## Exemplos ruins

- "Vamos guardar tudo, storage é barato."
- Soft delete (linha marcada como deletada mas dado intacto) sendo chamado de "deleção".
- Política definida mas job nunca rodou.
- Backup mensal mantido eternamente (dado retido na cópia, mesmo deletado na produção).

## Exceções

- Obrigação legal de retenção (NF-e, contratos): documentar prazo + base legal. Após prazo legal, retenção termina.
- Audit log próprio com retenção legal (5 anos default) é exceção sob base "exercício regular de direito".

