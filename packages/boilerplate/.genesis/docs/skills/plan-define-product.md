# Skill: `define-product`

> Traduz o entendimento de negócio em decisões concretas de produto: MVP, jornadas críticas e roadmap em horizontes.

| Campo | Valor |
|-------|-------|
| Skill ID | `define-product` |
| Fase do fluxo | Fase 4 — produto e MVP |
| Skill anterior | [`design-business-model`](plan-design-business-model.md) ou [`discover-business`](disc-discover-business.md) |
| Skill seguinte | [`plan-modules`](plan-modules-mvp.md) (ou [`validate-idea`](disc-validate-idea.md) se premissas fatais ainda abertas) |
| Tempo típico | 1–2 horas |

## Contexto e objetivo

`define-product` é onde "tenho uma ideia para um sistema que faz X, Y, Z" vira "no MVP entram só X e parte do Y, na sequência Z, e nunca W". Aqui você **corta agressivamente**.

A skill faz três coisas:

1. **Mapeia jornadas críticas** do usuário (no máximo 2–3 — não 8).
2. **Define o MVP** com escopo IN, escopo OUT, anti-MVP e critérios de sucesso/fracasso em 60 dias.
3. **Esboça roadmap em horizontes** Now/Next/Later (sem datas fixas).

O que `define-product` **não faz**:

- Não escolhe tecnologia.
- Não define banco de dados, frameworks, padrões de código.
- Não desenha telas ou UX detalhada.
- Não define preços (isso é `design-business-model`).

## Quando você deve invocar

- Após [`discover-business`](disc-discover-business.md) (ou [`design-business-model`](plan-design-business-model.md)) ter te dado clareza de público e monetização.
- Quando você precisar **cortar escopo** mas não consegue sozinho.
- Quando o time estiver discutindo "isso entra no MVP?" sem critério.
- Antes de [`plan-modules`](plan-modules-mvp.md) — não dá pra modular um produto que ainda não tem MVP definido.

**Gatilhos no chat:**

- "vamos definir o MVP"
- "quais funcionalidades vão entrar primeiro?"
- "preciso planejar a jornada do aluno"
- "ajude a cortar escopo"

## Pré-condições

- [ ] [`product-vision.md`](../../../docs/product/product-vision.md) preenchido (visão e north star).
- [ ] [`problem-statement.md`](../../../docs/product/problem-statement.md) com problema e quem sofre.
- [ ] [`target-users.md`](../../../docs/product/target-users.md) com persona primária clara.
- [ ] [`value-proposition.md`](../../../docs/product/value-proposition.md) preenchido.
- [ ] [`business-model.md`](../../../docs/business/business-model.md) ou [`monetization.md`](../../../docs/business/monetization.md) com pelo menos uma fonte de receita declarada.

Se algum item está vazio, **volte e complete antes**. Definir MVP sem monetização clara leva a feature creep.

## O passo a passo

### 1. Invoque a skill

> "vamos definir o MVP"

A IA carrega `define-product`, lê os arquivos de pré-condição, e começa pela jornada do usuário.

### 2. Mapeie 2–3 jornadas críticas

A IA vai perguntar:

> "Quais são os 2–3 fluxos centrais que o usuário primário precisa fazer para receber valor?"

**Para cada jornada**, preencha:

- **Persona** específica que executa.
- **Cenário** concreto (não abstrato).
- **Objetivo** mensurável.
- **Pré-condição** (o que precisa estar configurado).
- **Passos** numerados (gatilho → ação → resultado).
- **Fricções esperadas**.
- **Momento de verdade** — o ponto em que o usuário decide se ficou impressionado ou frustrado.
- **Métricas** observáveis.

A IA escreve em [`docs/product/user-journeys.md`](../../../docs/product/user-journeys.md).

**Regra:** se você listar mais de 3 jornadas no MVP, a IA vai discordar. Empurre para 2.

### 3. Defina escopo IN

Liste as features que **precisam** estar no MVP. Para cada uma, a IA exige:

- **Persona atendida**.
- **Por que é essencial agora** (ligado ao critério de sucesso).
- **Definição de pronto** específica e testável.

Se a lista passar de 5 features IN, **a IA vai pedir corte**. Volte e priorize.

### 4. Defina escopo OUT (o que NÃO entra)

Tão importante quanto o IN. Listar o que está conscientemente fora:

- Por que cortou.
- Quando reavaliar.

Esta seção **não é caprichosa**. Ela vai te proteger de pressão futura ("e se a gente colocasse só essa pequena feature aqui?"). Cada item OUT é uma decisão registrada.

### 5. Defina anti-MVP

Coisas que **pioram o MVP** se entrarem (não apenas "ficariam para depois"). Geralmente:

- Importação CSV no dia 1 → cria suporte hell.
- White label → não há clientes ainda.
- Múltiplas integrações de gateway → uma basta.

### 6. Defina critério de sucesso e fracasso em 60 dias

A IA vai exigir números, não adjetivos:

- ✅ Critério de sucesso: "10 escolas pagantes ativas em 60 dias", "NPS ≥ 40", "50% dos usuários voltam na semana 2".
- ❌ Critério de fracasso: "<3 pagantes em 60 dias → pivot na persona", "0 cursos publicados no marketplace em 30 dias → reavaliar a hipótese marketplace".

Sem critério de fracasso, "MVP fracassou" vira opinião. Com critério, vira decisão.

### 7. Esboce o roadmap em horizontes

Now (4–8 semanas), Next (3–6 meses), Later (6+ meses). Sem datas fixas. Para cada iniciativa do Now:

- Que hipótese ela valida.
- Critério de sucesso por iniciativa.

A IA escreve em [`docs/product/roadmap.md`](../../../docs/product/roadmap.md).

### 8. Identifique premissas que precisam de validação

Se durante a discussão surgiram afirmações fortes não validadas ("usuários querem essa feature"), registre em [`assumptions.md`](../../../docs/research/assumptions.md). Premissas críticas com confiança 1-2 e impacto alto/fatal **devem** ir para [`validate-idea`](disc-validate-idea.md) antes do desenvolvimento.

### 9. Atualize `PROJECT_STATE.md` e sugira próxima skill

A IA marca Fase 4 como concluída e sugere [`plan-modules`](plan-modules-mvp.md) (ou [`validate-idea`](disc-validate-idea.md) se premissas fatais).

## Perguntas que a mentora vai fazer

### Sobre fluxos

**1. Quais são os principais fluxos do usuário?**
Por que importa: define o produto na prática. Se você cita 7+ fluxos, eles não são "principais" — você não priorizou.

### Sobre MVP

**2. Qual é o MVP mínimo?**
Por que importa: "mínimo" significa que cortar mais inviabiliza testar a hipótese central. Se ainda dá pra cortar, não é mínimo.

**3. O que NÃO deve entrar no MVP?**
Por que importa: lista OUT é proteção contra escopo crescente.

**4. Quais funcionalidades são críticas?**
Por que importa: priorização sem critério vira política.

**5. Quais são desejáveis?**
Por que importa: bom para o Next/Later do roadmap, não para o Now.

**6. Quais são perigosas ou prematuras?**
Por que importa: identifica anti-MVP.

### Sobre persona

**7. Quais personas devem ser atendidas primeiro?**
Por que importa: tentar atender 3 personas no MVP é cilada. Escolha 1, no máximo 2 muito ligadas.

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte |
|---------|-------------|-------|
| [`user-journeys.md`](../../../docs/product/user-journeys.md) | 2–3 jornadas críticas detalhadas + mapa global de fricções. | Você. |
| [`mvp-scope.md`](../../../docs/product/mvp-scope.md) | Hipótese a validar, escopo IN/OUT, anti-MVP, critérios sucesso/fracasso, tempo-caixa, métricas-instrumento. | Você. |
| [`roadmap.md`](../../../docs/product/roadmap.md) | Now/Next/Later, riscos por horizonte, não-roadmap. | Você. |
| [`assumptions.md`](../../../docs/research/assumptions.md) | Premissas novas surgidas. | A IA registra. |
| [`open-questions.md`](../../../docs/research/open-questions.md) | Perguntas que apareceram. | A IA registra. |
| [`PROJECT_STATE.md`](../../../docs/PROJECT_STATE.md) | Marca Fase 4 ✅. | A IA atualiza. |

## Critérios de "terminei essa skill"

- [ ] Pelo menos 2 jornadas críticas mapeadas com passos e fricções.
- [ ] MVP IN com ≤ 5 features, cada uma com persona + dor + definição de pronto.
- [ ] MVP OUT explícito com motivo de corte e "quando reavaliar".
- [ ] Anti-MVP listado (≥ 1 item).
- [ ] Critério de sucesso em 60 dias com números.
- [ ] Critério de fracasso definido com plano de ação.
- [ ] Roadmap nos 3 horizontes preenchidos.
- [ ] `PROJECT_STATE.md` mostra Fase 4 ✅ e sugere próxima skill.

## Anti-padrões — sinais de que algo está errado

🚫 **"Tudo é crítico, não consigo cortar."** Cortar é a definição de MVP. Volte ao north star — qual a hipótese central? O que falta cortar até ficar só essa hipótese?

🚫 **"Vou colocar 8 features no MVP porque o produto precisa disso para funcionar."** Releia o problem statement. Você precisa **testar a hipótese**, não entregar produto perfeito.

🚫 **"Critério de sucesso é 'usuários vão amar'."** Sem números, é fantasia. Empurre: "qual o número que prova 'amaram'?".

🚫 **Não tem critério de fracasso.** Sem ele, MVP nunca "fracassa" oficialmente, só vai sendo prorrogado.

🚫 **Roadmap virou cronograma com datas fixas.** Horizontes são intencionais — datas mentem.

🚫 **Você listou todas as personas no MVP.** Escolha 1 (primária). Atender 3 personas no MVP = falhar em 3 frentes.

