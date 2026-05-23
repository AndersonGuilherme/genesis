# Skill: `plan-modules`

> Quebra o MVP em módulos coesos, define fronteiras, dependências e a ordem de implementação.

| Campo | Valor |
|-------|-------|
| Skill ID | `plan-modules` |
| Fase do fluxo | Fase 5 — domínio e módulos |
| Skill anterior | [`define-product`](03-define-product.md) |
| Skill seguinte | [`choose-stack`](07-choose-stack.md) |
| Tempo típico | 1–2 horas |

## Contexto e objetivo

Em arquitetura, **fronteiras importam mais que tecnologia**. Você pode escolher qualquer linguagem; se os módulos vazarem responsabilidades, o sistema fica difícil de evoluir. `plan-modules` define essas fronteiras antes de qualquer escolha técnica.

A skill faz quatro coisas:

1. **Identifica módulos coesos** baseados no MVP (não em padrões técnicos).
2. **Define propósito e fronteira** de cada módulo.
3. **Mapeia dependências** e identifica acoplamentos perigosos.
4. **Define ordem de implementação** que destrava o MVP cedo.

Por que essa skill vem **antes** de `choose-stack`: a tecnologia adequada depende dos módulos. Marketplace + tempo real exige decisões diferentes de SaaS B2B puro. Você define módulos primeiro; a stack se adapta.

O que `plan-modules` **não faz**:

- Não define tecnologia interna de cada módulo (Fase 6 e 7).
- Não escreve specs detalhadas (Fase 8).
- Não decide microserviços vs. monolito modular (decisão arquitetural, vai em [`design-architecture`](08-design-architecture.md)).

## Quando você deve invocar

- Após [`define-product`](03-define-product.md) ter consolidado MVP.
- Antes de [`choose-stack`](07-choose-stack.md) — a stack depende dos módulos.
- Quando você precisar adicionar módulo novo durante evolução do produto.
- Antes de novo dev entrar no time — para ele entender as fronteiras existentes.

**Gatilhos no chat:**

- "vamos quebrar o produto em módulos"
- "quais módulos vamos atacar primeiro?"
- "onde mora a regra de cobrança?"

## Pré-condições

- [ ] [`mvp-scope.md`](../product/mvp-scope.md) preenchido com escopo IN claro.
- [ ] [`target-users.md`](../product/target-users.md) com papéis identificados (dono, admin, professor, aluno, etc.).
- [ ] [`value-proposition.md`](../product/value-proposition.md) consolidada.
- [ ] Pelo menos uma jornada crítica de [`user-journeys.md`](../product/user-journeys.md) detalhada.

## O passo a passo

### 1. Invoque a skill

> "vamos quebrar o produto em módulos"

A IA lê os arquivos de pré-condição e começa pelo levantamento de áreas de responsabilidade.

### 2. Liste áreas de responsabilidade

Antes de chamar de "módulo", liste as **áreas** que aparecem nas jornadas críticas. Para o tchr:

- Identidade (login, sessão, multi-tenant).
- Gestão escolar (turmas, alunos, matrículas).
- Cobrança (Pix, faturas, conciliação).
- Catálogo (cursos, conteúdo).
- Marketplace (compra, repasse, comissão).
- Notificações (email, push).
- Auditoria.
- Admin/back-office.

### 3. Agrupe em módulos coesos

Não 1:1. Algumas áreas podem caber em 1 módulo, outras precisam de separação clara. Critérios:

- **Coesão alta dentro do módulo** — código que muda junto fica junto.
- **Acoplamento baixo entre módulos** — fala via API/eventos, não acesso direto ao banco do vizinho.
- **Dono claro** — uma pessoa ou equipe consegue ser responsável.
- **Substituível em isolamento** — você consegue reescrever sem quebrar o resto.

A IA pode sugerir agrupamentos. **Você decide** ao final.

### 4. Para cada módulo, defina

- **Nome em kebab-case** (slug usado em pastas e código).
- **Propósito em 1 frase**.
- **Entidades principais** (sem detalhes — só nomes).
- **Eventos que emite** (sem schema ainda — só nomes).
- **Eventos que consome**.
- **Dependências** (quais outros módulos esse precisa).
- **Dono** (papel ou pessoa).

A IA escreve em `docs/modules/<modulo>.md` (um arquivo por módulo) e atualiza [`docs/modules/README.md`](../modules/README.md) com a lista mestra.

### 5. Identifique acoplamentos perigosos

Acoplamentos comuns que viram dívida:

- Módulo A lê banco do módulo B → vai virar bug quando B mudar schema.
- Eventos com payload gigante → muda sempre que algo mudar em qualquer módulo.
- Módulo "utils" virou repositório de tudo → não é módulo, é caos.
- Permissões definidas em N módulos → vai ter inconsistência.

A IA aponta. Você reorganiza fronteiras.

### 6. Defina ordem de implementação

Não é arbitrário. Critérios:

- **Caminho feliz primeiro** — o que destrava a jornada crítica principal.
- **Identity sempre primeiro** — sem login, nada funciona.
- **Dependências respeitadas** — não comece módulo C se ele depende de B que depende de A.
- **Risco distribuído** — não deixe a integração mais arriscada para o final (faça spike cedo).

