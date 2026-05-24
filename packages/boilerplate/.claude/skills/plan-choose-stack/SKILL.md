---
name: plan-choose-stack
description: Use para escolher a stack tecnológica com base em produto, time, custos e riscos. Stack-neutral por padrão. Apresenta no mínimo 3 opções avaliadas (conservadora, equilibrada, escalável) antes de recomendar. Termina com docs/architecture/technology-decision.md e ADR.
phase: planning
rules:
  - plan-stack-neutrality
  - plan-business-before-technology
  - plan-avoid-overengineering
  - plan-explain-tradeoffs
---

# Skill: plan-choose-stack

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/plan-stack-neutrality.md`
- `.claude/rules/plan-business-before-technology.md`
- `.claude/rules/plan-avoid-overengineering.md`
- `.claude/rules/plan-explain-tradeoffs.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Recomendar a stack tecnológica mais adequada **com justificativa explícita**, considerando produto, time, custos, riscos e ecossistema. Nunca assumir JavaScript/TypeScript/Node ou qualquer linguagem como padrão.

## Quando usar

- Após Fases 1–5 concluídas.
- Quando `docs/architecture/technology-decision.md` está vazio.
- Para revisar decisão de stack quando produto evoluir significativamente.

## Entradas esperadas

- `docs/product/mvp-scope.md`
- `docs/product/target-users.md`
- `docs/business/business-model.md`
- Informações sobre o time (skills, tamanho)

## Processo passo a passo

1. Coletar restrições do time (linguagens fortes, tamanho, orçamento).
2. Coletar restrições do produto (mobile? SEO? real-time? IA? volume?).
3. Definir os **critérios de avaliação** (já listados em `technology-decision.md`).
4. Construir **pelo menos 3 opções de stack**:
   - **Conservadora** — produtividade alta, comunidade grande, risco baixo.
   - **Equilibrada** — bom equilíbrio entre velocidade e escala.
   - **Escalável / específica** — preparada para crescimento ou caso específico (real-time, latência baixa, etc.).
   - **Experimental** (opcional) — apenas se houver razão forte.
5. Pontuar cada opção (1–5) nos critérios.
6. Recomendar com justificativa **e listar os trade-offs negativos**.
7. Gerar ADR `docs/adr/0001-stack-principal.md` (ou número disponível).
8. Atualizar `docs/architecture/technology-decision.md`.

## Perguntas guia

1. Em que **linguagens o time é forte**? Em quais é fraco?
2. Qual o **tamanho** do time técnico hoje? E em 6 meses?
3. **Mobile nativo no MVP**? Ou web responsivo basta?
4. **SEO** é crítico? (afeta SSR)
5. **Tempo real** (chat, dashboard live)?
6. **IA pesada** no caminho crítico?
7. **Volume esperado** em 12 meses?
8. Qual **orçamento mensal** de infra é aceitável?
9. Qual a **tolerância a operar Kubernetes** ou similar?
10. Há **restrição regulatória** que limita opções (dados em BR, etc.)?

## Critérios de avaliação (de `technology-decision.md`)

1. Produtividade do time
2. Risco operacional
3. Maturidade do ecossistema
4. Adequação ao domínio
5. Custo total (TCO 12m)
6. Caminho de escala
7. Facilidade de contratar

## Opções a sempre considerar (por categoria)

| Categoria | Candidatos a considerar |
|-----------|--------------------------|
| Backend dinâmico produtivo | Node.js (Nest/Hono/Fastify), Python (Django/FastAPI), Ruby (Rails), PHP (Laravel) |
| Backend tipado conservador | Go (chi/echo), C# (.NET), Java (Spring), Kotlin (Ktor) |
| Backend funcional/concurrent | Elixir (Phoenix), Rust (Axum), Scala |
| Frontend web | Next.js, Nuxt, SvelteKit, Remix, Astro, Rails turbo, Phoenix LiveView |
| Mobile | React Native + Expo, Flutter, nativo (Swift/Kotlin) |
| Banco | PostgreSQL (default forte), MySQL, SQLite (start), CockroachDB (escala), MongoDB (justificar) |
| Cache | Redis, Valkey |
| Fila | BullMQ, RabbitMQ, NATS, SQS, Kafka (heavy) |
| Storage | S3-compatible (AWS S3, R2, GCS, Backblaze, MinIO self) |
| Auth | Built-in (libs maduras), Clerk, Auth0, Keycloak, Supabase Auth |
| Pagamentos (BR) | Stripe, Pagar.me, Iugu, Asaas, Stark Bank, Mercado Pago |
| Email | Resend, Postmark, SES, SendGrid |
| Observabilidade | Sentry, Grafana Cloud, Honeycomb, Datadog, OpenTelemetry stack |
| Deploy | Railway, Fly.io, Render, Vercel, AWS, GCP, Hetzner+caprover |
| Testes | nativo da linguagem + Playwright (E2E web) + k6 (load) |

## Documentos que cria ou atualiza

- `docs/architecture/technology-decision.md`
- `docs/adr/NNNN-stack-principal.md` (criar)
- `docs/architecture/integration-map.md` (esboço inicial)
- `docs/PROJECT_STATE.md`

## Critérios de conclusão

- [ ] 3 opções (mínimo) descritas com pontuação completa
- [ ] Recomendação clara + trade-offs negativos listados
- [ ] ADR criado e referenciado
- [ ] Custo aproximado 12m estimado por opção

## Restrições

- **Não assumir** stack pelo viés do agente.
- Se o usuário pedir "use Next + Nest porque eu já sei", ainda assim apresentar alternativas e deixar a decisão registrada como **decisão consciente do time**.
- Não recomendar microserviços, Kubernetes, event sourcing ou CQRS no MVP a menos que haja justificativa forte.
- Evitar combinações exóticas sem ecossistema (ex.: linguagem de nicho como backend principal sem time experiente).

## Exemplos de uso

- "Vamos escolher a stack."
- "JavaScript serve aqui? Por quê?"
- "Quais opções fazem sentido para uma plataforma com marketplace?"
