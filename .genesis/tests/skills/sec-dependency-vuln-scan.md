# Tests: sec-dependency-vuln-scan

## Pré-condição
- CI pipeline existe (cross-link `ops-setup-ci-pipeline`).
- Stack escolhida.

## Prompts canônicos
- "configura scanners de vulnerabilidade"
- "snyk/dependabot/semgrep"
- "vuln scan no CI"

## Comportamentos esperados
- [ ] Escolhe ferramentas por categoria: deps (snyk/audit/safety), secrets (gitleaks), SAST (semgrep), DAST (zap).
- [ ] Configura gates de CI (CRITICAL bloqueia, HIGH com janela).
- [ ] Política de triage de CVE (cross-link `maint-security-patch-sla`).
- [ ] Produz `docs/security/vuln-scan-strategy.md` + workflow CI.

## Anti-padrões
- [ ] NÃO deixa scanner em modo "warning only" em CRITICAL.
- [ ] NÃO configura sem ownership do output (achados sem dono).
- [ ] NÃO ignora secrets scan ("usa só dep scan").
