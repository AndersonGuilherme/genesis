# Threat model

> Modelo de ameaças. Usamos STRIDE como ponto de partida. Atualizar a cada mudança arquitetural significativa.

## Ativos a proteger

| Ativo | Por que importa | Sensibilidade |
|-------|------------------|----------------|
| Credenciais de usuários | acesso a contas | alta |
| Dados pessoais (PII) | LGPD + reputação | alta |
| Dados financeiros (cobranças, saldo, comissão) | confiança + multa | crítica |
| Segredos / chaves | acesso pleno | crítica |
| Conteúdo do criador (cursos) | confiança | alta |
| Logs de auditoria | conformidade | média |
| Reputação da marca | tudo | crítica |

## Atores (ameaça)

| Ator | Motivação | Capacidade |
|------|-----------|------------|
| Atacante externo oportunista | dinheiro fácil | baixa-média |
| Atacante direcionado | dinheiro grande / sabotagem | alta |
| Insider malicioso (ex-funcionário, ex-prestador) | revanche / dinheiro | média-alta |
| Insider acidental | erro humano | alta |
| Bot scanner | recon automático | alta volume |
| Concorrente | dano competitivo | varia |

## STRIDE por componente

### Frontend / API pública

| STRIDE | Ameaça | Controle |
|--------|--------|----------|
| Spoofing | login com credencial roubada | MFA + rate limit |
| Tampering | manipulação de payload | validação + assinatura |
| Repudiation | usuário nega ação | audit log com hash |
| Information disclosure | erro vaza dados | tratamento de erro padrão |
| DoS | ataque volumétrico | WAF + CDN + rate limit |
| Elevation of privilege | bypass de RBAC | autorização em cada endpoint |

### Banco de dados

| STRIDE | Ameaça | Controle |
|--------|--------|----------|
| Tampering | injeção SQL | prepared statements, ORM seguro |
| Information disclosure | dump de dados | criptografia + acesso restrito |
| DoS | query pesada | timeout + read replica |

### Pagamento

| STRIDE | Ameaça | Controle |
|--------|--------|----------|
| Tampering | webhook forjado | signing secret, allowlist IP |
| Repudiation | usuário nega ter comprado | log + assinatura do evento |
| Information disclosure | armazenamento PAN | não armazenar, tokenizar |

### Pipeline CI/CD

| STRIDE | Ameaça | Controle |
|--------|--------|----------|
| Tampering | inserção de código malicioso | code review, branch protection |
| Information disclosure | secret em log | scrubber + scanner |
| Elevation of privilege | acesso ao prod | SSO + MFA + audit |

## Top 10 ameaças priorizadas

| # | Ameaça | Probabilidade | Impacto | Severidade |
|---|--------|----------------|---------|-------------|
| 1 | Credenciais comprometidas via reuse | alta | alto | crítica |
| 2 | Cross-tenant data leak por bug em query | média | alto | alta |
| 3 | Webhook de pagamento forjado | baixa | alto | alta |
| 4 | Dependência terceira com CVE crítica | alta | varia | alta |
| 5 | DDoS em endpoint público | média | médio | média |
| 6 | Insider acessa dados além do papel | média | alto | alta |
| 7 | Backup não criptografado vaza | baixa | crítica | alta |
| 8 | Segredo commitado por engano | média | crítica | alta |
| 9 | Phishing direcionado a admin | média | crítica | crítica |
| 10 | Bot abusa de signup gratuito | alta | baixo | média |

## Plano de mitigação

Cada item acima tem controle em [security-requirements.md](security-requirements.md). Faltando controle = backlog.

## Cadência de revisão

- Após cada mudança significativa de arquitetura
- Trimestral mínimo
- Após incidente real

## Histórico de incidentes

| Data | Resumo | Severidade | Postmortem |
|------|--------|------------|------------|
| _(YYYY-MM-DD)_ | _(...)_ | _(...)_ | _(link)_ |