Para o MVP do tchr, sugestão típica:

1. `identity` (multi-tenant + login)
2. `school-management` (entidades centrais do domínio)
3. `billing` (cobrança Pix — eixo de monetização)
4. `catalog` (cursos)
5. `marketplace` (compra + repasse)
6. `notifications` (transversal, entra junto a partir do 3)
7. `admin` (back-office, entra por último)

### 7. Decida limites de "uniformidade interna"

Cada módulo pode ter padrões internos próprios? Ou seguem padrão global?

- Global: estrutura de pastas, naming, formato de log, eventos.
- Por módulo: ORM ou query manual, biblioteca de validação, formato interno.

Decisão registrada em [`docs/modules/README.md`](../modules/README.md) ou em ADR.

### 8. Identifique módulos "transversais"

Algumas funcionalidades atravessam todos os módulos (auditoria, observabilidade, autorização). Para cada uma:

- É um módulo separado ou é "infra compartilhada"?
- Quem mantém?
- Como módulos consomem?

### 9. Atualize `PROJECT_STATE.md` e sugira próxima skill

A IA atualiza e sugere [`choose-stack`](07-choose-stack.md).

## Perguntas que a mentora vai fazer

**1. Qual problema esse módulo resolve?**
Por que importa: módulo sem propósito claro vira lixeira.

**2. Quem usa esse módulo?**
Por que importa: define API pública e permissões.

**3. Quais entidades pertencem a esse módulo?**
Por que importa: distingue dado próprio do módulo vs. dado emprestado.

**4. Quais regras de negócio existem?**
Por que importa: regra crítica define se módulo precisa de teste pesado.

**5. Quais eventos esse módulo emite?**
Por que importa: contrato com o resto do sistema.

**6. Quais eventos esse módulo consome?**
Por que importa: revela dependências invisíveis.

**7. Quais integrações são necessárias?**
Por que importa: gateway, email, storage — registram em `integration-map.md` na Fase 7.

**8. Quais APIs são expostas?**
Por que importa: contrato com frontend e outros módulos.

**9. Qual a ordem de implementação?**
Por que importa: destrava MVP cedo.

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte |
|---------|-------------|-------|
| [`docs/modules/README.md`](../modules/README.md) | Lista mestra dos módulos, regras de fronteira, ordem de implementação. | Você. |
| `docs/modules/<modulo>.md` (um por módulo) | Nome, propósito, entidades, eventos, dependências, dono. | Você. |
| [`PROJECT_STATE.md`](../PROJECT_STATE.md) | Marca Fase 5 ✅ + lista módulos identificados. | A IA. |
| [`assumptions.md`](../research/assumptions.md) | Premissas surgidas (ex.: "marketplace e gestão coexistem sem conflito"). | A IA. |

## Critérios de "terminei essa skill"

- [ ] Lista de módulos do MVP definida (geralmente 4–7).
- [ ] Para cada módulo: propósito, entidades, eventos, dependências, dono.
- [ ] Dependências mapeadas — grafo sem ciclos.
- [ ] Acoplamentos perigosos identificados e mitigados.
- [ ] Ordem de implementação proposta com justificativa.
- [ ] [`docs/modules/README.md`](../modules/README.md) atualizado.
- [ ] `PROJECT_STATE.md` mostra Fase 5 ✅.

## Anti-padrões — sinais de que algo está errado

🚫 **Módulo "utils" ou "common".** Não é módulo, é lixeira. Coisas dentro disso deveriam estar em algum módulo específico.

🚫 **Mais de 8 módulos no MVP.** Module-itis. Releia coesão — provavelmente dois "módulos" são na verdade o mesmo.

🚫 **Acoplamento cruzado de banco.** Módulo A faz `SELECT` direto na tabela do módulo B = fronteira violada antes de existir.

🚫 **Módulo sem dono.** Vai virar terra de ninguém.

🚫 **Implementar começando por `notifications`.** Sem identity e domínio central, notificações não têm o que disparar.

🚫 **Definir tecnologia interna do módulo aqui.** "Esse módulo vai usar Mongo, esse usa Postgres." Espere `design-architecture`.

🚫 **Decidir microserviços agora.** Fase 5 trata de módulos lógicos. Decidir se vira microserviço é decisão arquitetural — vai em ADR durante [`design-architecture`](08-design-architecture.md).

## Exemplo aplicado: tchr

**Áreas de responsabilidade levantadas:**

- Multi-tenant + auth (dono/professor/aluno/responsável).
- Gestão de turmas + alunos + matrículas.
- Cobrança recorrente Pix + faturas.
- Cursos (criação, edição, conteúdo).
- Marketplace (compra de curso por aluno externo + repasse para criador).
- Notificações (email, in-app).
- Auditoria (LGPD + compliance).
- Admin do back-office (suporte).

**Módulos definidos (6 no MVP, 1 transversal):**

