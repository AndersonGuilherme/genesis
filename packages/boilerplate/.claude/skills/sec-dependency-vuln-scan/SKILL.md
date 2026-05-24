---
name: sec-dependency-vuln-scan
description: Configura scanners de vulnerabilidade (deps, secrets, SAST, DAST) com gates em CI. Produz `docs/security/vuln-scan-strategy.md` + workflow CI.
phase: security
rules:
  - sec-secrets-no-commit
---

# Skill: sec-dependency-vuln-scan

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter.

## Objetivo

Configurar conjunto mínimo de scanners de vulnerabilidade + definir gates em CI + SLA de triage. Produz `docs/security/vuln-scan-strategy.md`.

## Quando usar

- Após escolha de stack (`plan-choose-stack`).
- Antes do primeiro deploy.
- Quando aparece CVE crítico.

## Pré-condições

- Stack escolhida (linguagem, package manager, framework).
- CI/CD provider definido (GitHub Actions, GitLab, Jenkins, etc.).

## Processo

1. Identificar scanners apropriados à stack:
   - **Dependências**: npm/pip/cargo audit + dependabot/snyk.
   - **Secrets**: gitleaks ou detect-secrets em pre-commit + CI.
   - **SAST**: semgrep com regras OWASP top 10 da linguagem.
   - **DAST**: OWASP ZAP em staging (opcional MVP).
2. Configurar workflow CI rodando todos no PR.
3. Definir gates: severity alta bloqueia merge; média gera warning.
4. Triage: para CVE existente, avaliar exposição real + ação (upgrade/workaround/aceitar com risco documentado).
5. Documentar SLA por severidade: critical em 24h, high em 7d, medium em 30d.
6. Documentar exception process: como aceitar CVE com risco documentado.
7. Preencher `docs/security/vuln-scan-strategy.md`.

## Restrições

- Gate alto bloqueia merge — sem exceção sem ADR.
- Scanner configurado mas resultado ignorado vira teatro — definir owner do triage.

## Exemplos de uso

- "Configura scanners de seg pra MVP."
- "CVE-2026-XXXX apareceu em dep — triage."

## Critérios de conclusão

- [ ] Scanners apropriados à stack identificados.
- [ ] Workflow CI configurado.
- [ ] Gates definidos por severidade.
- [ ] SLA documentado.
- [ ] Exception process documentado.
- [ ] `docs/security/vuln-scan-strategy.md` completo.
