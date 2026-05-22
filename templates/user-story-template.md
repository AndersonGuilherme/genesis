# User Story: \<título curto\>

| Campo | Valor |
|-------|-------|
| ID | US-NNNN |
| Persona | _(referência a [target-users](../docs/product/target-users.md))_ |
| Módulo | _(slug do módulo)_ |
| Prioridade | crítica / alta / média / baixa |
| Status | rascunho / em-spec / em-desenvolvimento / pronto |
| Estimativa | XS / S / M / L / XL |

## História

> Como \<persona\>,
> quero \<ação\>,
> para \<benefício\>.

Exemplo:
> Como dono de escola,
> quero gerar boletos mensais automaticamente,
> para receber em dia sem precisar lembrar cada aluno.

## Contexto

Por que essa história existe? Que problema do usuário ela resolve? Link para [problem-statement](../docs/product/problem-statement.md) e/ou [user-journeys](../docs/product/user-journeys.md).

## Critérios de aceite

Formato Given/When/Then. Cada cenário vira teste.

```
Cenário: caminho feliz
  Dado <pré-condição>
  Quando <ação>
  Então <resultado>
  E <verificação adicional>

Cenário: erro previsto
  Dado <pré-condição>
  Quando <ação>
  Então <erro esperado>
```

## Dependências

- Outras histórias que precisam estar prontas
- Módulos / integrações necessárias

## Notas de design

- Telas, fluxos, mensagens visíveis ao usuário

## Notas de implementação

- Pontos técnicos relevantes
- Erros conhecidos a tratar

## Métricas afetadas

- _(ex.: % de cobranças geradas com sucesso)_
- _(ex.: tempo até primeira cobrança)_

## Riscos

- _(...)_

## Histórico

| Data | Mudança | Por quem |
|------|---------|----------|
