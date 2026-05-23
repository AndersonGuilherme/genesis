# Skill: `create-implementation-plan`

> Skill transversal. Transforma a spec de um módulo em sequência de tarefas pequenas, testáveis e entregáveis sob TDD.

| Campo | Valor |
|-------|-------|
| Skill ID | `create-implementation-plan` |
| Fase do fluxo | **transversal** — invocada após cada spec de módulo aprovada |
| Skill anterior | [`define-module-spec`](10-define-module-spec.md) |
| Skill seguinte | [`start-development`](14-start-development.md) |
| Tempo típico | 30–60 minutos por módulo |

## Contexto e objetivo

Spec descreve **o quê**. Plano de implementação descreve **como você chega lá em commits pequenos**.

Esta skill é o que separa "vamos codar o módulo" (vago, leva 3 semanas, vira PR gigante) de "T-01, T-02, T-03..." (cada uma 1-2 commits, testável, revisável em isolamento).

A skill faz seis coisas:

1. **Lê a spec completa** do módulo (overview, data-model, api, events, business-rules, acceptance).
2. **Lista tarefas verticais** — cada uma entrega valor mínimo testável end-to-end.
3. **Ordena** para destravar caminho feliz cedo, edge cases ao final.
4. **Define testes esperados** por tarefa (Given/When/Then sempre que possível).
5. **Estima esforço** em faixa (XS/S/M/L/XL).
6. **Identifica riscos** por tarefa.

O resultado: `docs/specs/<modulo>/implementation-plan.md` — entrada direta para [`start-development`](14-start-development.md).

O que `create-implementation-plan` **não faz**:

- Não escreve código.
- Não decide tecnologia interna (vem da spec e do `technology-decision.md`).
- Não substitui review de PR — é planejamento, não execução.

## Quando você deve invocar

- Após [`define-module-spec`](10-define-module-spec.md) aprovar a spec de um módulo.
- Antes de [`start-development`](14-start-development.md) para esse módulo.
- Quando módulo já existente recebe escopo novo significativo (refazer só a parte nova).
- Quando o time precisa enxergar caminho de execução antes de prometer prazo.

**Gatilhos no chat:**

- "quebra a spec do billing em tarefas"
- "plano de implementação para o módulo identity"
- "vamos transformar essa spec em sequência de PRs"

## Pré-condições

- [ ] [`docs/specs/<modulo>/`](../../../docs/specs/) completo (overview, data-model, api, events, business-rules, acceptance).
- [ ] [`docs/testing/testing-strategy.md`](../../../docs/testing/testing-strategy.md) definida (sabe que ferramenta de teste usar).
- [ ] [`docs/architecture/architecture-overview.md`](../../../docs/architecture/architecture-overview.md) preenchido (sabe padrões adotados).

## O passo a passo

### 1. Invoque a skill apontando o módulo

> "quebra a spec do billing em tarefas"

A IA carrega `create-implementation-plan`, lê todos os arquivos de `docs/specs/billing/` e começa a decompor.

### 2. Liste tarefas verticais

Princípios:

- **Vertical, não horizontal.** Evite "fazer todo o banco primeiro, depois toda API, depois todo frontend". Em vez disso: cada tarefa entrega 1 caso de uso completo.
- **Mínima e completa.** Tarefa boa: cria 1 endpoint + teste do caminho feliz + migration necessária. Tarefa ruim: "implementar billing".
- **Caminho feliz primeiro.** Edge cases viram tarefas separadas no final.
- **Setup (T-00) explícito.** Se o módulo precisa de bootstrap (estrutura de pastas, configs), é tarefa T-00.

### 3. Para cada tarefa, defina

A IA preenche estrutura:

```markdown
### T-NN — <título curto>

- **Objetivo:** uma frase
- **Esforço:** XS / S / M / L / XL
- **Dependências:** T-XX, T-YY ou "nenhuma"
- **Arquivos:**
  - Criar: `caminho/arquivo.ext`
  - Modificar: `caminho/arquivo.ext`
- **Testes:**
  - Cenário em Given/When/Then
  - Outro cenário
- **Critério de pronto:**
  - [ ] Testes passam.
  - [ ] Lint/format ok.
  - [ ] Doc atualizada (se aplicável).
- **Commit sugerido:** `feat(<modulo>): <descrição>`
- **Riscos:** integração externa? migration destrutiva? regra complexa?
```

### 4. Ordene as tarefas

Critério primário: **caminho feliz da jornada principal primeiro**.

Para o módulo `identity` (exemplo):

