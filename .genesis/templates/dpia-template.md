# DPIA: <nome-da-operação>

> Aplicado pela skill `lgpd-dpia`. Um arquivo por operação de alto risco.
> Relatório de Impacto à Proteção de Dados Pessoais (RIPD) referenciado pelo art. 38 LGPD.

## Identificação

- **Operação**: <nome curto>
- **Data**: <YYYY-MM-DD>
- **Responsável**: <DPO + tech lead>
- **Última revisão**: <YYYY-MM-DD>
- **Próxima revisão**: <YYYY-MM-DD ou condição de revisão>

## 1. Descrição da operação

<O quê faz, como funciona, qual o fluxo de dado.>

- Entrada: <que dado entra, de onde>.
- Processamento: <que decisão/transformação acontece>.
- Saída: <que dado sai, pra onde>.
- Atores: <quem opera, quem é afetado>.

## 2. Necessidade

- Por que essa operação é necessária ao negócio?
- Que alternativas menos intrusivas foram avaliadas?
- Por que essa alternativa foi escolhida?

## 3. Dados envolvidos

| Categoria | Sensível? | Volume estimado | Origem |
|-----------|:---------:|-----------------|--------|
| <nome, CPF> | ✗ | ~10k titulares/mês | cadastro |
| <histórico de saúde> | ✓ | ~500 titulares | formulário próprio |

## 4. Titulares afetados

- <Aluno regular, criança, idoso, vulnerável, etc.>
- Volume total estimado: <N>.

## 5. Base legal

| Finalidade | Base legal | Justificativa |
|-----------|------------|---------------|
| <triagem inicial> | legítimo interesse + revisão humana | <justificativa> |
| <armazenamento> | consent específico (art. 11) | dado sensível |

## 6. Riscos identificados

### Risco 1: <título>

- **Descrição**: <o que pode acontecer>.
- **Probabilidade**: baixa / média / alta.
- **Impacto**: baixa / médio / alto.
- **Risco**: <classificação combinada>.
- **Titular afetado**: <quem sofre>.

### Risco 2: <título>

...

## 7. Mitigações

| Risco | Mitigação técnica | Mitigação organizacional | Risco residual |
|-------|-------------------|--------------------------|----------------|
| Risco 1 | <encryption a nível de aplicação> | <treinamento + auditoria trimestral> | baixa |
| Risco 2 | <pseudonimização + retention curto> | <revisão humana obrigatória> | baixa |

## 8. Decisão automatizada

Se aplicável:

- Existe decisão automatizada com efeito jurídico ou relevante? <sim/não>
- Direito de revisão humana garantido? <como>
- Critérios da decisão documentados? <link>

## 9. Plano de revisão

- Periodicidade: <semestral | anual | quando operação muda significativamente>.
- Gatilhos: <novo tipo de dado, mudança de fornecedor, incidente, mudança legal>.
- Próxima revisão programada: <YYYY-MM-DD>.

## 10. Aprovação

- **DPO**: <nome + data + assinatura>.
- **Tech lead**: <nome + data + assinatura>.
- **Jurídico**: <nome + data + assinatura>.
- **Decisão final**: <aprovado | aprovado com ressalvas | reprovado>.

## Referências

- LGPD art. 38 (RIPD).
- Resolução CD/ANPD aplicável (atualizar conforme publicação).
- `docs/security/lgpd/data-inventory.md`
- `docs/security/lgpd/consent-strategy.md`
