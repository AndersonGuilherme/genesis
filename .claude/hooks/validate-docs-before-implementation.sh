#!/usr/bin/env bash
# .claude/hooks/validate-docs-before-implementation.sh
#
# Hook: PreToolUse, matcher Write|Edit
#
# Quando Claude tentar criar/editar arquivos fora de docs/, .claude/, .genesis/,
# verifica se .genesis/scripts/check-readiness.sh passa. Se falhar, bloqueia.
#
# Útil em projetos-filho do boilerplate, para impedir que código de aplicação
# seja criado antes da documentação mínima.
#
# Contrato com Claude Code:
#   - exit 0 → segue normalmente
#   - exit 2 → bloqueia com mensagem
#
# Para desativar: GENESIS_HOOKS_DISABLE=1

set -u

if [ "${GENESIS_HOOKS_DISABLE:-0}" = "1" ]; then
  exit 0
fi

# Lê payload do Claude Code (JSON via stdin)
input=$(cat 2>/dev/null || true)

# Tenta extrair file_path do payload. Heurística simples — funciona para casos comuns.
# (Não usar jq por padrão para manter o hook portátil.)
file_path=$(printf '%s' "$input" | grep -oE '"file_path"\s*:\s*"[^"]+"' | head -n1 | sed -E 's/.*"file_path"\s*:\s*"([^"]+)".*/\1/')

# Se não conseguir extrair, deixa passar (não bloqueia por incerteza)
if [ -z "$file_path" ]; then
  exit 0
fi

# Se o arquivo é dentro de pastas "permitidas mesmo sem readiness", passa
case "$file_path" in
  *docs/*|*\.claude/*|*\.genesis/*|*README.md|*CLAUDE.md|*\.gitignore|*\.editorconfig|*LICENSE|*LICENSE.md|*NOTICE|*COPYING|*CHANGELOG.md|*CONTRIBUTING.md|*CODE_OF_CONDUCT.md)
    exit 0
    ;;
esac

# Caso contrário, está tentando mexer em código de aplicação — checar readiness
if [ -f .genesis/scripts/check-readiness.sh ]; then
  if ! bash .genesis/scripts/check-readiness.sh > /tmp/genesis-readiness.out 2>&1; then
    cat <<EOF
[project-genesis-boilerplate] Tentativa de criar/editar arquivo de código fora de docs/, .claude/ e .genesis/, mas readiness ainda não foi aprovado.

Arquivo bloqueado: $file_path

Saída de .genesis/scripts/check-readiness.sh:

$(cat /tmp/genesis-readiness.out)

Use a skill review-readiness para diagnóstico. Para desativar este hook, exporte GENESIS_HOOKS_DISABLE=1.
EOF
    exit 2
  fi
fi

exit 0