1. T-00 — Setup (estrutura de pastas, vitest, lint).
2. T-01 — Migration tabela `tenants`.
3. T-02 — Migration tabela `users`.
4. T-03 — Repository de tenants e users.
5. T-04 — Endpoint POST /signup (caminho feliz).
6. T-05 — Validação de senha (BR-001) + erro WEAK_PASSWORD.
7. T-06 — Email único por tenant + erro EMAIL_TAKEN.
8. T-07 — Endpoint POST /login + argon2 verify.
9. T-08 — Refresh token rotacionável.
10. T-09 — MFA opcional (BR-004).
11. T-10 — Job de purga de sessões expiradas.

Setup primeiro. Caminho feliz cedo. Edge cases (rate limit, lock após N falhas) no final.

### 5. Estime esforço

Faixas:

- **XS** — <30 min de trabalho. Ex.: ajuste de config.
- **S** — algumas horas. Ex.: 1 endpoint simples com teste.
- **M** — meio dia a 1 dia. Ex.: endpoint com regra de negócio + teste de integração.
- **L** — 1-3 dias. Ex.: feature com migração + endpoint + UI.
- **XL** — > 3 dias. **Quebrar.**

Se uma tarefa é XL, divida em sub-tarefas. PR gigante = revisão ruim.

### 6. Identifique dependências

Geralmente:

- T-XX **depende de** T-YY → T-YY precisa estar pronto antes.
- T-XX **bloqueia** T-ZZ → outra tarefa fica em hold até essa.

Desenhe mentalmente como grafo. Se há ciclo, algo está errado — revise.

### 7. Identifique riscos por tarefa

Riscos comuns:

- **Integração externa nova** (gateway, email, etc.) → fazer spike cedo, prever fallback.
- **Migração destrutiva** → testar rollback em staging antes.
- **Regra de negócio complexa** → considerar revisão por agent `domain-modeler`.
- **Performance crítica** → planejar load test específico.

### 8. Defina cadência de PRs

A cada N tarefas concluídas → 1 PR. Padrão recomendado:

- 3 tarefas pequenas (S) → 1 PR.
- 1 tarefa média (M) → 1 PR.
- Tarefa L → 1 PR sozinho (ou quebrar em sub-tarefas).

Registre no plano: "PR-1: T-00 a T-03", "PR-2: T-04 a T-06", etc.

### 9. Sugira mensagens de commit

Cada tarefa tem mensagem sugerida no padrão convencional:

- `feat(<modulo>): <descrição curta>` — feature nova.
- `chore(<modulo>): <descrição>` — manutenção.
- `test(<modulo>): <descrição>` — só teste.
- `refactor(<modulo>): <descrição>` — sem mudança de comportamento.
- `fix(<modulo>): <descrição>` — bug fix.

### 10. Salve o plano

A IA escreve em `docs/specs/<modulo>/implementation-plan.md` com:

- Pré-requisitos (spec aprovada, ADRs vinculados, dependências externas).
- Lista numerada de tarefas (T-00, T-01, ...).
- Cadência de PRs.
- Riscos identificados.

### 11. Atualize `PROJECT_STATE.md`

A IA adiciona linha:

> "Módulo `identity`: spec ✅, plano ✅, em fila para implementação."

E sugere próxima skill: [`start-development`](14-start-development.md).

## Perguntas que a mentora vai fazer

**1. Essa tarefa entrega valor visível ou é só andaime?**
Por que importa: tarefas verticais minimizam risco de "andaime que não vira nada".

**2. Qual o teste que prova que essa tarefa terminou?**
Por que importa: sem teste, "pronto" é opinião.

**3. Quanta dependência essa tarefa tem? Pode ser fatiada?**
Por que importa: dependência alta = bloqueio em série.

**4. Tem caminho de rollback se essa tarefa quebrar produção?**
Por que importa: deploys de risco precisam de plano de volta.

**5. Essa tarefa cabe em 1-2 commits?**
Por que importa: se não cabe, está grande demais.

**6. Essa ordem trava menos coisas?**
Por que importa: caminho crítico curto destrava paralelização.

**7. Tem critério da spec sem tarefa associada?**
Por que importa: gap = bug futuro.

**8. Tem tarefa sem critério da spec?**
Por que importa: feature creep — está fazendo algo que ninguém pediu.

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte |
|---------|-------------|-------|
| `docs/specs/<modulo>/implementation-plan.md` | Plano completo com tarefas, esforços, dependências, PRs, riscos. | Você (mentora conduz). |
| [`PROJECT_STATE.md`](../../../docs/PROJECT_STATE.md) | Módulo marcado com plano pronto. | A IA. |

## Critérios de "terminei essa skill"

- [ ] Plano cobre **todos os critérios de aceite** da spec.
- [ ] Cada tarefa é XS, S ou M (L só quando necessário; XL **nunca**).
- [ ] Cada tarefa tem testes esperados (Given/When/Then sempre que possível).
- [ ] Ordem destrava caminho feliz cedo.
- [ ] Riscos por tarefa identificados.
- [ ] Cadência de PRs definida.
- [ ] Mensagens de commit sugeridas.
- [ ] `PROJECT_STATE.md` atualizado.

