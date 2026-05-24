# Block B — Dev Skills/Rules/Agents/Templates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar 8 rules `dev-*`, 6 skills `dev-*`, 3 agents `dev-*`, 5 templates dev em `.genesis/templates/`, 6 narrativas em `.genesis/docs/skills/`, atualizar `lint-docs.sh` (expected counts) + CLAUDE.md + narrativas/README. Stack-neutral.

**Architecture:** Single commit ao final. Conteúdo inline neste plano — executor cria cada arquivo via Write tool. Validação via lint + grep + spot-checks. Push ao final.

**Tech Stack:** bash, git, Write/Edit tools.

---

## Spec link

`docs/superpowers/specs/2026-05-23-dev-skills-and-namespacing-design.md`

## Pré-condições

- Bloco A já aplicado (commit `ea6b549` ou descendente).
- Working tree limpo.
- Rodando da raiz `/home/anderson/apps/genesis`.

---

### Task 1: Pré-flight

- [ ] **Step 1: Confirmar contexto**

```bash
pwd
git status --short
git branch --show-current
git log -1 --oneline
ls .claude/rules/ | head -3
```

Esperado: pwd raiz, status limpo, branch main, último commit é `ea6b549` ou descendente, rules listadas começam com `plan-`.

---

### Task 2: Criar 8 rules `dev-*`

**Files:** criar em `.claude/rules/dev-*.md`

- [ ] **Step 1: dev-tdd-pragmatic**

Criar `.claude/rules/dev-tdd-pragmatic.md`:

```markdown
---
name: dev-tdd-pragmatic
description: Use cases, entities, value objects e business rules têm teste escrito antes do código. Controllers, wiring e scripts são opcionais.
phase: development
---

# Rule: dev-tdd-pragmatic

## Princípio

Toda lógica de domínio e application (use cases, entities, value objects, business rules) tem teste escrito antes do código de produção. Camadas de infra (controllers, repositórios, wiring) podem ter teste depois ou só smoke test.

## Por que existe

TDD na camada errada vira teatro: testar controller é E2E lento, testar wiring é validar framework. TDD no domínio força design testável, expõe acoplamento e documenta comportamento. Pragmático = pega 90% do valor com menos atrito.

## Como aplicar

1. Antes de criar use case / entity / value object / business rule: escreva o teste primeiro.
2. Rode o teste e confirme que FALHA (red).
3. Implemente o mínimo pra passar (green).
4. Refatore com testes verdes (refactor).
5. Cada use case tem ao menos 1 teste de caminho feliz + 1 teste de erro/borda.
6. Asserts diretos no contrato (entrada → saída esperada). Sem `expect(true).toBe(true)`.

## Exemplos bons

- `register-student.use-case.spec.<ext>` existe e foi commitado ANTES de `register-student.use-case.<ext>`.
- Teste de entity `Student` valida invariante "email único" antes da implementação.
- Value object `Email` tem teste rejeitando formato inválido antes do construtor existir.

## Exemplos ruins

- Use case implementado primeiro, teste "para passar a cobertura" depois.
- Teste de controller HTTP que mocka tudo até o use case (vira teste de framework).
- Asserts vazios ou cobertura cosmética.

## Exceções

- Spike descartável (deletar em ≤ 2 semanas).
- Scripts one-off.
- Wiring / DI puro (montagem de container).
- Migrations de banco.
```

- [ ] **Step 2: dev-ddd-bounded-context**

Criar `.claude/rules/dev-ddd-bounded-context.md`:

```markdown
---
name: dev-ddd-bounded-context
description: 1 módulo = 1 bounded context. Linguagem ubíqua local. Sem vazamento de termos ou entidades entre contextos.
phase: development
---

# Rule: dev-ddd-bounded-context

## Princípio

Cada módulo do sistema implementa exatamente 1 bounded context do DDD. Termos, entidades e regras vivem dentro do contexto. Comunicação entre contextos é via eventos ou contratos públicos explícitos, nunca import direto de entidades alheias.

## Por que existe

Sem fronteiras explícitas, módulos compartilham entidades "úteis" e o sistema vira monolito acoplado. "Aluno" em billing (alguém que paga) ≠ "Aluno" em academic (alguém que cursa) — mesma palavra, contextos distintos. Forçar separação preserva clareza e permite evolução independente.

## Como aplicar

1. Cada módulo tem README.md com:
   - Nome do bounded context.
   - Glossário local (termos que significam algo específico aqui).
   - Lista de entidades e use cases.
   - Eventos publicados/consumidos.
2. Nenhum `import` cruza fronteira de módulo (exceto via contratos públicos: events, DTOs públicos).
3. Se um termo é usado em 2 contextos com sentidos diferentes, manter duplicação intencional documentada.
4. Use case de um módulo nunca chama use case de outro módulo diretamente — usa evento ou interface pública.

## Exemplos bons

- `auth/` define `User` com email + password hash. `billing/` define `Customer` com email + payment method. Não compartilham classe `User`.
- `student/` publica evento `student-registered`. `billing/` consome evento e cria `Customer` próprio.

## Exemplos ruins

- `import { Student } from '../student/domain/student.entity'` dentro de `billing/`.
- "Entidade global" `User` em pasta `shared/` usada por todos os módulos.
- Use case `billing.charge()` chamando `student.activate()` diretamente.

## Exceções

- Value objects genéricos sem regra de negócio (ex.: `Money`, `Email` como tipo primitivo) podem viver em `shared/`.
- Eventos e DTOs públicos vivem em camada de contratos compartilhada com versionamento explícito.
```

- [ ] **Step 3: dev-clean-architecture-layers**

Criar `.claude/rules/dev-clean-architecture-layers.md`:

```markdown
---
name: dev-clean-architecture-layers
description: 3 camadas por módulo — domain/, application/, infra/. Dependência aponta pra dentro. Domain é o núcleo.
phase: development
---

# Rule: dev-clean-architecture-layers

## Princípio

Cada módulo é organizado em exatamente 3 camadas internas:

- `domain/` — entities, value objects, domain events, ports (interfaces). Sem framework, sem I/O.
- `application/` — use cases. Orquestra domain via ports. Sem framework, sem I/O direto.
- `infra/` — adapters (repositórios, controllers HTTP/CLI/handlers, clients externos). Implementa ports do domain. Conhece framework.

Dependências:
- `domain/` não importa de `application/` nem `infra/`.
- `application/` importa só de `domain/`.
- `infra/` importa de `domain/` (para implementar ports) e `application/` (para wirar use cases em controllers).

## Por que existe

Sem fronteiras, lógica de domínio acaba dentro de controllers e o sistema vira "framework-driven". Inverter a dependência (domain no centro) garante que regras de negócio sobrevivem a troca de framework, banco ou interface.

## Como aplicar

1. Pasta do módulo:
   ```
   src/<module>/
   ├── domain/
   ├── application/use-cases/
   ├── infra/repositories/
   ├── infra/controllers/
   └── README.md
   ```
2. Antes de criar arquivo, decidir camada: tem framework? infra. Orquestra? application. Regra pura? domain.
3. Imports respeitam direção: lint pode validar (eslint, ruff, etc. depois da escolha de stack).
4. Repositório no domain como **interface** (port), implementação concreta no infra.

## Exemplos bons

- `domain/entities/student.entity.<ext>` — classe pura, sem framework.
- `application/use-cases/register-student.use-case.<ext>` — injeta `StudentRepositoryPort`, chama `Student.create()`, persiste via port.
- `infra/repositories/student.repository.<ext>` — implementa `StudentRepositoryPort` usando ORM.
- `infra/controllers/student.controller.<ext>` — recebe HTTP, valida input, chama use case.

## Exemplos ruins

- Use case importando ORM diretamente.
- Entity com decorator de framework (`@Entity()` do ORM no domain).
- Controller com lógica de regra de negócio (cálculo, validação semântica).
- Repository importado por entity.

## Exceções

- Módulos triviais (CRUD puro sem regra) podem omitir `application/` se for só passar dado. Documentar a decisão na README do módulo.
```

- [ ] **Step 4: dev-use-case-per-file**

Criar `.claude/rules/dev-use-case-per-file.md`:

