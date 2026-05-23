# Skill: `choose-stack`

> Escolhe a stack tecnológica com base em produto, time, custos e riscos. Stack-neutral por padrão — apresenta ≥3 opções avaliadas antes de recomendar.

| Campo | Valor |
|-------|-------|
| Skill ID | `choose-stack` |
| Fase do fluxo | Fase 6 — tecnologia |
| Skill anterior | [`plan-modules`](09-plan-modules.md) |
| Skill seguinte | [`design-architecture`](08-design-architecture.md) |
| Tempo típico | 2–3 horas |

## Contexto e objetivo

`choose-stack` é a primeira skill que toca tecnologia, e a razão de existir é uma rule inegociável: **stack-neutrality**. Nenhuma linguagem ou framework é assumido por padrão. JavaScript, TypeScript, Node, Next, Nest, Go, Elixir, Rust, Python, PHP — toda escolha precisa ser justificada pelo contexto.

A skill faz cinco coisas:

1. **Coleta restrições reais** do time e do produto.
2. **Apresenta ≥ 3 opções** (conservadora / equilibrada / escalável, opcionalmente experimental).
3. **Pontua cada opção** (1–5) em 7 critérios objetivos.
4. **Recomenda 1 opção** com justificativa **e trade-offs negativos**.
5. **Sugere ADR** para registrar a decisão.

A skill rejeita atalhos: "vamos usar Next + Nest porque é o que está em alta" não é decisão, é hábito. Mesmo que você queira manter essa escolha, ela vira **decisão consciente** com alternativas avaliadas e custos registrados.

O que `choose-stack` **não faz**:

- Não define arquitetura de alto nível (próxima skill).
- Não escolhe gateway, email provider, etc. (vai em `design-architecture` e `integration-map`).
- Não escreve scaffolding de código.

## Quando você deve invocar

- Após [`plan-modules`](09-plan-modules.md) ter definido os módulos do MVP.
- Quando o produto pivotar significativamente (revisar a decisão).
- Quando houver troca grande do time (linguagens fortes mudam).
- Pelo menos uma vez por ano, mesmo sem mudança.

**Gatilhos no chat:**

- "vamos escolher a stack"
- "javascript serve aqui? por quê?"
- "quais opções fazem sentido para uma plataforma com marketplace?"

## Pré-condições

- [ ] Fases 1 a 5 concluídas (a IA recusa rodar antes disso — rule `business-before-technology`).
- [ ] [`mvp-scope.md`](../product/mvp-scope.md) preenchido.
- [ ] [`docs/modules/`](../modules/) com lista mestra dos módulos do MVP.
- [ ] Você tem informações sobre o time (linguagens fortes/fracas, tamanho, orçamento de infra).

## O passo a passo

### 1. Invoque a skill

> "vamos escolher a stack"

A IA carrega `choose-stack`, lê o estado do projeto e começa coletando restrições.

### 2. Restrições do time e contexto

A IA vai perguntar:

| Variável | Por que importa |
|----------|------------------|
| Tamanho do time técnico hoje | 1 dev mantém menos stacks; 10 toleram mais variedade. |
| Linguagens em que o time é forte | Produtividade real. |
| Linguagens em que o time tem pouca experiência | Risco. |
| Orçamento mensal de infra | Filtro de opções caras. |
| Tolerância a custo operacional alto | Define se aceita Kubernetes/SRE. |
| Tolerância a velocidade de desenvolvimento baixa | Define se aceita Rust/Haskell. |
| Necessidade de mobile nativo no MVP | Impacta frontend grandemente. |
| Necessidade de SEO no MVP | SSR vs. SPA. |
| Necessidade de tempo real | Define candidatos (Elixir/Phoenix LiveView, Node + Socket.io, etc.). |
| Necessidade de IA pesada | Python entra como candidato real. |
| Volume esperado em 12 meses | Filtra opções que não escalam. |
| Picos sazonais | Define necessidade de autoscale. |

