# Skill: `validate-idea`

> Skill transversal. Força validação das premissas mais arriscadas antes de gastar tempo construindo.

| Campo | Valor |
|-------|-------|
| Skill ID | `validate-idea` |
| Fase do fluxo | **transversal** — invocada quando premissas fatais aparecem |
| Skill anterior | qualquer skill que tenha gerado premissa crítica |
| Skill seguinte | volta à skill da fase em curso |
| Tempo típico | 30 min planejando + dias/semanas executando o experimento |

## Contexto e objetivo

Toda decisão grande no boilerplate fica registrada como **premissa** em [`docs/research/assumptions.md`](../research/assumptions.md), com nível de confiança (1–5) e impacto (baixo/médio/alto/fatal).

Quando uma premissa tem **confiança 1–2 + impacto alto ou fatal**, ela é um risco existencial. Construir baseado nela é apostar a casa.

`validate-idea` força o ciclo:

1. Olhe a premissa.
2. Defina **o que provaria que é verdadeira** e **o que provaria que é falsa**.
3. Escolha o **experimento mais barato** que dá essa resposta.
4. Defina **critério de sucesso e falha ANTES de rodar**.
5. Execute, registre o resultado, atualize a confiança.

Sem essa skill, premissas viram dogma — discutidas em reunião, não testadas no mundo real.

O que `validate-idea` **não faz**:

- Não executa o experimento por você (é fora do chat: entrevistar, postar landing page, contatar usuário).
- Não decide se você deve continuar com o projeto — só te dá dado.
- Não substitui pesquisa qualitativa em escala (use entrevistas constantemente, não só nesta skill).

## Quando você deve invocar

- Após [`discover-business`](02-discover-business.md) registrar premissas em `assumptions.md` com confiança baixa.
- Após [`define-product`](03-define-product.md) — premissa "vão usar isso" precisa validar antes de construir.
- Após [`design-business-model`](06-design-business-model.md) — premissa "vão pagar R$ X" precisa de smoke test ou piloto.
- **SEMPRE** antes de `start-development` se há premissa com confiança 1-2 + impacto fatal aberta.
- Quando o time está prestes a gastar >4 semanas baseado em achismo.

**Gatilhos no chat:**

- "como sei se essa ideia tem demanda?"
- "quero validar willingness to pay"
- "não sei se o público-alvo é esse mesmo"
- "rode validate-idea"

## Pré-condições

- [ ] [`docs/research/assumptions.md`](../research/assumptions.md) existe e tem pelo menos 1 premissa registrada.
- [ ] [`docs/product/problem-statement.md`](../product/problem-statement.md) e [`target-users.md`](../product/target-users.md) preenchidos (para contexto).

## O passo a passo

### 1. Invoque a skill

> "quero validar willingness to pay"

A IA lê `assumptions.md` e prioriza premissas com baixa confiança + alto impacto.

### 2. Liste premissas críticas pendentes

A IA mostra tabela:

| ID | Premissa | Confiança | Impacto | Tem plano? |
|----|----------|-----------|---------|------------|
| A-0001 | Escolas pagam R$ 200/mês | 2 | alto | não |
| A-0002 | Criadores aceitam comissão 10% | 2 | alto | não |
| A-0003 | Indicação funciona como canal | 3 | médio | não |

Você escolhe qual atacar primeiro. Padrão: maior impacto + menor confiança.

### 3. Para cada premissa, defina critérios

A IA conduz três perguntas:

**a) O que provaria que essa premissa é VERDADEIRA?**

Não "uma sensação positiva". Coisa concreta. Ex.:
- "5 escolas pagam o sinal de R$ 99 pelo acesso antecipado."
- "30% dos cliques no preço viram leads qualificados."
- "10 criadores publicam curso e fazem ≥1 venda em 30 dias."

**b) O que provaria que é FALSA?**