## Anti-padrões — sinais de que algo está errado

🚫 **Tarefa "fazer o módulo X" sem decomposição.** Não é tarefa, é placeholder. Decomponha.

🚫 **Pulou testes para "ganhar velocidade".** Cada tarefa tem teste. Sem isso, plano é wishful thinking.

🚫 **PR gigante (50+ arquivos).** Quebra em sub-tarefas.

🚫 **Setup espalhado no meio do plano.** Setup (T-00) deve ser primeiro e isolado.

🚫 **Edge cases primeiro.** Não. Caminho feliz primeiro. Edge ao final.

🚫 **Tarefa horizontal: "criar todo o banco".** Não. Cada migration vem junto da tarefa que precisa dela.

🚫 **Critério da spec sem tarefa correspondente.** Gap. Adicione tarefa ou justifique fora de escopo.

🚫 **Tarefa sem critério de pronto.** Sem isso, vira "tá pronto?" "acho que sim" — dívida garantida.

🚫 **Sem identificar risco de integração externa.** Gateway/email/storage podem falhar; planejar resiliência desde a tarefa, não em produção.

🚫 **Estimou XL sem dividir.** XL deve sempre ser dividido em ≥ 2 sub-tarefas.

## Exemplo aplicado: tchr — plano do módulo `identity`

```markdown
# Plano de implementação — identity

## Pré-requisitos
- Spec aprovada: docs/specs/identity/
- ADRs vinculados: 0001 (stack), 0004 (auth), 0005 (multi-tenancy)
- Dependências externas: Resend, HIBP API

## Tarefas

### T-00 — Setup do módulo (S)
- Objetivo: bootstrap estrutura `src/identity/`, vitest, lint, .env.
- Arquivos:
  - Criar: `package.json`, `tsconfig.json`, `vitest.config.ts`, `src/identity/index.ts`.
- Testes: teste smoke `1 === 1` rodando ok.
- Critério: `npm test` retorna verde.
- Commit: `chore(identity): bootstrap module with fastify + vitest`.
- Risco: nenhum.

### T-01 — Migration tabela tenants (S)
- Objetivo: criar tabela `tenants` com colunas básicas + índice de status.
- Arquivos:
  - Criar: `migrations/001_create_tenants.sql`.
  - Criar: `tests/identity/tenant_repository.test.ts`.
  - Criar: `src/identity/data/tenant_repository.ts`.
- Testes:
  - Cenário: criar tenant retorna id uuid + status="trial".
  - Cenário: tentativa de criar tenant sem nome → erro.
- Critério: testes passam, migration aplica forward + reverse.
- Commit: `feat(identity): add tenants table with create operation`.
- Risco: baixo.

### T-02 — Migration tabela users (S)
- Objetivo: tabela `users` com FK para tenant, email único composto.
- Arquivos:
  - Criar: `migrations/002_create_users.sql`.
  - Criar: `tests/identity/user_repository.test.ts`.
  - Criar: `src/identity/data/user_repository.ts`.
- Testes:
  - Cenário: criar user com email único por tenant OK.
  - Cenário: criar user com email duplicado no mesmo tenant → erro UNIQUE_VIOLATION.
- Critério: testes passam, constraint composta funciona.
- Commit: `feat(identity): add users table with unique email per tenant`.
- Risco: baixo.

### T-03 — Endpoint POST /v1/auth/signup — caminho feliz (M)
- Objetivo: signup que cria tenant + user + role owner atomicamente.
- Arquivos:
  - Criar: `src/identity/api/signup.ts`.
  - Criar: `tests/identity/signup.test.ts`.
- Testes:
  - Cenário: signup com email novo + senha forte → 201, tenant criado, user criado, role=owner, evento user.created emitido.
- Critério: caminho feliz funciona end-to-end (HTTP request → DB → evento).
- Commit: `feat(identity): add signup endpoint with tenant creation`.
- Risco: transação atômica precisa de cuidado.

### T-04 — Signup: validação de senha + HIBP (M)
- Objetivo: implementar BR-001 (senha forte + check HIBP).
- Arquivos:
  - Modificar: `src/identity/api/signup.ts`.
  - Criar: `src/identity/lib/password_check.ts`.
  - Criar: `tests/identity/password_check.test.ts`.
- Testes:
  - Cenário: senha < 10 chars → 422 WEAK_PASSWORD.
  - Cenário: senha em lista HIBP → 422 WEAK_PASSWORD.
  - Cenário: senha forte → ok.
- Critério: 3 cenários verdes.
- Commit: `feat(identity): enforce strong password policy with HIBP check`.
- Risco: HIBP API pode estar fora; mockar em testes, integração real apenas em staging.

### T-05 — Signup: email duplicado retorna 409 (S)
- Objetivo: tratar UNIQUE_VIOLATION e retornar erro semântico.
- Arquivos:
  - Modificar: `src/identity/api/signup.ts`.
  - Modificar: `tests/identity/signup.test.ts`.
- Testes:
  - Cenário: signup com email já usado em tenant X → 409 EMAIL_TAKEN.
- Critério: erro retornado tem código + mensagem amigável.
- Commit: `feat(identity): return 409 EMAIL_TAKEN on duplicate signup`.
- Risco: baixo.

### PR-1: T-00 a T-05 — signup feature completa
- Branch: `feat/identity-signup`.
- Descrição: módulo identity inicializado, tabelas criadas, signup com validação de senha (HIBP) e tratamento de email duplicado.
- Cobertura: caminhos felizes + 2 erros.

### T-06 — Endpoint POST /v1/auth/login (M)
- Objetivo: login com verify argon2id, retorna access token + refresh token.
- (...continua...)

### T-07 — Refresh token rotacionável (M)
### T-08 — Logout invalida refresh token (S)
### T-09 — Rate limit + bloqueio progressivo após N falhas (M)
- Implementa BR-002.
### T-10 — MFA TOTP opcional (L) — quebrar em sub-tarefas
  - T-10.1 — Setup MFA (gerar secret + QR).
  - T-10.2 — Validar MFA no login.
  - T-10.3 — Force MFA para roles owner/admin/support (BR-004).
### T-11 — Job de purga de sessões expiradas (S)

### PR-2: T-06 a T-08 — login + refresh + logout
### PR-3: T-09 — rate limit + lock
### PR-4: T-10 — MFA (3 sub-PRs ou 1 grande)
### PR-5: T-11 — job de purga

## Riscos consolidados
- HIBP API pode falhar — fallback: lista local de top 10k senhas.
- argon2id em ambiente serverless: cold start pode ser lento (>1s) — testar em staging.
- Rate limit em múltiplos pods: Redis distribuído necessário.

## Total estimado
~ 8 dias de dev sênior para o módulo `identity` completo.
```