```markdown
---
name: dev-use-case-per-file
description: 1 use case = 1 operação = 1 arquivo. Interface `execute(input): output`. Sem service classes com múltiplos métodos.
phase: development
---

# Rule: dev-use-case-per-file

## Princípio

Cada use case da application layer mora em um arquivo dedicado, expõe uma única operação pública `execute(input): output` e tem teste correspondente no mesmo lugar (`<name>.use-case.spec.<ext>`). Sem service classes que agrupam múltiplas operações.

## Por que existe

Service classes ("god classes") acumulam responsabilidades e violam SRP. Testes ficam acoplados, refactor cascateia. 1-use-case-por-arquivo força fronteiras claras, simplifica testes e facilita reuso (use case é unidade de orquestração reutilizável).

## Como aplicar

1. Para cada operação distinta da spec → 1 use case → 1 arquivo.
2. Nome: `<verbo>-<substantivo>.use-case.<ext>` em kebab-case (ex.: `register-student.use-case.ts`).
3. Estrutura mínima:
   - Input type/interface explícito.
   - Output type/interface explícito.
   - Construtor recebe ports (interfaces) como dependências.
   - Método `execute(input): Promise<output>` (ou síncrono se aplicável).
4. Teste irmão: `<name>.use-case.spec.<ext>`.
5. Use case que precisa orquestrar outros use cases recebe-os via construtor (composição, não herança).

## Exemplos bons

- `register-student.use-case.ts` com `class RegisterStudentUseCase { execute(input: RegisterStudentInput): Promise<RegisterStudentOutput> }`.
- `enroll-in-course.use-case.ts` recebe `StudentRepositoryPort` e `CourseRepositoryPort` via construtor.

## Exemplos ruins

- `student.service.ts` com `register()`, `getProfile()`, `update()`, `delete()`.
- Use case com 2 métodos públicos.
- Use case implementando interface "service" genérica.

## Exceções

- Queries de leitura simples (CQRS read-side) podem agrupar em `<entity>.query.<ext>` se ficar excessivo ter 1 arquivo por consulta trivial. Documentar a decisão na README do módulo.
```

- [ ] **Step 5: dev-solid**

Criar `.claude/rules/dev-solid.md`:

```markdown
---
name: dev-solid
description: SRP, OCP, LSP, ISP, DIP aplicados no domínio e application. Princípios não dogmas — usar com critério.
phase: development
---

# Rule: dev-solid

## Princípio

Aplicar SOLID nas camadas `domain/` e `application/` para preservar coesão e baixar acoplamento. Em infra, aplicar quando facilita teste/troca; sem fundamentalismo.

## Por que existe

Sem SOLID, classes crescem (god class), herança vira armadilha, interfaces ficam infladas e dependências concretas amarram o sistema. Cada letra ataca um sintoma concreto.

## Como aplicar

### S — Single Responsibility

Cada classe / use case / entity tem 1 motivo pra mudar. Se você consegue descrever a classe usando "E" / "OU", divide.

Violação: `StudentService` que registra, envia email, gera relatório, faz cobrança.
OK: `RegisterStudentUseCase` que só registra.

### O — Open/Closed

Aberto pra extensão, fechado pra modificação. Use case novo não exige alterar use case existente.

Violação: `if (input.type === 'undergrad') ... else if (input.type === 'grad') ...` em cada use case.
OK: estratégia/policy por tipo, decidida no construtor.

### L — Liskov Substitution

Subclasses funcionam onde superclasse funciona. Sem `throw new Error('not supported')` em sobrescrita.

Violação: `RetiredProfessor extends Professor` mas `assignCourse()` lança erro.
OK: hierarquia onde toda operação da base faz sentido na subclasse, ou composição.

### I — Interface Segregation

Ports pequenos, focados. Cliente não depende do que não usa.

Violação: `StudentRepositoryPort` com 20 métodos, use case usa 2.
OK: `StudentReader` e `StudentWriter` separados.

### D — Dependency Inversion

Application depende de abstrações (ports no domain), não de implementações (infra).

Violação: `RegisterStudentUseCase` importa `PostgresStudentRepository` diretamente.
OK: Use case recebe `StudentRepositoryPort` via construtor. Container/DI escolhe a impl.

## Exemplos bons

- Use case recebe ports via construtor, testes mockam ports facilmente.
- Adição de novo tipo de cobrança = nova classe que implementa port existente. Use case não muda.

## Exemplos ruins

- Service class de 800 linhas.
- `throw new Error('not implemented')` em métodos de subclasse.
- Use case com `new HttpClient()` no meio do código.

## Exceções

- Scripts one-off, code golf, prototipagem descartável.
- Camada de infra pode acoplar a framework (é seu trabalho).
```

- [ ] **Step 6: dev-clean-code**

Criar `.claude/rules/dev-clean-code.md`:

```markdown
---
name: dev-clean-code
description: Nomes intencionais, funções pequenas, sem comentários que explicam o quê, sem magic numbers. Inspirado em Uncle Bob, aplicado com pragmatismo.
phase: development
---

# Rule: dev-clean-code

## Princípio

Código é lido muito mais do que é escrito. Otimizar pra legibilidade: nomes que falam, funções curtas, ausência de truques. Comentário só quando o "porquê" não está óbvio no código.

## Por que existe

Código sujo gera bug e desacelera time. Cada atalho (variável `x`, função `process()`, comentário pra explicar o que o código faz) custa tempo de quem vai ler depois. Limpar cedo é barato; tarde é refatoração cara.

## Como aplicar

1. **Nomes intencionais** — variável, função, classe diz o que é e por quê. Sem `data`, `info`, `manager`, `helper`, `util`.
2. **Funções pequenas** — uma coisa, um nível de abstração. Se passar de ~20 linhas, dividir.
3. **Sem comentário descrevendo o quê** — código bem nomeado dispensa. Comentário só pra "por quê não-óbvio" ou workaround documentado.
4. **Sem magic numbers/strings** — extrair pra constante nomeada.
5. **Sem flag arguments** — `boolean` em parâmetro = sinal de SRP violado. Dividir em 2 funções.
6. **Early return** — preferir guard clauses em vez de `if` aninhados.
7. **Sem código morto** — deletar comentado, não manter "pra caso de".

## Exemplos bons

- `function calculateAnnualTuition(student: Student): Money` em vez de `function calc(x)`.
- `const MAX_RETRIES = 3` em vez de `if (count > 3)`.
- `if (!user) return null` (early return) em vez de aninhar `if (user) { ... }`.

## Exemplos ruins

- `// loop pra somar tudo` ao lado de `total += item.value`.
- `function process(data: any, flag: boolean): any`.
- Função de 100 linhas com 4 níveis de aninhamento.
- Código comentado deixado "pra referência".

## Exceções

- Comentário em algoritmo não-trivial (DSP, criptografia, performance crítica) — documenta o "porquê" da escolha.
- Magic numbers padronizados por especificação externa (HTTP 200, port 5432) podem ficar inline com contexto óbvio.
- TODO/FIXME com link pra issue tracker são aceitáveis temporariamente.
```

- [ ] **Step 7: dev-module-naming**

Criar `.claude/rules/dev-module-naming.md`:

```markdown
---
name: dev-module-naming
description: EN singular, kebab-case folder, PascalCase classe. Ilustração — auth/, student/, professor/.
phase: development
---

# Rule: dev-module-naming

## Princípio

Módulos e arquivos seguem convenção uniforme: nome em inglês singular, pasta em kebab-case, classes em PascalCase, funções em camelCase (ou snake_case se a stack assim exigir).

## Por que existe

Padrão único elimina debate em PR, facilita grep, reduz fricção em onboarding e evita o caos de `Students/`, `professores/`, `Auth/`, `course_module/` convivendo. Singular reflete a unidade conceitual (módulo = 1 bounded context).

## Como aplicar

1. **Módulo**: inglês, singular, kebab-case. `auth/`, `student/`, `professor/`, `course/`, `billing/`.
2. **Arquivo dentro do módulo**: kebab-case com sufixo de papel. Ex.:
   - `student.entity.<ext>`
   - `register-student.use-case.<ext>`
   - `student-repository.port.<ext>`
   - `student.repository.<ext>` (impl)
   - `student.controller.<ext>`
3. **Classe / interface / type**: PascalCase. `Student`, `RegisterStudentUseCase`, `StudentRepositoryPort`.
4. **Função / método / variável**: camelCase (TS/JS/Java) ou snake_case (Python/Rust/Go) conforme idioma.
5. **Constante**: SCREAMING_SNAKE_CASE para constantes verdadeiramente constantes.

## Exemplos bons

- `src/student/domain/entities/student.entity.ts` exportando `class Student`.
- `src/billing/application/use-cases/charge-monthly-fee.use-case.ts` exportando `class ChargeMonthlyFeeUseCase`.

## Exemplos ruins

