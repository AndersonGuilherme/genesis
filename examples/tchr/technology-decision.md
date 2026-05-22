# Technology decision — tchr (exemplo)

> Documento de exemplo. Demonstra como `docs/architecture/technology-decision.md` ficaria após aplicar a skill `choose-stack`, com três opções avaliadas (sem viés de linguagem).

## Restrições do time e contexto

| Variável | Valor |
|----------|-------|
| Tamanho do time técnico hoje | 1 fundador (full-stack) + previsão de 1 dev sênior em 60 dias |
| Linguagens em que o time é forte | TypeScript/Node, Elixir |
| Linguagens em que o time tem pouca experiência | Go (médio), Rust (zero) |
| Orçamento mensal de infra inicial | R$ 800 |
| Tolerância a custo operacional alto | baixa |
| Tolerância a velocidade de desenvolvimento baixa | baixa |
| Necessidade de mobile nativo no MVP | não (web responsivo basta) |
| Necessidade de SEO no MVP | sim (páginas públicas de escola e curso) |
| Necessidade de tempo real | leve (presença em sala, notificações) |
| Necessidade de IA pesada no caminho crítico | não |
| Volume esperado em 12 meses | 150 tenants, ~5.000 alunos, picos em fevereiro |
| Picos sazonais | sim (matrículas em fevereiro e julho) |

## Critérios de avaliação

Cada opção pontuada (1–5) em:

1. Produtividade do time
2. Risco operacional
3. Maturidade do ecossistema
4. Adequação ao domínio
5. Custo total (TCO 12m)
6. Caminho de escala
7. Facilidade de contratar

## Opções avaliadas

### Opção A — Conservadora (Node + Next + Postgres)

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + Next.js (SSR para páginas públicas) |
| Backend | Node.js + Fastify (separado do front, monolito modular) |
| Banco principal | PostgreSQL gerenciado (Neon/Supabase ou Railway) |
| Cache | Redis gerenciado (Upstash) |
| Filas | BullMQ sobre Redis (start) → migrar para serviço gerenciado quando volume justificar |
| Storage | S3-compatible (Cloudflare R2 — barato) |
| Auth | implementação própria com JWT + sessão refresh; biblioteca madura tipo lucia ou nextauth no front |
| Pagamentos | Pagar.me (Pix nativo, split de marketplace) + fallback Asaas |
| Email | Resend |
| Observabilidade | Sentry + OpenTelemetry → Grafana Cloud free tier no início |
| Deploy | Railway (start), Fly.io ou AWS quando crescer |
| Testes | Vitest + Playwright + supertest |

**Pontuação:**

| Critério | Nota |
|---------|------|
| Produtividade | 5 |
| Risco operacional | 4 |
| Maturidade ecossistema | 5 |
| Adequação domínio | 4 |
| Custo total | 4 |
| Caminho de escala | 3 |
| Facilidade contratar | 5 |

**Por que escolher esta:** fundador é fortíssimo nessa stack, mercado de contratação é o maior do Brasil, SSR cobre SEO bem, libs maduras para Pix/marketplace, custo inicial baixo (Railway + R2 + Resend cabem em R$ 200/mês).

**Por que evitar esta:** caminho de escala em tempo real e em concorrência paralela é mais frágil que Elixir; Node tem mais armadilhas de event loop quando workloads crescem.

**Custo aproximado relativo (infra 12m):** R$ 6k–R$ 12k

### Opção B — Equilibrada (Elixir + Phoenix + LiveView)

| Camada | Tecnologia |
|--------|------------|
| Frontend | Phoenix LiveView para painéis internos (dono/secretaria/aluno); páginas públicas como HEEx server-rendered |
| Backend | Elixir + Phoenix (monolito modular com contexts) |
| Banco principal | PostgreSQL gerenciado |
| Cache | Cachex local (BEAM) + Redis para invalidação cross-node |
| Filas | Oban (Postgres-backed) — excelente para idempotência |
| Storage | S3-compatible (R2) |
| Auth | Phoenix + bcrypt + Pow ou implementação própria |
| Pagamentos | Pagar.me + Asaas (clientes oficiais inexistem, escreve adapter próprio — manageable) |
| Email | Resend ou Postmark |
| Observabilidade | OpenTelemetry + Grafana Cloud |
| Deploy | Fly.io (ótimo para Elixir distribuído) |
| Testes | ExUnit + Wallaby (E2E) + integration tests com banco real |

