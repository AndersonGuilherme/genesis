# Skill: `create-adr`

> Skill transversal. Registra decisão arquitetural ou estratégica importante em formato consistente, com alternativas e consequências negativas listadas.

| Campo | Valor |
|-------|-------|
| Skill ID | `create-adr` |
| Fase do fluxo | **transversal** — invocada toda vez que decisão importante surgir |
| Skill anterior | qualquer skill que tenha gerado decisão |
| Skill seguinte | volta para skill da fase em curso |
| Tempo típico | 15–30 minutos por ADR |

## Contexto e objetivo

ADR (Architecture Decision Record) é a defesa contra "daqui a 6 meses ninguém vai lembrar por que decidimos isso". Sem ADR, decisão grande vira folclore — quem entrou depois questiona, sem ter contexto.

`create-adr` força um padrão consistente: número incremental, alternativas reais avaliadas, consequências honestas (positivas **e** negativas), critério para reverter.

A skill faz cinco coisas:

1. **Confirma** que a decisão merece ADR (filtra decisões pequenas/reversíveis).
2. **Determina próximo número** lendo `docs/adr/` e somando 1.
3. **Cria** `docs/adr/NNNN-titulo-kebab-case.md` usando o template.
4. **Pressiona** você a listar pelo menos 2 alternativas reais com motivo de rejeição.
5. **Atualiza** o índice em `docs/adr/README.md`.

O que `create-adr` **não faz**:

- Não decide por você — registra a sua decisão.
- Não cria ADR para decisão pequena (rename de variável, escolha de biblioteca trivial).
- Não permite editar ADR antigo — cria novo que `supersedes` quando direção muda.

## Quando você deve invocar

- Após [`choose-stack`](plan-choose-stack.md) — ADR-0001 da stack principal.
- Durante [`design-architecture`](plan-design-architecture.md) — ADRs estruturais (banco, padrão arquitetural, auth, multi-tenancy).
- Após [`design-business-model`](plan-design-business-model.md) — ADR do modelo de receita.
- Durante [`define-module-spec`](plan-define-module-spec.md) — ADR de decisões específicas do módulo.
- Após `validate-idea` ter refutado premissa fatal — ADR do pivot.
- Sempre que houver decisão "irreversível em tempo curto".
- Sempre que houver decisão de **NÃO fazer** algo importante (anti-decisão).

**Regra prática:** se daqui a 6 meses você não vai lembrar por que decidiu, é ADR.

**Gatilhos no chat:**

- "vamos registrar a decisão sobre Postgres"
- "cria ADR para a escolha de Stripe vs. Pagar.me"
- "documenta que não vamos usar microserviços agora"
- "rode create-adr"

## Quando NÃO usar

- Escolha de biblioteca pequena substituível (ex.: zod vs. valibot).
- Convenção de nome (snake_case vs. camelCase).
- Detalhe interno de implementação que não cruza fronteira.
- Decisão reversível com 1 PR.

Para essas, escreva na própria spec do módulo ou em comentário de PR.

## Pré-condições

- [ ] Decisão tem alternativas reais que foram consideradas (mínimo 2).
- [ ] Você consegue articular o contexto que pressionou para essa escolha.
- [ ] [`docs/adr/README.md`](../../../docs/adr/README.md) e [`docs/adr/adr-template.md`](../../../docs/adr/adr-template.md) existem (vêm do boilerplate).

## O passo a passo

### 1. Invoque a skill

> "vamos registrar a decisão sobre Postgres como banco primário"

A IA carrega `create-adr`.

### 2. Confirme que merece ADR

A IA pergunta:

> "Essa decisão é irreversível em tempo curto? Você consegue listar pelo menos 2 alternativas reais que foram consideradas? Se respondeu não para qualquer, talvez não precise de ADR — pode ir direto na spec ou no PR."

Se confirmar que merece, segue.

### 3. Próximo número

A IA lista `docs/adr/` e identifica o próximo número (`0001`, `0002`, ...). Confirma com você.

### 4. Título em kebab-case

A IA propõe baseado na decisão: `0002-postgres-como-banco-primario`. Você ajusta se necessário.

### 5. Copie template e preencha

A IA cria `docs/adr/0002-postgres-como-banco-primario.md` baseado em [`docs/adr/adr-template.md`](../../../docs/adr/adr-template.md). Campos:

#### Cabeçalho

| Campo | Valor |
|-------|-------|
| Número | NNNN |
| Status | proposed / accepted / deprecated / superseded by NNNN |
| Data | YYYY-MM-DD |
| Responsáveis | nomes |
| ADRs relacionados | links |