| Módulo | Propósito | Entidades principais | Dono |
|--------|-----------|------------------------|------|
| `identity` | Auth, sessão, tenants, papéis. | Tenant, User, Role, Session | dev backend lead |
| `school-management` | Turmas, alunos, matrículas, regras de calendário. | School, Class, Student, Enrollment | dev backend |
| `billing` | Cobrança Pix recorrente, faturas, conciliação. | Invoice, Charge, PaymentEvent | dev backend lead |
| `catalog` | Criação e publicação de cursos. | Course, Lesson, MediaAsset | dev backend |
| `marketplace` | Compra externa de cursos + repasse ao criador. | Order, Payout, Commission | dev backend lead |
| `notifications` | Email + push baseado em eventos. | Notification, Template | dev qualquer (transversal) |
| `admin` | Back-office para suporte interno. | (consume dos outros) | a definir, opcional MVP |

**Dependências:**

```
school-management ──depende──> identity
billing            ──depende──> identity, school-management
catalog            ──depende──> identity
marketplace        ──depende──> identity, catalog, billing
notifications      ──consome eventos──> todos
admin              ──consome leitura──> todos (sem escrita cruzada)
```

**Eventos principais (sem schema final):**

- `identity` emite: `user.created`, `tenant.suspended`, `user.deleted`.
- `school-management` emite: `class.created`, `enrollment.created`, `student.churned`.
- `billing` emite: `charge.succeeded`, `charge.failed`, `invoice.overdue`.
- `catalog` emite: `course.published`, `course.unpublished`.
- `marketplace` emite: `order.created`, `payout.processed`.
- `notifications` consome de todos.

**Acoplamentos perigosos identificados e mitigados:**

- ❌ `billing` lendo tabela de `school-management` direto → fronteira violada. Mitigação: `school-management` expõe API ou snapshot de aluno no evento de matrícula.
- ❌ `marketplace` calculando comissão lendo `pricing` do `catalog` → expor cálculo via API do `catalog`, ou snapshot no evento `course.purchase_requested`.
- ❌ `notifications` com 17 templates inline → centralizar e versionar templates por módulo dono.

**Ordem de implementação proposta:**

1. **`identity`** — sem isso nada existe. ~2 sprints.
2. **`school-management`** — entidades centrais. ~3 sprints.
3. **`billing`** — eixo de monetização (Pix recorrente é o teste central). ~3 sprints.
4. **`catalog`** — base para marketplace. ~2 sprints.
5. **`notifications`** — transversal, entra junto com 3. ~1 sprint.
6. **`marketplace`** — depende de tudo. ~3 sprints.
7. **`admin`** — opcional no MVP. Provavelmente fica fora ou versão mínima.

**Uniformidade:**

- Global: estrutura `<modulo>/{api,domain,data,events}`, naming `snake_case` SQL, eventos no padrão `<modulo>.<acao_passada>`.
- Por módulo: livre escolha de validador interno (zod, valibot, etc.), desde que valide entrada.

**ADR sugerido:** "0003 — Monolito modular com 6 módulos no MVP" com justificativa de não escolher microserviços (overhead operacional desproporcional ao time e volume).

## Troubleshooting

### Tenho 12 módulos identificados

Releia coesão. Provavelmente:
- `auth` + `users` + `tenants` viram `identity`.
- `payments` + `invoices` + `charges` viram `billing`.
- `email` + `push` + `sms` viram `notifications`.

### Dois módulos parecem ter mesmo propósito

Talvez sejam o mesmo. Verifique:
- Mesma persona usa?
- Mesma equipe mantém?
- Compartilham > 50% das entidades?

Se sim, fundir.

### Não consigo decidir a ordem de implementação

Comece pela jornada crítica número 1 do [`user-journeys.md`](../product/user-journeys.md). Liste todos os módulos que ela toca; implemente nessa ordem.

### Marketplace e gestão escolar parecem dois produtos diferentes

Bingo — é uma decisão importante. Está coexistindo no MVP, mas as fronteiras precisam ser MUITO claras. Considere ADR explicando por que ficam juntos vs. seriam dois produtos separados.

### Notifications vira responsabilidade de todo mundo e ninguém

Decisão: ou é módulo próprio com API/eventos claros (recomendado), ou é biblioteca compartilhada (perigoso, vira utils). Documente o que escolheu.

## Próximo passo

➡️ **[`choose-stack`](07-choose-stack.md)** — agora que módulos estão definidos, avaliar tecnologias adequadas.

## Referências cruzadas

- [`.claude/skills/plan-modules/SKILL.md`](../../.claude/skills/plan-modules/SKILL.md) — arquivo consumido pela IA.
- [`tests/skills/plan-modules.md`](../../tests/skills/plan-modules.md) — checks canônicos.
- Rules relevantes:
  - [`module-spec-required`](../../.claude/rules/module-spec-required.md)
  - [`avoid-overengineering`](../../.claude/rules/avoid-overengineering.md)
- Agents relevantes:
  - [`software-architect`](../../.claude/agents/software-architect.md) — pode revisar fronteiras.
  - [`domain-modeler`](../../.claude/agents/domain-modeler.md) — para validar entidades por módulo.
- Templates relevantes:
  - [`module-spec-template.md`](../../templates/module-spec-template.md) — para os specs por módulo na Fase 8.