Também concreto. Ex.:
- "<2 escolas pagam mesmo após 200 leads quentes."
- "<5% conversão no smoke test."
- "Nenhum criador publica curso após 30 dias com onboarding ativo."

**c) Qual o experimento mais barato que dá essa resposta?**

A IA propõe métodos:

- **Entrevista qualitativa** — para entender problema. 10–15 conversas. Barata.
- **Smoke test (landing page)** — para medir intent de compra. 1 página + tráfego pago/orgânico.
- **Concierge MVP** — atender manualmente (sem produto) para entender entrega.
- **Wizard of Oz** — frontend funciona, backend é humano por trás.
- **Piloto pago** — produto inicial com 3–5 clientes pagando.
- **A/B test** — quando já há tráfego.

### 4. Registre o experimento em `validation-plan.md`

Cada experimento tem:

| Campo | Valor |
|-------|-------|
| ID | EXP-NNNN |
| Hipótese | Frase falsificável ("Se X, então Y") |
| Premissa que valida | A-NNNN |
| Método | entrevista / smoke / piloto / etc. |
| Amostra | Tamanho + perfil |
| Métrica | Número exato a observar |
| Critério de sucesso | Antes de rodar |
| Critério de falha | Antes de rodar |
| Duração | Dias |
| Custo estimado | R$ + horas |
| Status | planejado / rodando / concluído |

A IA escreve em [`docs/research/validation-plan.md`](../research/validation-plan.md).

### 5. Execute o experimento (fora do chat)

Você sai do chat e faz: entrevistas, landing page, anúncios, contato com clientes potenciais, etc. Pode levar dias ou semanas.

A IA não pode fazer isso por você. **Esse é o ponto** — você precisa de dado real do mundo, não da IA opinando.

### 6. Registre o resultado

Volte ao chat:

> "rodei o experimento EXP-0001, conversão foi de 12% no smoke test contra meta de 10%"

A IA atualiza:

- `validation-plan.md` — resultado concreto.
- `assumptions.md` — sobe confiança da premissa para 4 (se sucesso) ou marca como refutada (se falha).

### 7. Decida o que fazer com o resultado

**Premissa confirmada (sucesso):**
- Continue para próxima fase.
- Use o dado em [`mvp-scope.md`](../product/mvp-scope.md) — agora baseado em evidência.

**Premissa refutada (falha):**
- A IA ajuda a decidir entre:
  - **Pivot na persona** — talvez o público errado.
  - **Pivot no problema** — talvez o problema não é tão agudo.
  - **Pivot no modelo** — talvez o preço/formato está errado.
  - **Pivot no canal** — talvez funcione, mas o canal escolhido falhou.
  - **Mata o projeto** — opção válida se a premissa fatal cai.

A decisão **sempre** gera ADR (via [`create-adr`](11-create-adr.md)).

**Inconclusivo (amostra pequena, ruído):**
- Rode novamente com amostra maior.
- Não trate como confirmação ou falha.

### 8. Atualize `PROJECT_STATE.md`

Adicione nota: "EXP-0001 concluído — premissa A-0001 confirmada/refutada. Decisão: \<X\>".

## Tipos de experimento — quando usar cada

### Entrevista qualitativa
- **Quando:** problema ainda nebuloso, persona indefinida.
- **Tamanho:** 10–15 conversas.
- **Critério:** padrões repetidos em ≥ 70% das entrevistas.
- **Limite:** intenção declarada ≠ comportamento.

### Smoke test (landing page)
- **Quando:** medir intent de compra.
- **Tamanho:** ≥ 200 visitantes qualificados.
- **Critério:** CTR / conversão acima de benchmark do setor.
- **Limite:** "cliquei" ≠ "vou pagar amanhã".

### Concierge MVP
- **Quando:** quer testar entrega antes de construir.
- **Tamanho:** 5–10 clientes reais.
- **Critério:** clientes voltam para uma segunda iteração e referem.
- **Limite:** não escala — só prova caminho feliz inicial.

