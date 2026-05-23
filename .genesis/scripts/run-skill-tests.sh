#!/usr/bin/env bash
# .genesis/scripts/run-skill-tests.sh
#
# Wrapper que roda todos os checks automatizáveis do boilerplate:
#   - lint-docs.sh         (estrutura + links — DEVE passar)
#   - check-readiness.sh   (gate de readiness — espera-se falhar no boilerplate base,
#                           mas roda para mostrar o estado)
#
# Sai com 0 se o lint passou (independente do readiness).

set -u

if [ -t 1 ]; then
  BOLD=$'\033[1m'; RESET=$'\033[0m'; CYAN=$'\033[36m'
else
  BOLD=""; RESET=""; CYAN=""
fi

section() { printf "\n${BOLD}${CYAN}=== %s ===${RESET}\n" "$*"; }

section "Lint estrutural (.genesis/scripts/lint-docs.sh)"
if bash .genesis/scripts/lint-docs.sh; then
  lint_ok=1
else
  lint_ok=0
fi

section "Readiness (.genesis/scripts/check-readiness.sh)"
echo "Espera-se que FALHE no boilerplate base (templates não preenchidos)."
echo "Em um projeto-filho com docs reais, deve passar."
echo
bash .genesis/scripts/check-readiness.sh || true

section "Resultado"
if [ "$lint_ok" = "1" ]; then
  echo "${BOLD}Lint OK.${RESET} Status de readiness é informativo (depende do estágio do projeto)."
  exit 0
else
  echo "${BOLD}Lint FALHOU.${RESET} Corrija antes de continuar."
  exit 1
fi
