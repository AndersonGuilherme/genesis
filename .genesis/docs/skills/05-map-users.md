# Skill: `map-users`

> Skill transversal. Refina personas e define matriz de papéis vs. permissões para alimentar a arquitetura de auth.

| Campo | Valor |
|-------|-------|
| Skill ID | `map-users` |
| Fase do fluxo | **transversal** — geralmente entre `discover-business` e `design-architecture` |
| Skill anterior | [`discover-business`](02-discover-business.md) ou [`define-product`](03-define-product.md) |
| Skill seguinte | volta para o fluxo principal (frequentemente [`design-architecture`](08-design-architecture.md)) |
| Tempo típico | 30–60 minutos |

## Contexto e objetivo

`discover-business` define **quem é** o usuário. `map-users` define **quais papéis** essas pessoas assumem no sistema e **quais permissões** cada papel tem.

A skill faz quatro coisas:

1. **Lista todas as pessoas envolvidas** numa decisão típica de compra e uso (usuário, comprador, decisor, influenciador).
2. **Para cada pessoa, define o papel** dela no sistema (owner, admin, member, viewer, custom).
3. **Constrói matriz papel × recurso** com permissões granulares.
4. **Identifica conflitos** (ex.: aluno menor de idade requer consentimento de responsável).

O resultado alimenta diretamente [`auth-strategy.md`](../../../docs/security/auth-strategy.md) na Fase 7 e as permissões das specs de módulo na Fase 8.

O que `map-users` **não faz**:

- Não decide a tecnologia de auth (JWT, Clerk, Auth0 — vai em `choose-stack`).
- Não escreve o código de autorização (vai em `start-development`).
- Não define UX dos fluxos de cadastro/login (fica em jornadas/specs).

## Quando você deve invocar

- Após [`discover-business`](02-discover-business.md) ter mapeado público em alto nível.
- **Antes** de [`design-architecture`](08-design-architecture.md), para alimentar `auth-strategy.md`.
- Em projetos com múltiplos papéis simultâneos (escola, professor, aluno, responsável, suporte).
- Quando se identifica novo papel não previsto.
- Antes de criar nova feature que envolva mudança de permissões.

**Gatilhos no chat:**

- "quem realmente paga, decide, usa?"
- "quais permissões teremos?"
- "como tratar o menor de idade?"
- "vamos mapear os papéis"

## Pré-condições

- [ ] [`target-users.md`](../../../docs/product/target-users.md) com pelo menos persona primária definida.
- [ ] [`user-journeys.md`](../../../docs/product/user-journeys.md) com pelo menos 1 jornada crítica detalhada (ajuda a expor papéis).
- [ ] [`mvp-scope.md`](../../../docs/product/mvp-scope.md) — para focar nos papéis do MVP.

## O passo a passo

### 1. Invoque a skill

> "quem realmente paga, decide, usa?"

A IA lê os arquivos de pré-condição e começa pelo levantamento de pessoas.

### 2. Liste pessoas envolvidas em uma decisão típica

Para cada pessoa que aparece nas jornadas ou no contexto de compra, identifique:

| Pessoa | É usuário? | É comprador? | É decisor? | É influenciador? |
|--------|------------|--------------|------------|---------------------|
| Dona da escola | sim (diária) | sim | sim | — |
| Secretária | sim | não | não | sim (operacional) |
| Professor | sim | não | não | sim |
| Aluno | sim (semanal) | não | não | não |
| Responsável (se menor) | indireto | sim (pelo aluno) | sim | sim |
| Suporte interno | sim | não | não | — |
| Marido/contador da dona | não | não | influencia decisão | sim |

Marque também quem **não** entra no sistema (ex.: marido influencia mas não loga).

### 3. Para cada pessoa que entra no sistema, defina o papel

Papéis comuns (use slug):

- `owner` — dono do tenant, controle total.
- `admin` — administrador delegado.
- `member` — membro com permissões padrão.
- `viewer` — só leitura.
- `guest` — acesso temporário/restrito.
- Custom: `teacher`, `student`, `guardian`, `support`, etc. — domínio específico.

Para o tchr:
- `owner` — dona da escola, criador autônomo.
- `admin` — secretária ou co-fundador.
- `teacher` — professor da escola.
- `student` — aluno matriculado.
- `guardian` — responsável de menor.
- `support` — suporte interno (papel especial, multi-tenant).

