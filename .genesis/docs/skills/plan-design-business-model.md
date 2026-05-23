# Skill: `design-business-model`

> Detalha o modelo de negócio: planos, pricing com âncora, comissão, GTM e unit economics estimados.

| Campo | Valor |
|-------|-------|
| Skill ID | `design-business-model` |
| Fase do fluxo | Fase 3 detalhada — pricing e GTM |
| Skill anterior | [`discover-business`](disc-discover-business.md) |
| Skill seguinte | [`define-product`](plan-define-product.md) |
| Tempo típico | 1–2 horas |

## Contexto e objetivo

Após `discover-business`, você tem hipóteses de monetização ("vamos cobrar assinatura + comissão"). Mas hipótese não é plano: ainda falta **quanto cobrar, em quais planos, como dividir o que está em cada um, qual o motion de venda**.

`design-business-model` resolve isso. Ela transforma "vamos cobrar algo" em:

- Estrutura de planos (máximo 4 — geralmente 3).
- Pricing com **âncora** (com o que o cliente vai comparar).
- Política de comissão (se marketplace).
- Estimativa de unit economics (CAC, LTV, payback) em faixas honestas.
- Motion principal de GTM (self-service, inside sales, parceria...) e canais de aquisição.
- Lista de experimentos de pricing planejados.

A skill resiste a três tentações comuns: **descontar para fechar primeiro cliente** (vira benchmark eterno), **criar 10 planos** ("atender todo mundo"), e **definir pricing baseado em custo** em vez de valor.

O que `design-business-model` **não faz**:

- Não escolhe gateway de pagamento (isso vira ADR na Fase 7).
- Não desenha a tela de checkout (Fase 8 — spec).
- Não escolhe ferramenta de CRM ou growth.

## Quando você deve invocar

- Após [`discover-business`](disc-discover-business.md) ter mapeado fontes de receita iniciais como hipóteses.
- Antes de [`define-product`](plan-define-product.md) — porque o pricing influencia o que entra no MVP (ex.: feature gratuita ou só Pro).
- Quando o time discute pricing sem chegar a lugar nenhum.
- Antes de lançar campanha de aquisição.

**Gatilhos no chat:**

- "vamos definir os planos"
- "quanto cobrar?"
- "como vamos vender?"

## Pré-condições

- [ ] [`discover-business`](disc-discover-business.md) concluído.
- [ ] [`target-users.md`](../../../docs/product/target-users.md) com persona primária e capacidade de pagamento declarada.
- [ ] [`value-proposition.md`](../../../docs/product/value-proposition.md) preenchido.
- [ ] [`monetization.md`](../../../docs/business/monetization.md) com fontes de receita listadas como hipóteses.

## O passo a passo

### 1. Invoque a skill

> "vamos definir os planos"

A IA carrega `design-business-model` e começa pela revisão das fontes de receita.

### 2. Estrutura de planos

Para cada fonte de receita recorrente (geralmente SaaS):

- **Quantos planos** (3 ideal, 4 limite).
- **Persona-âncora** de cada plano.
- **Preço** com âncora justificada.
- **Limites técnicos** que distinguem planos (alunos máximos, recursos disponíveis, suporte).
- **Diferenciais reais** entre planos (não apenas "tudo + 1 feature").

A IA escreve em [`docs/business/pricing.md`](../../../docs/business/pricing.md).

**Regra:** se você listar mais de 4 planos, a IA vai discordar.

### 3. Pricing — âncora obrigatória

Para cada preço, declare a âncora:
- "Cliente compara com Conta Azul (R$ 150/mês)."
- "Cliente compara com Hotmart (10% de comissão)."
- "Cliente paga estagiário por R$ 800/mês — somos 1/4 disso."

Sem âncora, o número é palpite. A IA vai exigir.

### 4. Comissão (se marketplace)

Se há marketplace, defina:

- % cobrado do vendedor.
- Cobrança do comprador (geralmente nenhuma).
- Pagamento ao vendedor (D+N).
- Política de estorno e disputa.
- Limite mínimo de saque.
- Quem emite NF para quem.