## Troubleshooting

### Não sei como decompor uma feature

Use as **histórias de uso** da spec (`acceptance.md`). Cada Given/When/Then geralmente vira 1 tarefa.

### Tarefa parece S mas a IA disse M

Confie na conservadora. Se realmente for S, terminará rápido e bem. Se for M e você subestimou, evita atraso.

### Tenho 30 tarefas em um plano

Pode ser correto. Mas verifique se algumas podem virar 1 tarefa maior testada em conjunto. Granularidade extrema fragmenta esforço.

### Algumas tarefas dependem de integração externa que ainda não testei

Adicione **spike** como tarefa antecipada. Ex.: T-02.5 "Spike: validar integração HIBP em sandbox por 2h, decidir se faz parte do plano ou fallback local."

### A IA gerou plano sem riscos identificados

Empurre: "para cada tarefa, identifique pelo menos 1 risco potencial (mesmo que baixo)". Sem isso, é otimista demais.

### Plano grande demais — ninguém vai ler

Plano bom é proporcional ao módulo. `identity` é módulo grande; `notifications` é menor. Se está enorme, módulo provavelmente está grande demais — considere quebrar em dois módulos.

## Próximo passo

➡️ **[`start-development`](14-start-development.md)** — executar o plano, tarefa a tarefa, com TDD.

ou (se ainda há módulos sem spec):

➡️ **[`define-module-spec`](10-define-module-spec.md)** — para o próximo módulo do MVP.

## Referências cruzadas

- [`.claude/skills/create-implementation-plan/SKILL.md`](../../../.claude/skills/create-implementation-plan/SKILL.md) — arquivo consumido pela IA.
- [`.genesis/tests/skills/create-implementation-plan.md`](../../tests/skills/create-implementation-plan.md) — checks canônicos.
- Rules relevantes:
  - [`testing-strategy-required`](../../../.claude/rules/testing-strategy-required.md)
  - [`no-code-before-spec`](../../../.claude/rules/no-code-before-spec.md)
  - [`avoid-overengineering`](../../../.claude/rules/avoid-overengineering.md)
- Agents relevantes:
  - [`implementation-planner`](../../../.claude/agents/implementation-planner.md) — para revisar decomposição.
  - [`software-architect`](../../../.claude/agents/software-architect.md) — para checar acoplamentos cruzados.
- Templates relevantes:
  - [`user-story-template.md`](../../templates/user-story-template.md) — para histórias dentro de tarefas L.