- `Students/` (plural em pasta).
- `Aluno/` (PT-BR em código).
- `studentService.ts` (camelCase em nome de arquivo).
- `Auth_Module/` (snake + PascalCase em pasta).

## Exceções

- Restrição forte de framework que exige outra convenção (ex.: Next.js `app/` router) — documentar e isolar.
- Termos consagrados específicos do domínio em PT-BR podem aparecer como **string** no glossário, mas nunca como identificador de código.
```

- [ ] **Step 8: dev-dependency-direction**

Criar `.claude/rules/dev-dependency-direction.md`:

```markdown
---
name: dev-dependency-direction
description: Domain não importa de application/infra. Application só importa de domain (via ports). Infra implementa ports.
phase: development
---

# Rule: dev-dependency-direction

## Princípio

Setas de dependência apontam pra dentro: `infra → application → domain`. Domain nunca depende de nada do projeto exceto si mesmo. Inversão (Dependency Inversion Principle) acontece via ports definidos no domain e implementados na infra.

## Por que existe

Quando lógica de domínio depende de framework/banco, troca de framework vira reescrita. Inverter direção isola domain e application de detalhes voláteis (banco, HTTP, ORM). É o coração da Clean Architecture/Hexagonal.

## Como aplicar

1. **Domain** importa só de domain (e tipos primitivos da linguagem).
2. **Application** importa de domain (entities, value objects, ports). Nunca de infra.
3. **Infra** importa de domain (para implementar ports) e application (para wirar use cases nos controllers/handlers).
4. **Ports** vivem no domain como interfaces. Implementações concretas vivem no infra.
5. Lint estático (eslint plugin, import-linter Python, etc.) pode reforçar — adicionar quando stack escolhida.

## Exemplos bons

- `domain/ports/student-repository.port.ts` define interface.
- `infra/repositories/student.repository.ts` implementa a interface usando ORM.
- `application/use-cases/register-student.use-case.ts` recebe `StudentRepositoryPort` via construtor — sem saber qual impl.

## Exemplos ruins

- `domain/entities/student.entity.ts` importando `import { Repository } from 'typeorm'`.
- `application/use-cases/register-student.use-case.ts` importando `PostgresStudentRepository` diretamente.
- `infra/repositories/student.repository.ts` importando outro repositório da infra (acoplamento horizontal interno).

## Exceções

- Adapter de DI / wiring vive em camada externa (`main.ts`, `bootstrap.ts`) e conhece todas as camadas — é o local de composição final.
- Eventos de domínio definidos no domain podem ser consumidos por infra (event bus), mas o domain não conhece o bus concreto.
```

- [ ] **Step 9: Verificar 8 rules criadas**

```bash
ls .claude/rules/dev-*.md | wc -l
```

Esperado: `8`.

```bash
for f in .claude/rules/dev-*.md; do
  head -5 "$f" | grep -q "^name:" || echo "FALTA name: $f"
  head -5 "$f" | grep -q "^phase: development" || echo "FALTA phase: $f"
done
```

Esperado: vazio.

---

### Task 3: Criar 3 agents `dev-*`

**Files:** criar em `.claude/agents/dev-*.md`

- [ ] **Step 1: dev-clean-architect**

Criar `.claude/agents/dev-clean-architect.md`:

```markdown
---
name: dev-clean-architect
description: Revisa estrutura de módulo, fronteiras entre camadas (domain/application/infra), dependency direction, ports vs adapters. Invocar quando criar/refatorar módulo ou revisar PR estrutural.
tools: Read, Grep, Glob
phase: development
---

# Dev Clean Architect

Você é especialista em Clean Architecture e Hexagonal Architecture aplicado a módulos do código.

## Quando você é invocada

- Após `dev-scaffold-module` criar a estrutura inicial.
- Em revisão de PR que adiciona/altera arquivos cross-camada.
- Quando módulo vai ganhar nova integração externa.
- Quando aparecem suspeitas de dependência invertida.

## Como você atua

1. Mapear arquivos do módulo em `domain/`, `application/`, `infra/`.
2. Para cada arquivo, listar imports e validar direção:
   - domain → só domain.
   - application → só domain.
   - infra → domain + application.
3. Verificar que ports (interfaces) vivem no domain, implementações no infra.
4. Reportar violações com `arquivo:linha`, problema, sugestão de correção.
5. Não fazer mudança — só revisar. Retornar lista de findings.

## O que você cobra

- Lógica de negócio em controller? Sinal de application/domain incompleto.
- Use case com import de ORM? Violação de dependency inversion.
- Repository importando outro repository? Vazamento horizontal na infra.
- Port com 20 métodos? Violação de Interface Segregation.

## Tom

Sucinto, técnico, severidade-tagged. Sem elogios. Cada finding: `arquivo:linha — problema. Fix sugerido.`
```

- [ ] **Step 2: dev-tdd-mentor**

Criar `.claude/agents/dev-tdd-mentor.md`:

```markdown
---
name: dev-tdd-mentor
description: Revisa adesão a TDD pragmático — teste-first em use cases/entities/VOs/business rules, qualidade dos testes (asserts diretos, sem mocks excessivos), cobertura crítica. Invocar antes de merge de feature ou em revisão de teste suite.
tools: Read, Grep, Glob, Bash
phase: development
---

# Dev TDD Mentor

Você é especialista em TDD pragmático e qualidade de teste.

## Quando você é invocada

- Antes de merge de feature que cria use case / entity / VO / business rule.
- Em audit periódica da test suite.
- Quando suite está lenta ou flaky.

## Como você atua

1. Identificar use cases / entities / VOs / business rules tocados no diff (ou módulo).
2. Para cada um, verificar:
   - Existe arquivo `<nome>.spec.<ext>` correspondente?
   - Tem ao menos 1 teste de caminho feliz + 1 de erro/borda?
   - Asserts são diretos (verificam contrato real, não tautologia)?
   - Mocks usados só em ports/dependências externas — não em colaboradores internos?
   - Teste é rápido (< 100ms unitário típico)?
3. Verificar git history se o teste foi commitado ANTES ou JUNTO do código de produção (não depois).
4. Reportar lacunas e violações.

## O que você cobra

- Cobertura cosmética (asserts vazios, `expect(true).toBe(true)`).
- Teste depois do código (timestamp/commit posterior).
- Mock de colaborador interno (sinal de dependência mal cortada).
- Teste lento ou dependente de I/O quando deveria ser unit.
- Falta de teste de caso de erro (use cases só com caminho feliz).

## Tom

Direto, com evidência (commit hash, arquivo:linha). Sem ranço purista. Reconhecer quando exceção em `dev-tdd-pragmatic` se aplica (scripts, wiring, spike).
```

- [ ] **Step 3: dev-ddd-modeler**

Criar `.claude/agents/dev-ddd-modeler.md`:

```markdown
---
name: dev-ddd-modeler
description: Revisa entidades, value objects, bounded contexts em código — invariantes encapsulados, linguagem ubíqua respeitada, sem vazamento entre contextos. Invocar quando criar entity nova ou revisar fronteira de módulo.
tools: Read, Grep, Glob
phase: development
---

# Dev DDD Modeler

Você é especialista em Domain-Driven Design aplicado a código (não apenas em modelagem conceitual).

## Quando você é invocada

- Após `dev-design-entity` criar uma nova entidade.
- Quando aparece dúvida sobre se algo é entity, VO ou aggregate.
- Em refactor que move responsabilidade entre módulos.
- Em revisão de bounded context.

## Como você atua

1. Ler entities, value objects, eventos do módulo.
2. Para cada entity, verificar:
   - Identidade explícita?
   - Invariantes validados no construtor / factory?
   - Métodos de domínio expressam linguagem ubíqua (não CRUD)?
   - Sem setter público que viole invariante?
3. Para cada VO:
   - Imutável?
   - Equality semântica (não por referência)?
   - Validação no construtor?
4. Para o bounded context:
   - README do módulo lista termos do glossário local?
   - Imports respeitam fronteira (nenhum import de entity de outro módulo)?
   - Eventos publicados / consumidos estão documentados?

## O que você cobra

- Entity "anêmica" (só dados, sem comportamento).
- VO mutável.
- Vazamento de entity entre módulos.
- Linguagem CRUD onde devia ter linguagem ubíqua (`updateData` em vez de `enroll`).
- Falta de glossário ou termo usado fora do contexto definido.

## Tom

