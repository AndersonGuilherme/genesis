# Skill: `start-development`

> Inicia o desenvolvimento real. Loop por módulo: ler spec → ler plano → TDD → commits pequenos → atualizar docs.

| Campo | Valor |
|-------|-------|
| Skill ID | `start-development` |
| Fase do fluxo | Fase 10 — implementação |
| Skill anterior | [`review-readiness`](13-review-readiness.md) |
| Skill seguinte | nenhuma (loop por módulo até MVP completo) |
| Tempo típico | contínuo — semanas/meses |

## Contexto e objetivo

Esta é a única skill que escreve **código de aplicação**. Todas as outras se limitam a documentação, decisões e specs.

`start-development` é invocada **somente após `review-readiness` aprovar**. A primeira coisa que ela faz é reconfirmar essa aprovação — se algo regrediu, aborta.

A skill conduz um loop:

1. **Confirma readiness** (`bash scripts/check-readiness.sh` retorna 0).
2. **Confirma qual módulo** será atacado (primeiro do MVP, geralmente `identity`).
3. **Lê o implementation-plan** do módulo.
4. **Para cada tarefa do plano:**
   - Escreve testes falhando (TDD).
   - Implementa o mínimo para passar.
   - Roda suite local.
   - Lint/format.
   - Commit pequeno e descritivo.
   - Atualiza docs afetadas (ADR, eventos, data-strategy, etc.).
5. **A cada N tarefas concluídas, abre PR.**
6. **Atualiza `PROJECT_STATE.md`** quando o módulo entrega valor visível.

O que `start-development` **não faz**:

- Não inventa código fora do plano. Se algo precisa mudar, **volta** e atualiza spec/plano primeiro.
- Não pula testes para "ganhar velocidade".
- Não acumula commits grandes.

## Quando você deve invocar

- **Apenas** após [`review-readiness`](13-review-readiness.md) ter retornado **aprovado**.
- Para iniciar trabalho em um novo módulo cuja spec já está pronta.
- Nunca antes do readiness.

**Gatilhos no chat:**

- "vamos começar a implementar o identity"
- "bora codar"
- "start develop"
- "vamos para o próximo módulo"

## Pré-condições

- [ ] [`review-readiness`](13-review-readiness.md) → **APROVADO** (registrado em `PROJECT_STATE.md`).
- [ ] [`docs/specs/<modulo>/`](../specs/) completo (overview, data-model, api, events, business-rules, acceptance).
- [ ] [`docs/specs/<modulo>/implementation-plan.md`](../specs/) criado por [`create-implementation-plan`](12-create-implementation-plan.md).
- [ ] Stack instalada localmente (conforme [`technology-decision.md`](../architecture/technology-decision.md)).
- [ ] Repositório com testes funcionais configurados (ou tarefa T-00 do plano cobre setup).

## O passo a passo

### 1. Invoque a skill

> "vamos começar a implementar o identity"

A IA carrega `start-development` e imediatamente reconfirma readiness.

### 2. Reconfirme readiness

A IA executa:

```bash
bash scripts/check-readiness.sh
```

Se exit code ≠ 0, **aborta**. Volta para [`review-readiness`](13-review-readiness.md).

### 3. Confirme módulo e plano

A IA mostra:

> "Vou começar pelo módulo `identity`. Plano em `docs/specs/identity/implementation-plan.md` tem 11 tarefas. Confirma?"

Você confirma ou redireciona para outro módulo.

### 4. Setup inicial (T-00 do plano, se houver)

Geralmente a primeira tarefa não é feature — é setup:

- Inicializar projeto (`npm init`, `mix new`, etc.).
- Configurar test runner.
- Configurar linter/formatter.
- Configurar pipeline CI inicial.
- Configurar variáveis de ambiente.

A IA cria, commita pequeno, e segue.

### 5. Loop por tarefa

Para cada tarefa do plano (T-01, T-02, ...):

#### 5.1. Releia a tarefa

A IA mostra a definição da tarefa: objetivo, arquivos a criar/modificar, testes esperados, critério de pronto.

#### 5.2. Escreva o teste **primeiro**

A IA cria o(s) arquivo(s) de teste em modo "failing": ele descreve o cenário (Given/When/Then) e roda, esperando falha porque o código não existe ainda.

#### 5.3. Rode o teste e confirme falha

