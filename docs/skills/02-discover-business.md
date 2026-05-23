# Skill: `discover-business`

> Conduz Fases 2 e 3 — público, mercado, concorrência, proposta de valor e fontes de receita iniciais.

| Campo | Valor |
|-------|-------|
| Skill ID | `discover-business` |
| Fase do fluxo | Fases 2–3 — público/mercado + valor/monetização |
| Skill anterior | [`init-project`](01-init-project.md) |
| Skill seguinte | [`design-business-model`](06-design-business-model.md) |
| Tempo típico | 1–2 horas |

## Contexto e objetivo

`discover-business` é a ponte entre "tenho uma ideia" e "consigo conversar sobre o negócio sem viagem". Depois dela, você sabe:

- **Quem é o usuário primário** (com JTBD claro).
- **Quem é o comprador** (pode ser diferente do usuário).
- **Quem são os concorrentes diretos, indiretos e a inércia**.
- **Como hoje as pessoas resolvem o problema** (e por que não basta).
- **Qual a proposta de valor** em uma frase falsificável.
- **Por onde o dinheiro pode entrar** (hipóteses, não compromisso ainda).

A skill faz isso pressionando você a sair do abstrato. Ela vai brigar com "para todo mundo", "não tem concorrente igual", "vamos cobrar quando descobrirmos". Esse é o trabalho dela.

O que `discover-business` **não faz**:

- Não escolhe tecnologia.
- Não define o MVP (isso é Fase 4 com `define-product`).
- Não desenha pricing definitivo (isso é `design-business-model` em sequência).

## Quando você deve invocar

- Imediatamente após `init-project` terminar a Fase 1.
- Quando precisar revisar profundamente o entendimento de negócio de um projeto que já existe.
- Quando algo mudar no mercado (novo concorrente forte, regulação, pivô).

**Gatilhos no chat:**

- "concluí a Fase 1, e agora?"
- "vamos pensar mercado e monetização"
- "quero revisar o modelo de negócio"

## Pré-condições

- [ ] [`init-project`](01-init-project.md) concluído.
- [ ] [`docs/product/product-vision.md`](../product/product-vision.md) preenchido.
- [ ] [`docs/product/problem-statement.md`](../product/problem-statement.md) preenchido com pelo menos 1 evidência.
- [ ] Você já fez pelo menos 3 conversas qualitativas com pessoas que sofrem do problema (mesmo que informais). Se não fez, **pause** e faça antes — essa skill perde valor sem material real para discutir.

## O passo a passo

### 1. Invoque a skill

> "vamos pensar mercado e monetização"

ou

> "rode a skill discover-business"

A IA vai ler os arquivos de pré-condição e começar pela Fase 2 (público e mercado).

### 2. Fase 2 — público e mercado (~30–45 min)

A IA fará blocos de 3–5 perguntas. As perguntas-base:

1. Quem é o **usuário principal**?
2. Quem é o **comprador**?
3. Quem é o **decisor**?
4. Quem são os **concorrentes diretos**?
5. Quem são os **concorrentes indiretos**?
6. Como as pessoas resolvem esse problema **hoje**?
7. O que faria alguém **trocar a solução atual** pela sua?

A IA registra as respostas em três arquivos:

- [`docs/product/target-users.md`](../product/target-users.md) — persona primária, secundárias, anti-personas, mapa de papéis.
- [`docs/business/market-analysis.md`](../business/market-analysis.md) — TAM/SAM/SOM, tendências, regulação.
- [`docs/business/competitors.md`](../business/competitors.md) — matriz comparativa incluindo a inércia.

**Atenção:** se você responder "não tem concorrente", a IA vai discordar. **Inércia** (não comprar nada, continuar na planilha + WhatsApp) é concorrente. Listar inércia força você a perguntar "o que faria a pessoa mudar?".

### 3. Fase 3 — valor e monetização (~30–45 min)