### 4. Defina hierarquia ou paralelismo entre papéis

- **Hierárquico:** owner > admin > member > viewer. Owner pode fazer tudo que admin faz + mais.
- **Paralelo:** roles independentes (teacher e student não têm relação hierárquica).
- **Compostos:** uma pessoa pode ter múltiplos papéis (dona = owner + teacher).

Registre em [`auth-strategy.md`](../../../docs/security/auth-strategy.md).

### 5. Construa matriz papel × recurso

Liste recursos principais e o que cada papel pode fazer:

| Recurso | owner | admin | teacher | student | guardian | support |
|---------|-------|-------|---------|---------|----------|---------|
| school | full | read+update | read | — | — | read |
| class | full | full | read+update_grades | read_own | read_own_kids | read |
| student | full | full | read | read_self+update_self | read_kids | read |
| course | create+manage | manage | — | enroll | — | read |
| transaction | view+refund | view | — | view_self | view_kids | view |

Critério: **se não está claro, vira bug em produção**. Force decidir agora.

### 6. Identifique conflitos importantes

Conflitos típicos:

- **Menor de idade** — exige consentimento de responsável (LGPD art. 14).
- **Funcionário que sai da escola** — desativar mas preservar histórico.
- **Aluno em múltiplas escolas** — uma conta, múltiplos tenants? Ou contas separadas?
- **Criador autônomo que também é dono de escola** — múltiplos papéis na mesma conta.
- **Co-fundadores** — quem é owner vs. admin? Sucessão de ownership?

A IA pergunta sobre cada um e registra a decisão.

### 7. Defina convite e onboarding por papel

Como cada papel entra no sistema?

- `owner`: signup público.
- `admin`: convite do owner.
- `teacher`: convite do owner ou admin.
- `student`: convite + ativação (ou cadastro pelo responsável se menor).
- `guardian`: criado junto com cadastro de aluno menor.
- `support`: criado por outro support (papel administrativo do sistema).

### 8. Defina convidados externos (guests), se houver

Casos comuns:

- Aluno externo que compra curso no marketplace (sem ser aluno regular).
- Convidado para sessão única.
- Visualização pública de catálogo (sem login).

Cada caso vira papel ou regra específica.

### 9. Identifique cross-tenant

Há papéis que cruzam tenants?

- `support` (interno) acessa múltiplos tenants — papel especial.
- Aluno em duas escolas — uma conta? Duas contas?

Decisão registrada em ADR se afetar arquitetura.

### 10. Atualize documentos

A IA escreve em:

- [`target-users.md`](../../../docs/product/target-users.md) — refinamento do mapa de papéis.
- [`auth-strategy.md`](../../../docs/security/auth-strategy.md) — papéis base, matriz, hierarquia.
- Em cada `docs/specs/<modulo>/business-rules.md` futuro — regras de permissão específicas do módulo.

### 11. Sugira próxima skill

Volte ao fluxo principal — geralmente [`design-architecture`](08-design-architecture.md) (que usa o output desta skill para refinar `auth-strategy.md`).

## Perguntas que a mentora vai fazer

**1. Quem usa o sistema todo dia?**
Por que importa: define usuário "primário" no design de UX.

**2. Quem decide a compra?**
Por que importa: define alvo de marketing.

**3. Quem assina o contrato e paga?**
Por que importa: define billing e relacionamento comercial.

**4. Quem influencia sem aparecer no fluxo?**
Por que importa: marido contador, RH da empresa, etc. — podem virar advocate ou bloqueador.

**5. Quais papéis existem dentro do tenant?**
Por que importa: alimenta RBAC.

**6. Algum papel administra outros?**
Por que importa: hierarquia define herança de permissões.

**7. Existe caso de menor de idade?**
Por que importa: LGPD art. 14 obriga consentimento de responsável.

