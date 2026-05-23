# Skill: `review-readiness`

> Gate de prontidão. Avalia se o projeto pode iniciar implementação — bloqueia se não pode.

| Campo | Valor |
|-------|-------|
| Skill ID | `review-readiness` |
| Fase do fluxo | Fase 9 — gate de prontidão |
| Skill anterior | [`create-implementation-plan`](plan-create-implementation-plan.md) |
| Skill seguinte | [`start-development`](dev-start-development.md) (se liberada) |
| Tempo típico | 15–30 minutos |

## Contexto e objetivo

`review-readiness` é o **portão final** antes do código. Existe porque, sem ela, projetos saem implementando com:

- Visão de produto incompleta.
- Premissas críticas não validadas.
- Specs ainda em rascunho.
- Auth ou observabilidade "para definir depois".

A skill faz três coisas:

1. **Roda `.genesis/scripts/check-readiness.sh`** (gate automatizado) e coleta saída.
2. **Verifica qualitativamente** cada item — não basta o arquivo existir, precisa ter conteúdo real.
3. **Decide** entre **liberar** (você pode invocar `start-development`) e **bloquear** (com relatório do que falta + qual skill recuperar).

A skill não negocia: se faltar algo essencial, ela bloqueia mesmo sob pressão. Esse é o ponto.

O que `review-readiness` **não faz**:

- Não escreve nem corrige docs (você volta nas skills certas).
- Não decide se o produto é "bom" — só se está minimamente pronto.
- Não revisa qualidade do conteúdo — só presença e completude estrutural.

## Quando você deve invocar

- Antes da **primeira linha de código** do projeto.
- Antes de qualquer release relevante.
- Periodicamente (mensal) para garantir que documentação não regrediu.
- Quando o usuário diz "vamos começar a implementar".

**Gatilhos no chat:**

- "posso começar a implementar?"
- "check de readiness"
- "estamos prontos pro código?"
- "bora codar"
- "rode review-readiness"

## Pré-condições

Idealmente, fases 1 a 8 todas concluídas:

- [ ] [`init-project`](plan-init-project.md) — identidade.
- [ ] [`discover-business`](disc-discover-business.md) — mercado + valor.
- [ ] [`design-business-model`](plan-design-business-model.md) — planos e GTM.
- [ ] [`define-product`](plan-define-product.md) — MVP definido.
- [ ] [`plan-modules`](plan-modules-mvp.md) — módulos identificados.
- [ ] [`choose-stack`](plan-choose-stack.md) — stack escolhida com ADR.
- [ ] [`design-architecture`](plan-design-architecture.md) — arquitetura, segurança, observabilidade, deploy.
- [ ] [`define-module-spec`](plan-define-module-spec.md) — pelo menos do **primeiro módulo a implementar**.
- [ ] [`create-implementation-plan`](plan-create-implementation-plan.md) — para o mesmo módulo.

Se ainda falta algo, a skill vai te apontar para qual recuperar. Não é problema invocar `review-readiness` "cedo demais" — ela apenas te dá visão clara do estado.

## O passo a passo

### 1. Invoque a skill

> "posso começar a implementar?"

A IA carrega `review-readiness` e prepara para rodar o gate automatizado.

### 2. Rodar `.genesis/scripts/check-readiness.sh`

A IA executa:

```bash
bash .genesis/scripts/check-readiness.sh
```

E coleta:

- Saída completa.
- Exit code (`0` = OK, `1` = bloqueado).
- Lista dos arquivos verificados com status `✓` ou `✗`.

O script verifica:

- Arquivo existe.
- Arquivo > 800 bytes (filtro tamanho).
- Arquivo tem ≤ 5 placeholders `_(...)` (filtro template não preenchido).

### 3. Revisar qualitativamente

O script é automático, mas presença ≠ qualidade. A IA verifica:

| Item | Pergunta-controle |
|------|---------------------|
| `product-vision.md` | A visão sobrevive ao "teste do crítico"? |
| `problem-statement.md` | Tem evidência real (entrevista, dado)? |
| `mvp-scope.md` | Tem critério de sucesso com **números**? |
| `business-model.md` | Tem pelo menos uma fonte de receita com hipóteses? |
| `technology-decision.md` | ≥ 3 opções avaliadas + ADR vinculado? |
| `architecture-overview.md` | C4 níveis 1 e 2 com Mermaid ou texto? |
| `data-strategy.md` | Multi-tenancy decidida e justificada? |
| `auth-strategy.md` | MFA, sessão, papéis claros? |
| `security-requirements.md` | Checklist por camada preenchido? |
| `data-privacy.md` | Inventário de PII feito? |
| `testing-strategy.md` | Pirâmide + tipos de teste + cobertura por camada? |
| `docs/modules/README.md` | Lista módulos do MVP com ordem? |
| `docs/specs/<modulo>/` | Spec completa do primeiro módulo (overview, data-model, api, events, business-rules, acceptance)? |
| `docs/specs/<modulo>/implementation-plan.md` | Plano com ≥ 5 tarefas decompostas? |