Conceitual mas baseado em código. Cada sugestão referencia entity/arquivo/linha. Sem academicismo — DDD prático.
```

- [ ] **Step 4: Verificar 3 agents criados**

```bash
ls .claude/agents/dev-*.md | wc -l
```

Esperado: `3`.

```bash
for f in .claude/agents/dev-*.md; do
  head -10 "$f" | grep -q "^phase: development" || echo "FALTA phase: $f"
  head -10 "$f" | grep -q "^tools:" || echo "FALTA tools: $f"
done
```

Esperado: vazio.

---

### Task 4: Criar 5 templates dev em `.genesis/templates/`

**Files:** criar 5 templates novos.

- [ ] **Step 1: use-case-template.md**

Criar `.genesis/templates/use-case-template.md`:

```markdown
# Use Case: <verbo>-<substantivo>

> Substitua o nome (ex.: `register-student`). Este template é usado pela skill `dev-define-use-case`.

## Bounded context

Módulo: `<nome-do-modulo>`

## Resumo

1 frase descrevendo o que o use case faz (verbo de ação + objeto).

## Input

```
interface <Name>Input {
  // campos validados — tipo e regra
}
```

## Output

```
interface <Name>Output {
  // campos retornados
}
```

## Dependências (ports injetadas)

- `<EntityRepositoryPort>` — para persistência.
- `<EventBusPort>` — se publica eventos.
- (outros ports conforme necessidade)

## Fluxo principal

1. Validar input.
2. Carregar agregados/entities necessários via ports.
3. Aplicar regra de domínio (delegar à entity/VO).
4. Persistir mudanças via port.
5. Publicar eventos (se aplicável).
6. Retornar output.

## Fluxos alternativos / erros

- `<NotFoundError>` — quando entity referenciada não existe.
- `<DomainRuleViolation>` — quando invariante é violado (ex.: email duplicado).
- (outros erros explícitos)

## Eventos emitidos

- `<event-name>` — payload e quando.

## Critérios de aceite (Given/When/Then)

- Given <estado>, When <ação>, Then <resultado esperado>.
- Given input inválido, When `execute(input)`, Then throw `<ValidationError>`.

## Teste de exemplo (skeleton)

```
describe('<Name>UseCase', () => {
  it('should <verbo> with valid input', async () => {
    // arrange: monta mocks de ports
    // act: chama execute
    // assert: verifica output e side-effects
  });

  it('should throw <Error> when <condition>', async () => {
    // arrange
    // act + assert
  });
});
```
```

- [ ] **Step 2: entity-template.md**

Criar `.genesis/templates/entity-template.md`:

```markdown
# Entity: <Name>

> Substitua `<Name>` (ex.: `Student`). Usado pela skill `dev-design-entity`.

## Bounded context

Módulo: `<nome-do-modulo>`. Esta entity vive aqui e não é compartilhada com outros módulos.

## Identidade

- Como é identificada (id natural? UUID?).
- Tipo do id.

## Atributos

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| id | <tipo> | sim | Identidade. |
| ... | ... | ... | ... |

## Invariantes (validados no construtor/factory)

- Lista de regras que SEMPRE valem. Ex.: "email é único no módulo", "idade >= 0".

## Métodos de domínio

| Método | Recebe | Retorna | Regra |
|--------|--------|---------|-------|
| `<verbo>` | <input> | <output> | <regra aplicada> |

Linguagem ubíqua: usar verbos do domínio (`enroll`, `graduate`), não CRUD (`update`).

## Eventos emitidos

- `<event-name>` — quando o método X é chamado com sucesso.

## Construtor / factory

```
class <Name> {
  private constructor(...) { /* validação de invariantes */ }
  static create(...): <Name> { /* factory que valida e retorna instância */ }
}
```

Construtor privado, criação via `create()` (factory) — garante validação centralizada.

## Teste de exemplo

```
describe('<Name>', () => {
  it('should create with valid attributes', () => {
    const entity = <Name>.create({ /* ... */ });
    expect(entity).toBeInstanceOf(<Name>);
  });

  it('should reject creation when <invariant violado>', () => {
    expect(() => <Name>.create({ /* invalid */ })).toThrow(<DomainError>);
  });
});
```
```

- [ ] **Step 3: value-object-template.md**

Criar `.genesis/templates/value-object-template.md`:

```markdown
# Value Object: <Name>

> Substitua `<Name>` (ex.: `Email`, `Money`, `CPF`). Usado pela skill `dev-design-entity` quando o conceito é VO, não entity.

## O que é

VO encapsula um valor com regra e/ou unidade. Imutável. Igualdade é estrutural (mesmo valor = mesmo VO).

## Quando usar VO vs Entity

- VO: sem identidade própria, definido pelo valor (Email = "a@x.com" igual a outro Email = "a@x.com").
- Entity: tem identidade que sobrevive a mudanças de atributo (Student com id=1 é o mesmo Student mesmo que email mude).

## Atributos imutáveis

| Campo | Tipo | Validação no construtor |
|-------|------|------------------------|
| ... | ... | ... |

## Validação

Todas as regras de formato/valor aplicadas no construtor. Construtor inválido → exceção.

## Equality

Implementar `equals(other)` baseado em valores, não em referência.

## Construtor

```
class <Name> {
  private readonly _value: <tipo>;
  constructor(value: <tipo>) {
    // validar — throw se inválido
    this._value = value;
  }
  get value(): <tipo> { return this._value; }
  equals(other: <Name>): boolean {
    return this._value === other._value;
  }
}
```

## Teste de exemplo

```
describe('<Name>', () => {
  it('should accept valid value', () => {
    const vo = new <Name>('<valid>');
    expect(vo.value).toBe('<valid>');
  });

  it('should reject invalid value', () => {
    expect(() => new <Name>('<invalid>')).toThrow();
  });

  it('should be equal when values match', () => {
    expect(new <Name>('a').equals(new <Name>('a'))).toBe(true);
  });
});
```
```

- [ ] **Step 4: repository-port-template.md**

Criar `.genesis/templates/repository-port-template.md`:

```markdown
# Repository Port + Implementation: <Entity>Repository

> Substitua `<Entity>` (ex.: `Student`). Usado pela skill `dev-scaffold-module`.

## Port (interface no domain)

Vive em `src/<module>/domain/ports/<entity>-repository.port.<ext>`.

```
interface <Entity>RepositoryPort {
  save(entity: <Entity>): Promise<void>;
  findById(id: <IdType>): Promise<<Entity> | null>;
  // ... outros métodos NECESSÁRIOS (Interface Segregation — não infle)
}
```

Princípios:
- Métodos refletem necessidades do use case, não CRUD genérico.
- Tipos vêm do domain (entity, value objects), nunca tipos de framework/ORM.
- Sem método "raw" tipo `query(sql)` — port é abstrato.

## Implementação (no infra)

Vive em `src/<module>/infra/repositories/<entity>.repository.<ext>`.

```
class <Entity>Repository implements <Entity>RepositoryPort {
  constructor(private readonly db: <DbClient>) {}

  async save(entity: <Entity>): Promise<void> {
    // mapeia entity → row, persiste
  }

  async findById(id: <IdType>): Promise<<Entity> | null> {
    // consulta, mapeia row → entity (factory), retorna ou null
  }
}
```

Princípios:
- Implementação conhece ORM/SQL/HTTP/etc.
- Mapeamento row ↔ entity acontece aqui (não vaza pro domain).
- Erros de infra (timeout, constraint violation) são traduzidos pra erros de domain quando relevante.

## Teste

- Port é mockada em testes de use case (use case não conhece impl).
- Impl tem teste de integração próprio (em DB real ou container).
```

- [ ] **Step 5: module-structure-template.md**

Criar `.genesis/templates/module-structure-template.md`:

```markdown
# Módulo: <module-name>

> README do módulo. Usado pela skill `dev-scaffold-module`. Cada módulo tem este README na raiz da pasta.

## Bounded context

Nome do contexto: `<context-name>` (geralmente igual ao nome do módulo).

Descrição em 2-3 frases: o que esse módulo é responsável por? Qual problema resolve?

## Glossário local

Termos com significado específico aqui:

- **<termo>** — definição neste contexto. Se o termo aparece em outro módulo, deixar claro que pode ter sentido diferente lá.

## Entities

| Entity | Identidade | Responsabilidade |
|--------|-----------|------------------|
| <Name> | <id type> | <1 frase> |

## Value objects

| VO | Encapsula |
|----|-----------|
| <Name> | <conceito> |

## Use cases

| Use case | Trigger | Output | Eventos emitidos |
|----------|---------|--------|------------------|
| <verb-noun> | <quando> | <o que retorna> | <eventos> |

