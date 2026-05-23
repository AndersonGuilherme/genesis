---
name: plan-modules-mvp
description: Use após design-architecture. Identifica módulos do MVP, define fronteiras, dependências e ordem de implementação. Termina com docs/modules/ preenchido para cada módulo.
phase: planning
rules:
  - plan-module-spec-required
  - plan-avoid-overengineering
---

# Skill: plan-modules-mvp

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter:
- `.claude/rules/plan-module-spec-required.md`
- `.claude/rules/plan-avoid-overengineering.md`

Aplique elas durante o processo. Se algo conflitar com pedido do usuário, recuse e cite a rule.

## Objetivo

Quebrar o produto em **módulos** coesos com fronteiras claras, dependências mapeadas e ordem de ataque que destrava o MVP rapidamente.

## Quando usar

- Após `design-architecture` concluir.
- Antes de `define-module-spec`.
- Quando o produto evolui e novos módulos surgem.

## Entradas esperadas

- `docs/architecture/architecture-overview.md`
- `docs/product/mvp-scope.md`
- `docs/security/auth-strategy.md`

## Processo passo a passo

1. Listar áreas de responsabilidade do produto.
2. Agrupar em módulos coesos (cada módulo = uma fronteira clara).
3. Para cada módulo, definir:
   - Nome (kebab-case)
   - Propósito (1 frase)
   - Entidades principais
   - Eventos emitidos / consumidos
   - APIs públicas
   - Dependências de outros módulos
4. Identificar **acoplamentos perigosos** (módulos que tocam internas alheias).
5. Definir **ordem de implementação** que destrava o MVP cedo.
6. Registrar em `docs/modules/`.
7. Atualizar PROJECT_STATE.
8. Sugerir próxima skill: `define-module-spec` para cada módulo.

## Perguntas guia (por módulo)

1. Qual problema esse módulo resolve?
2. Quem usa esse módulo?
3. Quais entidades pertencem a esse módulo?
4. Quais regras de negócio existem?
5. Quais casos de uso existem?
6. Quais permissões existem?
7. Quais eventos esse módulo emite?
8. Quais eventos esse módulo consome?
9. Quais integrações são necessárias?
10. Quais APIs são expostas?
11. Quais telas ou fluxos existem?
12. Quais jobs ou filas são necessários?
13. Quais emails/notificações são enviados?

## Módulos típicos a sempre considerar

- `identity` (users, tenants, sessions)
- `billing` (cobrança, pagamentos, faturas)
- `catalog` / `product-domain` (entidades centrais do produto)
- `notifications` (email, push, SMS)
- `audit` (log de auditoria imutável)
- `admin` / `back-office`
- `marketplace` (se aplicável)

A lista real depende do produto. Discuta com o usuário.

## Heurísticas de fronteira

- Módulo deve ter dono claro.
- Mudança em regra de negócio toca em 1 módulo, não 5.
- Outro módulo só fala via API/eventos.
- Sem leitura de banco cruzada.

## Documentos que cria ou atualiza

- `docs/modules/README.md` (lista mestra)
- `docs/modules/<modulo>.md` (um por módulo, com fronteira em alto nível)
- `docs/architecture/architecture-overview.md` (referenciar módulos)

## Critérios de conclusão

- [ ] Lista de módulos do MVP definida
- [ ] Fronteiras documentadas
- [ ] Dependências mapeadas
- [ ] Ordem de implementação proposta com justificativa

## Restrições

- Não criar módulos para "encaixar tudo". Module-itis é tão ruim quanto big-ball-of-mud.
- Não definir tecnologia interna do módulo aqui (isso vai na spec).
- Não criar módulo sem dono claro.

## Exemplos de uso

- "Vamos quebrar o produto em módulos."
- "Quais módulos vamos atacar primeiro?"
- "Onde mora a regra de cobrança?"
