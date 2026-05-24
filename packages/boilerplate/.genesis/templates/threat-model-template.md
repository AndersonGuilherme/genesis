# Threat Model: <nome-do-sistema>

> Aplicado pela skill `sec-threat-model`. Atualizar a cada mudança arquitetural significativa.

## Escopo

Sistema/módulo analisado: ___. Versão da arquitetura: ___. Data: ___.

## Componentes e trust boundaries

| Componente | Tipo | Trust zone | Notas |
|------------|------|-----------|-------|
| <ex: API Gateway> | edge | untrusted → trusted | terminação TLS |
| <ex: Auth service> | service | trusted | emite JWT |
| <ex: DB principal> | data | trusted (network isolada) | RDS encrypted |
| <ex: gateway pagamento> | external | untrusted | webhook HMAC-signed |

## Fluxos de dado

Para cada fluxo entre componentes, descrever:
- Origem → Destino
- Dado trafegado (PII? secret? público?)
- Protocolo (HTTPS? mTLS?)
- Autenticação no canal

| # | Origem | Destino | Dado | Protocolo | Auth |
|---|--------|---------|------|-----------|------|
| 1 | Mobile app | API Gateway | login (email + password) | HTTPS | none → emite JWT |
| 2 | API Gateway | Auth service | JWT validation | mTLS | mTLS cert |

## Ameaças (STRIDE)

Para cada componente/fluxo, avaliar:

### <Componente/Fluxo>

| Categoria | Ameaça | Probabilidade | Impacto | Risco | Mitigação | Rule |
|-----------|--------|---------------|---------|-------|-----------|------|
| Spoofing | <ex: bypass de JWT validation> | baixa | alto | médio | Validar assinatura + expiração; reject `alg=none` | sec-authn-required |
| Tampering | ... | ... | ... | ... | ... | ... |
| Repudiation | ... | ... | ... | ... | ... | sec-audit-trail |
| Information disclosure | ... | ... | ... | ... | ... | sec-encryption-in-transit |
| Denial of service | ... | ... | ... | ... | ... | sec-rate-limit-public-api |
| Elevation of privilege | ... | ... | ... | ... | ... | sec-authz-enforced |

## Riscos priorizados

| # | Risco | Mitigação | Owner | Prazo |
|---|-------|-----------|-------|-------|
| 1 | <descrição curta> | <ação concreta> | <pessoa> | <data> |

## Suposições

- <Lista de suposições de segurança: ex. "rede privada do banco é isolada", "fornecedor X cumpre PCI">

## Revisão

| Data | Revisor | Mudanças significativas |
|------|---------|------------------------|
| ___  | ___     | ___ |
