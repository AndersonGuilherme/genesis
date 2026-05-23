---
name: ops-setup-ci-pipeline
description: Configura CI pipeline com lint, test, build, scanners de segurança e gate de merge. Stack-neutral. Produz workflow em `.github/workflows/` (ou equivalente).
phase: operations
rules:
  - ops-rollback-tested
  - sec-secrets-no-commit
---

# Skill: ops-setup-ci-pipeline

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Produzir pipeline CI completo com gates: lint, unit test, integration test, build, scan de segurança, secret scan. Falhar = bloquear merge.

## Quando usar

- Antes de primeiro deploy.
- Ao adicionar serviço novo no monorepo.
- Em auditoria de readiness.

## Pré-condições

- Stack escolhida (`plan-choose-stack` aprovada).
- Provider CI definido (GitHub Actions, GitLab CI, CircleCI).
- Template `.genesis/templates/ci-pipeline-template.md` disponível.

## Processo

1. Definir estágios:
   - **Lint** (formatter + linter, falha = bloqueia).
   - **Unit test** (rápido, <2min).
   - **Integration test** (com containers se necessário).
   - **Build** (artefato versionado).
   - **Secret scan** (gitleaks/trufflehog).
   - **Dep vuln scan** (snyk, npm audit, safety).
   - **SAST** (semgrep, codeql).
2. Definir gates:
   - Falha em qualquer estágio = bloqueia merge.
   - Coverage threshold (se aplicável, conforme `docs/testing/testing-strategy.md`).
3. Cache de dependências (acelera 5-10x).
4. Matrix se aplicável (versões de runtime).
5. Secrets do CI via vault do provider (não em código).
6. Artefato versionado com `git sha + tag`.
7. Notificação em Slack/Discord para falha em main.
8. Documentar em `docs/deployment/ci-pipeline.md`.

## Restrições

- Sem `--no-verify`, sem `continue-on-error` em estágio bloqueante.
- Sem secret hardcoded no workflow.
- Sem step que faz deploy em produção (deploy = CD separado).
- Tempo total < 15min (acima disso, paralelizar).

## Exemplos de uso

- "Configurar CI do tchr (GitHub Actions)."
- "Adicionar SAST ao CI existente."

## Critérios de conclusão

- [ ] Pipeline executa em cada PR.
- [ ] Falha bloqueia merge.
- [ ] Cache configurado.
- [ ] Secret scan + dep scan ativos.
- [ ] Coverage gate (se aplicável).
- [ ] Notificação de falha em main.
- [ ] `docs/deployment/ci-pipeline.md` completo.