```bash
npm test -- tests/identity/signup.test.ts
# ou equivalente da stack
```

Deve falhar. Se não falhar, o teste está testando errado.

#### 5.4. Implemente o mínimo

A IA escreve o código **mínimo necessário** para o teste passar. Sem "preparar para o futuro" — só o que a tarefa pede.

#### 5.5. Rode novamente

Teste deve passar. Se não, ajustar até passar.

#### 5.6. Rode toda a suite local

```bash
npm test
```

Outros testes devem continuar verdes. Se quebrou, regression — fix antes de avançar.

#### 5.7. Lint e format

```bash
npm run lint
npm run format
```

#### 5.8. Commit pequeno

Mensagem convencional:

```
feat(identity): implement signup with weak password rejection

- adds POST /v1/auth/signup
- argon2id hash + email uniqueness per tenant
- emits user.created event
```

A IA propõe a mensagem; você revisa.

#### 5.9. Atualize docs se necessário

- Se um evento novo apareceu, atualizar `events.md`.
- Se um dado novo (com PII) entrou, atualizar `data-privacy.md`.
- Se uma decisão importante surgiu, criar ADR via [`create-adr`](11-create-adr.md).

#### 5.10. Marca tarefa como concluída

A IA atualiza o plano: `- [x] T-01 — signup com sucesso`.

### 6. PR a cada N tarefas

Cadência típica: 3 tarefas → abrir PR. Ou 1 tarefa grande → PR.

PR contém:

- Lista de tarefas concluídas.
- Diff testável.
- Como revisar (passo a passo).
- Possíveis riscos.

### 7. Atualize `PROJECT_STATE.md`

A cada entrega visível ao usuário (módulo `identity` completo, primeiro endpoint funcionando, etc.), atualize o estado:

- Quantas tarefas concluídas.
- Quantas pendentes.
- Bloqueios atuais.
- Próxima ação.

### 8. Próximo módulo (loop)

Quando o módulo atual está pronto (todas as tarefas concluídas + critério de aceite passando + deploy em staging OK):

- Confirma com você.
- Atualiza módulo como "implementado".
- Invoque [`define-module-spec`](10-define-module-spec.md) para o próximo módulo da ordem.

## Princípios durante implementação

### Disciplina TDD

Teste primeiro, código depois. Mesmo quando é tentador. Razão: você só sabe se o teste prova o comportamento quando ele falhou antes.

### Commits pequenos

Cada commit deve ser **revisável em 5 minutos**. Se está mais que isso, divida.

Mensagens convencionais:
- `feat(<modulo>): <descrição>` — feature nova.
- `fix(<modulo>): <descrição>` — bug fix.
- `chore(<modulo>): <descrição>` — manutenção (deps, config).
- `refactor(<modulo>): <descrição>` — sem mudança de comportamento.
- `docs(<modulo>): <descrição>` — documentação.
- `test(<modulo>): <descrição>` — só teste.

### Não improvise fora do plano

Se durante a implementação descobre algo:

- Que muda contrato → atualiza spec **antes** de continuar.
- Que muda arquitetura → cria ADR **antes** de continuar.
- Que muda regra de negócio → atualiza `business-rules.md` **antes** de continuar.

Pequenas pausas para registrar evitam grandes pausas para refatorar.

### Sem feature creep

Tarefa pediu A. Faça A. Se B parece útil, abre tarefa B no plano e implementa depois. Não acumule.

### Atualize docs

A cada tarefa concluída, pergunte:

- Há novo evento? Atualizar `events.md`.
- Há nova integração externa? Atualizar `integration-map.md`.
- Há novo dado pessoal? Atualizar `data-privacy.md`.
- Há decisão importante nova? Criar ADR.

Se nada disso, OK.

## Perguntas que a mentora vai fazer

A skill **executa** mais que pergunta. Mas pode pedir confirmação:

**1. Confirma que vamos começar pelo módulo `<X>`?**
**2. Confirma a abordagem TDD para essa tarefa?** (caso o time não use TDD por padrão, registra como decisão).
**3. Há decisão nova que precisa de ADR?**
**4. Atualizar `PROJECT_STATE.md` agora?**

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Frequência |
|---------|-------------|-------------|
| `<código de aplicação>` | Código real do projeto. | A cada tarefa. |
| `<testes>` | Testes que provam o comportamento. | A cada tarefa (primeiro). |
| `docs/specs/<modulo>/implementation-plan.md` | Marca tarefas concluídas. | A cada tarefa. |
| `docs/specs/<modulo>/events.md` | Se novo evento aparecer. | Conforme necessário. |
| `docs/architecture/data-strategy.md` | Se novo dado/tabela aparecer. | Conforme necessário. |
| `docs/security/data-privacy.md` | Se novo PII aparecer. | Conforme necessário. |
| `docs/adr/NNNN-*.md` | Decisões nascendo durante implementação. | Conforme necessário. |
| `docs/PROJECT_STATE.md` | Progresso, próxima ação. | A cada entrega visível. |
| `CHANGELOG.md` (se houver) | Releases. | A cada tag de versão. |

## Critérios de "terminei essa tarefa"

Para cada tarefa (T-01, T-02, etc.):

- [ ] Testes da tarefa passam (incluindo cenários de erro).
- [ ] Lint/format ok.
- [ ] Suite completa local passa (nenhum teste pré-existente quebrou).
- [ ] Documentação afetada atualizada.
- [ ] Commit feito com mensagem convencional.
- [ ] Tarefa marcada `- [x]` no plano.

## Critérios de "terminei esse módulo"

- [ ] Todas as tarefas do plano marcadas concluídas.
- [ ] Todos os critérios de aceite de `acceptance.md` passam.
- [ ] Cobertura mínima do `testing-strategy.md` atingida na camada de regras de negócio.
- [ ] Endpoint público documentado (OpenAPI ou equivalente).
- [ ] Smoke test funcional em staging.
- [ ] `PROJECT_STATE.md` mostra módulo como "implementado".

## Anti-padrões — sinais de que algo está errado

🚫 **Começou sem readiness aprovado.** Bloquear imediatamente. `prevent-code-before-readiness.sh` deveria ter cortado.

🚫 **Pulou o teste para "ganhar velocidade".** Não é velocidade — é dívida. Teste primeiro.

🚫 **Commit gigante (50+ arquivos).** Divida. Cada commit em ≤ 10 arquivos exceto bootstrap.

🚫 **Implementação ignora a spec.** Spec é contrato. Se está obsoleta, **pare** e atualize.

🚫 **Improvisou ADR no chat sem registrar.** Sem ADR registrado, decisão evapora.

🚫 **Mudou contrato público sem atualizar `api.md`.** Frontend vai quebrar; outros módulos vão quebrar.

🚫 **Adicionou PII ao banco sem atualizar `data-privacy.md`.** LGPD violation latente.

🚫 **PR sem descrição clara.** Revisor precisa adivinhar. Inclua: o que mudou, como testar, riscos.

🚫 **Testes mockando o banco quando deveriam ser integração real.** Mocks mentem em produção.

🚫 **Tarefa T-XX disse "S" mas levou 2 dias.** Estimou errado — registre e ajuste o plano.

## Exemplo aplicado: tchr — primeiras 3 tarefas do módulo `identity`

**Plano (`docs/specs/identity/implementation-plan.md`):**

```
T-01 (S) — setup projeto Node + Fastify + Postgres + Vitest
T-02 (S) — migration: tabela tenants
T-03 (M) — endpoint POST /v1/auth/signup com validação de senha
T-04 (S) — endpoint POST /v1/auth/login com argon2id
T-05 (M) — refresh token rotacionável
... 11 tarefas total
```

### T-01 — Setup

A IA:

1. Confirma com você: "Vou rodar `npm init`, instalar Fastify + Postgres driver + Vitest, e criar estrutura de pastas `src/identity/` e `tests/identity/`. OK?"
2. Cria arquivos: `package.json`, `tsconfig.json`, `vitest.config.ts`, `.env.example`, `src/identity/index.ts` (vazio com export).
3. Roda `npm install`.
4. Adiciona script `test`, `lint`, `format`.
5. Commit: `chore(identity): bootstrap module structure with fastify + vitest`.
6. Marca T-01 como concluída.

### T-02 — Migration tabela tenants

A IA:

1. Cria `migrations/001_create_tenants.sql`:
   ```sql
   CREATE TABLE tenants (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'trial',
     plan_id TEXT,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   CREATE INDEX idx_tenants_status ON tenants(status);
   ```