### 4. Verificar premissas críticas

A IA lê [`docs/research/assumptions.md`](../../../docs/research/assumptions.md):

- Alguma premissa com **confiança 1-2 + impacto alto/fatal** ainda aberta?
- Se sim, **bloquear** e sugerir [`validate-idea`](disc-validate-idea.md) antes.

### 5. Verificar perguntas em aberto críticas

A IA lê [`docs/research/open-questions.md`](../../../docs/research/open-questions.md):

- Há pergunta crítica sem responsável?
- Há pergunta aberta > 30 dias sem ação?
- Se sim, bloquear e pedir resolução.

### 6. Decidir: liberar ou bloquear

Se **TODOS** os checklists passam → **APROVADO**.

Se **QUALQUER UM** falha → **BLOQUEADO**.

### 7. Gerar relatório

#### Se aprovado:

```markdown
## ✅ Readiness review: APROVADO

- `.genesis/scripts/check-readiness.sh` retornou 0.
- Todos os documentos essenciais preenchidos com conteúdo real.
- Nenhuma premissa fatal aberta.
- Spec + implementation-plan do primeiro módulo (identity) prontos.

Próximo passo: invocar `start-development` para começar pelo módulo `identity`.
```

#### Se bloqueado:

```markdown
## ❌ Readiness review: BLOQUEADO

Itens faltando:

1. ❌ `docs/business/business-model.md` (template não preenchido — 32 placeholders)
   → Recuperar via: `design-business-model`
2. ❌ Premissa A-0001 ("escolas pagam R$ 200/mês") confiança 2, impacto alto, sem plano de validação
   → Recuperar via: `validate-idea`
3. ❌ Spec do módulo `identity` incompleta (falta `acceptance.md`)
   → Recuperar via: `define-module-spec`

Resolva esses 3 itens e rode `review-readiness` novamente.
```

A IA pode persistir o relatório em `docs/validation/readiness-<data>.md` (opcional).

### 8. Atualizar `PROJECT_STATE.md`

A IA marca status atual:

- "Readiness aprovado em YYYY-MM-DD" → Fase 9 ✅.
- "Readiness bloqueado em YYYY-MM-DD — 3 itens pendentes" → Fase 9 em andamento.

### 9. Indicar próxima skill

- Se aprovado: [`start-development`](dev-start-development.md).
- Se bloqueado: a skill exata para cada item faltante.

## Perguntas que a mentora vai fazer

A skill **não pergunta muito** — ela executa checks. Mas pode pedir confirmação:

**1. Confirma que o primeiro módulo a implementar é `<X>`?**
Por que importa: o gate avalia readiness em relação a esse módulo específico.

**2. Confirma que a premissa A-0001 ainda é fatal?**
Por que importa: se você já reduziu impacto via descoberta nova, talvez não bloqueie mais.

**3. Quer persistir o relatório em `docs/validation/`?**
Por que importa: histórico do estado em cada checkpoint ajuda em retrospectiva.

## Documentos produzidos ou atualizados

| Arquivo | O que entra | Fonte |
|---------|-------------|-------|
| `docs/validation/readiness-<data>.md` (opcional) | Relatório do gate. | A IA. |
| [`PROJECT_STATE.md`](../../../docs/PROJECT_STATE.md) | Marca status do gate + readiness em `.genesis/scripts/check-readiness.sh`. | A IA. |

A skill **não escreve** em outros docs. Você volta nas skills certas para preenchê-los.

## Critérios de "terminei essa skill"

- [ ] `.genesis/scripts/check-readiness.sh` rodado.
- [ ] Decisão clara: aprovado ou bloqueado.
- [ ] Se aprovado: próxima skill (`start-development`) indicada.
- [ ] Se bloqueado: lista de itens faltantes + skill para cada.
- [ ] `PROJECT_STATE.md` atualizado.

## Anti-padrões — sinais de que algo está errado

🚫 **A IA aprovou mesmo com docs cheios de placeholders.** Empurre: "verifique também o conteúdo, não só a presença". A regra do gate é: arquivo existe + conteúdo real + sem premissa fatal aberta.

🚫 **A IA pediu para você rodar `check-readiness.sh` manualmente.** A skill deve rodar automaticamente e interpretar a saída.

🚫 **Bloqueio sem indicar skill para recuperar.** Útil ≠ apontar problema. Lembre: "para cada item bloqueado, sugira a skill exata".

🚫 **Aprovação com premissa A-XXXX (confiança 1, impacto fatal) aberta.** Recusar — invoque [`validate-idea`](disc-validate-idea.md) antes.

🚫 **Aprovação sem plano de implementação do primeiro módulo.** Spec sem plano = código sem direção.

🚫 **Você forçou aprovação "porque o time tá com pressa".** Sem readiness, você está escolhendo refazer depois.

## Exemplo aplicado: tchr

**Cenário 1: bloqueado**

