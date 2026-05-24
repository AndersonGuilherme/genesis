# Tests: lgpd-data-inventory

## Pré-condição
- `docs/architecture/architecture-overview.md` define componentes.
- `docs/specs/<modulo>/data-model.md` lista entidades + campos.

## Prompts canônicos
- "criar ROPA"
- "registro de operações de tratamento"
- "data inventory LGPD"

## Comportamentos esperados
- [ ] Lista fontes de PII (forms, integrações, eventos, uploads).
- [ ] Cada campo PII tem finalidade específica (não genérica).
- [ ] Base legal explícita por entry (consent/contrato/obrigação legal/legítimo interesse/etc.).
- [ ] Retenção + ação ao expirar (delete | anonymize).
- [ ] Compartilhamento (interno por role, externo por parceiro) mapeado.
- [ ] Transferência internacional marcada.
- [ ] Categorias sensíveis (art. 11) marcadas.
- [ ] Produz `docs/security/lgpd/data-inventory.md`.

## Anti-padrões
- [ ] NÃO usa finalidade genérica ("prestação do serviço").
- [ ] NÃO deixa base legal em branco.
- [ ] NÃO esquece de cruzar campo coletado pelo form com entry no inventory.