Anote tudo. Se você não souber alguma, marque como "?" — a IA vai pedir para refletir antes de pontuar.

### 3. Critérios de avaliação

Toda opção será pontuada (1–5) em 7 critérios:

1. **Produtividade do time** — quanto entrega por sprint.
2. **Risco operacional** — chance de quebrar em produção.
3. **Maturidade do ecossistema** — bibliotecas, comunidade.
4. **Adequação ao domínio** — quão bem resolve este produto.
5. **Custo total (TCO 12m)** — infra + ferramentas + tempo.
6. **Caminho de escala** — o que muda quando crescer 10x.
7. **Facilidade de contratar** — encontrar gente.

A IA pode adicionar critérios específicos (ex.: "suporte a Pix nativo no ecossistema BR").

### 4. Construa ≥ 3 opções

**Opção A — Conservadora.** Maximiza produtividade. Geralmente: stack mainstream com comunidade ampla. Para web: Node + Next/Nest ou Python + Django/FastAPI. Para mobile-first: React Native + Expo.

**Opção B — Equilibrada.** Trade entre produtividade e características específicas. Pode ser Elixir + Phoenix (para tempo real), Go + Echo (para baixo custo de runtime), ou Rails (para velocidade de prototipagem).

**Opção C — Escalável / específica.** Otimiza para caso particular. Elixir distribuído para presença em tempo real, Rust para latência crítica, .NET para integração com Azure/AD enterprise.

**Opção D — Experimental.** Opcional. Use só se há razão forte (ex.: time fortíssimo em algo de nicho com benefício específico).

Para cada opção, defina todas as camadas:

- Frontend
- Backend
- Banco principal
- Cache
- Filas
- Storage
- Auth
- Pagamentos (com candidatos BR: Pagar.me, Asaas, Iugu, Stark Bank, MP)
- Email (Resend, Postmark, SES)
- Observabilidade (Sentry + OpenTelemetry + Grafana/Honeycomb/Datadog)
- Deploy (Railway, Fly.io, AWS, GCP, Hetzner)
- Testes

### 5. Pontue e justifique

Para cada opção, pontuação 1–5 nos 7 critérios + **por que escolher** + **por que evitar** + **custo aproximado 12m**.

A IA pode propor pontuação inicial; você ajusta com base na sua realidade.

### 6. Recomende com trade-offs negativos

A recomendação **deve** listar:

- Por que essa venceu.
- O que você está abrindo mão ao escolher esta (trade-off negativo).
- Quando reavaliar (qual gatilho).

Sem trade-off negativo, recomendação é desonesta.

### 7. Sugira ADR `0001-stack-principal`

Invoque [`create-adr`](11-create-adr.md). A decisão de stack é o ADR de número 0001 do projeto (por convenção).

O ADR contém:

- Contexto (restrições do time, produto, orçamento).
- Decisão em 1 frase.
- Alternativas avaliadas (mínimo 2 rejeitadas, com motivos).
- Consequências positivas e negativas.
- Como reverter (geralmente "exige plano formal — não revertível em tempo curto").
- Validação em 6 meses.

### 8. Atualize `technology-decision.md`

A IA escreve em [`docs/architecture/technology-decision.md`](../architecture/technology-decision.md):

- Resumo das restrições.
- Tabela das 3+ opções pontuadas.
- Recomendação.
- Link para o ADR.

### 9. Atualize `PROJECT_STATE.md` e sugira próxima skill

Próxima é [`design-architecture`](08-design-architecture.md).

## Perguntas que a mentora vai fazer

**1. Em que linguagens o time é forte? Em quais é fraco?**
Por que importa: maior produtividade vem de linguagens conhecidas. Ignorar isso = pagar caro.

**2. Qual o tamanho do time hoje? E em 6 meses?**
Por que importa: 1 dev não opera Kubernetes; 10 talvez sim.

**3. Mobile nativo no MVP?**
Por que importa: define se entra React Native, Flutter ou nativo Swift/Kotlin no estack.

