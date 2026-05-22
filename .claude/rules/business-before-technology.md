# Rule: business-before-technology

## Princípio

Não escolher stack, framework ou padrão técnico antes de entender problema, usuário, valor e modelo de negócio.

## Por que existe

Stack escolhida cedo demais vira solução à procura de problema. A stack ideal depende do produto e do time — e nenhum dos dois é conhecido se o negócio ainda está nebuloso.

## Como aplicar

1. Skill `choose-stack` só roda após Fases 1–5 do fluxo.
2. Se o usuário começar perguntando "Next ou Nest?", redirecionar à fase faltante.
3. Stack só vira ADR quando há restrições reais documentadas em `technology-decision.md`.

## Exemplos bons

- "Antes de escolher a stack, vamos entender quem é o usuário e quanto ele pode pagar pelo produto."
- ADR de stack cita restrições do time, do produto e do orçamento.
- Decisão recomeça quando o produto pivota significativamente.

## Exemplos ruins

- "Já decidi: vai ser Next + Supabase, vamos começar." (sem ter problem statement).
- Escolher arquitetura por moda do mês.
- Adotar microserviços para "preparar pro futuro" sem volume justificável.

## Exceções

- Times com restrição forte de skill (ex.: time só sabe Go) — registrar como restrição em `technology-decision.md` e ainda assim avaliar alternativas para decisão consciente.
- Projeto de pesquisa puramente técnica (não é o caso deste boilerplate).