#### Contexto

O que estava acontecendo? Que forças pressionam para uma escolha? Que restrições existem?

Inclua links para:
- [`problem-statement.md`](../../../docs/product/problem-statement.md) (se afeta produto).
- [`architecture-overview.md`](../../../docs/architecture/architecture-overview.md) (se afeta arquitetura).
- ADRs anteriores impactados.

#### Decisão

Uma frase: **decidimos \<X\>**.

Detalhe:
- Como a decisão se concretiza no código/processo.
- Onde se aplica.
- Quem deve seguir.

#### Alternativas consideradas

A IA **exige** mínimo 2 alternativas reais. Para cada uma:

- **Descrição:** o que era.
- **Por que foi rejeitada:** motivo objetivo.

Se você não lista alternativas reais, a skill recusa criar ADR. Isso não é decisão — é hábito.

#### Consequências

**Positivas** (o que melhora) — claras.

**Negativas** (o que piora ou fica difícil) — **obrigatórias**. Sem isso, ADR é desonesto.

**Riscos** (o que pode dar errado) — também obrigatórios.

#### Como reverter

Passos para desfazer, **se possível em tempo razoável**. Ou: "não-revertível em tempo curto — mudança requer plano formal".

#### Validação

Como saberemos em 3-6 meses se foi boa decisão? Métrica ou sinal observável.

#### Histórico

Tabela de mudanças (data, mudança, por quem).

### 6. Atualize índice

A IA atualiza `docs/adr/README.md` adicionando linha na tabela:

| Número | Título | Status | Data |
|--------|--------|--------|------|
| 0002 | Postgres como banco primário | accepted | 2026-05-23 |

### 7. Linke do documento relacionado

A IA adiciona link no documento de arquitetura/módulo/módulo onde a decisão aparece:

```markdown
| ADR vinculado | 0002 — Postgres como banco primário (exemplo — link real apontaria para o arquivo após criação) |
```

### 8. Confirme com você

A IA mostra preview do ADR completo. Você revisa, ajusta tom/precisão, aprova.

## Perguntas que a mentora vai fazer

**1. Em uma frase, o que foi decidido?**
Por que importa: a clareza dessa frase é o teste do ADR. Se você não consegue resumir, decisão não é clara.

**2. Qual o contexto que forçou essa decisão?**
Por que importa: contexto explica o porquê — sem ele, futuro lê "decidimos X" sem saber por quê.

**3. Quais foram as alternativas consideradas?**
Por que importa: sem alternativas reais, é hábito, não decisão.

**4. Por que cada alternativa foi rejeitada?**
Por que importa: futuro pode reabrir debate desnecessário se motivos não estão claros.

**5. Quais consequências positivas?**
Por que importa: trade-off declarado.

**6. Quais consequências negativas?**
Por que importa: o que você está abrindo mão.

**7. Quais riscos?**
Por que importa: o que pode dar errado se a decisão se mostrar errada.

**8. Como reverter, se necessário?**
Por que importa: sinaliza quão "stuck" você fica com essa decisão.

**9. Como saberemos em 6 meses se foi boa decisão?**
Por que importa: ADR sem critério de validação fica órfão.

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte |
|---------|-------------|-------|
| `docs/adr/NNNN-<titulo>.md` | ADR novo. | Você (mentora conduz). |
| [`docs/adr/README.md`](../../../docs/adr/README.md) | Linha adicionada no índice. | A IA. |
| Documento de arquitetura/módulo relacionado | Link para o novo ADR. | A IA. |

## Critérios de "terminei essa skill"

- [ ] ADR criado com todos os campos preenchidos.
- [ ] Mínimo 2 alternativas com motivo de rejeição.
- [ ] Consequências negativas listadas.
- [ ] Riscos listados.
- [ ] Critério de validação em 6 meses definido.
- [ ] Status definido (geralmente `accepted`).
- [ ] Índice em `docs/adr/README.md` atualizado.
- [ ] Documento relacionado com link.

## Anti-padrões — sinais de que algo está errado

🚫 **Sem alternativas.** Não é decisão. Recuse criar ADR.

🚫 **Sem consequências negativas listadas.** Desonesto. Revise.

🚫 **Editou ADR antigo.** Não. Crie novo que `supersedes`.

🚫 **ADR sem data.** Sem isso, contexto histórico se perde.