### Wizard of Oz
- **Quando:** quer validar UX sem ter backend.
- **Tamanho:** 5–10 sessões.
- **Critério:** usuário completa tarefa principal sem perceber o "humano por trás".
- **Limite:** sustenta pouco volume.

### Piloto pago
- **Quando:** quer dado financeiro real.
- **Tamanho:** 3–5 clientes pagando preço cheio.
- **Critério:** renovação após período inicial.
- **Limite:** custoso, requer produto mínimo funcionando.

### A/B test
- **Quando:** já há tráfego e variantes claras.
- **Tamanho:** depende de poder estatístico (significância 95% + tamanho do efeito).
- **Critério:** variante vence com significância.
- **Limite:** só funciona com volume.

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte |
|---------|-------------|-------|
| [`assumptions.md`](../research/assumptions.md) | Confiança atualizada após resultado. | A IA. |
| [`validation-plan.md`](../research/validation-plan.md) | Experimento planejado + resultado. | A IA. |
| [`idea-validation.md`](../validation/idea-validation.md) | Atualização do checklist global. | A IA. |
| [`user-interviews.md`](../validation/user-interviews.md) | Se método foi entrevista, registros aqui. | Você (resumindo cada). |
| ADR | Se decisão de pivot/manter veio do resultado. | Via [`create-adr`](11-create-adr.md). |

## Critérios de "terminei essa skill" (por premissa)

- [ ] Premissa explícita em `assumptions.md`.
- [ ] Experimento registrado em `validation-plan.md` com critérios antes de rodar.
- [ ] Experimento executado.
- [ ] Resultado registrado.
- [ ] Confiança da premissa atualizada (ou marcada como refutada).
- [ ] Decisão consequente registrada (ADR se aplicável).

## Anti-padrões — sinais de que algo está errado

🚫 **"Critério de sucesso é 'as pessoas vão gostar'."** Vago. Exija número.

🚫 **Definiu critério DEPOIS de rodar.** Cria viés retrospectivo. Defina antes ou repita.

🚫 **"Perguntei pra família, todos gostaram."** Viés de confirmação. Não conta.

🚫 **"Vou validar quando o produto estiver pronto."** Invertido. Validar é antes.

🚫 **Amostra de 3 pessoas declarando intenção = "validado".** Intenção declarada não é compra. E 3 não é amostra.

🚫 **Premissa refutada mas você ignora.** Pivot ou continue conscientemente — mas registre a decisão.

🚫 **Premissa confirmada com 8 entrevistas e n=5 dizendo sim → tratada como "100% confirmada".** Confiança 4, talvez 5. Não infinito.

🚫 **A IA aceitou ouvir "essa premissa não precisa ser validada" sem questionar.** Empurre — se a confiança é baixa e impacto é alto, é validação obrigatória.

## Exemplo aplicado: tchr

### EXP-0001 — Willingness to pay das escolas

| Campo | Valor |
|-------|-------|
| Hipótese | "Donas de escolas pequenas de idiomas pagam R$ 199/mês por uma plataforma integrada de gestão + cobrança Pix." |
| Premissa | A-0001 |
| Método | Smoke test (landing) + 10 entrevistas com escolas que clicarem |
| Amostra | 200 visitantes qualificados via Instagram ads + 10 entrevistas |
| Métrica | (a) CTR no botão "Quero saber mais"; (b) % das entrevistadas que dizem "pago amanhã ao preço de R$ 199" |
| Critério de sucesso | ≥ 12% CTR + ≥ 30% das entrevistadas com intent real |
| Critério de falha | < 6% CTR ou < 10% intent real |
| Duração | 21 dias |
| Custo | R$ 500 ads + 15h trabalho |

**Resultado (hipotético):**

- 14% CTR (passou).
- 4 de 10 entrevistadas (40%) disseram "pago amanhã" e 2 deixaram email com depósito de sinal voluntário.
- Premissa confirmada → confiança sobe de 2 para 4.

