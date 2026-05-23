# Skill: `define-module-spec`

> Cria a spec executável de um módulo: entidades, regras, APIs, eventos, integrações, jobs, dados, erros, observabilidade, testes e critérios de aceite.

| Campo | Valor |
|-------|-------|
| Skill ID | `define-module-spec` |
| Fase do fluxo | Fase 8 — spec por módulo |
| Skill anterior | [`design-architecture`](plan-design-architecture.md) |
| Skill seguinte | [`create-implementation-plan`](plan-create-implementation-plan.md) |
| Tempo típico | 1–2 horas **por módulo** |

## Contexto e objetivo

Spec é o contrato do módulo. Sem ela, módulo vira região nebulosa do código onde regras aparecem implícitas, sem teste, e qualquer mudança gera bug em outro lugar.

`define-module-spec` escreve esse contrato **antes** do código. Cobre:

1. **Entidades** e invariantes.
2. **Regras de negócio** críticas, testáveis.
3. **APIs públicas** com schemas, erros, permissões.
4. **Eventos** emitidos e consumidos com schema.
5. **Integrações externas** específicas desse módulo.
6. **Jobs e filas** necessários.
7. **Dados sensíveis** e tratamento.
8. **Critérios de aceite** em Given/When/Then, sem palavras vagas.

A skill é invocada **uma vez por módulo crítico do MVP**. Você roda ela, gera spec, depois pode rodar [`create-implementation-plan`](plan-create-implementation-plan.md) e finalmente codar. Repete o ciclo para o próximo módulo.

O que `define-module-spec` **não faz**:

- Não escreve código.
- Não desenha telas detalhadas (mantém em alto nível).
- Não define ferramentas internas (linguagem, ORM — já definidas em `choose-stack`).

## Quando você deve invocar

- Após [`design-architecture`](plan-design-architecture.md) concluir a visão geral.
- **Uma vez por módulo crítico do MVP** (você roda esta skill repetidas vezes).
- Quando precisar adicionar feature relevante a módulo existente (atualizar spec antes do código).
- Quando contrato público mudar.

**Gatilhos no chat:**

- "vamos detalhar o módulo de cobrança"
- "spec do marketplace, por favor"
- "vamos fazer a spec do identity primeiro"
- "o que esse módulo realmente faz?"

## Pré-condições

- [ ] [`docs/modules/<modulo>.md`](../../../docs/modules/) existe com visão alta nível do módulo.
- [ ] [`design-architecture`](plan-design-architecture.md) concluído.
- [ ] [`auth-strategy.md`](../../../docs/security/auth-strategy.md) preenchida (define permissões base).
- [ ] [`integration-map.md`](../../../docs/architecture/integration-map.md) lista integrações relevantes.

## O passo a passo

### 1. Invoque a skill apontando o módulo

> "vamos detalhar o módulo `billing`"

A IA carrega `define-module-spec`, confirma o módulo, e lê:

- `docs/modules/billing.md` (visão alta nível).
- Documentos de arquitetura/segurança relevantes.

### 2. Crie estrutura `docs/specs/<modulo>/`

A IA cria a pasta e os arquivos esqueleto:

- `overview.md` — resumo da spec (extraído do template).
- `data-model.md` — entidades.
- `api.md` — endpoints.
- `events.md` — emitidos e consumidos.
- `business-rules.md` — regras críticas.
- `acceptance.md` — critérios em Given/When/Then.

### 3. Modelagem de entidades

Para cada entidade do módulo, use [`data-model-template.md`](../../templates/data-model-template.md):

- Campos com tipo, obrigatoriedade, unicidade.
- Relacionamentos (com cardinalidade e cascata em delete).
- **Invariantes** — regras que nunca podem ser violadas (idealmente no banco via constraint).
- Índices com motivo.
- Soft delete? Auditoria?
- Retenção LGPD se há PII.
- Crescimento esperado.

A IA escreve em `docs/specs/<modulo>/data-model.md`.

