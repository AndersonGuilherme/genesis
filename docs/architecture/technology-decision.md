# Technology decision

> A decisão de stack. **Stack-neutral por padrão.** Este documento precisa apresentar pelo menos 3 alternativas avaliadas com critérios explícitos antes de declarar uma escolha.

## Regra inegociável

Não escolha stack antes de ter:

- [problem-statement.md](../product/problem-statement.md) preenchido
- [mvp-scope.md](../product/mvp-scope.md) preenchido
- [target-users.md](../product/target-users.md) preenchido
- [business-model.md](../business/business-model.md) preenchido
- Restrições do time documentadas (próxima seção)

## Restrições do time e contexto

| Variável | Valor |
|----------|-------|
| Tamanho do time técnico hoje | _(n)_ |
| Linguagens em que o time é forte | _(lista)_ |
| Linguagens em que o time tem pouca experiência | _(lista)_ |
| Orçamento mensal de infra | _(R$)_ |
| Tolerância a custo operacional alto | baixa / média / alta |
| Tolerância a velocidade de desenvolvimento baixa | baixa / média / alta |
| Necessidade de mobile nativo no MVP | sim / não |
| Necessidade de SEO no MVP | sim / não |
| Necessidade de tempo real | sim / não |
| Necessidade de cargas pesadas de IA / ML | sim / não |
| Volume esperado em 12 meses (usuários ativos) | _(n)_ |
| Picos sazonais | sim / não |

## Critérios de avaliação

Cada opção será pontuada (1–5) nestes critérios:

1. **Produtividade do time** — quanto o time entrega por sprint nessa stack.
2. **Risco operacional** — chance de quebrar em produção, custo de manter.
3. **Maturidade do ecossistema** — bibliotecas, comunidade, vagas.
4. **Adequação ao domínio** — quão bem a stack resolve este tipo de produto.
5. **Custo total (TCO 12 meses)** — infra + ferramentas + tempo.
6. **Caminho de escala** — o que muda quando crescer 10x.
7. **Facilidade de contratar** — encontrar gente com essa stack.

## Opções avaliadas

### Opção A — Conservadora

| Camada | Tecnologia |
|--------|------------|
| Frontend | _(ex.: React + Next.js)_ |
| Backend | _(ex.: Node.js + NestJS)_ |
| Banco principal | _(ex.: PostgreSQL)_ |
| Cache | _(ex.: Redis)_ |
| Filas | _(ex.: BullMQ)_ |
| Storage | _(ex.: S3-compatible)_ |
| Auth | _(ex.: built-in JWT + bcrypt)_ |
| Pagamentos | _(ex.: Stripe)_ |
| Email | _(ex.: Resend)_ |
| Observabilidade | _(ex.: Sentry + Grafana Cloud)_ |
| Deploy | _(ex.: Railway / Fly.io)_ |
| Testes | _(ex.: Vitest + Playwright)_ |

**Pontuação:**

| Critério | Nota |
|---------|------|
| Produtividade | _( /5)_ |
| Risco operacional | _( /5)_ |
| Maturidade ecossistema | _( /5)_ |
| Adequação domínio | _( /5)_ |
| Custo total | _( /5)_ |
| Caminho de escala | _( /5)_ |
| Facilidade contratar | _( /5)_ |

**Por que escolher esta:** _(...)_
**Por que evitar esta:** _(...)_
**Custo aproximado relativo (infra 12m):** _(R$)_

### Opção B — Equilibrada

| Camada | Tecnologia |
|--------|------------|
| Frontend | _(ex.: Vue / Nuxt ou Svelte / SvelteKit)_ |
| Backend | _(ex.: Go + Echo, ou Elixir + Phoenix)_ |
| Banco principal | _(ex.: PostgreSQL)_ |
| Cache | _(ex.: Redis)_ |
| Filas | _(ex.: NATS / RabbitMQ)_ |
| Storage | _(ex.: S3)_ |
| Auth | _(ex.: provedor externo — Clerk / Auth0)_ |
| Pagamentos | _(ex.: Stripe + provedor BR)_ |
| Email | _(ex.: Postmark)_ |
| Observabilidade | _(ex.: OpenTelemetry → Honeycomb / Grafana)_ |
| Deploy | _(ex.: Kubernetes gerenciado)_ |
| Testes | _(ex.: stack nativa da linguagem)_ |

_(Repetir pontuação, motivos.)_

### Opção C — Escalável / específica

| Camada | Tecnologia |
|--------|------------|
| Frontend | _(ex.: React Native + Expo se mobile-first)_ |
| Backend | _(ex.: Elixir + Phoenix para tempo real, OU Rust se latência crítica)_ |
| Banco principal | _(ex.: PostgreSQL particionado, ou CockroachDB)_ |
| Cache | _(ex.: Redis Cluster)_ |
| Filas | _(ex.: Kafka)_ |
| Storage | _(ex.: S3 + CDN)_ |
| Auth | _(ex.: solução custom + OIDC)_ |
| Pagamentos | _(ex.: split + carteira própria)_ |
| Email | _(ex.: AWS SES dedicated)_ |
| Observabilidade | _(ex.: Datadog full-stack)_ |
| Deploy | _(ex.: AWS multi-AZ)_ |
| Testes | _(ex.: contract tests + load tests obrigatórios)_ |

_(Repetir pontuação, motivos.)_

### Opção D — Experimental (opcional)

Use se houver justificativa forte para uma stack não-mainstream. Liste riscos claramente.

## Recomendação

| Item | Valor |
|------|-------|
| Stack recomendada | _(A, B, C ou combinação)_ |
| Pontuação total | _(número)_ |
| Justificativa em 5 linhas | _(...)_ |
| ADR vinculado | criar em [../adr/](../adr/) (próximo número, ex.: `0001-stack-principal.md`) |

## Reavaliação

Quando reavaliar a decisão:

- Quando atingirmos _(marco de escala)_
- Quando _(custo)_ ultrapassar _(limite)_
- Quando _(time)_ mudar materialmente
- Anualmente, no mínimo
