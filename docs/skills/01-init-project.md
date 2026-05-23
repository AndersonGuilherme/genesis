# Skill: `init-project`

> Ponto de entrada de todo projeto novo. Orquestra as 10 fases e conduz a primeira (identidade do projeto).

| Campo | Valor |
|-------|-------|
| Skill ID | `init-project` |
| Fase do fluxo | Fase 1 — identidade do projeto |
| Skill anterior | nenhuma (esta é a porta de entrada) |
| Skill seguinte | [`discover-business`](02-discover-business.md) |
| Tempo típico | 30–60 minutos |

## Contexto e objetivo

`init-project` é a primeira interação real entre você e a mentoria do boilerplate. Ela existe porque, na prática, a maioria dos projetos morrem por **falta de clareza de identidade**: o dono não sabe explicar o problema em uma frase, não sabe quem sofre, não sabe que tipo de produto está construindo. Essa skill força você a parar e responder essas perguntas **antes** de qualquer outra decisão.

A skill faz três coisas:

1. **Carrega o estado do projeto** (lê `docs/PROJECT_STATE.md` para saber em que fase você está). Se for um projeto novo, conduz a Fase 1.
2. **Conduz as perguntas da Fase 1** em blocos pequenos (3 a 5 por vez, não 20 de uma vez).
3. **Registra as respostas nos documentos corretos** (`product-vision.md` e `problem-statement.md`), atualizando `PROJECT_STATE.md` no final.

O que `init-project` **não faz**:

- Não escolhe tecnologia.
- Não decide MVP ainda (isso é Fase 4).
- Não escreve código.
- Não aceita "pular para a parte técnica" — redireciona se você tentar.

## Quando você deve invocar

- Logo após clonar o boilerplate (via `genesis-init.sh`, `degit` ou clone direto).
- Quando `docs/PROJECT_STATE.md` mostrar a Fase 1 como não concluída.
- Quando você se pegar pensando "preciso começar do zero esse projeto".
- Quando alguém novo entrar no time e precisar reconstruir o contexto.

**Gatilhos típicos no chat:**

- "vamos iniciar o projeto"
- "começar projeto novo"
- "rode a skill init-project"
- "como começo aqui?"

## Pré-condições

- [ ] Repositório clonado a partir do `project-genesis-boilerplate`.
- [ ] `docs/PROJECT_STATE.md` existe (vem do boilerplate).
- [ ] Claude Code (ou cliente equivalente) aberto na raiz do repo.
- [ ] **Não há documentação já preenchida** em `docs/product/` — se há, você provavelmente está em outra fase; use [`review-readiness`](13-review-readiness.md) primeiro.

## O passo a passo

### 1. Abra o Claude Code na raiz e ative a skill

No chat, diga simplesmente:

> "vamos iniciar o projeto"

A IA vai reconhecer a intenção, carregar `init-project`, e começar lendo `docs/PROJECT_STATE.md` para confirmar que está realmente na Fase 1.

### 2. Responda as 7 perguntas da Fase 1 em blocos

A IA vai fazer **no máximo 3–5 perguntas por vez**. Não tente despejar tudo de uma só vez — responda em rodadas. As 7 perguntas-base são:

1. Qual é o **nome** do projeto?
2. Como você descreveria o projeto em **uma frase**?
3. Qual **problema** ele resolve?
4. Por que esse problema **importa**?
5. Quem **sofre** com esse problema hoje?
6. O projeto é **B2B, B2C, B2B2C, marketplace, SaaS, comunidade, ferramenta interna** ou outro?
7. Qual é o **estágio atual da ideia** (apenas hipótese, com piloto, com clientes pagantes, etc.)?

