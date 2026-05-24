# Tests: lgpd-dpia

## Pré-condição
- Operação de alto risco identificada (dado sensível, decisão automatizada, volume grande, criança).
- `docs/security/lgpd/data-inventory.md` lista a operação.

## Prompts canônicos
- "fazer DPIA"
- "RIPD pra módulo de saúde"
- "avaliação de impacto"

## Comportamentos esperados
- [ ] Descrição da operação + fluxo.
- [ ] Necessidade + alternativas menos intrusivas avaliadas.
- [ ] Categorias de dado + titulares + base legal.
- [ ] Riscos identificados (discriminação, exposição, reidentificação, perda de controle).
- [ ] Prob × impacto = risco priorizado.
- [ ] Mitigações técnicas + organizacionais por risco.
- [ ] Revisão humana pra decisão automatizada (art. 20).
- [ ] Plano de revisão.
- [ ] Produz `docs/security/lgpd/dpia-<operacao>.md`.

## Anti-padrões
- [ ] NÃO substitui base legal por DPIA (DPIA é avaliação adicional).
- [ ] NÃO deixa decisão automatizada sem direito de revisão humana.
- [ ] NÃO aceita "risco baixo, sem mitigação".