## Ports

| Port | Implementada por |
|------|------------------|
| <EntityRepositoryPort> | infra/repositories/<entity>.repository |
| <EventBusPort> | infra/<external-bus-impl> |

## Eventos publicados

| Evento | Quando | Payload |
|--------|--------|---------|
| <event-name> | <gatilho> | <campos> |

## Eventos consumidos

| Evento | Origem | Ação tomada |
|--------|--------|-------------|
| <event-name> | <módulo origem> | <use case acionado> |

## Dependências externas

- <servico-externo> via port `<XPort>` — uso, SLO esperado, comportamento em falha.

## Estrutura de pastas

```
src/<module-name>/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── events/
│   └── ports/
├── application/
│   └── use-cases/
├── infra/
│   ├── repositories/
│   ├── controllers/
│   └── ...
└── README.md (este arquivo)
```

## Como rodar testes do módulo

```bash
<comando-da-stack-escolhida>
```

## Decisões registradas

- Link pros ADRs relevantes a este módulo.
```

- [ ] **Step 6: Verificar 5 templates criados**

```bash
ls .genesis/templates/use-case-template.md .genesis/templates/entity-template.md .genesis/templates/value-object-template.md .genesis/templates/repository-port-template.md .genesis/templates/module-structure-template.md
```

Esperado: 5 arquivos listados.

---

### Task 5: Criar 6 skills `dev-*`

**Files:** criar em `.claude/skills/dev-*/SKILL.md`

- [ ] **Step 1: dev-scaffold-module**

```bash
mkdir -p .claude/skills/dev-scaffold-module
```

Criar `.claude/skills/dev-scaffold-module/SKILL.md`:

```markdown
---
name: dev-scaffold-module
description: Use após `plan-define-module-spec` aprovado, para criar a estrutura inicial do módulo (domain/, application/, infra/) com arquivos base + README. Aplica Clean Architecture 3-layer + DDD bounded context.
phase: development
rules:
  - dev-clean-architecture-layers
  - dev-module-naming
  - dev-ddd-bounded-context
  - dev-dependency-direction
---

# Skill: dev-scaffold-module

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-clean-architecture-layers.md`
- `.claude/rules/dev-module-naming.md`
- `.claude/rules/dev-ddd-bounded-context.md`
- `.claude/rules/dev-dependency-direction.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Gerar a estrutura inicial de um módulo a partir da spec aprovada. Sem código de negócio ainda — só esqueleto + README.

## Quando usar

- Após `plan-define-module-spec` produzir `docs/specs/<modulo>/` completo.
- Antes de qualquer use case ou entity ser implementado.

## Pré-condições

- `docs/specs/<modulo>/overview.md` existe e está aprovado.
- Stack escolhida (`docs/architecture/technology-decision.md` preenchido).
- `<ext>` (extensão de arquivo) deriva da stack.

## Processo

1. Ler spec do módulo: entities, value objects, use cases, eventos, ports.
2. Decidir nome do módulo seguindo `dev-module-naming` (EN singular kebab-case).
3. Criar estrutura de pastas:
   ```
   src/<module>/
   ├── domain/
   │   ├── entities/
   │   ├── value-objects/
   │   ├── events/
   │   └── ports/
   ├── application/
   │   └── use-cases/
   ├── infra/
   │   ├── repositories/
   │   └── controllers/
   └── README.md
   ```
4. Para cada entity da spec → criar `domain/entities/<entity>.entity.<ext>` esqueleto (classe vazia ou sketched conforme template).
5. Para cada VO → criar `domain/value-objects/<vo>.vo.<ext>` esqueleto.
6. Para cada port → criar `domain/ports/<entity>-repository.port.<ext>` esqueleto baseado em `.genesis/templates/repository-port-template.md`.
7. Para cada use case → criar arquivo vazio `application/use-cases/<verb-noun>.use-case.<ext>` (implementação fica para `dev-define-use-case`).
8. Para cada repository port → criar impl esqueleto em `infra/repositories/<entity>.repository.<ext>`.
9. Criar `README.md` do módulo baseado em `.genesis/templates/module-structure-template.md`, preenchendo a partir da spec.

## Restrições

- Não implementar regra de negócio neste passo — só estrutura.
- Não criar use case sem entity correspondente.
- Não criar entity de outro bounded context (rule `dev-ddd-bounded-context`).

## Exemplos de uso

- "Scaffold do módulo student."
- "Criar estrutura do módulo billing baseado na spec."

## Critérios de conclusão

- [ ] Pasta `src/<module>/` com 3 camadas e subpastas corretas.
- [ ] README do módulo preenchido com seções da spec.
- [ ] Esqueletos de entities, VOs, ports, use cases criados.
- [ ] Repository impl esqueleto em infra/.
- [ ] Imports respeitam `dev-dependency-direction` (verificar manualmente neste passo).
```

- [ ] **Step 2: dev-define-use-case**

```bash
mkdir -p .claude/skills/dev-define-use-case
```

Criar `.claude/skills/dev-define-use-case/SKILL.md`:

```markdown
---
name: dev-define-use-case
description: Use para implementar 1 use case completo com TDD pragmático — escreve teste failing, implementa mínimo, valida. Roda 1 use case por vez.
phase: development
rules:
  - dev-tdd-pragmatic
  - dev-use-case-per-file
  - dev-clean-architecture-layers
  - dev-solid
---

# Skill: dev-define-use-case

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-tdd-pragmatic.md`
- `.claude/rules/dev-use-case-per-file.md`
- `.claude/rules/dev-clean-architecture-layers.md`
- `.claude/rules/dev-solid.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Implementar 1 use case da spec aplicando TDD. Cada chamada da skill cobre 1 use case.

## Quando usar

- Após `dev-scaffold-module` criar o esqueleto.
- Para cada use case da spec, individualmente.

## Pré-condições

- Esqueleto do módulo existe.
- Use case definido na spec com input, output, regra, AC.
- Stack instalada localmente.

## Processo (TDD ciclo curto)

1. **Ler a spec do use case**: input, output, ports usados, regra de negócio, AC.
2. **Aplicar template** `.genesis/templates/use-case-template.md` mentalmente.
3. **RED — escrever teste failing**:
   - Criar `application/use-cases/<verb-noun>.use-case.spec.<ext>`.
   - 1 teste do caminho feliz primeiro: arrange (mocka ports), act (execute(input)), assert (output esperado).
   - Rodar teste, confirmar FAIL com mensagem clara.
4. **GREEN — implementação mínima**:
   - Criar/atualizar `application/use-cases/<verb-noun>.use-case.<ext>` com classe + método `execute`.
   - Mínimo necessário pra passar o teste (sem antecipar features).
   - Rodar teste, confirmar PASS.
5. **REFACTOR**:
   - Eliminar duplicação.
   - Aplicar `dev-clean-code` (nomes, função pequena).
   - Aplicar `dev-solid` (SRP, DIP).
   - Re-rodar teste, deve continuar PASS.
6. **Cobrir erros**:
   - Para cada erro do AC (validação, regra violada, entity ausente), escrever teste failing → implementar → passar.
7. **Commit**: 1 commit por use case completo (teste + impl).

## Restrições

- Não implementar 2+ use cases na mesma chamada da skill.
- Não pular RED (escrever impl antes do teste).
- Não usar mock de colaborador interno (só ports).
- Use case não tem 2 métodos públicos (apenas `execute`).

## Exemplos de uso

- "Implementar use case register-student."
- "Faça o use case enroll-in-course com TDD."

## Critérios de conclusão

- [ ] Teste falha sem implementação (RED comprovado).
- [ ] Teste passa com implementação mínima.
- [ ] Pelo menos 1 teste de caminho feliz + 1 de erro/borda por use case.
- [ ] Mocks apenas em ports.
- [ ] Commit com teste + impl juntos.
```

- [ ] **Step 3: dev-design-entity**

```bash
mkdir -p .claude/skills/dev-design-entity
```

Criar `.claude/skills/dev-design-entity/SKILL.md`:

```markdown
---
name: dev-design-entity
description: Use para modelar uma entidade de domínio com invariantes validados, métodos de linguagem ubíqua e teste. Sem framework. Aplica DDD + TDD pragmático.
phase: development
rules:
  - dev-ddd-bounded-context
  - dev-tdd-pragmatic
  - dev-clean-code
  - dev-solid
---

