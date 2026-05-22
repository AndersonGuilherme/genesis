# User journeys

> Como cada persona se move pelo produto. Identifique pontos de fricção e momentos de verdade.

## Como mapear

Para cada jornada use o esqueleto:

```
Persona: ___
Cenário: ___
Objetivo: ___
Pré-condição: ___

Passos:
1. (gatilho)
2. (ação)
3. (interação com o sistema)
4. (resultado)

Fricções:
- ___

Momento de verdade:
- ___
```

## Jornada 1 — _(nome curto)_

**Persona:** _(ex.: Marina, dona de escola)_
**Cenário:** _(ex.: cadastrar nova turma e enviar boleto do mês)_
**Objetivo:** _(ex.: receber pagamento das 25 mensalidades sem ligar para ninguém)_
**Pré-condição:** _(ex.: alunos já cadastrados)_

### Passos
1. _(gatilho — "começo do mês")_
2. _(abre o app, vai em "Cobranças")_
3. _(seleciona turma, escolhe vencimento)_
4. _(sistema gera boletos e envia automaticamente)_
5. _(Marina vê dashboard de pagos vs. atrasados)_

### Fricções esperadas
- _(ex.: aluno sem CPF cadastrado)_
- _(ex.: boleto emitido com nome errado)_

### Momento de verdade
- _(ex.: confirmar que 90% dos boletos foram pagos sem intervenção manual)_

### Métricas
- _(taxa de geração com sucesso)_
- _(tempo até primeira cobrança)_
- _(taxa de pagamento automático)_

## Jornada 2 — _(próxima jornada crítica)_

_(Repita o esqueleto.)_

## Mapa global de fricções

Liste as fricções de todas as jornadas e priorize.

| Fricção | Jornada | Severidade (1-5) | Frequência | Ideia de mitigação |
|---------|---------|------------------|------------|---------------------|
| _(ex.: campo CPF obrigatório)_ | Jornada 1 | 4 | alta | _(tornar opcional + validar depois)_ |

## Jornadas anti-padrão

Cenários que **não** devem ser otimizados (ainda):

- _(ex.: importar planilha gigante do Excel — só na fase 2)_
- _(ex.: emitir nota fiscal — depende de integração específica)_