Após a Fase 2 fechar, a IA passa para Fase 3. Perguntas-base:

1. Qual é a **proposta de valor** no formato "Para X que sofre com Y, somos Z que entrega W. Diferente de \<concorrente\>, somos \<diferencial\>"?
2. Como o projeto pode **ganhar dinheiro**? (uma fonte ou várias?)
3. Existe **assinatura**?
4. Existe **comissão**?
5. Existe **pagamento único**?
6. Existe **plano gratuito**?
7. Existe **marketplace**?
8. Existe **venda enterprise**?
9. Quais **métricas** indicam que o projeto está dando certo?

Documentos:

- [`docs/product/value-proposition.md`](../product/value-proposition.md) — VPC simplificado.
- [`docs/business/business-model.md`](../business/business-model.md) — Business Model Canvas resumido.
- [`docs/business/monetization.md`](../business/monetization.md) — fontes de receita inicial.

### 4. Registro de premissas e riscos

A IA vai pegar afirmações que você fez ("vão pagar R$ 200/mês", "o canal Instagram traz N leads") e marcá-las como **premissas** em [`docs/research/assumptions.md`](../research/assumptions.md), com nível de confiança (1–5) e impacto (baixo/médio/alto/fatal).

Vai também identificar **riscos de negócio** e registrar em [`docs/business/risks.md`](../business/risks.md).

Você deve revisar cada premissa: a confiança está honesta? Se há premissa com confiança 1-2 e impacto alto/fatal, **considere invocar [`validate-idea`](04-validate-idea.md) antes de avançar**.

### 5. Decida se precisa de ADR

Se uma decisão importante surgir nesta skill (ex.: "modelo principal de receita será comissão de marketplace, não assinatura"), peça para criar ADR via [`create-adr`](11-create-adr.md). Não é obrigatório agora — pode ser feito depois, mas registrar cedo evita debate repetido.

### 6. Atualize `PROJECT_STATE.md`

A IA marca Fases 2 e 3 como concluídas e indica próxima skill ([`design-business-model`](06-design-business-model.md) ou [`define-product`](03-define-product.md), dependendo do desbalanceamento — geralmente `design-business-model` se a monetização ainda está nebulosa).

## Perguntas que a mentora vai fazer

### Sobre público

**1. Quem é o usuário principal?**
Por que importa: pessoa que vai abrir o app todo dia. Sem isso claro, todo design fica abstrato.

**2. Quem é o comprador?**
Por que importa: pode ser diferente do usuário. Aluno usa, escola paga. Funcionário usa, empresa paga. Define o GTM.

**3. Quem é o decisor?**
Por que importa: em B2B, decisor e comprador podem ser pessoas diferentes (CIO decide, departamento compra).

### Sobre concorrência

**4. Quem são os concorrentes diretos?**
Por que importa: define posicionamento e benchmark de preço.

**5. Quem são os concorrentes indiretos?**
Por que importa: empresas que pegam o mesmo budget mas resolvem de outro jeito. Conta Azul versus seu sistema de gestão.

**6. Como as pessoas resolvem o problema hoje?**
Por que importa: descobre a inércia e mostra qual UX você precisa superar.

**7. O que faria alguém trocar?**
Por que importa: identifica o "trigger de mudança". Sem trigger, custo de aquisição é alto demais.

### Sobre valor e monetização

**8. Proposta de valor?**
Por que importa: tem que sobreviver ao "teste do crítico" — uma pessoa cética leria e diria "interessante, me explica como faz".

**9. Como ganha dinheiro?**
Por que importa: define toda a arquitetura financeira e de cobrança.

**10. Marketplace, comissão, assinatura, único?**
Por que importa: cada modelo tem ônus operacional diferente.

**11. Plano gratuito?**
Por que importa: pode ser aquisição ou ralo de suporte.