2. Cria teste `tests/identity/tenant.test.ts` que verifica criação de tenant via repository.
3. Roda teste — falha (sem código ainda).
4. Cria `src/identity/data/tenant_repository.ts` com `create()` mínimo.
5. Roda teste — passa.
6. Commit: `feat(identity): add tenants table with create operation`.
7. Marca T-02.

### T-03 — Signup com validação de senha

A IA:

1. Cria `tests/identity/signup.test.ts` com cenários:
   - Cenário: signup com sucesso (cria tenant, user, role=owner, emite `user.created`).
   - Cenário: signup com senha fraca → 422 `WEAK_PASSWORD`.
   - Cenário: signup com email já usado no mesmo tenant → 409 `EMAIL_TAKEN`.
2. Roda — 3 falhas.
3. Implementa em `src/identity/api/signup.ts`:
   - Validação de senha (≥10 chars + check HIBP).
   - Cria tenant + user + role atomicamente.
   - Hash argon2id.
   - Emite evento `user.created`.
4. Roda — 3 passam.
5. Roda lint/format.
6. Atualiza `docs/specs/identity/events.md` com schema final de `user.created` (já estava no plano, agora confirma).
7. Commit: `feat(identity): add signup endpoint with HIBP password check`.
8. Marca T-03.

(Loop continua até T-11. PR aberto a cada 3 tarefas concluídas.)

## Troubleshooting

### Hook `prevent-code-before-readiness.sh` está bloqueando

Indica que readiness não foi aprovado oficialmente. Rode `bash scripts/check-readiness.sh` e veja exit code. Se for 1, volte na skill da fase pendente. Se quiser bypass deliberado (emergência): `export GENESIS_HOOKS_DISABLE=1`.

### Tarefa T-XX está mais complexa que esperado

Pause e atualize o plano: quebre em sub-tarefas (T-XX.1, T-XX.2). Não force tudo num commit gigante.

### Spec disse X mas a implementação revelou Y

Pause. Atualize a spec primeiro. Depois retoma. Sem isso, código e spec divergem.

### Achei bug em outro módulo durante implementação deste

Registre como tarefa pendente no plano do outro módulo, não interrompa o atual. Exceção: bug que bloqueia o caminho feliz da tarefa atual — aí pare e corrija primeiro.

### Estou perdendo tempo com setup repetitivo entre tarefas

Crie scripts em `scripts/` (ex.: `scripts/seed-dev.sh`, `scripts/reset-db.sh`). Tarefa de "produtividade do dev" pode entrar no Next do roadmap.

### PR ficou grande demais

Antes de abrir, divida em commits temáticos via `git rebase -i`. Se já está aberto, peça revisão por tema (commits primeiro, depois diff completo).

### Cobertura caiu

Provavelmente testou só caminho feliz. Adicione testes de erro e edge cases antes de fechar PR.

### Documentação ficou para depois

Não funciona — fica para nunca. Atualize na hora da mudança ou no commit, não num "PR de docs" separado.

## Próximo passo

➡️ **Loop:** terminada a primeira tarefa → próxima tarefa. Terminado o primeiro módulo → invoque [`define-module-spec`](10-define-module-spec.md) para o próximo módulo da ordem.

➡️ **Em paralelo:** sempre que decisão importante surgir → [`create-adr`](11-create-adr.md).

## Referências cruzadas

- [`.claude/skills/start-development/SKILL.md`](../../.claude/skills/start-development/SKILL.md) — arquivo consumido pela IA.
- [`tests/skills/start-development.md`](../../tests/skills/start-development.md) — checks canônicos.
- [`scripts/check-readiness.sh`](../../scripts/check-readiness.sh) — gate de pré-condição.
- Rules relevantes:
  - [`no-code-before-spec`](../../.claude/rules/no-code-before-spec.md)
  - [`testing-strategy-required`](../../.claude/rules/testing-strategy-required.md)
  - [`documentation-first`](../../.claude/rules/documentation-first.md)
- Agents relevantes:
  - [`implementation-planner`](../../.claude/agents/implementation-planner.md) — para revisão de plano e decomposição.
  - [`software-architect`](../../.claude/agents/software-architect.md) — para decisões emergentes.
- Templates relevantes:
  - [`user-story-template.md`](../../templates/user-story-template.md) — para histórias específicas.
