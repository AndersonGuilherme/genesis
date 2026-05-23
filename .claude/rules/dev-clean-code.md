---
name: dev-clean-code
description: Nomes intencionais, funções pequenas, sem comentários que explicam o quê, sem magic numbers. Inspirado em Uncle Bob, aplicado com pragmatismo.
phase: development
---

# Rule: dev-clean-code

## Princípio

Código é lido muito mais do que é escrito. Otimizar pra legibilidade: nomes que falam, funções curtas, ausência de truques. Comentário só quando o "porquê" não está óbvio no código.

## Por que existe

Código sujo gera bug e desacelera time. Cada atalho (variável `x`, função `process()`, comentário pra explicar o que o código faz) custa tempo de quem vai ler depois. Limpar cedo é barato; tarde é refatoração cara.

## Como aplicar

1. **Nomes intencionais** — variável, função, classe diz o que é e por quê. Sem `data`, `info`, `manager`, `helper`, `util`.
2. **Funções pequenas** — uma coisa, um nível de abstração. Se passar de ~20 linhas, dividir.
3. **Sem comentário descrevendo o quê** — código bem nomeado dispensa. Comentário só pra "por quê não-óbvio" ou workaround documentado.
4. **Sem magic numbers/strings** — extrair pra constante nomeada.
5. **Sem flag arguments** — `boolean` em parâmetro = sinal de SRP violado. Dividir em 2 funções.
6. **Early return** — preferir guard clauses em vez de `if` aninhados.
7. **Sem código morto** — deletar comentado, não manter "pra caso de".

## Exemplos bons

- `function calculateAnnualTuition(student: Student): Money` em vez de `function calc(x)`.
- `const MAX_RETRIES = 3` em vez de `if (count > 3)`.
- `if (!user) return null` (early return) em vez de aninhar `if (user) { ... }`.

## Exemplos ruins

- `// loop pra somar tudo` ao lado de `total += item.value`.
- `function process(data: any, flag: boolean): any`.
- Função de 100 linhas com 4 níveis de aninhamento.
- Código comentado deixado "pra referência".

## Exceções

- Comentário em algoritmo não-trivial (DSP, criptografia, performance crítica) — documenta o "porquê" da escolha.
- Magic numbers padronizados por especificação externa (HTTP 200, port 5432) podem ficar inline com contexto óbvio.
- TODO/FIXME com link pra issue tracker são aceitáveis temporariamente.