**12. Métricas de sucesso?**
Por que importa: north star foi definida em `init-project`; aqui você desdobra em métricas operacionais.

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte |
|---------|-------------|-------|
| [`target-users.md`](../product/target-users.md) | Persona primária, secundárias, anti-personas, mapa de papéis (usuário, comprador, decisor, influenciador). | Você + entrevistas. |
| [`market-analysis.md`](../business/market-analysis.md) | TAM/SAM/SOM com cálculo visível, tendências favoráveis e adversas, regulação, janela. | Você + dados públicos. |
| [`competitors.md`](../business/competitors.md) | Diretos, indiretos, substitutos, inércia. Matriz comparativa. | Você. |
| [`value-proposition.md`](../product/value-proposition.md) | Frase no formato VPC, jobs/dores/ganhos, diferenciais reais. | Você. |
| [`business-model.md`](../business/business-model.md) | Business Model Canvas resumido. | Você. |
| [`monetization.md`](../business/monetization.md) | Fontes de receita iniciais, hipóteses, métricas-chave. | Você. |
| [`assumptions.md`](../research/assumptions.md) | Premissas surgidas com nível de confiança e impacto. | A IA registra automaticamente. |
| [`risks.md`](../business/risks.md) | Riscos de negócio identificados. | A IA registra. |
| [`PROJECT_STATE.md`](../PROJECT_STATE.md) | Marca Fases 2 e 3 como concluídas. | A IA atualiza. |

## Critérios de "terminei essa skill"

- [ ] Persona primária clara com JTBD, dor aguda, ganho desejado.
- [ ] Pelo menos 1 persona secundária e 1 anti-persona registradas.
- [ ] Mapa de papéis (usuário/comprador/decisor) explícito.
- [ ] Pelo menos 3 concorrentes mapeados (diretos + indiretos + inércia).
- [ ] Matriz comparativa com pelo menos 4 critérios.
- [ ] Proposta de valor sobreviveu ao "teste do crítico".
- [ ] Pelo menos 1 fonte de receita definida com hipóteses.
- [ ] Pelo menos 3 premissas registradas em `assumptions.md`.
- [ ] Pelo menos 3 riscos de negócio em `risks.md`.
- [ ] `PROJECT_STATE.md` mostra Fases 2 e 3 ✅.

## Anti-padrões — sinais de que algo está errado

🚫 **"Nosso público-alvo é todo mundo que tem esse problema."** Empurre a IA: "exija que eu nomeie uma persona arquetípica específica".

🚫 **"Não temos concorrente, somos únicos."** A inércia é concorrente. Se a pessoa pode continuar fazendo do jeito atual sem comprar nada, isso compete com você.

🚫 **"A monetização a gente vê depois."** Fase 3 obriga hipóteses. "Depois" é Fase 6 (stack) — não esse momento.

🚫 **A IA aceitou TAM/SAM/SOM sem mostrar cálculo.** Peça: "me mostre como esse número foi calculado, e em que fonte se baseou".

🚫 **Você cita 12 features como diferenciais.** Só é diferencial se for **importante para o usuário** E (**único** OU **difícil de copiar**). Geralmente sobram 1 ou 2.

🚫 **Premissa "vão pagar R$ X" registrada com confiança 5 sem entrevista.** Confiança 5 = validado em produção. Sem dado real, confiança máxima é 3.

## Exemplo aplicado: tchr

**Persona primária definida:**
> Marina, 38 anos, dona de escola de idiomas em SP, 80 alunos, 4 salas, secretaria de 1 pessoa. JTBD: "cobrar mensalidades em dia e acompanhar evasão sem virar a noite na planilha." Dor aguda: aluno some por 2 meses e ninguém percebe.

**Concorrentes mapeados:**
- **Diretos:** Wisecup (R$ 250/mês, sem marketplace), QueroSistemas (focado em escola de música).
- **Indiretos:** Conta Azul + Hotmart somados (gestão e venda separadas).
- **Substituto:** secretária + planilha + grupos de WhatsApp.
- **Inércia:** continuar no jeito atual — é o concorrente mais forte para o primeiro ano.