🚫 **Tem feature IN sem persona explícita.** Cada feature deve apontar para uma pessoa concreta que vai usar. Sem isso, é palpite.

## Exemplo aplicado: tchr

**Hipótese central do MVP:**
> Donas de escolas pequenas pagam recorrentemente por uma plataforma única que reduz tempo de gestão e captura mensalidades automaticamente.

**Jornadas críticas (2):**

1. **Cadastro de turma + cobrança recorrente Pix** (persona: Marina, dona).
   - Gatilho: começo do mês.
   - Passos: abre app → cria turma → seleciona alunos → escolhe dia de vencimento → sistema gera Pix e envia.
   - Momento de verdade: ver dashboard mostrando 22 de 25 pagas no dia seguinte sem intervenção.
2. **Publicação de curso no marketplace** (persona: Marina como criadora ou criador autônomo).
   - Gatilho: aluno externo pediu acesso a um conteúdo já gravado.
   - Passos: criar curso → preço → preview público → primeira venda → repasse D+14.
   - Momento de verdade: primeira venda fora do círculo conhecido.

**Escopo IN (4 features):**

1. Cadastro de tenants (escola/criador) e alunos.
2. Cobrança recorrente Pix (1 gateway + reconciliação por webhook).
3. Catálogo público de cursos por tenant.
4. Dashboard de cobranças e vendas.

**Escopo OUT:**
- Emissão de NF-e → terceirizada em fase 2.
- App mobile nativo → web responsivo cobre.
- Relatórios pedagógicos → não conecta à hipótese central.
- Importação CSV gigante → cria suporte hell no início.
- Múltiplos gateways → 1 basta para testar willingness to pay.

**Anti-MVP:**
- White label.
- Múltiplos idiomas.
- Webhook para integração de terceiros (B2D).
- Editor de conteúdo nativo (curso é vídeo + arquivos, não SCORM).

**Critério de sucesso em 60 dias:**
- 10 escolas pagantes ativas com ≥ 5 alunos cada.
- 20 cursos publicados no marketplace.
- NPS ≥ 40.
- Taxa de geração de cobranças com sucesso ≥ 99%.

**Critério de fracasso:**
- < 3 escolas pagantes em 60 dias → pivot na persona (talvez B2B2C via associações).
- 0 cursos publicados com venda em 30 dias → reavaliar hipótese marketplace.

**Roadmap:**
- Now (4–8 semanas): cobrança Pix + catálogo público.
- Next (3–6 meses): relatório financeiro + app aluno mobile + sala virtual integrada.
- Later (6+ meses): integração com associações de escolas, IA para previsão de evasão.

**Não-roadmap (intencional):**
- Virar ERP completo.
- Concorrer com Hotmart em afiliados.
- Vender para grandes redes corporativas.

## Troubleshooting

### Não consigo cortar features

Use o teste do "se eu remover, a hipótese central ainda é testável?". Se sim, corte. Repita até a remoção comprometer o teste.

### Tenho 5 personas relevantes

Escolha 1 como primária (a que mais sofre, paga mais, ou destrava o canal). Outras viram secundárias com prioridade baixa no Now.

### Não sei se é MVP ou se já é produto completo

MVP = menor escopo que valida a hipótese central com usuários reais pagando (quando o modelo prevê pagamento). Se você inclui "feature para empolgar investidor", não é MVP.

### A IA não está cortando — está concordando com tudo

Empurre: "aja como `product-strategist` e me force a cortar 30% desse escopo". A skill é cética por design, mas se você está respondendo com muita certeza, ela pode confiar demais.

### Tenho premissa crítica não validada (vão pagar X?)

Antes de avançar para `plan-modules`, invoque [`validate-idea`](disc-validate-idea.md). Construir baseado em achismo crítico é caro.

## Próximo passo

➡️ **[`plan-modules`](plan-modules-mvp.md)** — quebrar o MVP em módulos.

ou (se premissas fatais ainda abertas):

➡️ **[`validate-idea`](disc-validate-idea.md)** — validar antes de construir.

## Referências cruzadas

- [`.claude/skills/plan-define-product/SKILL.md`](../../../.claude/skills/plan-define-product/SKILL.md) — arquivo consumido pela IA.
- [`.genesis/tests/skills/plan-define-product.md`](../../tests/skills/plan-define-product.md) — checks canônicos.
- Rules relevantes:
  - [`business-before-technology`](../../../.claude/rules/plan-business-before-technology.md)
  - [`avoid-overengineering`](../../../.claude/rules/plan-avoid-overengineering.md)
- Agents relevantes:
  - [`product-strategist`](../../../.claude/agents/plan-product-strategist.md) — pode revisar escopo e cortar.
  - [`ux-researcher`](../../../.claude/agents/plan-ux-researcher.md) — para revisar jornadas.
- Templates relevantes:
  - [`user-story-template.md`](../../templates/user-story-template.md) — para detalhar features do escopo IN.