🚫 **"Decisão pequena" virou ADR.** Verifique critério — talvez fique melhor em comentário de PR.

🚫 **Anti-decisão sem registrar.** "Decidimos NÃO usar microserviços" precisa de ADR tanto quanto "decidimos usar X". Talvez mais — anti-decisões protegem contra pressão futura.

🚫 **ADR longo demais (8+ páginas).** ADR bom é 1-2 páginas. Se está mais, está incluindo detalhes que vão em spec.

🚫 **Critério de validação vago ("vamos ver se está dando certo").** Defina métrica observável.

## Exemplo aplicado: tchr

### ADR-0001 — Stack principal

```markdown
# ADR-0001: Stack principal Node.js + Next.js + Postgres

| Campo | Valor |
|-------|-------|
| Número | 0001 |
| Status | accepted |
| Data | 2026-05-23 |
| Responsáveis | Anderson (founder) |
| ADRs relacionados | (será atualizado em 0002+) |

## Contexto

O tchr precisa de uma plataforma SaaS B2B com marketplace integrado. Restrições: time de 1 founder + 1 dev sênior previsto, orçamento mensal inicial de R$ 800, time forte em TypeScript e Elixir, médio em Go.

MVP exige: SEO para páginas públicas, cobrança Pix nativa, multi-tenant pool, deploy fácil. Volume esperado em 12 meses: ~150 tenants, ~5k alunos, picos sazonais em fevereiro e julho.

Detalhe completo da avaliação em `docs/architecture/technology-decision.md`.

## Decisão

Adotamos como stack principal:
- **Backend:** Node.js + Fastify (monolito modular).
- **Frontend:** Next.js (SSR para SEO de páginas públicas, CSR para painéis).
- **Banco:** Postgres (via Neon ou Railway).
- **Cache + Fila:** Redis (BullMQ para fila).
- **Storage:** Cloudflare R2.
- **Auth:** próprio com argon2id + JWT.
- **Pagamentos:** Pagar.me (Pix nativo) + Asaas como fallback.
- **Email:** Resend.
- **Observabilidade:** Sentry + OpenTelemetry → Grafana Cloud.
- **Deploy:** Railway no MVP.

## Alternativas consideradas

### Alternativa 1 — Elixir + Phoenix + Postgres

- **Descrição:** stack BEAM com Phoenix LiveView para painéis e Oban para filas.
- **Por que foi rejeitada:** mercado de contratação menor no BR, libs de pagamento BR menos maduras em Elixir (escreveríamos adapters), e time precisa de rampa para o dev novo. Vantagem real (BEAM para tempo real) não é diferencial central no MVP. Se tempo real virar core no futuro, podemos migrar **apenas o módulo de presença** para Elixir.

### Alternativa 2 — Go + Echo + Postgres

- **Descrição:** stack Go com framework Echo, mantendo Next.js no front.
- **Por que foi rejeitada:** produtividade do founder cai (médio em Go, fortíssimo em TypeScript), e ecossistema de pagamento BR mais maduro em Node. Custo de runtime menor não justifica perda de velocidade no MVP atual (volume pequeno).

## Consequências

### Positivas
- Velocidade máxima de entrega no MVP.
- Stack que o founder domina, reduzindo bugs e tempo de debug.
- Comunidade ampla e contratação fácil no BR.
- Custo inicial baixo (Railway + R2 + Resend cabem em ~R$ 200/mês).

### Negativas
- Caminho de escala para tempo real é mais frágil que Elixir.
- Node tem armadilhas conhecidas em event loop quando workloads crescem desproporcional.
- Lock-in moderado em Pagar.me/Asaas — fallback existe mas é trabalho integrar segundo.

### Riscos
- Se "sala virtual com presença ao vivo" virar diferencial central em 12 meses, podemos precisar migrar o módulo correspondente.
- Custo de Railway pode crescer não-linear quando volume aumentar (mitigação: monitorar mensalmente).

## Como reverter

Não-revertível em tempo curto. Substituir stack inteira após 6 meses de produto exige rewrite gradual módulo a módulo. Decisão é praticamente irreversível por 12-18 meses.

## Validação

Em 6 meses (novembro 2026), revisar:
- Custo total de infra ainda < R$ 1.5k/mês para os tenants ativos.
- Produtividade do time medida em features entregues por sprint.
- Nenhum incidente arquitetural causado por escolha de stack.

Se 2 ou mais critérios falharem, reabrir ADR.

## Histórico

| Data | Mudança | Por quem |
|------|---------|----------|
| 2026-05-23 | criado | Anderson |
```

