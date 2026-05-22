# Rule: avoid-overengineering

## Princípio

Não propor complexidade desnecessária para o estágio atual do projeto. Simples primeiro, complexo quando o problema pedir.

## Por que existe

Sistemas complexos cedo demais matam projetos novos. Cada camada extra é custo de manutenção, debug, treinamento e deploy. O melhor código é o que ainda nem foi escrito.

## Como aplicar

1. Default: monolito modular.
2. Sem microserviços, Kubernetes, CQRS, event sourcing, service mesh ou Kafka **sem justificativa numérica**.
3. Sem cache, fila ou worker assíncrono **sem gargalo demonstrado** (exceto operações claramente assíncronas: envio de email, geração de relatório longo).
4. Sem framework extra ou abstração nova **sem dor concreta**.
5. Sempre perguntar: "qual número (volume, latência, time) justifica isso agora?".

## Exemplos bons

- Cobrança é fila (async OK por natureza).
- Cadastro é síncrono, simples.
- "Vamos começar com Postgres + monolito; partição/réplica quando passarem de _(número)_."

## Exemplos ruins

- "Microserviços porque pode escalar."
- "Event sourcing porque a gente vai querer auditoria."
- "Kubernetes pra estar preparado."
- "Vamos abstrair o banco caso a gente mude."

## Exceções

- Restrições reais documentadas (ex.: regulação exige separação de processamento).
- Volume já existente que torna a complexidade necessária.
- Time experiente naquela complexidade + benefício claro.
