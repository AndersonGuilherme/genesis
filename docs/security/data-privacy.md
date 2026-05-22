# Data privacy (LGPD)

> Compromisso com dados pessoais. Atendimento mínimo à LGPD; bom comportamento mesmo onde a lei não obriga.

## Princípios

1. **Coletar pouco.** Só pedir o que é estritamente necessário.
2. **Reter pouco.** Apagar quando não há mais finalidade.
3. **Acessar pouco.** Menor privilégio também vale para humanos lendo dado.
4. **Transparência radical.** Política clara, sem letrinha miúda.

## Inventário de dados pessoais

Manter atualizado. Exemplo:

| Categoria | Campos | Finalidade | Base legal LGPD | Local | Retenção |
|-----------|--------|------------|------------------|-------|----------|
| Identificação | nome, email | conta de usuário | consentimento + execução de contrato | banco principal | enquanto ativo + 2 anos |
| Contato | telefone, endereço | comunicação operacional | execução de contrato | banco principal | enquanto ativo + 2 anos |
| Pagamento | últimos 4 dígitos do cartão, brand | comprovação fiscal | obrigação legal | banco principal | 5 anos |
| Dados de aluno menor | nome, data de nascimento | gestão escolar | consentimento do responsável | banco principal | enquanto matriculado + 2 anos |
| Logs de acesso | IP, user agent, timestamp | segurança | legítimo interesse | log storage | 6 meses (Marco Civil) |
| Conteúdo do criador | aulas, textos, mídias | execução do serviço | execução de contrato | storage de objetos | enquanto ativo |

## Bases legais possíveis

- Consentimento (art. 7º, I)
- Execução de contrato (art. 7º, V)
- Obrigação legal (art. 7º, II)
- Legítimo interesse (art. 7º, IX) — exige LIA registrada
- Proteção da vida ou da incolumidade física (raro aqui)

## Direitos do titular

Implementáveis no produto:

| Direito | Como atender |
|---------|---------------|
| Confirmação e acesso | self-service "Meus dados" + exportação |
| Correção | edição em conta + workflow para campos sensíveis |
| Anonimização ou exclusão | botão "Excluir minha conta" + processo backend |
| Portabilidade | exportação em CSV + JSON |
| Informação sobre compartilhamento | seção na política de privacidade |
| Revogação de consentimento | toggle por finalidade |
| Revisão de decisões automatizadas | aplicável se houver IA em decisões |

## Política de privacidade

- Publicada em URL pública (`/privacidade`)
- Linguagem clara, sem jargão legal puro
- Versão datada e histórico acessível
- Inclui: identificação do controlador, DPO, base legal por finalidade, retenção, transferência internacional (se houver), direitos

## Cookies e consentimento

- Categorias: estritamente necessários (sem consent), funcionais, analíticos, marketing
- Banner com opt-in por categoria (não pré-marcado)
- Registro do consentimento (timestamp + versão)

## Transferência internacional

Se algum fornecedor armazena fora do Brasil (storage, email, etc.):

| Fornecedor | País / região | Base legal para transferência |
|-----------|----------------|-------------------------------|
| _(ex.: AWS São Paulo)_ | BR | n/a |
| _(ex.: Resend)_ | EUA | cláusulas contratuais padrão |

## Vazamento (data breach)

Plano de resposta em [../operations/incident-response.md](../operations/incident-response.md). Resumo:

- Notificar autoridade (ANPD) em prazo razoável
- Notificar titulares afetados
- Postmortem público quando aplicável
- Tempo alvo de detecção a notificação: 72h

## DPO

- Nome: _(designar)_
- Contato público: _(ex.: dpo@dominio.com.br)_
- Responsabilidade: receber pedidos de titulares, conduzir auditorias internas, ser ponto focal ANPD

## Cadência

- Revisão geral: anual
- Revisão de inventário: trimestral
- Treinamento do time: anual + admissão
- Auditoria de acesso a dados: trimestral
