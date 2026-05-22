# Business Rule: \<nome da regra\>

| Campo | Valor |
|-------|-------|
| ID | BR-NNNN |
| Módulo | _(slug)_ |
| Inegociável? | sim / não |
| Origem | jurídica / contratual / política interna / produto |
| Data | YYYY-MM-DD |
| Responsável | _(papel)_ |

## Descrição em 1 frase

_(Frase clara, sem ambiguidade. Ex.: "Aluno menor de 18 anos só pode ser cadastrado com confirmação por email do responsável.")_

## Descrição detalhada

Quando se aplica? Quando NÃO se aplica? Quais sistemas/módulos tocam essa regra?

## Motivação

Por que essa regra existe? (regulação, contrato, política).

## Exemplos

### Exemplo positivo (regra atendida)
- _(...)_

### Exemplo negativo (regra violada)
- _(...)_

### Caso limítrofe
- _(...)_

## Exceções

Há situações em que a regra **não** se aplica?

- _(...)_

## Impacto em módulos

| Módulo | Como aplica |
|--------|-------------|
| _(...)_ | _(...)_ |

## Onde a regra vive no sistema

- [ ] Banco de dados (constraint, trigger)
- [ ] Aplicação (validação, serviço)
- [ ] Frontend (UX, mensagem)
- [ ] Job / fila
- [ ] Política externa (parceiro)

(Geralmente em mais de um lugar — múltiplas camadas.)

## Testes necessários

- [ ] Unitário do serviço que valida a regra
- [ ] Integração se há constraint de banco
- [ ] Permissão / autorização afetada
- [ ] Mensagem de erro ao usuário

## Riscos se violada

- _(consequência: multa, perda de confiança, bug em outro módulo, etc.)_

## Plano se a regra mudar

- Quem aprova mudança?
- O que precisa atualizar (specs, ADRs, testes)?

## Histórico

| Data | Mudança | Motivo |
|------|---------|--------|