### 5. Plano gratuito e trial

Decida com clareza:

- **Plano gratuito existe?** Se sim, com que objetivo (aquisição, validação, marketing)? Qual o risco (carga de suporte, canibalização)?
- **Trial existe?** Quanto tempo? Que restrições? O que sinaliza intent de pagar para conversão?

### 6. Unit economics estimados

A IA vai pedir estimativas (em faixas — não chute exato):

- **CAC** (custo de aquisição por cliente).
- **LTV** (ARPU × meses de retenção esperada).
- **Margem bruta** estimada.
- **Payback** em meses.

**Critério:** LTV/CAC ≥ 3 e payback ≤ 12 meses são sinal verde para escalar. Abaixo disso, sinalizar como risco crítico em [`risks.md`](../../../docs/business/risks.md).

### 7. Motion principal de GTM

Escolha 1 motion primário (máximo 2):

- Self-service (signup público).
- Inside sales (lead → SDR → demo).
- Field sales (vendedor externo).
- Product-led (uso grátis → conversão).
- Channel/parceiros.
- Community-led.

Justifique a escolha com base em ticket médio, ciclo de venda, persona e canal disponível.

A IA escreve em [`docs/business/go-to-market.md`](../../../docs/business/go-to-market.md).

### 8. Funil e canais

Mapeie o funil (atração → lead → ativação → conversão → retenção → referência) e liste **3–5 canais de aquisição** com:

- Hipótese (por que esse canal pode funcionar).
- Custo esperado por lead.
- Tempo para validar.

### 9. Onboarding e suporte

Para cada plano, diga:

- Onboarding self-service ou guiado?
- Suporte: e-mail, chat, telefone, SLA?
- Métrica de ativação ("quando consideramos que o cliente ativou?").

### 10. Lista experimentos de pricing planejados

Para os próximos 90 dias, liste 2–4 experimentos. Cada um com:

- Hipótese.
- Métrica de sucesso (com número).
- Tamanho amostra.

A IA escreve em [`pricing.md`](../../../docs/business/pricing.md) na seção "Testes de preço previstos".

### 11. Sugira ADR para "modelo principal de receita"

Decisão importante. Crie ADR via [`create-adr`](plan-create-adr.md):

- Decisão: "modelo primário será X" (assinatura, comissão, etc.).
- Alternativas avaliadas.
- Consequências negativas.

### 12. Atualize `PROJECT_STATE.md` e sugira próxima skill

Marca conclusão e sugere [`define-product`](plan-define-product.md).

## Perguntas que a mentora vai fazer

**1. Quem paga quanto, com que frequência?**
Por que importa: ticket médio define ciclo de vendas e GTM. R$ 50 self-service; R$ 5k inside; R$ 50k field.

**2. Tem plano gratuito? Por quê?**
Por que importa: free tier sem objetivo gera só custo de suporte.

**3. Tem trial? Por quanto tempo?**
Por que importa: 7d, 14d e 30d resolvem casos diferentes.

**4. Tem comissão de marketplace? Quanto?**
Por que importa: <8% pode não cobrir gateway + suporte; >15% afasta criadores.

**5. Quanto custa atender 1 cliente por mês?**
Por que importa: define margem real e ticket mínimo viável.

**6. Qual é a âncora de preço?**
Por que importa: cliente sempre compara. Defina contra o quê.

**7. Qual é o motion principal de GTM?**
Por que importa: errar motion vs. ticket = queimar dinheiro com vendedor caro em produto barato (ou autosserviço quando precisava de suporte).

