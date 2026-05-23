# project-genesis-boilerplate

![status](https://img.shields.io/badge/status-active-success)
![license](https://img.shields.io/badge/license-MIT-blue)
![stack](https://img.shields.io/badge/stack-neutral-purple)
![language](https://img.shields.io/badge/docs-pt--BR-orange)

> Um sistema guiado de criação de projetos. Não é um template de código. É um **mentor exigente** que te força a entender negócio, produto, usuários, módulos e arquitetura **antes** de escrever a primeira linha.

## O que é

Este repositório é um **boilerplate de planejamento**. Você o clona toda vez que vai começar um projeto novo, e nele a IA (Claude Code) assume o papel de:

- Arquiteta sênior de produto
- Mentora de negócios
- Especialista em Spec Driven Development (SDD)
- Arquiteta de software
- Engenheira de plataforma

A IA faz perguntas estratégicas em fases, registra suas respostas nos documentos certos, sugere alternativas quando suas decisões parecem fracas, propõe ADRs para decisões importantes, e **bloqueia o início do desenvolvimento até que o projeto esteja realmente pronto**.

## Para quem serve

- Fundadores que tendem a sair codando antes de entender o problema.
- Times pequenos que precisam de disciplina sem burocracia.
- Engenheiros que querem aplicar SDD de verdade, não apenas no nome.
- Quem precisa documentar para humanos e para agentes de IA futuros.

## Filosofia

O boilerplate é radicalmente **documentation-first** e **stack-neutral**.

1. Primeiro entender o **negócio**.
2. Depois entender o **produto**.
3. Depois entender os **usuários**.
4. Depois entender os **módulos**.
5. Depois definir **regras de negócio**.
6. Depois definir **arquitetura**.
7. Depois definir **specs**.
8. Depois validar **riscos**.
9. Depois criar **plano de implementação**.
10. Só depois gerar **código**.

A IA é autorizada a **discordar de você** quando o caminho parecer ruim. Ela explica trade-offs, sugere alternativas e exige justificativa para decisões grandes.

## Fluxo recomendado

1. **Clone este repositório** com o nome do seu projeto. Três opções:

   **a) CLI deste boilerplate (recomendado — faz tudo limpo):**
   ```bash
   git clone https://github.com/AndersonGuilherme/genesis.git ~/.genesis-source
   bash ~/.genesis-source/scripts/genesis-init.sh meu-projeto ./meu-projeto
   ```

   **b) git clone direto:**
   ```bash
   git clone https://github.com/AndersonGuilherme/genesis.git meu-projeto
   cd meu-projeto
   rm -rf .git examples && git init
   ```

   **c) degit (requer Node):**
   ```bash
   npx degit AndersonGuilherme/genesis meu-projeto
   cd meu-projeto && rm -rf examples && git init
   ```

2. **Abra o Claude Code** no diretório. Ele vai ler `CLAUDE.md` e carregar as skills/rules automaticamente.

3. **Comece pela skill `init-project`**:
   - No chat, peça: *"vamos iniciar o projeto"* ou *"rode a skill init-project"*.
   - A IA vai conduzir você pelas 10 fases descritas abaixo.

4. **Preencha os docs** conforme a IA pergunta. Não pule fases.

5. **Rode `scripts/check-readiness.sh`** sempre que quiser saber se já pode começar a implementar.

6. **Use a skill `start-development`** apenas quando a readiness review passar.

## As 10 fases

| Fase | Foco | Skill principal | Documentos gerados |
|------|------|------------------|---------------------|
| 1 | Identidade do projeto | `init-project` | `docs/product/product-vision.md`, `docs/product/problem-statement.md` |
| 2 | Público e mercado | `discover-business` | `docs/business/market-analysis.md`, `docs/business/competitors.md` |
| 3 | Valor e monetização | `design-business-model` | `docs/business/business-model.md`, `docs/business/monetization.md`, `docs/business/pricing.md` |
| 4 | Produto e MVP | `define-product` | `docs/product/value-proposition.md`, `docs/product/mvp-scope.md`, `docs/product/user-journeys.md` |
| 5 | Domínio e regras | `plan-modules` | `docs/modules/*`, regras de negócio |
| 6 | Tecnologia | `choose-stack` | `docs/architecture/technology-decision.md` + ADRs |
| 7 | Arquitetura | `design-architecture` | `docs/architecture/*` |
| 8 | Specs por módulo | `define-module-spec` | `docs/specs/*` |
| 9 | Readiness review | `review-readiness` | Bloqueio ou liberação |
| 10 | Implementação | `start-development` | Plano e código |

## Skills disponíveis

📖 **Documentação narrativa completa em [docs/skills/](docs/skills/README.md)** — walkthroughs passo a passo por skill, com exemplos aplicados ao tchr.

Os arquivos em [.claude/skills/](.claude/skills/) são consumidos pela IA; os de `docs/skills/` são para humanos. Os dois contam a mesma história.

- `init-project` — Ponto de entrada. Orquestra todas as fases.
- `discover-business` — Negócio, mercado, monetização, riscos.
- `define-product` — Visão, personas, MVP, jornadas, roadmap.
- `validate-idea` — Hipóteses, validação, entrevistas, métricas, experimentos.
- `map-users` — Usuários, compradores, decisores, personas, permissões.
- `design-business-model` — Monetização, pricing, planos, custos, canais, GTM.
- `choose-stack` — Escolha de tecnologia **sem viés de linguagem**.
- `design-architecture` — Arquitetura, integrações, dados, segurança, deploy, observabilidade.
- `plan-modules` — Módulos, fronteiras, dependências, ordem de implementação.
- `define-module-spec` — Spec completa por módulo.
- `create-adr` — Registro de decisões arquiteturais.
- `create-implementation-plan` — Specs viram plano incremental.
- `review-readiness` — Bloqueia ou libera o início do desenvolvimento.
- `start-development` — Inicia código somente após readiness aprovado.

## Agents

Estão em [.claude/agents/](.claude/agents/). São personagens especializados que a IA pode invocar para revisar uma área específica.

- `product-strategist` — Visão de produto, MVP, posicionamento.
- `business-mentor` — Modelo de negócio, viabilidade.
- `software-architect` — Arquitetura, stack, módulos.
- `domain-modeler` — Entidades, regras, bounded contexts.
- `security-reviewer` — Auth, LGPD, threat modeling.
- `scalability-reviewer` — Performance, filas, cache.
- `ux-researcher` — Usuários, jornadas, entrevistas.
- `monetization-strategist` — Pricing, planos, marketplace.
- `technical-writer` — Documentação clara, rastreabilidade.
- `implementation-planner` — Quebrar specs em tarefas pequenas.

## Rules

Estão em [.claude/rules/](.claude/rules/). São princípios que a IA segue automaticamente.

- `no-code-before-spec.md`
- `documentation-first.md`
- `business-before-technology.md`
- `module-spec-required.md`
- `adr-required-for-decisions.md`
- `security-by-design.md`
- `testing-strategy-required.md`
- `stack-neutrality.md`
- `explain-tradeoffs.md`
- `avoid-overengineering.md`

## Documentação

Estrutura padrão em [docs/](docs/):

```
docs/
├── PROJECT_STATE.md         — Estado vivo do projeto
├── START_HERE.md            — Por onde começar
├── glossary.md              — Termos PT-BR consistentes
├── product/                 — Visão, problema, personas, jornadas, MVP, roadmap
├── business/                — Modelo, monetização, mercado, GTM, pricing
├── architecture/            — Visão, contexto, stack, integrações, dados, escala
├── modules/                 — Mapa e specs de módulos
├── specs/                   — Specs funcionais por feature
├── adr/                     — Architecture Decision Records
├── research/                — Premissas, perguntas em aberto, validação
├── validation/              — Validação de ideia, entrevistas, métricas
├── security/                — Requisitos, ameaças, autenticação, privacidade
├── testing/                 — Estratégia, critérios de aceite, gates
├── deployment/              — Estratégia, ambientes, CI/CD
└── operations/              — Monitoramento, logs, resposta a incidentes
```

## Como decidir stack

Use a skill `choose-stack`. Ela **não assume** JavaScript, TypeScript, Node, Next, Nest ou qualquer linguagem específica. Ela analisa:

- Tipo do produto (SaaS, marketplace, mobile-first, real-time, etc.)
- Complexidade do domínio
- Volume esperado
- Necessidade de SEO, mobile, tempo real, IA, analytics
- Experiência do time
- Custo de infraestrutura
- Velocidade de entrega vs. manutenção no longo prazo

E apresenta **pelo menos 3 opções de stack** (conservadora, equilibrada, escalável), cada uma com frontend, backend, banco, cache, filas, storage, auth, pagamentos, emails, observabilidade, deploy, testes, riscos, custo aproximado, quando escolher e quando evitar.

A decisão final vira um ADR em [docs/adr/](docs/adr/) e é registrada em [docs/architecture/technology-decision.md](docs/architecture/technology-decision.md).

## Como validar readiness

```bash
bash scripts/check-readiness.sh
```

O script verifica se os documentos essenciais existem e foram realmente preenchidos. Retorna `0` se OK, `1` se algo falta. Veja [scripts/README.md](scripts/README.md) para detalhes.

## Como começar desenvolvimento

Só após `check-readiness.sh` passar.

1. Use `review-readiness` para revisão final manual.
2. Use `start-development` para iniciar o primeiro módulo.
3. Cada módulo segue: ler spec → criar plano pequeno → escrever testes → implementar → validar → atualizar docs.

## Exemplo: o caso `tchr`

O projeto `tchr` é uma plataforma de gestão educacional e marketplace de cursos. Veja como ficaria o estado inicial dele em [examples/tchr/](examples/tchr/):

- Visão de produto
- Statement de problema
- Comparação de 3 stacks viáveis

O exemplo serve como inspiração, **não como template fixo**. Apague o diretório `examples/` antes de usar este boilerplate de verdade.

## Próximos passos

1. Abra o Claude Code aqui.
2. Diga: *"vamos iniciar o projeto"*.
3. Deixe a IA conduzir.
4. Não tente pular fases.
5. Quando `check-readiness.sh` passar, comece a codar.

## Licença

MIT — use, modifique, distribua.
