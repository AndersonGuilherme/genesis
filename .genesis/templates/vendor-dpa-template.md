# Vendor DPA Registry — <nome-do-sistema>

> Aplicado pela skill `lgpd-vendor-dpa`. Mantém lista de operadores externos que tratam PII.
> Acompanha o art. 39 (responsabilidade do operador) + art. 33 (transferência internacional).

## Resumo

- **Última auditoria**: <YYYY-MM-DD por NOME>
- **Próxima auditoria**: <YYYY-MM-DD>
- **Fornecedores ativos**: <N>
- **Sem DPA assinado** (bloqueante): <N — listar>

## Tabela de fornecedores

| ID | Fornecedor | Escopo (dado tratado) | Finalidade | Papel | País | DPA | Subprocessadores | Plano de exit |
|----|-----------|----------------------|-----------|-------|------|:---:|------------------|---------------|
| V-01 | AWS | hospedagem (todo banco/storage) | infra | operador | EUA (us-east-1) + Brasil (sa-east-1) | ✓ | listados em AWS DPA | migração pra outro IaaS — playbook em <link> |
| V-02 | Sendgrid | email transacional + marketing | comunicação | operador | EUA | ✓ | listados em Sendgrid DPA | migração pra alternativa SMTP — playbook em <link> |
| V-03 | Stripe | dado de pagamento (não armazenamos cartão) | processamento | operador (controlador conjunto pra PCI) | EUA | ✓ | listados em Stripe DPA | migração pra gateway alternativo |
| V-04 | Sentry | logs de erro (PII sanitizada) | observability | operador | EUA | ✓ | listados | self-hosted Sentry como fallback |
| V-05 | Mixpanel | analytics comportamental (sem PII direta) | analytics | operador | EUA | ✓ | listados | desabilitar + export agregados |
| V-06 | OpenAI | inputs de prompts (com PII potencialmente) | IA | operador | EUA | ✓ + zero data retention enabled | nenhum | desabilitar feature de IA |

## Detalhe por fornecedor

### V-01 — AWS

- **DPA**: <link pro AWS Data Processing Addendum + data de assinatura>
- **SCC** (Standard Contractual Clauses): incluídas no DPA AWS.
- **Cláusulas verificadas**:
  - [x] Finalidade limitada.
  - [x] Sem reuso pra outras finalidades sem autorização.
  - [x] Medidas técnicas/organizacionais (AWS Shared Responsibility).
  - [x] Notificação de incidente (AWS SLA).
  - [x] Direito de auditoria (AWS Compliance Reports — SOC, ISO).
  - [x] Devolução/deleção ao término.
  - [x] Subprocessadores listados (AWS Sub-Processors Page).
- **Risco residual**: dependência forte de um provider único — mitigado por arquitetura cloud-agnóstica progressiva.

<!-- Repetir bloco por fornecedor -->

## Processo pra adicionar fornecedor novo

1. Tech lead propõe fornecedor + justifica.
2. DPO avalia: escopo, papel, país, DPA disponível.
3. Jurídico revisa DPA + cláusulas mínimas.
4. Se PII envolvida: adicionar entry em `docs/security/lgpd/data-inventory.md`.
5. Se transferência internacional: cross-link com `docs/security/lgpd/international-transfers.md`.
6. Adicionar entry nesta tabela.
7. Atualizar `docs/security/privacy-notice.md`.

## Cláusulas mínimas do DPA

- Finalidade específica e limitada ao escopo contratado.
- Proibição de uso pra finalidades próprias do operador.
- Medidas técnicas e organizacionais (lista mínima).
- Notificação de incidente em prazo curto (default: 24h).
- Direito de auditoria (questionário ou audit report).
- Devolução ou deleção verificável ao término do contrato.
- Subprocessadores autorizados (lista pública + notificação de mudança).
- Cooperação com solicitações da ANPD.

## Auditoria periódica

A cada 6 meses:
- Validar que DPA continua vigente.
- Checar mudanças na lista de subprocessadores.
- Validar que escopo de dado tratado bate com inventory.
- Atualizar política de privacidade se houver mudança relevante.
