# Hooks do project-genesis-boilerplate

Hooks de shell que reforçam as regras do boilerplate dentro do Claude Code. Eles **não** rodam automaticamente quando você apenas usa o repo — precisam estar listados no `settings.json` do projeto que herda do boilerplate.

## Hooks disponíveis

### `prevent-code-before-readiness.sh`

- **Evento alvo:** `UserPromptSubmit`
- **O que faz:** Se o prompt do usuário menciona "implementar", "codar", "criar app/backend/frontend", "iniciar código/desenvolvimento", roda `.genesis/scripts/check-readiness.sh`. Se reprovar, bloqueia o prompt com exit code 2 e orienta o usuário a rodar a skill `plan-review-readiness`.

### `validate-docs-before-implementation.sh`

- **Evento alvo:** `PreToolUse`, matcher `Write|Edit`
- **O que faz:** Quando o Claude tenta criar/editar arquivo **fora** de `docs/`, `.claude/` ou `.genesis/`, roda `.genesis/scripts/check-readiness.sh`. Se reprovar, bloqueia com exit code 2.

## Ligando os hooks no Claude Code

Já existe um `.claude/settings.json` com os hooks pré-configurados. Se você herdou o boilerplate e quer **ligar**, basta manter o arquivo como está. Para **desligar**, comente o bloco `hooks` em `.claude/settings.json` ou remova as entradas.

Exemplo de `.claude/settings.json` (já incluso):

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": ".*",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/prevent-code-before-readiness.sh" }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/validate-docs-before-implementation.sh" }
        ]
      }
    ]
  }
}
```

## Contrato com Claude Code

| Exit code | Significado |
|-----------|-------------|
| `0` | Hook OK, segue normalmente |
| `2` | Hook bloqueia o prompt/ação. Stdout/stderr são mostrados ao usuário. |
| Outros | Tratados como erro do hook |

## Desativar temporariamente

Sem editar `settings.json`, basta exportar a variável de ambiente:

```bash
export GENESIS_HOOKS_DISABLE=1
```

Os dois hooks reconhecem essa variável e fazem `exit 0` imediato.

## Limitações conhecidas

- A heurística do hook `prevent-code-before-readiness.sh` baseia-se em palavras-chave em PT-BR e EN. Pode bloquear falso-positivo (ex.: usuário pedindo para explicar conceito de "implementação"). Nesse caso, basta reformular o prompt ou desativar.
- O hook `validate-docs-before-implementation.sh` extrai `file_path` por regex simples. Em payloads incomuns, pode deixar passar (fail-open) — comportamento intencional para não bloquear por incerteza.

## Estendendo

Para criar hook próprio, siga o mesmo contrato:

1. Crie `.claude/hooks/meu-hook.sh`.
2. Torne executável: `chmod +x .claude/hooks/meu-hook.sh`.
3. Adicione entrada no `.claude/settings.json` apontando para o evento desejado.
4. Use exit `0` (OK) ou `2` (bloqueio); imprima mensagem clara em caso de bloqueio.