### 4. APIs públicas

Para cada endpoint, use [`api-spec-template.md`](../../templates/api-spec-template.md):

- Método + path.
- Autenticação e permissão (por papel).
- Request (headers, query, body) com schema.
- Response (sucesso + erros).
- Códigos de erro enumerados.
- Idempotência (chave + janela).
- Rate limit.
- Exemplos curl.
- Eventos emitidos no sucesso.
- Testes obrigatórios.

Repita para cada endpoint público + interno relevante.

### 5. Eventos

Para cada evento emitido, schema explícito:

```json
{
  "event": "charge.succeeded",
  "version": 1,
  "id": "01J...",
  "occurred_at": "ISO-8601",
  "tenant_id": "uuid",
  "data": {
    "charge_id": "uuid",
    "amount_cents": 19900,
    "currency": "BRL",
    "method": "pix"
  }
}
```

Para eventos consumidos: declare o comportamento esperado quando o evento chega (idempotência, side effects).

A IA escreve em `events.md`.

### 6. Regras de negócio críticas

Para cada regra significativa, use [`business-rule-template.md`](../../templates/business-rule-template.md):

- Nome curto.
- Descrição em 1 frase.
- Inegociável ou contextual?
- Motivação (legal, contratual, política).
- Exemplos positivo, negativo, limítrofe.
- Exceções.
- Onde mora no sistema (banco/app/frontend/job).
- Testes necessários.

Regras críticas (cobrança, permissão, repasse de marketplace) devem ter **constraint de banco quando possível**.

### 7. Integrações específicas do módulo

Se este módulo usa integração externa única (ex.: `billing` usa Pagar.me), crie `docs/specs/integrations/pagarme.md` com o [`integration-spec-template.md`](../../templates/integration-spec-template.md):

- Motivo da integração.
- Alternativas avaliadas.
- Dados enviados (PII?).
- Dados recebidos.
- Auth.
- Limites e quotas.
- Fallback.
- Custos.
- Webhooks.
- Riscos.
- Testes.

### 8. Jobs e filas

Lista de jobs assíncronos:

| Job | Trigger | Frequência | Idempotente? | DLQ |
|-----|---------|------------|---------------|-----|
| `billing.reconcile_pix` | cron | a cada 6h | sim | sim |
| `billing.retry_failed_charge` | evento `charge.failed` | imediato com backoff | sim | sim |

### 9. Erros previstos

Tabela enumerada:

| Código | Condição | HTTP | Mensagem ao usuário |
|--------|----------|------|----------------------|
| `INSUFFICIENT_FUNDS` | saldo do payout < mínimo | 422 | "Saldo abaixo do mínimo para saque." |
| `CHARGE_ALREADY_PAID` | tentativa de pagar charge já paga | 409 | "Cobrança já foi paga." |

### 10. Observabilidade do módulo

- Logs essenciais por evento de negócio.
- Métricas RED por endpoint principal.
- Métricas de negócio (charges geradas, charges falhadas, repasses processados).
- Alertas mínimos.

### 11. Critérios de aceite

A parte mais importante. **Cada critério vira teste automatizado.** Formato Given/When/Then padronizado (ver [`acceptance-criteria.md`](../../../docs/testing/acceptance-criteria.md)).

Exemplo:

```
Cenário: gerar cobrança Pix com sucesso
  Dado um aluno com matrícula ativa
  E o tenant tem provedor Pagar.me configurado
  Quando o job mensal de cobrança roda no dia 5
  Então é criada uma charge com status "pending"
  E um Pix code é gerado via Pagar.me
  E um email é enviado ao aluno com o code
  E o evento charge.created é emitido com payload válido
```

**Critério vago é critério rejeitado.** "Rápido", "corretamente", "intuitivo" não passam.

### 12. Sugira ADR se houver decisão grande

Algumas decisões do módulo viram ADR:

- Escolha de provedor externo (se ADR de stack não cobriu detalhe).
- Padrão específico do módulo (ex.: "cobrança usa idempotência por chave externa do gateway").
- Política de retry diferente.

### 13. Atualize `PROJECT_STATE.md`

Marca módulo como "spec pronta". Sugere [`create-implementation-plan`](plan-create-implementation-plan.md) para esse módulo.

## Perguntas que a mentora vai fazer

**1. Qual problema esse módulo resolve?**
Por que importa: re-confirmar antes de detalhar. Se a resposta mudou desde `plan-modules`, ajuste.

**2. Quem usa esse módulo?**
Por que importa: define API pública e permissões.

**3. Quais entidades pertencem a esse módulo?**
Por que importa: dado próprio do módulo vs. dado emprestado (vem por evento ou API).

**4. Quais regras de negócio existem? Quais são inegociáveis? Quais podem mudar?**
Por que importa: inegociáveis viram constraint + teste; contextuais viram configuração.

**5. Quais casos de uso existem?**
Por que importa: cada caso de uso vira um ou mais endpoints + critérios de aceite.

**6. Quais permissões existem por papel?**
Por que importa: sem matriz clara, vira bug de autorização em produção.

**7. Quais eventos esse módulo emite/consome?**
Por que importa: contrato de integração com outros módulos.

**8. Quais integrações são necessárias?**
Por que importa: dependência externa precisa de spec própria + fallback.

**9. Quais APIs são expostas?**
Por que importa: contrato com frontend e outros módulos.

**10. Quais jobs ou filas são necessários?**
Por que importa: sem job assíncrono mapeado, async vira ad hoc.

**11. Quais emails/notificações são enviados?**
Por que importa: triggers de comunicação precisam de schema.

**12. Quais dados precisam ser auditados?**
Por que importa: LGPD + compliance + debug de produção.

**13. Quais testes são obrigatórios?**
Por que importa: spec testável = código testável.

**14. Quais critérios de aceite definem que o módulo está pronto?**
Por que importa: sem critério, "pronto" vira opinião.

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte |
|---------|-------------|-------|
| `docs/specs/<modulo>/overview.md` | Identificação, escopo IN/OUT, atores, dependências. | Você (mentora conduz). |
| `docs/specs/<modulo>/data-model.md` | Entidades, invariantes, índices, retenção. | Você. |
| `docs/specs/<modulo>/api.md` | Endpoints com schemas + erros + permissões. | Você. |
| `docs/specs/<modulo>/events.md` | Schemas de eventos emitidos e consumidos. | Você. |
| `docs/specs/<modulo>/business-rules.md` | Regras críticas detalhadas. | Você. |
| `docs/specs/<modulo>/acceptance.md` | Critérios em Given/When/Then. | Você. |
| `docs/specs/integrations/<servico>.md` | Spec de integração externa específica. | Via [`integration-spec-template.md`](../../templates/integration-spec-template.md). |
| Atualizações em `integration-map.md`, `data-privacy.md` | Quando módulo introduz nova integração ou novo PII. | A IA atualiza. |
| ADRs | Decisões específicas do módulo. | Via [`create-adr`](plan-create-adr.md). |
| [`open-questions.md`](../../../docs/research/open-questions.md) | Perguntas que apareceram durante a spec. | A IA. |
| [`PROJECT_STATE.md`](../../../docs/PROJECT_STATE.md) | Módulo marcado com spec pronta. | A IA. |

## Critérios de "terminei essa skill" (por módulo)

- [ ] Entidades modeladas com invariantes claras.
- [ ] APIs com schema completo (request + response + erros) e permissão por papel.
- [ ] Eventos com schema explícito.
- [ ] Regras críticas listadas e testáveis.
- [ ] Permissões matriciadas por papel.
- [ ] Integrações específicas com spec.
- [ ] Jobs com idempotência e DLQ definidos.
- [ ] Erros enumerados com HTTP code e mensagem.
- [ ] Observabilidade definida (logs + métricas).
- [ ] Critérios de aceite em Given/When/Then sem palavras vagas.
- [ ] Riscos e perguntas em aberto registrados.

