# Dogfood: tchr

Registro do uso real do `project-genesis-boilerplate` aplicado ao projeto `tchr`. Cada atrito vira backlog de fix no boilerplate.

## Metadados

| Campo | Valor |
|-------|-------|
| Data de início | 2026-05-23 |
| Data de conclusão | _(a preencher após dogfood interativo)_ |
| Projeto destino | `../tchr-genesis/` |
| Versão do boilerplate testada | commit f2bbcd2 (pós Fase C) |
| Tipo deste registro | **Misto** — atritos observados durante construção + dogfood automatizado parcial (geração via CLI). Dogfood interativo completo (rodar as 10 fases com mentoria) fica como passo manual do usuário. |

## Dogfood automatizado (Fase D parcial)

### O que foi testado
- `bash scripts/genesis-init.sh tchr ./tchr-genesis` em ambiente limpo
- Lint estrutural no projeto-filho gerado
- Verificação de estrutura de pastas e substituições

### Resultado
- ✅ CLI rodou sem erro
- ✅ `examples/` removido conforme esperado
- ✅ `PROJECT_STATE.md` zerado com nome="tchr", data atualizada
- ✅ `git init` produziu repo limpo
- ✅ Lint estrutural no projeto-filho: skills/agents/rules/templates todos válidos
- ❌ **Lint falhou em 1 link quebrado** — README referencia `examples/tchr/` que foi apagado

## Atritos encontrados

| ID | Severidade | Descrição | Arquivo afetado | Ação |
|----|------------|-----------|------------------|------|
| F-001 | médio | README do projeto-filho contém link `examples/tchr/` que aponta para pasta removida pelo genesis-init.sh, quebrando o lint. | `README.md` (boilerplate) e `scripts/genesis-init.sh` | **Resolvido na Fase E.** `genesis-init.sh` agora roda awk para deletar a seção `## Exemplo: o caso` do README sempre que `examples/` é removido. Validado: novo projeto-filho passa no lint. |
| F-002 | baixo | Hook `validate-docs-before-implementation.sh` bloqueou criação de LICENSE na raiz (não estava na whitelist). Fix aplicado na Fase A. | `.claude/hooks/validate-docs-before-implementation.sh` | Whitelist expandida para LICENSE, VERSION, CHANGELOG, NOTICE, COPYING, CONTRIBUTING, CODE_OF_CONDUCT. **Resolvido.** |
| F-003 | baixo | Script `check-readiness.sh` inicial só checava tamanho. Templates eram grandes o suficiente para passar sem preenchimento real. | `scripts/check-readiness.sh` | Adicionado contador de placeholders `_(...)` com limite MAX_PLACEHOLDERS=5. **Resolvido durante Fase 7 do build inicial.** |
| F-004 | baixo | Skill `define-module-spec` tinha links `../../templates/` que resolviam para `.claude/templates/` (inexistente). Profundidade errada. | `.claude/skills/define-module-spec/SKILL.md` | Corrigido para `../../../templates/`. **Resolvido na Fase B.** |
| F-005 | baixo | `docs/architecture/technology-decision.md` linkava ADR `0001-stack-principal.md` que ainda não existe. | `docs/architecture/technology-decision.md` | Trocado para link genérico apontando à pasta `../adr/`. **Resolvido na Fase B.** |
| F-006 | baixo | `docs/product/problem-statement.md` referenciava `../validation/validation-plan.md` mas o arquivo está em `../research/validation-plan.md`. | `docs/product/problem-statement.md` | Corrigido para `../research/`. **Resolvido na Fase B.** |

## Atritos pendentes para dogfood interativo (não cobertos aqui)

Estes só aparecem quando você rodar as skills interativamente com Claude num projeto-filho. Sugere-se:

1. Rodar `init-project` no `tchr-genesis` e anotar:
   - Perguntas que ficaram confusas
   - Documentos que pediram informação não óbvia
   - Atrito na transição entre skills (deve estar limpo via `## Próxima skill: ...`)
2. Tempo gasto por fase — anotar para calibrar expectativas.
3. Quais ADRs surgiram naturalmente — comparar com o exemplo em `examples/tchr/` (no boilerplate).
4. Se `review-readiness` libera corretamente após preencher tudo.

## Tempo por fase (a preencher após dogfood interativo)

| Fase | Skill | Tempo gasto | Atritos novos |
|------|-------|--------------|---------------|
| 1 | init-project | _(min)_ | _(notas)_ |
| 2 | discover-business | _(min)_ | _(notas)_ |
| 3 | design-business-model | _(min)_ | _(notas)_ |
| 4 | define-product | _(min)_ | _(notas)_ |
| 5 | plan-modules | _(min)_ | _(notas)_ |
| 6 | choose-stack | _(min)_ | _(notas)_ |
| 7 | design-architecture | _(min)_ | _(notas)_ |
| 8 | define-module-spec (identity) | _(min)_ | _(notas)_ |
| 9 | review-readiness | _(min)_ | _(notas)_ |

## O que funcionou bem (observado nesta sessão)

- Estrutura de pastas suporta crescimento sem ficar pesada.
- Hooks bloqueiam o que deveriam, com mensagem clara.
- `check-readiness.sh` produz feedback acionável.
- CLI `genesis-init.sh` é portátil (rsync ou cp -R como fallback).
- Lint estrutural pegou 6 problemas reais durante o build — útil mesmo antes de dogfood interativo.

## O que travou

- Hook bloqueando LICENSE (F-002) — resolvido cedo.
- Link `..` profundidade errada em `define-module-spec` (F-004) — pegado por lint.

## Decisões surpreendentes

- Necessidade de contar placeholders em check-readiness (F-003). Inicialmente o filtro só por tamanho não era suficiente; templates ricos passavam sem preenchimento real.

## Próximas iterações

Backlog derivado deste dogfood parcial:

- **F-001** — ✅ resolvido na Fase E.
- **Dogfood interativo completo** — rodar `tchr-genesis` com Claude em sessão separada, preencher fases 1-8, registrar atritos novos aqui.
- **CI Action** (futuro, fora desta versão) — rodar `lint-docs.sh` em cada PR.
- **Examples extras** (futuro) — gerar SaaS B2B simples e marketplace puro além de tchr.
