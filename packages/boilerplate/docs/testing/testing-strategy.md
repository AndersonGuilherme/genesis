# Testing strategy

> Como garantimos que muda sem quebrar. Estratégia explícita evita pirâmide ou diamante errado.

## Filosofia

1. **Teste tem custo, sem teste tem custo maior.**
2. **Teste de regra de negócio é não-negociável.**
3. **Cobertura é guia, não meta.** 100% de cobertura com asserts ruins é pior que 70% com asserts certos.
4. **Velocidade do feedback importa.** Suite que demora demais ninguém roda.

## Pirâmide

```
            E2E (5%)
        ───────────────
       Integração (25%)
   ────────────────────────
       Unitários (70%)
```

Ajuste conforme a natureza do projeto. Heavy backend de regras → mais unitário. Heavy frontend visual → equilíbrio com mais E2E.

## Tipos e onde aplicar

### Unitário
- Foco: lógica de negócio pura, funções puras, regras complexas
- Velocidade: ms
- Sem dependência de IO

### Integração
- Foco: componente + adjacentes (banco, fila, cache)
- Velocidade: segundos
- Banco real (em test container) ou mock determinístico

### Contrato (contract test)
- Foco: APIs públicas + eventos
- Garante que o contrato não quebra entre módulos / clientes

### E2E (end-to-end)
- Foco: jornadas críticas do usuário
- Pouco número, alto valor
- Inclui frontend + backend + integração externa quando possível

### Smoke / health
- Após deploy
- Garantir que o sistema sobe e responde

### Carga (load test)
- Antes de release grande
- Cenário realista, não sintético sem sentido

### Caos (chaos test) — opcional
- Quando maturidade permitir
- Falhas controladas em produção (game days)

## O que TEM que ter teste

- Regras de negócio críticas (definidas em [../specs/](../specs/))
- Cálculos financeiros / cobrança
- Fluxo de autenticação e autorização
- Idempotência de operações
- Tratamento de webhook
- Migrações destrutivas (testadas em rollback)
- Permissões por papel (matriz inteira)

## O que NÃO precisa de teste exaustivo

- Getters/setters triviais
- Wrappers de biblioteca padrão
- Código de bootstrap

## Ferramentas (a definir)

| Tipo | Ferramenta | Por que |
|------|------------|---------|
| Unitário | _(depende da stack — definir após [technology-decision.md](../architecture/technology-decision.md))_ | velocidade |
| Integração | _(idem)_ | proximidade do real |
| E2E | _(ex.: Playwright)_ | cobre browser |
| Carga | _(ex.: k6, Locust)_ | scriptable |

## Convenções

- Cada teste deve **falhar antes de passar** (TDD quando possível)
- Nome de teste descreve comportamento, não método: `deve_rejeitar_pagamento_quando_saldo_insuficiente`
- AAA: Arrange / Act / Assert visíveis
- Sem `sleep` em testes — usar polling explícito ou await determinístico
- Dados de teste isolados por execução

## Critérios de aceite por feature

Cada feature segue o formato Given/When/Then padronizado em [acceptance-criteria.md](acceptance-criteria.md). Cada critério vira pelo menos um teste automatizado.

## Quality gates

Ver [quality-gates.md](quality-gates.md). Resumo:

- Pre-commit: lint + format
- PR: unit + integração + lint + tipos
- Merge to main: + contract
- Pre-deploy: + smoke
- Pos-deploy: + monitoring

## Cobertura mínima sugerida

| Camada | Linha alvo | Branches alvo |
|--------|-------------|----------------|
| Regras de negócio | 90% | 90% |
| Application services | 80% | 70% |
| Adapters / infra | 60% | 50% |
| UI / glue | sem alvo | sem alvo |

Estes números são guias. O que importa é teste útil, não vaidade.

## Quando dispensar teste

- Spike de exploração (descartado em < 2 semanas)
- Script one-off com dado não reaproveitado

Em todos os outros casos: teste obrigatório.
