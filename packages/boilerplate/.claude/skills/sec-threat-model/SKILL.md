---
name: sec-threat-model
description: Use após `plan-design-architecture` para produzir o threat model do MVP usando STRIDE. Identifica ameaças por componente, prioriza por risco, sugere mitigação ligada a rules sec-*.
phase: security
rules:
  - sec-authn-required
  - sec-authz-enforced
  - sec-encryption-in-transit
  - sec-encryption-at-rest
  - sec-audit-trail
  - sec-rate-limit-public-api
---

# Skill: sec-threat-model

## Pré-flight (obrigatório)

Antes de executar, leia as rules declaradas no frontmatter para conhecer as mitigações disponíveis.

## Objetivo

Produzir `docs/security/threat-model.md` aplicando STRIDE a cada componente/fluxo da arquitetura do MVP. Lista ameaças, risco, mitigação.

## Quando usar

- Após `plan-design-architecture` ter completado `docs/architecture/architecture-overview.md` + `integration-map.md`.
- Antes de `sec-define-auth-strategy` e outras decisões de segurança.
- Quando arquitetura ganha componente novo (integração, serviço).

## Pré-condições

- `docs/architecture/architecture-overview.md`, `system-context.md`, `integration-map.md` preenchidos.
- Template `.genesis/templates/threat-model-template.md` disponível.

## Processo

1. Ler arquitetura. Listar todos os componentes (frontend, API, banco, cache, fila, terceiros).
2. Mapear trust boundaries (zonas de confiança) e fluxos de dado entre componentes.
3. Para cada componente e fluxo, percorrer STRIDE:
   - Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.
   - Identificar ameaças concretas (não genéricas).
4. Avaliar cada ameaça: probabilidade × impacto = risco (baixo/médio/alto).
5. Para ameaças de risco médio/alto: definir mitigação concreta + link com rule sec-* correspondente.
6. Listar suposições explícitas (ex.: "rede privada do banco é isolada").
7. Preencher `docs/security/threat-model.md` com base no template.
8. Listar riscos top em `docs/research/open-questions.md` se requerem decisão futura.

## Restrições

- Não passar adiante (para `sec-define-auth-strategy`) sem o threat model preenchido.
- Cada ameaça de risco alto precisa de mitigação atribuída a alguém com prazo.
- Sem ameaças genéricas tipo "ataque hacker" — específicas (ex.: "JWT replay via XSS").

## Exemplos de uso

- "Roda o threat model do MVP do tchr."
- "Adiciona integração com gateway X — refazer parte do threat model."

## Critérios de conclusão

- [ ] `docs/security/threat-model.md` preenchido com todos os componentes.
- [ ] Cada ameaça de risco médio/alto tem mitigação.
- [ ] Suposições explícitas documentadas.
- [ ] Riscos top adicionados a `docs/research/open-questions.md`.
