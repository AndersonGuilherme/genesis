# System context

> Quem fala com o sistema, e com quem o sistema fala. Fronteiras claras evitam decisões precipitadas.

## Atores (humanos e sistêmicos)

| Ator | Tipo | Como interage | Frequência |
|------|------|---------------|------------|
| Dono da escola | humano | navegador web | diária |
| Aluno / responsável | humano | navegador web e mobile | semanal |
| Professor | humano | navegador web | diária |
| Suporte interno | humano | painel admin | sob demanda |
| Gateway de pagamento | sistema | webhooks + API | contínua |
| Provedor de email | sistema | API (saída) | contínua |
| Provedor de SMS | sistema | API (saída) | sob demanda |
| Storage de objetos | sistema | SDK (saída) | contínua |

## Sistemas externos críticos

| Sistema | Função | Criticidade | Dependência |
|---------|--------|-------------|-------------|
| Gateway de pagamento | gerar cobranças, conciliar | alta | hard |
| Provedor de email | onboarding, recuperação | média | soft (fallback possível) |
| Provedor de auth (se houver) | login social | média | soft |
| DNS / domínio | acesso ao app | alta | hard |
| CDN | assets estáticos | média | soft |

## Fluxos cross-domínio (inbound/outbound)

### Inbound (entra no sistema)
- Webhook de pagamento (gateway → sistema)
- Webhook de fraude / contestação
- Callback de provedor de email (bounce, complaint)
- Eventos de SSO (se aplicável)

### Outbound (sai do sistema)
- Requisições de cobrança (Pix, cartão, boleto)
- Envio de emails transacionais
- Push notifications
- Eventos para BI / analytics (se aplicável)

## Fronteiras lógicas

Onde termina a responsabilidade do sistema?

- _(ex.: emissão de NF — terceirizado)_
- _(ex.: aulas ao vivo — terceirizado em ferramenta externa)_
- _(ex.: SLA de entrega de email — depende do provedor)_

## Domínios não cobertos

Coisas que **não** entram no escopo do sistema (e devem ser deixadas claras desde já):

- _(ex.: gestão de patrimônio físico da escola)_
- _(ex.: folha de pagamento de funcionários)_

## Riscos do contexto

- Webhook do gateway pode falhar → necessário job de reconciliação.
- Dependência de provedor de email pode bloquear bounce alto → manter 2 providers configurados.
- Mudança de TOS de fornecedor pode quebrar funcionalidade → revisar trimestralmente.