## Anti-padrões — sinais de que algo está errado

🚫 **Critério com "rápido", "corretamente", "intuitivo".** Rejeitar. Exija número ou observação concreta.

🚫 **"Vamos definir permissões depois."** Não. Sem matriz na spec, vira bug em revisão de PR.

🚫 **Evento sem schema.** Vira contrato implícito, quebra na primeira mudança.

🚫 **Regra crítica sem teste planejado.** Sem teste, regra é folclore.

🚫 **API sem código de erro enumerado.** Frontend acaba tratando string de erro — frágil.

🚫 **Sem job de reconciliação onde há integração externa.** Gateway pode falhar webhook. Reconcilie noturnamente.

🚫 **Soft delete sem política de purga.** Vira lixo permanente.

🚫 **PII no log do módulo.** LGPD + custo. Sanitização central.

🚫 **Spec gigante sem foco.** Spec boa é curta e completa. Se sua spec tem 50 páginas, ela é um produto.

## Exemplo aplicado: tchr — módulo `identity`

Eis a spec do módulo mais simples (identity), em formato resumido. (Estrutura real em `docs/specs/identity/`.)

**`identity/overview.md`:**
- Propósito: autenticação multi-tenant, sessões, papéis.
- Atores: dono, admin, professor, aluno, responsável, suporte interno.
- Dependências: nenhuma (módulo base).
- Versão: v0.1, rascunho.

**`identity/data-model.md`:**
- `Tenant` (id uuid, name, status, plan_id, created_at, updated_at).
- `User` (id uuid, tenant_id FK, email único por tenant, hash_password argon2id, mfa_enabled, created_at, last_login_at, status).
- `Role` (id uuid, slug — owner/admin/teacher/student/guardian/support).
- `UserRole` (user_id, role_id, granted_by, granted_at).
- `Session` (id, user_id, refresh_token_hash, expires_at, ip, user_agent, revoked_at).

**Invariantes:**
- `tenant_id` em todas as queries de qualquer entidade do sistema.
- `email` único dentro do mesmo tenant (constraint composta).
- `Session.expires_at > now()` quando ativa.

**`identity/api.md`:**

| Método | Path | Auth | Permissão |
|--------|------|------|-----------|
| POST | `/v1/auth/signup` | não | público |
| POST | `/v1/auth/login` | não | público |
| POST | `/v1/auth/refresh` | refresh token | self |
| POST | `/v1/auth/logout` | sim | self |
| POST | `/v1/auth/mfa/enable` | sim | self |
| GET | `/v1/users/me` | sim | self |

Cada uma com schema, erros (`INVALID_CREDENTIALS`, `EMAIL_TAKEN`, `MFA_REQUIRED`, etc.) detalhados.

**`identity/events.md`:**
- Emite: `user.created`, `user.email_verified`, `user.password_changed`, `tenant.suspended`, `session.created`.
- Consome: nenhum (módulo base).

**`identity/business-rules.md`:**
- BR-001: Senha deve ter mínimo 10 caracteres + não estar em lista de senhas vazadas (Have I Been Pwned ou local).
- BR-002: Após 5 tentativas de login falhas em 15 min, captcha. Após 10, lock temporário 15 min.
- BR-003: Refresh token rotaciona a cada uso e expira em 30 dias.
- BR-004: MFA obrigatório para papéis `owner`, `admin`, `support`.
- BR-005: Aluno menor de 18 anos precisa de email confirmado do responsável antes de ativar conta (RG da LGPD).

**`identity/acceptance.md`:**

