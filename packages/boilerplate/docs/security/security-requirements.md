# Security requirements

> Lista mestra de requisitos de segurança. Sem isto preenchido, `start-development` não é liberado.

## Princípios

1. **Security by design.** Pensar em segurança antes do código, não depois do incidente.
2. **Menor privilégio.** Nenhum componente recebe mais permissão do que estritamente precisa.
3. **Defesa em profundidade.** Falhar em uma camada não significa comprometer outras.
4. **Transparência interna.** Quem é responsável por cada controle é claro.
5. **Conformidade não é fim — é piso.** LGPD é o mínimo, não o teto.

## Camadas

### Aplicação
- [ ] Validação de input em todo endpoint público
- [ ] Output encoding para prevenir XSS
- [ ] Proteção CSRF onde aplicável
- [ ] Headers de segurança: HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- [ ] Rate limit por IP e por usuário em endpoints sensíveis
- [ ] Captcha (ou equivalente) em signup e login após N falhas
- [ ] Tratamento de erro nunca vaza stack trace ao usuário

### Autenticação e sessão (ver [auth-strategy.md](auth-strategy.md))
- [ ] Senhas armazenadas com hash forte (bcrypt/argon2 com salt)
- [ ] Política mínima de senha (comprimento + dicionário)
- [ ] MFA opcional (obrigatório para admin)
- [ ] Sessões expiram em tempo razoável
- [ ] Refresh tokens rotacionam
- [ ] Logout invalida sessão server-side

### Autorização
- [ ] Modelo de papéis definido (RBAC ou ABAC)
- [ ] Verificação de permissão em cada endpoint
- [ ] Multi-tenant: validar `tenant_id` em todas as queries
- [ ] Privilege escalation testada

### Dados
- [ ] Criptografia em repouso (banco + storage)
- [ ] Criptografia em trânsito (TLS 1.2+ em tudo)
- [ ] PII inventariada (ver [data-privacy.md](data-privacy.md))
- [ ] Logs nunca contêm senha, token, CPF, dados de cartão
- [ ] Backups criptografados

### Infra
- [ ] Segredos em gerenciador (Vault, AWS Secrets, Doppler, etc.)
- [ ] Não há segredos em código, em config visível, em prints
- [ ] Acessos administrativos via VPN/SSO + MFA
- [ ] Rotação periódica de chaves
- [ ] Patching automático ou agendado

### Pipeline (CI/CD)
- [ ] Imagens escaneadas antes de deploy
- [ ] Dependências escaneadas (SAST + SCA)
- [ ] Branch protegida em main / production
- [ ] Code review obrigatório
- [ ] Secrets nunca em logs do pipeline

### Monitoramento e resposta
- [ ] Alertas para padrões anômalos (login fail spike, etc.)
- [ ] Runbook de resposta a incidente (ver [../operations/incident-response.md](../operations/incident-response.md))
- [ ] Logs de auditoria imutáveis (write-once / append-only quando possível)
- [ ] Tempo máximo de resposta a vulnerabilidade crítica: 24h

### Pagamento (se aplicável)
- [ ] Não armazenar PAN (dados de cartão) — usar tokenização
- [ ] PCI DSS conforme nível aplicável
- [ ] Webhooks autenticados por signing secret
- [ ] Idempotência em operações financeiras

### LGPD (ver [data-privacy.md](data-privacy.md))
- [ ] Inventário de dados pessoais
- [ ] Base legal mapeada por finalidade
- [ ] Direitos do titular implementáveis (acesso, retificação, exclusão, portabilidade)
- [ ] DPO designado e divulgado
- [ ] Política de privacidade publicada
- [ ] Aviso de cookies
- [ ] Plano de resposta a vazamento

## Ameaças prioritárias

Resumo de [threat-model.md](threat-model.md). Para cada uma, controle e responsável:

| Ameaça | Controle principal | Responsável |
|--------|---------------------|-------------|
| Roubo de credencial | MFA + senha forte + rate limit | engenharia |
| Acesso cruzado entre tenants | filtro de tenant em todas as queries | engenharia |
| Vazamento por log | revisão + sanitizer | engenharia |
| Phishing em usuário | educação + email DKIM/DMARC | comunicação |
| DDoS | CDN + WAF | infra |

## Quando atualizar este documento

- Antes de cada release importante
- Após incidente
- Trimestralmente como revisão de rotina
- Quando integrar novo fornecedor

## Auditoria

| Item | Cadência | Último teste |
|------|----------|---------------|
| Pentest externo | anual | _(data)_ |
| Restore de backup | mensal | _(data)_ |
| Revisão de permissões | trimestral | _(data)_ |
| Audit log de admin | semanal | _(data)_ |