**Decisão registrada como ADR-0006:** "Modelo SaaS B2B com ticket inicial R$ 199–249 é o eixo de monetização do MVP."

### EXP-0002 — Aceitação de comissão por criadores

| Campo | Valor |
|-------|-------|
| Hipótese | "Criadores de cursos aceitam comissão de 10% para terem gestão de aluno integrada à venda." |
| Premissa | A-0002 |
| Método | Concierge MVP — atender 5 criadores manualmente vendendo curso deles com 10% de comissão |
| Amostra | 5 criadores |
| Métrica | Quantos aceitam e completam 1 venda no programa |
| Critério de sucesso | ≥ 3 aceitam e completam |
| Critério de falha | < 2 aceitam |
| Duração | 30 dias |

**Resultado (hipotético):**

- 3 aceitaram, 2 completaram venda, 1 reclamou que 10% é alto demais comparado a outras opções.
- Confiança sobe para 3 (não 4 — feedback misto).
- Próxima ação: rodar EXP-0003 testando 8% vs. 12% com novos criadores.

### EXP-0003 — Canal de indicação

| Campo | Valor |
|-------|-------|
| Hipótese | "NPS alto entre escolas pagantes gera ≥ 1 indicação por cliente em 90 dias." |
| Premissa | A-0003 |
| Método | Aguardar — só rodável após 30+ clientes pagantes. |
| Status | Bloqueado por tamanho de amostra. Reavaliar no mês 4. |

## Troubleshooting

### Não tenho tempo para validar — preciso lançar

Pergunta: quanto custa lançar errado e descobrir em 6 meses? Geralmente caro mais que 2 semanas de validação. Se for emergência real, registre como decisão de "lançar sem validar" com prazo de avaliação curto e plano de pivot rápido.

### Resultado inconclusivo (amostra pequena, ruído)

Aumente amostra ou redesenhe o experimento. Não trate como confirmação ou refutação.

### A IA aceitou "premissa validada" com 1 entrevista de família

Empurre: "essa amostra é insuficiente para mudar confiança. Mantenha confiança original."

### Premissa refutada — não sei se pivot ou mata projeto

Liste em ADR todas as opções consideradas (pivot persona, pivot problema, pivot modelo, pivot canal, mata). Pontue cada uma pelo trabalho exigido + chance de funcionar. Decida com critério.

### O experimento exige produto mínimo que ainda não existe

Use Wizard of Oz ou Concierge — produto manual por trás, fachada real. Princípio: simular entrega antes de construir.

### Não sei se devo voltar para `discover-business` ou continuar

Se a premissa refutada quebrou hipótese central do problema/persona → volte para `discover-business`. Se quebrou só o modelo de negócio → `design-business-model`. Se quebrou MVP → `define-product`. ADR explica a decisão.

## Próximo passo

Não há próxima skill fixa. Volte para a skill da fase que você estava antes — agora com confiança atualizada na premissa.

Se decisão de pivot foi tomada:

➡️ Volte para a skill correspondente à fase que precisa rever (`discover-business`, `define-product`, etc.).

➡️ Crie ADR via [`create-adr`](11-create-adr.md) registrando a decisão.

## Referências cruzadas

- [`.claude/skills/validate-idea/SKILL.md`](../../.claude/skills/validate-idea/SKILL.md) — arquivo consumido pela IA.
- [`tests/skills/validate-idea.md`](../../tests/skills/validate-idea.md) — checks canônicos.
- Rules relevantes:
  - [`documentation-first`](../../.claude/rules/documentation-first.md)
  - [`explain-tradeoffs`](../../.claude/rules/explain-tradeoffs.md)
- Agents relevantes:
  - [`ux-researcher`](../../.claude/agents/ux-researcher.md) — para entrevistas.
  - [`business-mentor`](../../.claude/agents/business-mentor.md) — para validar hipóteses de monetização.
- Templates relevantes:
  - [`adr-template.md`](../../templates/adr-template.md) — para registrar decisão consequente.