**8. Quais canais vamos testar nos primeiros 90 dias?**
Por que importa: começar com 4 canais = falhar em 4. Foque em 1–2.

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte |
|---------|-------------|-------|
| [`pricing.md`](../../../docs/business/pricing.md) | Planos, preços, âncoras, comissão, descontos, política de reajuste, experimentos. | Você. |
| [`monetization.md`](../../../docs/business/monetization.md) | Refinamento das fontes de receita, métricas chave, custos diretos. | Você. |
| [`business-model.md`](../../../docs/business/business-model.md) | Atualizações em segmentos, canais, recursos-chave, parcerias, custos. | Você. |
| [`go-to-market.md`](../../../docs/business/go-to-market.md) | Motion escolhido, funil, canais, onboarding, métricas GTM. | Você. |
| [`risks.md`](../../../docs/business/risks.md) | Riscos novos identificados (concentração de cliente, dependência de canal, etc.). | A IA registra. |
| ADR | "Modelo principal de receita". | Via [`create-adr`](plan-create-adr.md). |
| [`PROJECT_STATE.md`](../../../docs/PROJECT_STATE.md) | Atualizado. | A IA. |

## Critérios de "terminei essa skill"

- [ ] Estrutura de planos definida (≤ 4) com persona-âncora por plano.
- [ ] Pricing com âncora justificada em cada plano.
- [ ] Plano gratuito e trial decididos (sim/não + condições).
- [ ] Comissão definida (se marketplace) com política de repasse/disputa.
- [ ] Unit economics estimados em faixas (CAC, LTV, payback).
- [ ] Motion de GTM declarada com justificativa.
- [ ] Pelo menos 3 canais de aquisição com hipótese + custo esperado.
- [ ] ≥ 2 experimentos de pricing planejados.
- [ ] ADR "Modelo principal de receita" criado.
- [ ] `PROJECT_STATE.md` atualizado.

## Anti-padrões — sinais de que algo está errado

🚫 **Mais de 4 planos.** Cliente entra em paralisia de escolha. 3 ideal.

🚫 **Desconto para o primeiro cliente.** Vira benchmark eterno. Cobre cheio e dê outra contrapartida (suporte premium, onboarding).

🚫 **Pricing baseado em custo, não em valor.** "Custa R$ 30 de infra, vou cobrar R$ 60." Errado. Valor entregue ao cliente é o teto; custo é o piso. Se valor < custo, projeto inviável.

🚫 **Sem âncora.** Cliente vai criar a sua âncora — pode ser desfavorável.

🚫 **LTV/CAC < 3 em cenário esperado.** Risco crítico. Registre em `risks.md` e revise antes de escalar GTM.

🚫 **"Motion: tudo. Vamos tentar self-service, inside, field e parceria ao mesmo tempo."** = falhar em 4. Escolha 1, no máximo 2.

🚫 **Plano gratuito ilimitado.** Vira ralo de suporte. Defina limites técnicos claros.

🚫 **Comissão de 30% como Hotmart.** Só se você entrega audiência. Se o criador traz a própria audiência, 30% é confisco — eles vão embora.

## Exemplo aplicado: tchr

**Estrutura de planos:**

| Plano | Preço | Para quem | Limites | Diferenciais |
|-------|-------|-----------|---------|---------------|
| Starter | R$ 99/mês | escolas até 50 alunos | 50 alunos, sem marketplace, sem cobrança automática | onboarding self-service |
| Pro | R$ 249/mês | escolas 51–200 | 200 alunos, marketplace ativo, cobrança Pix automática | suporte prioritário + relatórios |
| Business | sob consulta (≥ R$ 1.5k/mês) | redes / grandes | ilimitado, SLA, API | atendimento dedicado |

**Âncora de pricing:**

- Starter (R$ 99) vs. "secretária que faz no Excel" (custo de oportunidade R$ 800–1500).
- Pro (R$ 249) vs. Wisecup (R$ 250 sem marketplace) → mesmo preço, vantagem adicional.
- Business vs. cotação de ERP escolar gigante (R$ 3k+).

**Comissão marketplace (Pro/Business):**

- 10% sobre venda do criador.
- 0% do comprador.
- Repasse D+14 (após confirmação de pagamento + janela de estorno).
- Mínimo de saque: R$ 50.
- NF: criador emite para comprador, plataforma emite para criador (taxa).