**8. Algum papel pode ser suspenso ou convidado externamente?**
Por que importa: define estados intermediários (pending, suspended, deleted).

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte |
|---------|-------------|-------|
| [`target-users.md`](../../../docs/product/target-users.md) | Refinamento do mapa de papéis. | A IA. |
| [`auth-strategy.md`](../../../docs/security/auth-strategy.md) | Lista de papéis, matriz papel × recurso, hierarquia, política de convite. | A IA. |
| [`docs/specs/<modulo>/business-rules.md`](../../../docs/specs/) (futuro) | Regras específicas de permissão por módulo. | A IA na Fase 8. |
| ADR | Se decisão grande surgir (ex.: "uma conta por usuário, múltiplos tenants" vs. "conta separada por tenant"). | Via [`create-adr`](11-create-adr.md). |

## Critérios de "terminei essa skill"

- [ ] Mapa de pessoas (usuário/comprador/decisor/influenciador) explícito.
- [ ] Lista de papéis no sistema definida (com slug em kebab-case).
- [ ] Matriz papel × recurso preenchida para recursos principais.
- [ ] Conflitos importantes identificados (menor de idade, multi-tenant, etc.) com decisão.
- [ ] Política de convite/onboarding por papel definida.
- [ ] Guests/visitantes externos tratados (se aplicável).
- [ ] [`auth-strategy.md`](../../../docs/security/auth-strategy.md) atualizada.

## Anti-padrões — sinais de que algo está errado

🚫 **Criou papel "porque pode ser útil"**. Cada papel deve ter caso de uso real. Sem isso, é complexidade gratuita.

🚫 **Decidiu "vamos permitir tudo ao admin" sem detalhar**. Eventualmente vai dar bug — algum admin verá dado que não deveria. Detalhe matriz agora.

🚫 **Ignorou menor de idade**. LGPD obriga. Bug latente.

🚫 **Mais de 10 papéis no sistema.** Quase certo que está agrupando errado. Tente unir.

🚫 **Sem distinção clara entre usuário, comprador e decisor.** GTM e produto vão sofrer.

🚫 **"Suporte interno usa o mesmo papel admin do tenant."** Misturar suporte com cliente é receita pra incidente de privacidade.

🚫 **Permissões definidas só no review do PR**. Sem matriz prévia, cada PR vira debate sobre quem pode fazer o quê.

🚫 **"Convidado externo é apenas um aluno sem login"**. Pode ser, mas pense em rate limit, abuso, etc.

## Exemplo aplicado: tchr

**Pessoas envolvidas:**

| Pessoa | Usuário? | Comprador? | Decisor? | Influencia? |
|--------|----------|------------|----------|-------------|
| Marina (dona escola) | diária | sim | sim | — |
| Sandra (secretária) | diária | não | não | sim (operacional) |
| Professor João | diária | não | não | sim |
| Aluno Pedro (16 anos) | semanal | não | não | sim |
| Mãe do Pedro | indireto | sim (pelo Pedro) | sim | sim |
| Criador autônomo Carlos | semanal | sim (próprio plano) | sim | sim |
| Aluno externo do Carlos | one-off compra | sim | sim | — |
| Time interno tchr | sob demanda | — | — | sim |

**Papéis definidos:**

- `owner` — Marina, Carlos. Controle total do tenant.
- `admin` — Sandra (delegada de Marina). Pode tudo que owner exceto deletar conta e gerenciar billing.
- `teacher` — João. Pode ver turmas suas, lançar notas, marcar presença.
- `student` — Pedro como aluno regular. Visualiza turmas em que está matriculado, paga mensalidade.
- `guardian` — Mãe do Pedro. Visualiza dados do Pedro, recebe avisos, paga mensalidade.
- `marketplace_buyer` — aluno externo que compra curso do Carlos. Sem vínculo com tenant; conta global.
- `support` — papel especial do time interno. Multi-tenant.

**Matriz papel × recurso (recortes):**

| Recurso | owner | admin | teacher | student | guardian | marketplace_buyer | support |
|---------|-------|-------|---------|---------|----------|--------------------|---------|
| Tenant | full | read+update_settings | read | — | — | — | read |
| Class | full | full | read_own+update_grades | read_enrolled | read_kids_classes | — | read |
| Student | full | full | read_in_class | self+update_phone | kids_only | — | read |
| Invoice | full | view+create | — | view_own | view_kids | — | view |
| Course (catálogo) | create+manage | manage | — | view_enrolled | view_kids | view_purchased | read |
| Marketplace Order | view+refund | view+refund | — | — | — | view_own+create | view |
| Audit log | view | view (próprio tenant) | — | — | — | — | view (qualquer tenant) |

