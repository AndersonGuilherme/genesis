# Open questions

> Tudo que ainda não sabemos e que pode afetar decisões. Pergunta aberta não é problema — pergunta esquecida é.

## Como registrar

Cada pergunta tem ID, descrição, responsável, prazo e área impactada.

| ID | Pergunta | Área | Responsável | Prazo | Status |
|----|----------|------|-------------|-------|--------|
| Q-0001 | _(ex.: como atender contestações de pagamento sem suporte humano?)_ | produto + ops | _(nome)_ | _(data)_ | aberta |
| Q-0002 | _(ex.: precisamos suportar OAuth Google no MVP?)_ | identity | _(nome)_ | _(data)_ | aberta |
| Q-0003 | _(ex.: cobrança Pix tem requisitos LGPD adicionais?)_ | legal | _(nome)_ | _(data)_ | aberta |

## Status possíveis

- `aberta` — sem resposta ainda
- `em-pesquisa` — alguém está investigando
- `respondida` — decidida (deve gerar ADR se for relevante)
- `descartada` — não importa mais e por que

## Boas práticas

- Pergunta deve ser **falsificável ou decidível**, não ruminação.
- Quando a resposta vier, atualize aqui e linke o ADR (se houver).
- Não deixe pergunta crítica aberta por mais de _(prazo combinado)_ sem mexer.

## Perguntas estratégicas típicas

Para inspirar a primeira rodada:

- Qual o evento mais provável de quebrar o produto na fase de lançamento?
- Qual integração externa é a maior dependência hoje?
- Qual hipótese, se errada, mata o projeto?
- Que feature todo mundo pediu e ninguém sabe se vale a pena?
- Onde estamos confiando "no achismo" em vez de dado?

## Reciclagem

Toda quinta semana, revisar a lista. Perguntas paradas > 30 dias devem virar uma ação:
1. responder
2. agendar pesquisa
3. descartar com motivo