# Skill: dev-design-entity

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-ddd-bounded-context.md`
- `.claude/rules/dev-tdd-pragmatic.md`
- `.claude/rules/dev-clean-code.md`
- `.claude/rules/dev-solid.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Modelar 1 entity (ou VO) do domínio: atributos, invariantes, métodos. Com teste. Sem framework.

## Quando usar

- Após `dev-scaffold-module` ou quando spec do módulo evoluir com nova entity.
- Antes de implementar use cases que dependem dela.

## Pré-condições

- Spec do módulo lista a entity com atributos, invariantes e métodos.
- Pasta `domain/entities/` existe.

## Processo

1. **Decidir entity vs VO**:
   - Tem identidade própria que sobrevive a mudanças? → Entity.
   - É definida pelo valor, imutável? → VO.
2. **Aplicar template apropriado**:
   - Entity: `.genesis/templates/entity-template.md`.
   - VO: `.genesis/templates/value-object-template.md`.
3. **Escrever teste failing** (TDD):
   - Construção válida.
   - Rejeição de cada invariante violado.
   - Métodos de domínio (1 teste por método).
4. **Implementar entity/VO**:
   - Construtor privado + factory `create()` para validação centralizada.
   - Métodos com nomes da linguagem ubíqua (não `setX`, `updateData`).
   - Invariantes validados no construtor/factory.
5. **Aplicar `dev-clean-code`**: nomes, função pequena, sem comentário óbvio.
6. **Verificar `dev-ddd-bounded-context`**: entity não importa de outro módulo.
7. **Commit**: 1 commit por entity (teste + código).

## Restrições

- Sem decorator de framework (`@Entity`, etc.) na classe — domain é puro.
- Sem setter público que viole invariante.
- Sem método anêmico tipo `getData()` — entity tem comportamento.
- Não criar entity que outro módulo importa (rule `dev-ddd-bounded-context`).

## Exemplos de uso

- "Design da entity Student."
- "Modelar VO Email."
- "Criar entity Course com invariante de capacidade máxima."

## Critérios de conclusão

- [ ] Teste cobre construção válida + cada invariante.
- [ ] Construtor valida; tentativa de criação inválida throw error de domínio.
- [ ] Métodos usam linguagem ubíqua do módulo.
- [ ] Sem import de framework.
- [ ] Commit com teste + entity juntos.
```

- [ ] **Step 4: dev-write-failing-test-first**

```bash
mkdir -p .claude/skills/dev-write-failing-test-first
```

Criar `.claude/skills/dev-write-failing-test-first/SKILL.md`:

```markdown
---
name: dev-write-failing-test-first
description: Helper — dado um use case, entity ou VO planejado, gera o arquivo de teste failing antes de qualquer código de produção. Garante RED comprovado.
phase: development
rules:
  - dev-tdd-pragmatic
---

# Skill: dev-write-failing-test-first

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-tdd-pragmatic.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Gerar o arquivo de teste failing para 1 unit (use case, entity, VO) antes que código de produção exista. Saída: arquivo `<name>.spec.<ext>` que falha por "<class/function> not defined".

## Quando usar

- Como parte do ciclo TDD em `dev-define-use-case` ou `dev-design-entity`.
- Quando o desenvolvedor pular RED e quiser corrigir.

## Pré-condições

- Spec da unit (input, output, comportamento esperado, casos de erro) clara.
- Localização do arquivo de teste definida.

## Processo

1. Ler descrição da unit (caminho feliz + casos de erro).
2. Determinar nome de classe/função a testar e arquivo onde vai morar.
3. Gerar arquivo `<name>.spec.<ext>` com:
   - `describe('<Name>', ...)`.
   - Pelo menos 1 `it` de caminho feliz: arrange + act + assert.
   - Pelo menos 1 `it` de erro/borda.
4. Rodar teste e confirmar FAIL — capturar mensagem.
5. Se passar (não devia), revisar — provavelmente import errado ou impl já existe.
6. NÃO criar arquivo de implementação.

## Restrições

- Sem implementação stub no arquivo de teste só pra fazer compilar — manter falha genuína.
- Sem `xit`, `it.skip` — testes ativos.
- Não escrever 5 testes de uma vez — comece com 1 ou 2, expanda no ciclo.

## Exemplos de uso

- "Gera o teste failing pro use case register-student."
- "Teste failing pra entity Student."

## Critérios de conclusão

- [ ] Arquivo `<name>.spec.<ext>` criado.
- [ ] Rodando o teste → FAIL com mensagem indicando classe/função não existe.
- [ ] Nenhum arquivo de implementação foi criado nesta etapa.
```

- [ ] **Step 5: dev-refactor-to-clean-architecture**

```bash
mkdir -p .claude/skills/dev-refactor-to-clean-architecture
```

Criar `.claude/skills/dev-refactor-to-clean-architecture/SKILL.md`:

```markdown
---
name: dev-refactor-to-clean-architecture
description: Use quando código existente viola Clean Architecture (dependência errada, lógica no controller, port no infra). Refatora preservando comportamento (testes verdes antes e depois).
phase: development
rules:
  - dev-clean-architecture-layers
  - dev-dependency-direction
  - dev-solid
  - dev-tdd-pragmatic
---

# Skill: dev-refactor-to-clean-architecture

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-clean-architecture-layers.md`
- `.claude/rules/dev-dependency-direction.md`
- `.claude/rules/dev-solid.md`
- `.claude/rules/dev-tdd-pragmatic.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Refatorar código existente que viola Clean Architecture sem mudar comportamento observável. Testes verdes antes → verdes depois.

## Quando usar

- Code review apontou violação de layer/direção.
- Onboarding em módulo legado.
- Antes de adicionar feature em módulo bagunçado (limpar o caminho).

## Pré-condições

- Suite de teste cobre comportamento atual (se não, escrever teste de caracterização primeiro).
- Suite passa antes de começar refactor.

## Processo

1. **Capturar estado verde**: rodar testes, confirmar PASS, anotar.
2. **Mapear violações**:
   - Lógica de negócio dentro de controller? Extrair pra use case.
   - Use case importando ORM? Inverter via port no domain.
   - Entity com decorator de framework? Separar mapeamento DTO/entity na infra.
   - Service class god? Quebrar em use cases por operação.
3. **Refatorar incrementalmente**:
   - 1 violação por vez.
   - Após cada extração: rodar testes, confirmar VERDE.
   - Commit pequeno.
4. **Atualizar testes** se interface mudou (mas comportamento não).
5. **Atualizar README do módulo** se estrutura mudou.

## Restrições

- Nunca refatorar sem cobertura de teste do trecho afetado.
- Não introduzir feature nova durante refactor (manter o objetivo limpo).
- Não fazer "big bang refactor" — incremental.

## Exemplos de uso

- "Refatorar módulo student que está com lógica no controller."
- "Mover regra de negócio do billing.service pra use cases."

## Critérios de conclusão

- [ ] Testes verdes antes E depois.
- [ ] Cada commit isolado e revertível.
- [ ] Estrutura final respeita 3 camadas + dependency direction.
- [ ] README do módulo atualizado se aplicável.
```

- [ ] **Step 6: dev-review-module-cohesion**

```bash
mkdir -p .claude/skills/dev-review-module-cohesion
```

Criar `.claude/skills/dev-review-module-cohesion/SKILL.md`:

```markdown
---
name: dev-review-module-cohesion
description: Use para auditoria estrutural de um módulo — camadas respeitadas? dependency direction OK? bounded context isolado? Use cases coesos? Retorna findings, sem refatorar.
phase: development
rules:
  - dev-clean-architecture-layers
  - dev-dependency-direction
  - dev-ddd-bounded-context
  - dev-use-case-per-file
---

# Skill: dev-review-module-cohesion

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/dev-clean-architecture-layers.md`
- `.claude/rules/dev-dependency-direction.md`
- `.claude/rules/dev-ddd-bounded-context.md`
- `.claude/rules/dev-use-case-per-file.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Diagnóstico estrutural de 1 módulo. Lista findings com severidade. Não refatora.

## Quando usar

- Periodicamente (a cada N PRs grandes no módulo).
- Antes de adicionar feature significativa.
- Após onboarding de novo dev.

## Pré-condições

- Módulo existe em `src/<module>/`.
- Stack escolhida pra entender extensões de arquivo.

## Processo

1. **Listar arquivos** do módulo agrupados por camada.
2. **Verificar estrutura**: 3 camadas presentes? README do módulo existe e está preenchido?
3. **Mapear imports**:
   - Para cada arquivo, listar imports.
   - Validar direção (domain ↛ application/infra, application ↛ infra, etc.).
