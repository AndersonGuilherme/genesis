# Rule: documentation-first

## Princípio

Toda decisão importante atualiza documentação **antes** ou **junto** com a mudança no código ou no processo.

## Por que existe

Decisão que vive só no chat ou na cabeça do dev desaparece. Documentação é a memória externa do projeto — para humanos novos e para agentes de IA futuros.

## Como aplicar

1. Identificou decisão relevante? Pergunte: "qual doc precisa mudar?".
2. Atualize o doc no mesmo PR / commit da mudança que ele descreve.
3. Se a decisão muda direção, crie ADR.
4. Se a decisão muda contrato, atualize spec.
5. Se a decisão muda comportamento de usuário, atualize roadmap ou MVP scope.

## Exemplos bons

- Adicionou nova integração externa → adicionar em `integration-map.md` + spec da integração + ADR de motivo.
- Mudou política de retenção → atualizar `data-privacy.md` e `data-strategy.md`.
- Cortou feature do MVP → atualizar `mvp-scope.md` (mover para OUT) e roadmap.

## Exemplos ruins

- "Vou documentar depois quando der tempo."
- Conversa no chat decide algo e nada vai pro repo.
- ADR criado depois do incidente ter mostrado erro da decisão.

## Exceções

- Mudanças puramente cosméticas no código (rename de variável local, etc.).
- Spike descartável.
- Refatoração interna que **não** muda contrato.
