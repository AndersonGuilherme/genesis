# Quality gates

> Pontos de checagem automatizados entre o teclado e a produção. Cada gate tem critério claro de bloqueio.

## Gates por fase

### 1. Pré-commit (no laptop do dev)

Bloqueia o commit local quando falha.

- [ ] Formatador (lint format) sem alterações pendentes
- [ ] Linter sem erros (warnings aceitos com motivo)
- [ ] Tipos verificados (quando aplicável)
- [ ] Testes unitários afetados passando
- [ ] Hooks de segurança (scan de segredo) passam

Implementação: husky / lefthook / pre-commit framework.

### 2. Pull request (no CI)

Bloqueia merge quando falha.

- [ ] Build limpo
- [ ] Lint + tipos
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes de contrato (se contrato mudou)
- [ ] Cobertura ≥ alvo da camada
- [ ] Scan de dependências (SCA)
- [ ] Scan estático de código (SAST)
- [ ] Revisão por par (obrigatória)
- [ ] CHANGELOG ou commits convencionais

### 3. Merge to main

- [ ] Todos os anteriores
- [ ] Smoke test em ambiente de preview
- [ ] Migrações validadas (forward + rollback dry-run)

### 4. Pré-deploy (production)

- [ ] Artefato com versionamento imutável
- [ ] Configurações de produção revisadas
- [ ] Migração testada em staging
- [ ] Janela de deploy aprovada (quando relevante)
- [ ] Plano de rollback documentado

### 5. Pós-deploy

- [ ] Smoke test em produção
- [ ] Métricas de saúde dentro do normal por 15 min
- [ ] Sem erros críticos novos
- [ ] Alertas em silêncio (não suprimidos sem motivo)

## Política de exceção

Quebrar um gate exige:

1. Justificativa escrita
2. Aprovação de 2 pessoas (incluindo arquitete responsável)
3. Tarefa criada para resolver o débito em prazo definido
4. Registro em log de exceções

## Métricas dos gates

- Tempo médio de execução do pipeline
- Taxa de gates quebrados em produção
- Taxa de revert por gate insuficiente

## Não-objetivos

- Bloqueio por warning isolado de linter quando há motivo válido
- Cobertura como objetivo numérico desconectado do que está sendo testado

## Quando revisar os gates

- Após qualquer incidente que tenha passado pelos gates
- Quando o tempo do pipeline crescer além de _(limite)_
- Trimestral mínimo
