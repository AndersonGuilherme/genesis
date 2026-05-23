---
name: sec-encryption-in-transit
description: Toda comunicação externa via TLS 1.2+. HSTS habilitado. Certificados válidos com rotação automática. Comunicação interna sensível também cifrada.
phase: security
---

# Rule: sec-encryption-in-transit

## Princípio

Todo tráfego entre cliente e servidor, entre serviços, e com terceiros usa TLS 1.2+ (preferir 1.3). HTTP redireciona para HTTPS. HSTS preload. Comunicação interna entre componentes sensíveis também cifrada (mTLS quando service-to-service).

## Por que existe

Sniffing em wifi público, MITM em provedor comprometido, ataque entre serviços em rede compartilhada. Sem TLS, credenciais e PII trafegam em claro. LGPD art. 46 + ANPD esperam encryption in-transit como baseline.

## Como aplicar

1. Load balancer / API gateway termina TLS 1.2+ (1.3 preferido).
2. Redirect 301 HTTP → HTTPS automático.
3. Header `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
4. Certificados via ACME (Let's Encrypt) com renovação automática.
5. Comunicação service-to-service em rede privada: TLS interno ou mTLS para sensível.
6. Clientes HTTP (chamadas a APIs externas): verificar certificado (não desabilitar).
7. Banco de dados: conexão via TLS (sslmode=require ou superior).

## Exemplos bons

- nginx/API gateway com `ssl_protocols TLSv1.2 TLSv1.3`.
- Certbot rodando em cron com renovação automática.
- Cliente HTTP `verify=True` (Python) / `rejectUnauthorized: true` (Node).
- Postgres conexão com `sslmode=verify-full`.

## Exemplos ruins

- HTTP em produção "porque é interno".
- `verify=False` no cliente HTTP "pra resolver problema de certificado".
- TLS 1.0/1.1 ainda aceitos (obsoletos por NIST/PCI).
- Mixed content (página HTTPS carrega script HTTP).

## Exceções

- Localhost em ambiente de dev pode usar HTTP.
- Healthcheck interno entre containers na mesma pod/network pode dispensar TLS se rede é isolada e auditada.
- Pinning de certificado em mobile/cliente nativo apenas quando rotação está coordenada.
