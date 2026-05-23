# Política de Privacidade — <nome-do-produto>

> Versão pública exibida ao titular. Linguagem clara (LGPD art. 9).
> Atualizada por DPO + jurídico. Versionada (mudanças relevantes exigem comunicação ativa).

**Última atualização**: <YYYY-MM-DD>
**Versão**: <v1 | v2 | ...>

## 1. Quem somos

<Razão social>, CNPJ <00.000.000/0000-00>, com sede em <endereço>, é o controlador dos dados pessoais tratados neste produto.

**Encarregado pelo Tratamento de Dados (DPO)**: <nome>
**Canal de contato**: <dpo@dominio.com> ou <link pra formulário>

## 2. Quais dados coletamos e por quê

| Dado | Quando coletamos | Por quê |
|------|------------------|---------|
| Nome e email | No cadastro | Identificar você na plataforma + comunicação transacional |
| CPF | Na compra de plano pago | Emissão de NF-e (obrigação legal) |
| Telefone | Opcional, no perfil | Comunicação urgente sobre conta |
| Comportamento de navegação (analytics) | Enquanto você usa | Melhorar produto, sem identificar você diretamente |
| Cookies essenciais | Sempre | Manter sessão e segurança |
| Cookies analytics | Com seu consent | Métricas agregadas |

Lista completa em [Data Inventory público](#).

## 3. Base legal

Tratamos seus dados com base em (LGPD art. 7 e art. 11):

- **Execução de contrato**: cadastro, autenticação, prestação do serviço.
- **Obrigação legal**: NF-e (Receita Federal), guarda de comprovantes fiscais.
- **Consentimento**: marketing, cookies analytics, módulos sensíveis.
- **Legítimo interesse**: segurança, prevenção a fraude, melhoria do produto (com avaliação documentada).

## 4. Compartilhamento

Compartilhamos dados com:

| Operador | Finalidade | Salvaguardas |
|----------|-----------|--------------|
| AWS (cloud) | Hospedagem | DPA + cláusulas contratuais padrão |
| Sendgrid | Envio de email | DPA |
| Stripe | Processamento de pagamento | DPA + PCI DSS |
| Sentry | Erros de aplicação (sem PII em claro) | DPA |

Lista completa em <link pra vendor-dpa>.

## 5. Transferência internacional

Alguns operadores processam dados fora do Brasil (principalmente EUA). Adotamos:
- Cláusulas contratuais padrão.
- Avaliação de país de destino.
- Preferência por regiões brasileiras quando disponíveis.

## 6. Retenção

Mantemos seus dados pelo período necessário pra cada finalidade:

| Categoria | Retenção |
|-----------|----------|
| Conta ativa | Enquanto conta existe |
| Conta encerrada (PII direta) | 30 dias após encerramento, depois anonimizada |
| NF-e e comprovantes fiscais | 5 anos (obrigação legal) |
| Audit log | 5 anos |

Detalhe completo em <link pra retention-policy>.

## 7. Seus direitos (LGPD art. 18)

Você pode, a qualquer momento:

- **Confirmar** se tratamos seus dados.
- **Acessar** seus dados ([exportar em `/me/data`]).
- **Corrigir** dados incompletos ou desatualizados.
- **Eliminar** sua conta e dados ([`/me/account`]).
- **Portar** seus dados em formato estruturado.
- **Saber** com quem compartilhamos seus dados.
- **Revogar** consents ([`/me/consents`]).
- **Solicitar revisão** de decisões automatizadas.

**Prazo de resposta**: até 15 dias corridos. Excepcionalmente prorrogamos com justificativa.

Para casos não cobertos por endpoint: <dpo@dominio.com>.

## 8. Segurança

Aplicamos:
- Encryption em trânsito (TLS 1.2+).
- Encryption em repouso (banco e backup).
- Encryption adicional pra dados sensíveis específicos.
- Audit log de acessos a dados pessoais.
- Treinamento da equipe.
- Avaliação periódica de fornecedores.

## 9. Crianças e adolescentes

<Se aplicável>: Coletamos dado de menor de 18 anos somente com consentimento específico do responsável (LGPD art. 14).

## 10. Mudanças nesta política

Mudanças relevantes serão comunicadas com 30 dias de antecedência por email e banner no produto. Histórico de versões em <link>.

## 11. Como falar com a ANPD

Autoridade Nacional de Proteção de Dados:
<https://www.gov.br/anpd>

---

**Versão anterior**: `privacy-v0.md`
