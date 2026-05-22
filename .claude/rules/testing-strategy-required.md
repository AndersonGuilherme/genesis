# Rule: testing-strategy-required

## Princípio

Todo módulo precisa de estratégia de teste documentada, antes do código.

## Por que existe

Sem estratégia, time decide ad hoc por PR — alguns módulos têm cobertura, outros não. Estratégia explícita permite gate consistente e feedback rápido.

## Como aplicar

1. `docs/testing/testing-strategy.md` define pirâmide, ferramentas e cobertura por camada.
2. Cada spec de módulo declara os testes obrigatórios na seção "Testes".
3. Critérios de aceite (Given/When/Then) viram testes automatizados.
4. Gates de PR/merge reforçam (ver `docs/testing/quality-gates.md`).

## Exemplos bons

- Spec do `billing` lista: unitário para cálculo de comissão, integração com gateway em test container, contract test para webhook.
- Mudança de regra crítica → teste é o primeiro arquivo do PR.

## Exemplos ruins

- "Esse código é simples, não precisa teste."
- Cobertura cosmética (100%) com asserts vazios.
- Teste depois do bug — só serve como confirmação tardia.

## Exceções

- Spike descartável.
- Script one-off não reutilizado.
- Código de bootstrap puro (sem lógica de negócio).