**Proposta de valor:**
> "Para donas de escolas pequenas que sofrem com gestão fragmentada de alunos, conteúdo e cobrança, o tchr é uma plataforma única que automatiza administração escolar e venda de cursos. Diferente de planilhas + Hotmart + grupo de WhatsApp, o tchr conecta operação escolar e marketplace em um só painel."

**Fontes de receita (hipóteses):**
1. Mensalidade SaaS R$ 99–499/mês por tenant (escola/criador).
2. Comissão 8–15% sobre vendas no marketplace.
3. Plano enterprise sob consulta (redes de escolas).

**Premissas críticas registradas:**
- A-0001: "Donas de escolas pequenas pagam R$ 200/mês por gestão integrada." Confiança 2, impacto alto. **Precisa validação** via [`validate-idea`](04-validate-idea.md).
- A-0002: "Criadores aceitam comissão de 10–15% se houver gestão de aluno embutida." Confiança 2, impacto alto.
- A-0003: "Indicação entre escolas funciona como canal." Confiança 3, impacto médio.

**Riscos de negócio iniciais:**
- R-001: gateway de pagamento bloquear conta (alta probabilidade em marketplaces novos).
- R-002: concorrente baixar preço pela metade.
- R-003: regulação LGPD para dados de menores se apertar.

**Próximo passo sugerido:** invocar [`design-business-model`](06-design-business-model.md) para detalhar planos e pricing antes de definir o MVP.

## Troubleshooting

### A IA gerou TAM gigante e irreal

Peça: "use TAM Bottom-Up baseado em \<fonte específica\>". Ex.: "número de escolas privadas no BR (SEBRAE) × ticket médio realista × 12 meses". Sem fonte, número é fantasia.

### Não tenho entrevistas suficientes

Faça pelo menos 3 antes de avançar. Use o roteiro de [`docs/validation/user-interviews.md`](../validation/user-interviews.md).

### A IA pulou direto pra perguntar sobre marketplace sem ter validado se faz sentido

Lembre: "marketplace é uma decisão grande. Antes de detalhar, registre como hipótese a ser validada na Fase 4."

### Eu tenho contexto mas a IA está repetindo perguntas

Cole o contexto no chat antes da pergunta: "já entrevistei 14 escolas, 80% confirmaram o problema". A IA ajusta o tom.

### Não sei se devo ir para `design-business-model` ou `define-product`

Se a monetização está nebulosa (você não sabe quanto cobrar, o que vai estar no plano grátis, etc.), vá para `design-business-model` primeiro. Se está clara, vá para `define-product` definir MVP. A IA também sugere com base no estado dos docs.

## Próximo passo

➡️ **[`design-business-model`](06-design-business-model.md)** — detalhar planos, pricing, GTM antes do MVP.

ou

➡️ **[`define-product`](03-define-product.md)** — se monetização já está clara, ir direto para MVP.

## Referências cruzadas

- [`.claude/skills/discover-business/SKILL.md`](../../.claude/skills/discover-business/SKILL.md) — arquivo consumido pela IA.
- [`tests/skills/discover-business.md`](../../tests/skills/discover-business.md) — checks canônicos.
- Rules relevantes:
  - [`business-before-technology`](../../.claude/rules/business-before-technology.md)
  - [`explain-tradeoffs`](../../.claude/rules/explain-tradeoffs.md)
- Agents relevantes:
  - [`business-mentor`](../../.claude/agents/business-mentor.md) — invoke para revisar premissas e unit economics.
  - [`ux-researcher`](../../.claude/agents/ux-researcher.md) — para refinar personas.
  - [`monetization-strategist`](../../.claude/agents/monetization-strategist.md) — para revisar fontes de receita.
- Templates relevantes:
  - [`project-brief-template.md`](../../templates/project-brief-template.md) — para consolidar visão em 1 página.
