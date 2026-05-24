# MVP scope

> O que entra, o que NÃO entra, e por quê. O MVP é uma decisão dolorosa: o objetivo é cortar.

## Definição de MVP neste projeto

MVP = menor conjunto de funcionalidades que permite **validar a hipótese central** do projeto em produção real, com usuários reais pagando (quando o modelo prevê pagamento) ou usando recorrentemente.

MVP **não é**:
- versão beta;
- protótipo de design;
- demo para investidor;
- esqueleto técnico bonito sem uso real.

## Hipótese a ser validada com o MVP

_(1 frase clara, ligada ao [problem-statement.md](problem-statement.md))_

Critério de sucesso do MVP em 60 dias após lançar:

- _(ex.: 10 escolas pagantes ativas)_
- _(ex.: NPS ≥ 40)_
- _(ex.: 50% dos usuários retornam na semana 2)_

Critério de **fracasso** (e o que faremos):
- _(ex.: < 3 pagantes em 60 dias → pivot na persona)_

## Escopo IN — o que entra

Liste com brutalidade. Se entra, justifique.

| Feature | Persona atendida | Por que é essencial agora |
|---------|------------------|----------------------------|
| _(ex.: cadastro de alunos)_ | dono da escola | base de qualquer fluxo |
| _(ex.: cobrança recorrente Pix)_ | dono da escola | testa willingness to pay |
| _(ex.: catálogo público de cursos)_ | criador autônomo | testa marketplace |

## Escopo OUT — o que NÃO entra

Liste o que você gostaria de ter mas precisa cortar. Diga por que cada um foi cortado.

| Feature | Motivo do corte | Quando reavaliar |
|---------|-----------------|------------------|
| _(ex.: emissão de NF-e)_ | _(integração lenta, baixa demanda inicial)_ | mês 4 |
| _(ex.: app mobile nativo)_ | _(custo alto, web responsivo cobre)_ | depois de 100 escolas |
| _(ex.: relatórios pedagógicos)_ | _(não conecta à hipótese central)_ | nunca, talvez nunca |

## Anti-MVP

Algumas coisas pioram o MVP quando entram. Liste-as como **proibidas**:

- _(ex.: importação CSV no dia 1 — cria suporte hell)_
- _(ex.: white label — não há clientes ainda)_
- _(ex.: integração com 5 gateways — um basta)_

## Critério de "pronto" por feature

Para cada feature IN, defina o "done":

| Feature | Definição de pronto |
|---------|----------------------|
| _(ex.: cadastro de alunos)_ | _(usuário cria 10 alunos com erro < 5%, exportável)_ |
| _(ex.: cobrança Pix)_ | _(boleto Pix gerado, pago em sandbox, callback recebido)_ |

## Tempo-caixa

| Marco | Data alvo |
|-------|-----------|
| Início do MVP | _(YYYY-MM-DD)_ |
| Primeiro usuário real fora da casa | _(YYYY-MM-DD)_ |
| Avaliação dos critérios de sucesso | _(YYYY-MM-DD)_ |

Se a data alvo escorregar > 30%, revise escopo, não aumente tempo.

## Métricas-instrumento

Métricas que precisam estar coletando desde o dia 1:

- _(ex.: # de signups)_
- _(ex.: # de escolas que criam ≥ 5 alunos)_
- _(ex.: # de cobranças geradas e pagas)_

Veja [../validation/success-metrics.md](../validation/success-metrics.md).