Veja o detalhamento de cada uma na seção [Perguntas que a mentora vai fazer](#perguntas-que-a-mentora-vai-fazer).

### 3. Acompanhe a escrita nos arquivos

A IA vai escrever em:

- `docs/product/product-vision.md` — visão, missão, north star metric inicial.
- `docs/product/problem-statement.md` — problema, quem sofre, evidências iniciais.

Você **deve revisar** o que ela escreve em cada rodada. Se algo não te representa, corrija no próprio chat: "essa frase ficou genérica, o problema é mais específico em X".

### 4. Decida tipo de produto e estágio

A pergunta sobre tipo (SaaS, marketplace, etc.) parece simples mas tem impacto enorme em fases futuras. Pense:

- **SaaS B2B** — venda recorrente, ciclo de vendas longo, suporte profissional.
- **SaaS B2C** — self-service, churn alto, marketing intensivo.
- **Marketplace** — dois lados, take rate, problema do ovo e galinha.
- **Comunidade** — engajamento como métrica, monetização difícil.
- **Ferramenta interna** — sem GTM, foco em eficiência operacional.
- **B2B2C** — vende para empresa, usuário final é outro.

Esse tipo aparece em `docs/product/problem-statement.md` e em discussões futuras de modelo de negócio.

### 5. Atualize `PROJECT_STATE.md`

Ao final da Fase 1, a IA vai marcar a fase como concluída em `docs/PROJECT_STATE.md` e indicar explicitamente a próxima skill: `discover-business`.

### 6. Confirme a saída antes de avançar

Pergunte para si mesmo:

- A visão (1 frase) sobreviveria a um amigo cético? Ou ainda parece genérica?
- O problema citado é falsificável (alguém poderia dizer "isso não é um problema real")?
- Eu consigo nomear uma pessoa específica que sofre com isso?

Se a resposta para qualquer uma for "não", peça à IA para refinar antes de avançar.

## Perguntas que a mentora vai fazer

### 1. Qual é o nome do projeto?

Por que importa: o nome aparece em todos os documentos, no GitHub, no domínio futuro. Não precisa ser perfeito agora, mas precisa existir como referência. Se você ainda não tem, use um nome de trabalho (`pj-alpha`, `school-os`, etc.).

### 2. Como você descreveria o projeto em uma frase?

Por que importa: essa frase vira a **tagline** em `product-vision.md`. É a coisa que você fala em 10 segundos quando alguém pergunta "o que você faz?". Frase boa: específica, mensurável, memorável. Frase ruim: cheia de "plataforma inovadora que conecta pessoas a soluções".

### 3. Qual problema ele resolve?

Por que importa: produto sem problema é hobby. Aqui você expressa em texto comum o que dói no usuário **antes** de existir o produto. Se você não consegue escrever sem usar a sua solução como referência, o problema ainda está nebuloso.

### 4. Por que esse problema importa?

Por que importa: prova que vale a pena resolver. Custo financeiro do problema, custo emocional, custo de oportunidade. Se ninguém perderia dinheiro/tempo/sono com isso, **não é um problema, é um incômodo**.

### 5. Quem sofre com esse problema hoje?

Por que importa: força você a sair do abstrato. "Empresas" não sofrem; *pessoas dentro de empresas* sofrem. Identifique um arquétipo: "dona de escola de idiomas com 80 alunos", "professor autônomo de música com 2k seguidores no Instagram". Quanto mais específico, melhor.

### 6. Tipo de produto?

Por que importa: define o modelo mental para as próximas decisões (monetização, arquitetura, GTM). Não é uma escolha definitiva — pode mudar — mas precisa existir como hipótese inicial.

### 7. Estágio atual?

Por que importa: calibra o tom da mentoria. Para uma ideia, foco em validação. Para um piloto, foco em escalar. Para um produto com clientes pagantes, foco em retenção e evolução.

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte da verdade |
|---------|-------------|-------------------|
| [`docs/product/product-vision.md`](../product/product-vision.md) | Visão (1 frase), missão, north star metric inicial, princípios. | Você (validado pela IA). |
| [`docs/product/problem-statement.md`](../product/problem-statement.md) | Problema, quem sofre, evidências, custo do não-resolver, tipo de produto. | Você. |
| [`docs/PROJECT_STATE.md`](../PROJECT_STATE.md) | Marca Fase 1 como concluída. Define nome do projeto. Aponta próxima skill. | A IA atualiza. |

## Critérios de "terminei essa skill"

- [ ] `product-vision.md` tem visão, missão e north star definidos (mesmo que provisórios).
- [ ] `problem-statement.md` tem o problema em 1 frase, quem sofre, pelo menos 1 evidência (entrevista, dado, anedota citada).
- [ ] Tipo de produto está declarado.
- [ ] Estágio atual está declarado.
- [ ] `PROJECT_STATE.md` mostra Fase 1 ✅ e Fase ativa = 2.
- [ ] A IA sugeriu explicitamente rodar [`discover-business`](02-discover-business.md).

Se algum item estiver incompleto, **não avance**. Volte e refine.

## Anti-padrões — sinais de que algo está errado

🚫 **Você respondeu 20 perguntas de uma vez.** A skill deveria ter pedido em blocos de 3–5. Se isso aconteceu, peça uma resposta mais conduzida.

🚫 **A frase de visão começa com "Plataforma inovadora que..." ou termina com "...para todos".** Genérico. Refine.

🚫 **A IA aceitou "todo mundo" como público-alvo.** Empurre: "todo mundo é ninguém — me ajude a identificar uma persona arquetípica específica".

🚫 **Você está discutindo tecnologia.** "Vamos fazer em Next.js" não pertence a esta fase. Redirecione: "stack é Fase 6, vamos voltar à identidade".

🚫 **`PROJECT_STATE.md` não foi atualizado ao final.** Sem isso, a próxima skill perde o contexto. Confirme a atualização.

🚫 **A IA escreveu em `docs/architecture/` ou `docs/business/` nesta fase.** Não é o lugar. Só `docs/product/` e `docs/PROJECT_STATE.md`.

## Exemplo aplicado: tchr

Aqui está como a Fase 1 fluiu no exemplo do tchr (resumido — material completo em [`examples/tchr/product-vision.md`](../../examples/tchr/product-vision.md) e [`examples/tchr/problem-statement.md`](../../examples/tchr/problem-statement.md)).

**Dev:** "vamos iniciar o projeto"

**IA:** "Carrego `init-project`. Vamos pela identidade — Fase 1. Quatro perguntas para começar: 1) Nome do projeto? 2) Frase de descrição? 3) Que problema resolve? 4) Por que importa?"

**Dev:** "Nome: tchr. Descrição: plataforma de gestão escolar com marketplace de cursos integrado. Problema: escolas pequenas e professores autônomos administram alunos, conteúdo e cobrança em ferramentas desconectadas. Importa porque essas pessoas perdem dinheiro e tempo todo mês com workarounds frágeis."

**IA:** "Anotei. Antes de escrever, três validações rápidas: (a) Esse problema dói toda semana ou só esporadicamente? (b) Você tem alguém em mente que sofre disso — uma pessoa específica, não um arquétipo? (c) A 'integração' que você cita é diferencial real ou viraria mais um caso de 'todo mundo promete'?"

**Dev:** "(a) Toda semana, em escolas pequenas é dor diária. (b) Sim, Marina, dona de escola de idiomas em SP, 80 alunos. (c) Diferencial é manter gestão e venda no mesmo painel — Wisecup tem gestão mas não vende; Hotmart vende mas não gerencia. O 'no meio' não existe."

**IA escreve em `product-vision.md`:**
- Visão: "Tornar a gestão de uma escola pequena e a venda de cursos de um criador independente algo tão simples quanto criar um documento."
- North star: tenants ativos pagantes com 5+ alunos ativos no mês.
- Princípio: "Simplicidade vence completude."

**IA escreve em `problem-statement.md`:**
- Problema: como descrito acima.
- Quem sofre: dona de escola de idiomas (40-150 alunos) + professor autônomo (educação/música).
- Evidência inicial: 14 entrevistas a serem registradas em `docs/validation/user-interviews.md` na fase 2.

**IA:** "Próximas 3 perguntas: tipo de produto, estágio atual, e quem é o **decisor** versus quem é o **usuário** — separação importante porque define muito sobre o GTM. Vamos?"

(...continua até a Fase 1 fechar e a IA sugerir `discover-business`.)

## Troubleshooting

### A IA está fazendo perguntas demais de uma vez

Diga: "vamos em blocos menores, máximo 3 perguntas por turno". A skill foi feita assim e a regra `business-before-technology` reforça.

### Não tenho persona específica em mente

Use a pesquisa que você já fez (mesmo conversas informais). Se não tem nenhuma, **pare** — você não tem condições de iniciar este projeto sem ao menos uma entrevista qualitativa. Pause, faça 3 entrevistas em 1 semana, volte.

### Não sei se é SaaS, marketplace, comunidade ou outro

Pergunte à IA: "me ajude a decidir o tipo de produto avaliando esses critérios: como ganho dinheiro, quem usa todo dia, quem paga, e como cresce". A IA pode rodar uma sub-conversa para definir.

### Eu já tenho `product-vision.md` preenchido de uma versão antiga do projeto

Dois caminhos:

1. **Mantenha e refine** — diga "tenho rascunho prévio, vamos revisá-lo em vez de criar do zero".
2. **Apague e recomece** — útil se a direção mudou. Mova o antigo para `docs/history/` antes de apagar.

### A IA tenta avançar para `choose-stack` antes da fase 5

Bug ou alucinação. Lembre: "Fase 6 só depois das Fases 1-5. Aqui é Fase 1." A rule `business-before-technology` cobre isso.

## Próximo passo

Quando todos os critérios de conclusão estiverem marcados, invoque:

➡️ **[`discover-business`](02-discover-business.md)** — entender público, mercado, valor e monetização inicial.

## Referências cruzadas

- [`.claude/skills/init-project/SKILL.md`](../../.claude/skills/init-project/SKILL.md) — arquivo consumido pela IA.
- [`tests/skills/init-project.md`](../../tests/skills/init-project.md) — checks canônicos.
- Rules relevantes:
  - [`business-before-technology`](../../.claude/rules/business-before-technology.md)
  - [`documentation-first`](../../.claude/rules/documentation-first.md)
- Agents relevantes:
  - [`product-strategist`](../../.claude/agents/product-strategist.md) — pode revisar a visão quando preencher.
  - [`ux-researcher`](../../.claude/agents/ux-researcher.md) — pode revisar quem é a persona.
- Templates relevantes:
  - [`project-brief-template.md`](../../templates/project-brief-template.md) — para gerar resumo executivo do projeto.
