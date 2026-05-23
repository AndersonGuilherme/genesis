#!/usr/bin/env bash
# .claude/hooks/prevent-code-before-readiness.sh
#
# Hook: UserPromptSubmit
#
# Heurística: se o prompt do usuário contém intenção de iniciar implementação
# (palavras como "implementar", "codar", "criar app", "criar backend", etc.)
# e .genesis/scripts/check-readiness.sh retorna ≠ 0, bloqueia com exit code 2
# e mostra mensagem orientando o usuário a usar a skill plan-review-readiness.
#
# Contrato com Claude Code:
#   - exit 0 → segue normalmente
#   - exit 2 → bloqueia com mensagem em stderr/stdout
#
# Para desativar temporariamente: defina GENESIS_HOOKS_DISABLE=1 no ambiente.

set -u

if [ "${GENESIS_HOOKS_DISABLE:-0}" = "1" ]; then
  exit 0
fi

# Lê o prompt do usuário do stdin (Claude Code envia JSON)
input=$(cat 2>/dev/null || true)

# Heurística simples: procurar palavras-chave no input
if echo "$input" | grep -Eiq 'implement(ar|e|ação)|codar|começa(r)? a (codar|implementar)|criar (o |a |o )?(app|backend|frontend|api)|iniciar (código|desenvolvimento)|start (development|coding)'; then
  # Achou intenção de implementar — checar readiness
  if [ -x .genesis/scripts/check-readiness.sh ] || [ -f .genesis/scripts/check-readiness.sh ]; then
    if ! bash .genesis/scripts/check-readiness.sh > /tmp/genesis-readiness.out 2>&1; then
      cat <<EOF
[project-genesis-boilerplate] Pedido de implementação detectado, mas o readiness ainda não foi aprovado.

Saída de .genesis/scripts/check-readiness.sh:

$(cat /tmp/genesis-readiness.out)

Próximos passos:
  1. Rode a skill 'plan-review-readiness' para diagnóstico qualitativo.
  2. Preencha os documentos pendentes com conteúdo real.
  3. Tente novamente — ou exporte GENESIS_HOOKS_DISABLE=1 se já souber que está OK.
EOF
      exit 2
    fi
  fi
fi

exit 0