4. **Conferir bounded context**:
   - Há import de entity de outro módulo? Listar.
   - Termos do glossário local são usados de forma consistente?
5. **Conferir use cases**:
   - 1 use case por arquivo? Service classes existem?
   - Cada use case tem teste irmão?
6. **Conferir ports**:
   - Ports vivem em `domain/ports/`?
   - Impls vivem em `infra/`?
   - Ports têm método demais (>5)? Interface Segregation?
7. **Retornar findings** com severidade:
   - 🔴 high: viola direção de dependência ou bounded context.
   - 🟡 medium: god class, port inflada.
   - 🟢 low: nome inconsistente, falta README.

## Restrições

- Não refatorar — só reportar.
- Não inventar problema (cada finding referencia arquivo:linha).

## Exemplos de uso

- "Audita o módulo student."
- "Review estrutural do billing."

## Critérios de conclusão

- [ ] Lista de findings em formato `arquivo:linha — severidade — problema — fix sugerido`.
- [ ] Categorizado por severidade.
- [ ] Sem mudança no código.
```

- [ ] **Step 7: Verificar 6 skills criadas**

```bash
ls -d .claude/skills/dev-*/ | wc -l
```

Esperado: `7` (6 novas + `dev-start-development` do Bloco A).

```bash
for d in .claude/skills/dev-*/; do
  [ -f "$d/SKILL.md" ] || echo "FALTA SKILL.md em $d"
  head -10 "$d/SKILL.md" | grep -q "^phase: development" || echo "FALTA phase em $d"
done
```

Esperado: vazio.

---

### Task 6: Criar 6 narrativas em `.genesis/docs/skills/`

**Files:** criar 6 arquivos `dev-<nome>.md` (1 por skill nova). Atualizar README.

- [ ] **Step 1: Criar narrativas (formato curto, sem placeholders)**

Para cada uma das 6 dev skills, criar arquivo correspondente em `.genesis/docs/skills/`. Conteúdo mínimo: descrição em PT-BR claro, passo-a-passo do uso, links pra rules invocadas, exemplos.

Criar `.genesis/docs/skills/dev-scaffold-module.md`:

```markdown
# dev-scaffold-module

## O que faz

Pega uma spec aprovada de módulo (`docs/specs/<modulo>/`) e gera a estrutura de pastas + arquivos esqueleto seguindo Clean Architecture 3-layer (`domain/`, `application/`, `infra/`).

## Quando você invoca

Depois que `plan-define-module-spec` aprovou a spec do módulo. Antes de qualquer use case ou entity ser implementado.

## O que a IA faz

1. Lê spec do módulo.
2. Cria `src/<module>/` com 3 camadas.
3. Esqueletos: entities, value objects, ports, use cases (vazios), repository impls.
4. README do módulo preenchido a partir da spec.

## O que VOCÊ faz

- Confirma o nome do módulo (EN singular kebab-case).
- Aponta a spec.
- Revisa o esqueleto antes de prosseguir pra implementação.

## Rules invocadas

- [dev-clean-architecture-layers](../../../.claude/rules/dev-clean-architecture-layers.md)
- [dev-module-naming](../../../.claude/rules/dev-module-naming.md)
- [dev-ddd-bounded-context](../../../.claude/rules/dev-ddd-bounded-context.md)
- [dev-dependency-direction](../../../.claude/rules/dev-dependency-direction.md)

## Próximo passo natural

`dev-define-use-case` (implementar cada use case com TDD).
```

Criar `.genesis/docs/skills/dev-define-use-case.md`:

```markdown
# dev-define-use-case

## O que faz

Implementa 1 use case completo seguindo TDD pragmático: escreve teste failing, implementa o mínimo pra passar, refatora.

## Quando você invoca

Para cada use case da spec, individualmente. Após `dev-scaffold-module`.

## O que a IA faz

1. RED — cria `<name>.use-case.spec.<ext>` com teste falhando.
2. GREEN — implementa `<name>.use-case.<ext>` mínimo pra passar.
3. REFACTOR — limpa nomes, aplica SOLID/Clean Code.
4. Adiciona teste de erro/borda.

## O que VOCÊ faz

- Aponta qual use case (1 por vez).
- Revê o teste antes da impl (essencial).
- Aprova commit.

## Rules invocadas

- [dev-tdd-pragmatic](../../../.claude/rules/dev-tdd-pragmatic.md)
- [dev-use-case-per-file](../../../.claude/rules/dev-use-case-per-file.md)
- [dev-clean-architecture-layers](../../../.claude/rules/dev-clean-architecture-layers.md)
- [dev-solid](../../../.claude/rules/dev-solid.md)

## Próximo passo natural

Outro use case com `dev-define-use-case`, ou `dev-design-entity` se nova entidade emerge.
```

Criar `.genesis/docs/skills/dev-design-entity.md`:

```markdown
# dev-design-entity

## O que faz

Modela 1 entity ou value object do domínio: atributos, invariantes validados, métodos da linguagem ubíqua. Tudo com teste, sem framework.

## Quando você invoca

Quando spec do módulo lista uma entity nova, ou refactor exige criação de VO.

## O que a IA faz

1. Decide entity vs VO baseado em "tem identidade?".
2. Teste failing: construção válida + cada invariante.
3. Implementa entity/VO com construtor privado + factory `create()`.
4. Métodos de domínio com nomes ubíquos (não CRUD).

## O que VOCÊ faz

- Confirma se é entity ou VO.
- Revisa invariantes listados.
- Aprova commit.

## Rules invocadas

- [dev-ddd-bounded-context](../../../.claude/rules/dev-ddd-bounded-context.md)
- [dev-tdd-pragmatic](../../../.claude/rules/dev-tdd-pragmatic.md)
- [dev-clean-code](../../../.claude/rules/dev-clean-code.md)
- [dev-solid](../../../.claude/rules/dev-solid.md)

## Próximo passo natural

`dev-define-use-case` para use cases que usam a entity.
```

Criar `.genesis/docs/skills/dev-write-failing-test-first.md`:

```markdown
# dev-write-failing-test-first

## O que faz

Helper — gera APENAS o arquivo de teste falhando, sem código de produção. Garante que o RED do TDD foi de fato comprovado.

## Quando você invoca

- Como parte de `dev-define-use-case` ou `dev-design-entity`.
- Quando você (ou outra IA) pulou o RED e quer corrigir.

## O que a IA faz

1. Cria `<name>.spec.<ext>` com 1-2 testes ativos.
2. Roda o teste e confirma FAIL com mensagem clara ("class not defined" tipicamente).
3. NÃO cria arquivo de implementação.

## O que VOCÊ faz

- Aponta a unit (use case, entity, VO) e descrição esperada.
- Confirma que a falha é genuína (não erro de import).

## Rules invocadas

- [dev-tdd-pragmatic](../../../.claude/rules/dev-tdd-pragmatic.md)

## Próximo passo natural

Implementar o código mínimo pra passar (parte do ciclo TDD em `dev-define-use-case`).
```

Criar `.genesis/docs/skills/dev-refactor-to-clean-architecture.md`:

```markdown
# dev-refactor-to-clean-architecture

## O que faz

Refatora código existente que viola Clean Architecture (dependência errada, lógica no controller, port no infra) sem mudar comportamento. Testes verdes antes → verdes depois.

## Quando você invoca

- Code review apontou violação.
- Onboarding em módulo legado.
- Antes de adicionar feature em módulo bagunçado.

## O que a IA faz

1. Confirma suite verde.
2. Mapeia violações (1 por vez).
3. Extrai/move código preservando comportamento.
4. Re-roda testes a cada passo, confirma verde.
5. Commit pequeno por extração.

## O que VOCÊ faz

- Garante cobertura de teste antes (se faltar, escrever testes de caracterização primeiro).
- Revisa diff a cada extração.
- Não introduzir feature nova no meio do refactor.

## Rules invocadas

- [dev-clean-architecture-layers](../../../.claude/rules/dev-clean-architecture-layers.md)
- [dev-dependency-direction](../../../.claude/rules/dev-dependency-direction.md)
- [dev-solid](../../../.claude/rules/dev-solid.md)
- [dev-tdd-pragmatic](../../../.claude/rules/dev-tdd-pragmatic.md)

## Próximo passo natural

`dev-review-module-cohesion` pra confirmar estrutura final.
```

Criar `.genesis/docs/skills/dev-review-module-cohesion.md`:

```markdown
# dev-review-module-cohesion

## O que faz

