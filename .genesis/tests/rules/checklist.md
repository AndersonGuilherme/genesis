# Rules: checklist

Cada rule em `.claude/rules/` deve ter as seções obrigatórias verificadas pelo `lint-docs.sh`:

- `## Princípio`
- `## Por que existe`
- `## Como aplicar`
- `## Exemplos bons`
- `## Exemplos ruins`
- `## Exceções`

Esta página adiciona checks **semânticos** que o lint não cobre.

## Rules e seus aspectos críticos

| Rule | Aspecto crítico a verificar | Exceção registrada? |
|------|------------------------------|----------------------|
| `no-code-before-spec` | Cita "spec mínima aprovada" como gate. Trata spike descartável como exceção. | ✓ |
| `documentation-first` | Cita atualizar doc no mesmo PR. Reconhece refatoração interna como exceção. | ✓ |
| `business-before-technology` | Bloqueia escolha de stack antes das fases 1-5. Reconhece restrição forte de skill do time. | ✓ |
| `module-spec-required` | Bloqueia criação de arquivo de implementação sem spec. Permite bugfix em módulo já especificado. | ✓ |
| `adr-required-for-decisions` | Exige ≥ 2 alternativas reais. Permite decisões pequenas/reversíveis sem ADR. | ✓ |
| `security-by-design` | Cita LGPD, multi-tenancy, logs sem PII. Permite healthcheck público sem auth. | ✓ |
| `testing-strategy-required` | Spec do módulo declara testes obrigatórios. Permite spike e script one-off como exceção. | ✓ |
| `stack-neutrality` | Exige ≥ 3 opções avaliadas. Permite restrição de time como input documentado. | ✓ |
| `explain-tradeoffs` | Vantagem + custo + alternativas + critério de mudança. Permite resposta factual sem trade-off. | ✓ |
| `avoid-overengineering` | Default monolito modular; pergunta o número que justifica. Permite restrição regulatória ou volume já existente. | ✓ |

## Como usar este checklist

Ao editar uma rule, reler a linha correspondente. Se removeu uma exceção, atualize aqui. Se mudou o princípio, atualize CLAUDE.md também (que referencia as rules).

## Sinais de regressão

- Rule sem exceção realista → vira dogma e perde adesão.
- Rule sem exemplos concretos → ninguém aplica.
- Rule contradizendo outra → discutir e potencialmente fundir.

Lista atual considerada consistente entre si em 2026-05-23.