### ADR-0003 — Não usar microserviços no MVP (anti-decisão)

```markdown
# ADR-0003: Monolito modular no MVP, sem microserviços

| Campo | Valor |
|-------|-------|
| Status | accepted |
| Data | 2026-05-23 |

## Contexto

Time pequeno (1-2 devs), volume baixo nos primeiros 6 meses (< 150 tenants), e disciplina de fronteiras pode ser obtida com monolito modular sem custo operacional de microserviços (mesh, observability distribuída, complexidade de deploy).

## Decisão

Monolito modular como padrão arquitetural. Cada módulo (identity, school-management, billing, catalog, marketplace, notifications) tem fronteira clara via API/eventos, mas vive no mesmo deploy unit.

## Alternativas consideradas

### 1 — Microserviços desde o início
- Rejeitada: overhead operacional desproporcional ao time. Custo de mesh + observability + deploy + debug distribuído supera benefício em qualquer cenário de volume previsto em 12m.

### 2 — Monolito não-modular
- Rejeitada: perde a possibilidade de extrair módulo no futuro quando volume justificar. Disciplina de fronteiras é o que protege essa opção futura.

## Consequências

### Positivas
- Deploy simples (1 imagem, 1 pipeline).
- Debug centralizado.
- Custo de infra mais baixo.

### Negativas
- Workloads diferentes compartilham mesmo runtime — escala vertical até certo ponto.
- Quando 1 módulo precisar de escala independente, refatoração será necessária.

### Riscos
- Devs podem violar fronteiras sem perceber (mitigação: code review + lint estrutural via lint-docs.sh).

## Como reverter

Refatoração gradual módulo a módulo. Custo médio: 2-4 sprints por módulo extraído.

## Validação

Reavaliar quando:
- Algum módulo passar de 50% do tempo de CPU do app.
- Time crescer para ≥ 5 devs.
- Workloads conflitantes começarem a impactar SLO.

Em qualquer caso, revisão obrigatória aos 12 meses.
```

## Troubleshooting

### Não tenho alternativas reais — só veio essa ideia

Pausa. Pesquise pelo menos 2 outras opções viáveis. Sem alternativas, é hábito. Se a IA aceitar fazer ADR sem alternativas, ela está errada — empurre.

### Decisão pequena mas afeta longo prazo

Faça ADR. Se você tem dúvida sobre criar ou não, crie. Custo de ADR é baixo (15 min), custo de decisão perdida é alto.

### Editei o ADR antigo e perdi contexto

Reverta no git. ADRs antigos não devem ser editados — só status pode mudar para `deprecated` ou `superseded`. Decisões mudam: crie novo que supersede.

### ADR ficou enorme

Pergunte: parte disso é spec de implementação? Se sim, mova para a spec do módulo correspondente. ADR resume a decisão; spec detalha a implementação.

### Quem é responsável quando ADR mudar?

Quem propõe o novo ADR é responsável. O novo ADR linka `supersedes` ao antigo, e o antigo é marcado como `superseded by NNNN`.

### Time discordou da decisão depois de aprovada

Pode pedir revisão. Reabra discussão. Se concordar em mudar, crie novo ADR `supersedes`. Não force decisão impopular sem registro do dissenso (cria dívida humana).

## Próximo passo

Volte ao fluxo principal. Não há próxima skill fixa para `create-adr` — ela é serviço de outras.

Geralmente, depois de criar ADR, você continua na skill que estava antes (`choose-stack`, `design-architecture`, `define-module-spec`, etc.).

## Referências cruzadas

- [`.claude/skills/plan-create-adr/SKILL.md`](../../../.claude/skills/plan-create-adr/SKILL.md) — arquivo consumido pela IA.
- [`.genesis/tests/skills/create-adr.md`](../../tests/skills/create-adr.md) — checks canônicos.
- [`docs/adr/README.md`](../../../docs/adr/README.md) — índice mestre.
- Rules relevantes:
  - [`adr-required-for-decisions`](../../../.claude/rules/plan-adr-required-for-decisions.md)
  - [`explain-tradeoffs`](../../../.claude/rules/plan-explain-tradeoffs.md)
  - [`documentation-first`](../../../.claude/rules/plan-documentation-first.md)
- Agents relevantes:
  - [`software-architect`](../../../.claude/agents/plan-software-architect.md) — para revisar ADRs estruturais.
- Templates relevantes:
  - [`adr-template.md`](../../templates/adr-template.md)