**4. SEO é crítico?**
Por que importa: força SSR (Next.js, Nuxt, Remix, Astro, Phoenix LiveView).

**5. Tempo real?**
Por que importa: Elixir/Phoenix tem vantagem natural; Node + Socket.io também serve; outros pedem mais cuidado.

**6. IA pesada no caminho crítico?**
Por que importa: Python entra como candidato; ecossistema ML está lá.

**7. Volume esperado em 12 meses?**
Por que importa: <1k usuários ativos não justifica overhead operacional pesado.

**8. Orçamento mensal de infra aceitável?**
Por que importa: filtra opções caras (Datadog full, AWS sem otimização, Kubernetes gerenciado).

**9. Tolerância a operar Kubernetes ou similar?**
Por que importa: deploy "fácil" (Railway, Fly.io) vs. controle total (AWS, GCP).

**10. Restrição regulatória (dados em BR, etc.)?**
Por que importa: filtra provedores.

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte |
|---------|-------------|-------|
| [`docs/architecture/technology-decision.md`](../architecture/technology-decision.md) | Restrições, opções pontuadas, recomendação, condição de reavaliar. | A IA conduz, você decide. |
| `docs/adr/0001-stack-principal.md` | ADR formal da escolha. | Via [`create-adr`](11-create-adr.md). |
| [`docs/architecture/integration-map.md`](../architecture/integration-map.md) | Esboço inicial (gateway, email, etc.). | A IA escreve esboço; refinar em `design-architecture`. |
| [`PROJECT_STATE.md`](../PROJECT_STATE.md) | Marca Fase 6 ✅. | A IA. |

## Critérios de "terminei essa skill"

- [ ] ≥ 3 opções descritas com pontuação completa nos 7 critérios.
- [ ] Recomendação clara em 1 frase.
- [ ] Trade-offs negativos listados.
- [ ] ADR `0001-stack-principal.md` criado com ≥ 2 alternativas rejeitadas.
- [ ] Custo aproximado 12m estimado por opção.
- [ ] [`technology-decision.md`](../architecture/technology-decision.md) atualizado.
- [ ] [`PROJECT_STATE.md`](../PROJECT_STATE.md) marca Fase 6 ✅.

## Anti-padrões — sinais de que algo está errado

🚫 **A IA assumiu Node/TypeScript desde o início.** Empurre: "apresente ≥ 3 opções, sem viés. Por que não Go ou Elixir?".

🚫 **Apenas 1 opção apresentada.** A skill é "stack-neutral". Sem alternativas, é cargo cult.

🚫 **Recomendação sem trade-off negativo.** Desonesta. Pergunte: "o que estamos abrindo mão ao escolher essa?".

🚫 **Microserviços, Kubernetes, CQRS, event sourcing no MVP.** Sem justificativa numérica, esses são overengineering. A rule `avoid-overengineering` cobre.

🚫 **"O time só sabe Go, então a opção é só Go."** Ainda assim avalie alternativas — pode ser que valha treinar em algo diferente.

🚫 **Pricing estimado sem cálculo.** "Vai custar R$ 5k/mês." Como? Mostre breakdown: infra + ferramentas + observabilidade.

🚫 **Não tem ADR ao final.** Decisão sem registro = ninguém lembra por quê em 6 meses.

🚫 **Combinação exótica sem time experiente.** "Rust + Elm + CockroachDB" pode ser tecnicamente bom mas você não consegue contratar.

## Exemplo aplicado: tchr

Exemplo completo em [`examples/tchr/technology-decision.md`](../../examples/tchr/technology-decision.md). Resumo:

**Restrições registradas:**
- Time: 1 founder full-stack + 1 dev sênior previsto. Forte em TypeScript/Node e Elixir; médio em Go; zero Rust.
- Orçamento inicial infra: R$ 800/mês.
- Mobile nativo: não (web responsivo basta).
- SEO: sim (páginas públicas de escola e curso).
- Tempo real: leve (presença em sala, notificações).
- IA pesada: não no MVP.
- Volume 12m: 150 tenants, ~5k alunos, picos fev e jul.