**Conflitos resolvidos:**

- **Menor de idade (Pedro):** matrícula só é ativada após confirmação por email do guardian. Guardian tem visualização total dos dados do menor. Aluno < 14 anos: guardian é o único que loga.
- **Co-fundadores:** suporte para múltiplos owners por tenant (futuro, fora MVP). MVP: 1 owner, podem promover admin.
- **Aluno em múltiplas escolas:** 1 conta, múltiplas matrículas (mesmo email, vínculos diferentes por tenant). Decisão registrada como **ADR-0007**.
- **Dona da escola que também é criadora:** suporta múltiplos papéis na mesma conta (`owner` + `teacher` no tenant escola, `owner` em tenant criador separado).

**Convite/onboarding:**

- `owner` → signup público.
- `admin`, `teacher` → convite do owner por email.
- `student` (maior de idade) → cadastro próprio + matrícula confirmada.
- `student` (menor) → cadastro pelo guardian.
- `guardian` → criado junto com matrícula de menor.
- `marketplace_buyer` → checkout público (sem signup) + opcionalmente cria conta após.
- `support` → criado por outro support (admin do sistema).

**Cross-tenant:**

- `support` acessa qualquer tenant (com audit log obrigatório).
- `marketplace_buyer` vive global, vê apenas seus pedidos.

**Estados intermediários por papel:**

- `student.pending_guardian_confirmation`
- `student.suspended_unpaid`
- `teacher.archived` (saiu da escola, mantém histórico)

**ADRs sugeridos:**

- ADR-0007: "Aluno em múltiplas escolas usa uma conta, múltiplas matrículas."
- ADR-0008: "Suporte interno é cross-tenant com audit log obrigatório."

## Troubleshooting

### Não sei se uma pessoa é "papel" ou "estado"

Pergunta: a permissão muda? Se sim, é papel. Se a permissão é a mesma só com flag diferente, é estado.

### Tenho 12 papéis

Tente agrupar. `teacher_full_time`, `teacher_part_time`, `teacher_substitute` provavelmente são 1 papel (`teacher`) com flags ou permissões customizáveis.

### Decisor é diferente de comprador

Comum em B2B. Marketing fala com decisor; billing fala com comprador. UX precisa contemplar os dois ou direcionar bem.

### Não sei o que fazer com menor de idade

Padrão: cadastro pelo guardian, confirmação obrigatória. Acessos limitados conforme idade (< 14 só guardian loga; ≥ 14 com guardian permitindo). Detalhe na spec do módulo `identity`.

### Suporte interno precisa acessar dados sensíveis

Aceito, mas com:
- Audit log obrigatório (toda ação registrada).
- Acesso apenas com motivo declarado.
- Revisão mensal de quem acessou o quê.

### Aluno externo do marketplace vs. aluno regular

Decisão arquitetural: contas separadas ou conta única? Recomendado: uma conta global do usuário com múltiplos contextos (tenants em que aparece como aluno regular + compras avulsas no marketplace). Registre em ADR.

## Próximo passo

Volte ao fluxo principal — geralmente:

➡️ **[`design-architecture`](08-design-architecture.md)** — usar a matriz para definir `auth-strategy.md` em detalhe.

ou (caso esteja em fase de spec):

➡️ **[`define-module-spec`](10-define-module-spec.md)** — usar as permissões nesta skill para preencher `business-rules.md` do módulo.

## Referências cruzadas

- [`.claude/skills/map-users/SKILL.md`](../../../.claude/skills/map-users/SKILL.md) — arquivo consumido pela IA.
- [`.genesis/tests/skills/map-users.md`](../../tests/skills/map-users.md) — checks canônicos.
- Rules relevantes:
  - [`security-by-design`](../../../.claude/rules/security-by-design.md)
- Agents relevantes:
  - [`security-reviewer`](../../../.claude/agents/security-reviewer.md) — para revisar matriz e LGPD de menores.
  - [`ux-researcher`](../../../.claude/agents/ux-researcher.md) — para refinar diferenças entre usuário/comprador/decisor.
- Templates relevantes:
  - [`business-rule-template.md`](../../templates/business-rule-template.md) — para regras específicas de papel.