**Plano gratuito:**
- Não no MVP. Reavaliar após 6 meses.
- Motivo: hipótese central é willingness to pay; free pode esconder isso.

**Trial:**
- 14 dias no Pro.
- Sem cartão na ativação.
- Restrição: marketplace só após pagamento.

**Unit economics estimados:**

- CAC (canal indicação + Instagram orgânico): R$ 80–200.
- ARPU médio: R$ 180/mês (mix de Starter e Pro).
- Retenção esperada: 14 meses.
- LTV: R$ 2.520.
- LTV/CAC: ~15 (excelente, mas conservador antes de validar).
- Margem bruta: 75% (infra ~25% sobre receita).
- Payback: ~1 mês após cobrança recorrente entrar.

**Motion de GTM:**
- Primário: **product-led + community**. Self-service signup, conteúdo educativo no Instagram para donas de escola.
- Secundário: parceria com associações de escolas de idiomas a partir do mês 4.

**Canais e funil:**

| Canal | Hipótese | Custo esperado | Validar em |
|-------|----------|----------------|--------------|
| Instagram orgânico (conteúdo) | criadores e donas seguem nichos | tempo de produção | 60 dias |
| Indicação (NPS-driven) | NPS alto puxa novos | crédito R$ 50 por indicação | depois de 30 clientes |
| SEO ("sistema escola pequena") | ~1.2k buscas/mês BR | R$ 60/lead estimado | 90 dias |
| Parceria com associações | grupos têm escala | comissão sobre tenants ativos | mês 4 |

**Experimentos de pricing planejados:**

1. Pro R$ 249 vs. Pro R$ 299 com 50 leads cada → medir conversão e churn 30d.
2. Trial 7d vs. 14d → medir conversão.
3. Comissão 10% vs. 12% para criadores novos → medir adesão.

**ADR proposto:** "0002 — Modelo primário de receita: SaaS recorrente + comissão de marketplace" com justificativa de não escolher só assinatura (perde alavancagem do marketplace) nem só comissão (volume insuficiente nos primeiros 6 meses).

## Troubleshooting

### Não sei quanto cobrar

Use 3 abordagens combinadas:
1. **Cost-plus** — piso (custos × margem). Não use como teto.
2. **Concorrência** — preços de comparáveis no mercado.
3. **Value-based** — "se eu economizo 10h/mês da Marina, quanto vale a hora dela?".

Pricing final tende a ficar entre essas referências.

### A IA está sugerindo plano gratuito muito generoso

Pergunte: "qual o custo de suporte estimado para um free tier com X usuários, e qual % de conversão precisamos para isso fazer sentido?". Numbers force discipline.

### Tenho 5 planos diferentes em mente

Tente reduzir agrupando. "Plano para escola pequena de idiomas" e "plano para escola de música pequena" provavelmente são o mesmo plano com case study diferente — mantenha 1.

### CAC > LTV/3 mas eu acho que vai melhorar

Registre em `risks.md` como risco crítico com plano de mitigação. Não escale GTM antes de provar.

## Próximo passo

➡️ **[`define-product`](plan-define-product.md)** — definir MVP com pricing já em mente.

## Referências cruzadas

- [`.claude/skills/plan-design-business-model/SKILL.md`](../../../.claude/skills/plan-design-business-model/SKILL.md) — arquivo consumido pela IA.
- [`.genesis/tests/skills/design-business-model.md`](../../tests/skills/design-business-model.md) — checks canônicos.
- Rules relevantes:
  - [`explain-tradeoffs`](../../../.claude/rules/plan-explain-tradeoffs.md)
  - [`business-before-technology`](../../../.claude/rules/plan-business-before-technology.md)
- Agents relevantes:
  - [`monetization-strategist`](../../../.claude/agents/plan-monetization-strategist.md) — para revisar planos e comissão.
  - [`business-mentor`](../../../.claude/agents/plan-business-mentor.md) — para revisar unit economics.
- Templates relevantes:
  - [`adr-template.md`](../../templates/adr-template.md) — para o ADR de "Modelo de receita".
