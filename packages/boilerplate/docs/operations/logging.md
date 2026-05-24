# Logging

> Padrão de logs. Estrutura consistente faz a diferença entre debugar em 5 min ou 5 horas.

## Princípios

1. **Estruturado, não livre.** JSON desde o primeiro log.
2. **Útil ou silencioso.** Sem `console.log("aqui")`.
3. **Sem PII.** Senha, token, CPF e cartão nunca.
4. **Correlato.** Sempre carregar `request_id` / `trace_id`.

## Formato

```json
{
  "timestamp": "2026-05-21T19:42:11.123Z",
  "level": "info",
  "service": "billing-api",
  "env": "production",
  "request_id": "01J...",
  "trace_id": "...",
  "tenant_id": "...",
  "user_id": "...",
  "event": "charge.created",
  "amount": 19900,
  "currency": "BRL",
  "duration_ms": 42
}
```

## Níveis

| Nível | Quando usar |
|-------|-------------|
| debug | só dev / troubleshooting; nunca em prod por padrão |
| info | eventos relevantes do caminho feliz |
| warn | anomalia recuperável |
| error | falha que afeta o usuário ou o sistema |
| fatal | impossível continuar (raríssimo) |

## Convenções

- `event` é a chave principal para agrupar
- Verbos no passado: `charge.created`, não `creating`
- Campos numéricos como números, não strings
- Datas em UTC ISO-8601

## O que registrar

- Início e fim de requisição com latência e status
- Eventos de negócio importantes (signup, compra, evento emitido)
- Falhas com stack trace + contexto
- Acessos administrativos
- Mudanças sensíveis (papel, configuração, segredo)

## O que NÃO registrar

- Senha, token, refresh token, API key
- CPF completo, RG, dados de cartão
- Conteúdo de email/SMS enviado (apenas metadados)
- Payload completo de webhook com dados sensíveis (truncar/mascarar)
- Body de request com PII a granel

## Sanitização

- Lista de campos a redatar em middleware central
- Teste unitário garantindo redação
- Auditoria mensal de amostras

## Retenção

| Categoria | Retenção | Onde |
|-----------|----------|------|
| Aplicação | 30 dias | log warehouse principal |
| Auditoria | 7 anos | armazenamento append-only |
| Acesso (Marco Civil) | 6 meses mínimo | log warehouse |
| Debug | 7 dias | log warehouse (filtro) |

## Correlation

- `request_id` gerado no edge (ALB / API gateway / middleware)
- Propagar via header `X-Request-Id`
- Em workers: receber via mensagem
- Em integrações externas: enviar quando o provedor aceita

## Custos

- Volume principal vem de info de requisição. Considerar sampling em endpoints muito frequentes.
- Logs com PII sanitizada inadequadamente são problema duplo (LGPD + custo).

## Ferramentas

A definir após escolha de stack: ELK, Loki, Datadog, OpenSearch, Axiom, etc.

## Checagem de qualidade

- Log estruturado em 100% dos serviços
- Zero PII em amostra mensal
- Latência de ingest aceitável (< 1 min)
- Cardinalidade de `event` controlada