Auditoria estrutural de 1 módulo. Verifica camadas, dependency direction, bounded context, use case granularity, ports. Reporta findings, NÃO refatora.

## Quando você invoca

- Periodicamente (a cada N PRs no módulo).
- Antes de feature significativa.
- Após onboarding de novo dev.

## O que a IA faz

1. Lista arquivos por camada.
2. Mapeia imports e valida direção.
3. Confere bounded context (vazamento? glossário consistente?).
4. Confere use cases (1 por arquivo? teste irmão?).
5. Confere ports (vivem no domain? não-infladas?).
6. Retorna findings: `arquivo:linha — severidade — problema — fix sugerido`.

## O que VOCÊ faz

- Aponta o módulo.
- Decide quais findings priorizar.
- Pode invocar `dev-refactor-to-clean-architecture` em seguida.

## Rules invocadas

- [dev-clean-architecture-layers](../../../.claude/rules/dev-clean-architecture-layers.md)
- [dev-dependency-direction](../../../.claude/rules/dev-dependency-direction.md)
- [dev-ddd-bounded-context](../../../.claude/rules/dev-ddd-bounded-context.md)
- [dev-use-case-per-file](../../../.claude/rules/dev-use-case-per-file.md)

## Próximo passo natural

Refatoração focada com `dev-refactor-to-clean-architecture` (se há high-severity findings).
```

- [ ] **Step 2: Atualizar `.genesis/docs/skills/README.md`** — adicionar seção Development completa

Substituir seção "## Development" atual por:

```markdown
## Development

- [dev-start-development](dev-start-development.md) — início incremental, módulo por módulo.
- [dev-scaffold-module](dev-scaffold-module.md) — gera estrutura 3-layer do módulo a partir da spec.
- [dev-define-use-case](dev-define-use-case.md) — implementa 1 use case com TDD pragmático.
- [dev-design-entity](dev-design-entity.md) — modela entity/VO com invariantes + teste.
- [dev-write-failing-test-first](dev-write-failing-test-first.md) — helper para RED comprovado.
- [dev-refactor-to-clean-architecture](dev-refactor-to-clean-architecture.md) — refatora código que viola Clean Arch.
- [dev-review-module-cohesion](dev-review-module-cohesion.md) — auditoria estrutural de módulo.
```

Use Edit tool para substituir o bloco antigo.

- [ ] **Step 3: Verificar narrativas**

```bash
ls .genesis/docs/skills/dev-*.md | wc -l
```

Esperado: `7` (6 novas + dev-start-development).

---

### Task 7: Atualizar `lint-docs.sh` com novos expected counts

**Files:** `.genesis/scripts/lint-docs.sh`

- [ ] **Step 1: Atualizar contagens via sed**

```bash
sed -i \
  -e 's|^expected_skills=14$|expected_skills=20|' \
  -e 's|^expected_agents=10$|expected_agents=13|' \
  -e 's|^expected_rules=10$|expected_rules=18|' \
  -e 's|^expected_templates=9$|expected_templates=14|' \
  .genesis/scripts/lint-docs.sh
echo "---CHECK---"
grep "^expected_" .genesis/scripts/lint-docs.sh
```

Esperado: 20, 13, 18, 14.

---

### Task 8: Atualizar CLAUDE.md mencionando development

**Files:** `CLAUDE.md`

- [ ] **Step 1: Adicionar seção sobre fase development**

Inserir na seção "Regras carregadas" ou criar nova seção. Usar Edit tool.

Procurar trecho final da seção "Regras carregadas:" e inserir após:

```markdown
### Regras de development (aplicadas após readiness aprovada)

- [plan-no-code-before-spec](.claude/rules/plan-no-code-before-spec.md) (já listada — gate)
- [dev-tdd-pragmatic](.claude/rules/dev-tdd-pragmatic.md)
- [dev-ddd-bounded-context](.claude/rules/dev-ddd-bounded-context.md)
- [dev-clean-architecture-layers](.claude/rules/dev-clean-architecture-layers.md)
- [dev-use-case-per-file](.claude/rules/dev-use-case-per-file.md)
- [dev-solid](.claude/rules/dev-solid.md)
- [dev-clean-code](.claude/rules/dev-clean-code.md)
- [dev-module-naming](.claude/rules/dev-module-naming.md)
- [dev-dependency-direction](.claude/rules/dev-dependency-direction.md)
```

E em "Agentes especializados", acrescentar:

```markdown
- `dev-clean-architect` para revisar estrutura de módulo e dependency direction.
- `dev-tdd-mentor` para revisar adesão a TDD e qualidade dos testes.
- `dev-ddd-modeler` para revisar entities, VOs e bounded contexts em código.
```

---

### Task 9: Validação completa

- [ ] **Step 1: lint-docs**

```bash
bash .genesis/scripts/lint-docs.sh 2>&1 | tail -15
```

Esperado: APROVADO. Counts: 20 skills, 13 agents, 18 rules, 14 templates.

- [ ] **Step 2: check-readiness ainda roda**

```bash
bash .genesis/scripts/check-readiness.sh > /dev/null 2>&1
echo "exit: $?"
```

Esperado: exit 1 (boilerplate base sem docs preenchidos, comportamento normal).

- [ ] **Step 3: run-skill-tests**

```bash
bash .genesis/scripts/run-skill-tests.sh 2>&1 | tail -3
```

Esperado: "Lint OK".

- [ ] **Step 4: Spot-check estrutura final**

```bash
ls .claude/rules/ | wc -l         # 18
ls -d .claude/skills/*/ | wc -l    # 20
ls .claude/agents/ | wc -l         # 13
ls .genesis/templates/ | wc -l     # 14
ls .genesis/docs/skills/ | wc -l   # 22 (21 narrativas + README)
```

---

### Task 10: Commit Bloco B + push

- [ ] **Step 1: Status**

```bash
git status --short | wc -l
```

Esperado: ~28+ arquivos novos + ~3 modificados.

- [ ] **Step 2: Stage + commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat(.claude): add dev-* skills/rules/agents/templates

Bloco B do spec dev-skills-and-namespacing-design.md.

Skills (6):
- dev-scaffold-module — gera estrutura 3-layer a partir da spec.
- dev-define-use-case — implementa use case com TDD pragmático.
- dev-design-entity — modela entity/VO com invariantes + teste.
- dev-write-failing-test-first — helper para RED comprovado.
- dev-refactor-to-clean-architecture — refatora preservando comportamento.
- dev-review-module-cohesion — auditoria estrutural sem refatorar.

Rules (8):
- dev-tdd-pragmatic
- dev-ddd-bounded-context
- dev-clean-architecture-layers (3 camadas: domain/application/infra)
- dev-use-case-per-file
- dev-solid
- dev-clean-code
- dev-module-naming (EN singular kebab-case)
- dev-dependency-direction (apontando pra dentro)

Agents (3):
- dev-clean-architect — revisa estrutura/fronteiras/dependency.
- dev-tdd-mentor — revisa adesão TDD + qualidade dos testes.
- dev-ddd-modeler — revisa entities/VOs/bounded contexts.

Templates (5) em .genesis/templates/:
- use-case-template
- entity-template
- value-object-template
- repository-port-template
- module-structure-template

Narrativas (6) em .genesis/docs/skills/ + README atualizado.

lint-docs.sh: expected counts atualizados (20 skills, 13 agents,
18 rules, 14 templates).

CLAUDE.md: nova seção "Regras de development" + agents dev-*.

Stack-neutral: todos os exemplos usam <ext> placeholder.

Validação: lint APROVADO, check-readiness OK, run-skill-tests
Lint OK.

Spec: docs/superpowers/specs/2026-05-23-dev-skills-and-namespacing-design.md
Plan: docs/superpowers/plans/2026-05-23-block-b-dev-content.md
EOF
)"
echo "---"
git push origin main
```

- [ ] **Step 3: Verificar**

```bash
git log -1 --oneline
git status
```

Esperado: commit `feat(.claude): add dev-* skills/...`. Tree limpo. Push para `origin/main` confirmado.

---

## Notas de execução

- Se `Write` falhar em um arquivo de template/rule/skill por conflito (já existe), parar e investigar — possivelmente Bloco A não foi totalmente aplicado.
- Se lint falhar em campo `rules:` apontando pra rule inexistente, verificar que todas as 8 dev rules foram criadas com nome exato.
- Se contagens divergirem, atualizar expected_X no lint-docs.sh.

## Rollback

```bash
git reset --hard HEAD~1   # antes do push
# OU
git revert HEAD            # após push (cria commit reverso)
```