**3 opções avaliadas:**

| Opção | Backend | Frontend | Banco | Pontuação total |
|-------|---------|----------|-------|-----------------|
| A — Conservadora | Node + Fastify | Next.js | Postgres | 30/35 |
| B — Equilibrada | Elixir + Phoenix LiveView | LiveView | Postgres | 29/35 |
| C — Escalável | Go + Echo | Next.js | Postgres | 28/35 |

**Recomendação:** Opção A (Node + Next + Postgres). Razão: time é fortíssimo, ecossistema BR de pagamentos (Pagar.me, Asaas) maduro em Node, custo inicial cabe em R$ 200/mês com Railway + R2 + Resend.

**Trade-off negativo da escolha:** caminho de escala em tempo real é mais frágil que Elixir; quando "sala virtual com presença ao vivo" virar diferencial, considerar migrar **apenas o módulo de presença** para Elixir, mantendo o resto em Node.

**ADR criado:** [`docs/adr/0001-stack-principal.md`](../adr/) com Opção B (Elixir) e Opção C (Go) listadas como rejeitadas + justificativa.

## Troubleshooting

### A IA insiste em Node mesmo quando o time é forte em Go

Lembre: "respeite a restrição registrada de time forte em Go. Comece avaliando Go como Opção A".

### Não sei estimar custo de infra

Use referências:
- Railway / Fly.io / Render: ~R$ 50–200/mês para apps pequenos.
- AWS: imprevisível, comece em R$ 200 e cresça com uso.
- Cloudflare R2: ~R$ 0,015/GB armazenado, sem egress fee.
- Resend: 3k emails/mês grátis, ~R$ 100/mês depois.
- Sentry: free tier robusto para até 5k erros/mês.

Some os componentes da opção escolhida.

### Quero JavaScript mas não tenho certeza de Next ou Remix

A escolha do framework é detalhe dentro da Opção. Liste prós/contras dos dois no campo "Frontend" e pontue. Geralmente Next vence em ecossistema BR.

### Preciso de Pix nativo mas só conheço Stripe

Stripe não tem Pix robusto para BR. Inclua provedores BR como obrigatórios na lista: Pagar.me, Asaas, Iugu, Stark Bank, Mercado Pago. Sentry/Resend são mais flexíveis.

### Recomendação pessoal mas time é resistente

Crie ADR explicando a discordância. Decisão é colegiada quando o time sustenta — força impor cria dívida humana.

## Próximo passo

➡️ **[`design-architecture`](08-design-architecture.md)** — definir arquitetura de alto nível, integrações, dados, segurança, observabilidade.

E em paralelo:

➡️ **[`create-adr`](11-create-adr.md)** — formalizar a decisão como ADR-0001.

## Referências cruzadas

- [`.claude/skills/choose-stack/SKILL.md`](../../.claude/skills/choose-stack/SKILL.md) — arquivo consumido pela IA.
- [`tests/skills/choose-stack.md`](../../tests/skills/choose-stack.md) — checks canônicos.
- Rules relevantes:
  - [`stack-neutrality`](../../.claude/rules/stack-neutrality.md)
  - [`business-before-technology`](../../.claude/rules/business-before-technology.md)
  - [`avoid-overengineering`](../../.claude/rules/avoid-overengineering.md)
  - [`explain-tradeoffs`](../../.claude/rules/explain-tradeoffs.md)
- Agents relevantes:
  - [`software-architect`](../../.claude/agents/software-architect.md) — revisão da escolha.
  - [`scalability-reviewer`](../../.claude/agents/scalability-reviewer.md) — para confrontar "caminho de escala".
- Templates relevantes:
  - [`adr-template.md`](../../templates/adr-template.md) — para o ADR `0001-stack-principal.md`.