```
$ bash .genesis/scripts/check-readiness.sh
Readiness check — project-genesis-boilerplate
Limites: mínimo 800 bytes, máximo 5 placeholders _(...) por arquivo

  ✓ docs/product/product-vision.md             ok (3201 bytes, 0 placeholders)
  ✓ docs/product/problem-statement.md          ok (4127 bytes, 0 placeholders)
  ✓ docs/product/mvp-scope.md                  ok (3845 bytes, 1 placeholder)
  ✓ docs/business/business-model.md            ok (2987 bytes, 3 placeholders)
  ✗ docs/architecture/architecture-overview.md template não preenchido (10 placeholders)
  ✗ docs/architecture/technology-decision.md   template não preenchido (60 placeholders)
  ✓ docs/modules/README.md                     ok (3120 bytes, 2 placeholders)
  ✓ docs/specs/README.md                       ok (2575 bytes, 0 placeholders)
  ✓ docs/testing/testing-strategy.md           ok (3738 bytes, 4 placeholders)
  ✗ docs/security/security-requirements.md     template não preenchido (8 placeholders)

BLOQUEADO — 3 de 10 documento(s) faltando ou vazio(s).
```

Relatório da IA:

```
## ❌ Readiness review: BLOQUEADO

3 documentos essenciais ainda em template:

1. ❌ docs/architecture/architecture-overview.md (10 placeholders)
   → invocar `design-architecture`
2. ❌ docs/architecture/technology-decision.md (60 placeholders)
   → invocar `choose-stack`
3. ❌ docs/security/security-requirements.md (8 placeholders)
   → invocar `design-architecture` (cobre segurança)

Premissas críticas: A-0001 (escolas pagam R$ 200/mês) confiança 2, impacto alto, sem plano de validação.
   → invocar `validate-idea` antes de codar (sugerido) ou aceitar risco com plano de mitigação documentado.

Resolva os 3 docs + decida sobre A-0001 e rode `review-readiness` novamente.
```

**Cenário 2: aprovado**

```
$ bash .genesis/scripts/check-readiness.sh
APROVADO — todos os 10 documentos essenciais preenchidos.
```

Relatório da IA:

```
## ✅ Readiness review: APROVADO

- 10/10 documentos essenciais preenchidos com conteúdo real.
- Premissa A-0001 com plano de validação ativo (smoke test rodando há 4 dias, 12 leads).
- Spec completa do módulo `identity` em `docs/specs/identity/`.
- Implementation plan com 11 tarefas decompostas em `docs/specs/identity/implementation-plan.md`.
- ADRs estruturais criados (0001, 0002, 0003, 0004, 0005).

Próximo passo: invocar `start-development` para começar pelo módulo `identity`.
Cadência sugerida: 2-3 tarefas por dia, PR a cada 3 tarefas concluídas.
```

## Troubleshooting

### `check-readiness.sh` falhou mas todos os arquivos parecem preenchidos

Olhe a contagem de placeholders. Templates trazem `_(preencher)` em muitos lugares — substitua por conteúdo real. Lint conta `_(`.

### Quero aprovar mesmo com premissa A-0001 aberta porque quero "construir e ver"

Tudo bem fazer essa escolha, mas registre em `docs/adr/` como decisão consciente. Sem ADR, vira improviso.

### A IA ficou "checando" sem decidir

Force: "decida agora — aprovar ou bloquear. Cite os critérios". A skill deve produzir veredito claro.

### Esqueci de fazer a spec de um módulo

Spec completa **só do primeiro módulo a implementar** é necessária para liberar. Outros módulos podem ter spec mais tarde (mas antes de cada começar).

### `check-readiness.sh` está com filtros muito permissivos

Aumente `MAX_PLACEHOLDERS` para 3 ou 2 via `MAX_PLACEHOLDERS=3 bash .genesis/scripts/check-readiness.sh`.

### Estou em projeto existente sem PROJECT_STATE.md atualizado

Antes de rodar `review-readiness`, atualize `PROJECT_STATE.md` à mão (ou pedindo à IA) marcando quais fases já foram efetivamente concluídas. Sem isso, o gate dá resultado enganoso.

## Próximo passo

Se aprovado:

➡️ **[`start-development`](dev-start-development.md)** — começar a codar pelo primeiro módulo.

Se bloqueado:

➡️ Volte na skill da fase pendente (lista no relatório).

## Referências cruzadas

- [`.claude/skills/plan-review-readiness/SKILL.md`](../../../.claude/skills/plan-review-readiness/SKILL.md) — arquivo consumido pela IA.
- [`.genesis/tests/skills/review-readiness.md`](../../tests/skills/review-readiness.md) — checks canônicos.
- [`.genesis/scripts/check-readiness.sh`](../../scripts/check-readiness.sh) — gate automatizado.
- Rules relevantes:
  - [`no-code-before-spec`](../../../.claude/rules/plan-no-code-before-spec.md)
  - [`module-spec-required`](../../../.claude/rules/plan-module-spec-required.md)
  - [`security-by-design`](../../../.claude/rules/plan-security-by-design.md)
- Templates relevantes:
  - [`readiness-checklist-template.md`](../../templates/readiness-checklist-template.md) — checklist completo para revisão manual.