```
Cenário: signup com sucesso
  Dado um email não existente em nenhum tenant
  Quando o usuário envia signup com email + senha forte + tenant_name
  Então o tenant é criado em status "trial"
  E o usuário é criado com role "owner" e mfa_enabled=false
  E um email de verificação é enviado
  E o evento user.created é emitido

Cenário: signup com email já usado no mesmo tenant
  Dado um usuário existente em tenant X com email foo@bar.com
  Quando outro signup é feito para tenant X com foo@bar.com
  Então retorna 409 EMAIL_TAKEN
  E nenhum evento é emitido

Cenário: login após 5 falhas dispara captcha
  Dado 5 tentativas falhas em 15 min com mesmo email
  Quando a 6a tentativa chega
  Então a API responde 429 ou exige captcha
```

**Integrações:**
- Resend para email transacional (`docs/specs/integrations/resend.md`).
- Have I Been Pwned API ou lista local (`docs/specs/integrations/hibp.md`).

**Jobs:**
- `identity.purge_expired_sessions` — diário, expurga sessões expiradas há > 7 dias.
- `identity.warn_inactive_owner` — semanal, alerta donos sem login > 60d.

**Erros:**
- `INVALID_CREDENTIALS` (401), `EMAIL_TAKEN` (409), `WEAK_PASSWORD` (422), `MFA_REQUIRED` (403), `RATE_LIMIT` (429), `TENANT_SUSPENDED` (403).

**Observabilidade:**
- Métrica: `signup_total`, `login_success_total`, `login_fail_total`, `mfa_enrolled_count`.
- Alerta: `login_fail_total` spike > 5x baseline em 5 min.

## Troubleshooting

### Spec ficou gigante (40+ páginas)

Provavelmente está incluindo detalhes de implementação. Lembre: spec descreve **o quê**, não **como**. Como vai em código.

### Não consigo escrever critério Given/When/Then

Está vago. Reformule: o que o **usuário observa** depois de fazer X? Se você não sabe, pergunte ao stakeholder do módulo.

### Permissões giraram em 10 papéis

Reduza. Geralmente owner + admin + member + viewer + guest cobre quase tudo. Papéis extras precisam justificar com caso de uso real.

### Tenho regra de negócio que muda com frequência

Não é regra, é configuração. Mova para tabela de config ou feature flag.

### Evento que emito precisa de payload gigante

Provavelmente está vazando entidade inteira no evento. Inclua só o que outros módulos precisam saber. Outros podem buscar via API se quiserem detalhe.

### Integração externa do módulo não tem fallback documentado

Decida: aceita lock-in (com motivo) ou adiciona provedor secundário. Registre.

## Próximo passo

➡️ **[`create-implementation-plan`](plan-create-implementation-plan.md)** — quebrar essa spec em tarefas verticais XS-M para implementação TDD.

Depois (loop):

➡️ **[`define-module-spec`](plan-define-module-spec.md)** — para o próximo módulo do MVP.

## Referências cruzadas

- [`.claude/skills/plan-define-module-spec/SKILL.md`](../../../.claude/skills/plan-define-module-spec/SKILL.md) — arquivo consumido pela IA.
- [`.genesis/tests/skills/define-module-spec.md`](../../tests/skills/define-module-spec.md) — checks canônicos.
- Rules relevantes:
  - [`module-spec-required`](../../../.claude/rules/plan-module-spec-required.md)
  - [`security-by-design`](../../../.claude/rules/plan-security-by-design.md)
  - [`testing-strategy-required`](../../../.claude/rules/plan-testing-strategy-required.md)
- Agents relevantes:
  - [`domain-modeler`](../../../.claude/agents/plan-domain-modeler.md) — para revisar entidades e regras.
  - [`security-reviewer`](../../../.claude/agents/plan-security-reviewer.md) — para permissões e PII.
- Templates relevantes:
  - [`module-spec-template.md`](../../templates/module-spec-template.md)
  - [`data-model-template.md`](../../templates/data-model-template.md)
  - [`api-spec-template.md`](../../templates/api-spec-template.md)
  - [`business-rule-template.md`](../../templates/business-rule-template.md)
  - [`integration-spec-template.md`](../../templates/integration-spec-template.md)