**Pontuação:**

| Critério | Nota |
|---------|------|
| Produtividade | 4 (fundador conhece, dev novo precisa rampa) |
| Risco operacional | 5 (BEAM é robusta para tempo real e filas) |
| Maturidade ecossistema | 4 (libs de pagamento BR menores, mas viável) |
| Adequação domínio | 5 (presença em sala, notificações em tempo real, idempotência via Oban) |
| Custo total | 4 |
| Caminho de escala | 5 (BEAM escala excelentemente até picos grandes) |
| Facilidade contratar | 2 (mercado menor) |

**Por que escolher esta:** se o futuro do tchr inclui "sala virtual com presença ao vivo" e marketplace de eventos em tempo real, Elixir é o caminho de menor sofrimento. Oban no Postgres elimina dependência extra para fila.

**Por que evitar esta:** contratar dev sênior em Elixir é mais lento; libs de gateway BR muitas vezes precisam ser portadas; rampa de aprendizado para alguém vindo de Node não é trivial.

**Custo aproximado relativo (infra 12m):** R$ 7k–R$ 14k

### Opção C — Escalável / específica (Go + Next + Postgres)

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js (igual à opção A, mantém SEO) |
| Backend | Go + Echo ou Chi (monolito modular) |
| Banco principal | PostgreSQL gerenciado |
| Cache | Redis gerenciado |
| Filas | NATS JetStream ou RabbitMQ |
| Storage | S3 / R2 |
| Auth | implementação própria + jwt-go |
| Pagamentos | Pagar.me + Asaas |
| Email | Resend |
| Observabilidade | OpenTelemetry + Grafana Cloud |
| Deploy | Fly.io ou AWS ECS |
| Testes | testing + testify + Playwright para E2E web |

**Pontuação:**

| Critério | Nota |
|---------|------|
| Produtividade | 2 (fundador conhece médio; aprendizado para o novo dev) |
| Risco operacional | 5 (binário simples, baixa memória, deploy fácil) |
| Maturidade ecossistema | 4 |
| Adequação domínio | 3 (sem killer feature para o domínio escolar) |
| Custo total | 5 (menor uso de RAM/CPU por requisição) |
| Caminho de escala | 5 |
| Facilidade contratar | 4 |

**Por que escolher esta:** se viesse uma exigência forte de baixíssimo custo de infra ou throughput muito alto. Em 12 meses, com 150 tenants, isso não justifica o overhead de produtividade.

**Por que evitar esta:** velocidade de entrega de features cai bastante para o domínio rico em regras do tchr; o ecossistema de bibliotecas de pagamento BR é mais fraco em Go que em Node ou em Elixir; troca de stack para "escalar futuramente" pode ser feita depois com base em dados.

**Custo aproximado relativo (infra 12m):** R$ 5k–R$ 10k

## Recomendação

| Item | Valor |
|------|-------|
| Stack recomendada | **Opção A (Node + Next + Postgres)** |
| Pontuação total | 30/35 |
| Justificativa em 5 linhas | Maximiza velocidade de entrega no estágio atual, em que validar produto importa mais que escalar. Domínio inicial (gestão + cobrança + marketplace) é coberto sem ginástica. Custo inicial cabe no orçamento. Permite contratar fácil. Reavaliar Elixir se sala virtual ao vivo virar core diferencial. |
| ADR vinculado | `docs/adr/0001-stack-principal.md` (a criar) |

## Reavaliação

Reavaliar a decisão quando:

- Volume de eventos concorrentes em tempo real ultrapassar workload natural de Node (provavelmente > 1.000 conexões simultâneas em presença ao vivo).
- Custo de Node + Redis + workers passar de R$ 5k / mês de forma consistente.
- Time crescer para 5+ devs e parte do produto justificar isolar serviço.
- Diferenciação por features de tempo real / distribuição se tornar o eixo de competição.

Mesmo nesses casos, **revisão é por módulo**, não substituição total — possíveis caminhos incluem migrar apenas o módulo de presença/sala para Elixir, mantendo o resto em Node.
