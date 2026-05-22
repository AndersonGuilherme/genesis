#!/usr/bin/env bash
# scripts/check-readiness.sh
#
# Verifica se os documentos essenciais existem e foram realmente preenchidos.
# Retorna 0 se tudo OK, 1 se algo está faltando.
#
# Uso: bash scripts/check-readiness.sh
#
# Filtros aplicados a cada documento essencial:
#   - Arquivo precisa existir
#   - Arquivo precisa ter mais de MIN_BYTES (default 800)
#   - Arquivo precisa ter MENOS placeholders "_(...)" do que MAX_PLACEHOLDERS (default 5).
#     Isso descarta templates não-preenchidos: os templates do boilerplate vêm
#     com muitos marcadores _(...) que devem ser substituídos por conteúdo real.
#
# Para customizar:
#   MIN_BYTES=1000 MAX_PLACEHOLDERS=3 bash scripts/check-readiness.sh

set -u

MIN_BYTES="${MIN_BYTES:-800}"
MAX_PLACEHOLDERS="${MAX_PLACEHOLDERS:-5}"

# Lista de documentos essenciais. Mantenha sincronizada com docs/PROJECT_STATE.md.
REQUIRED_DOCS=(
  "docs/product/product-vision.md"
  "docs/product/problem-statement.md"
  "docs/product/mvp-scope.md"
  "docs/business/business-model.md"
  "docs/architecture/architecture-overview.md"
  "docs/architecture/technology-decision.md"
  "docs/modules/README.md"
  "docs/specs/README.md"
  "docs/testing/testing-strategy.md"
  "docs/security/security-requirements.md"
)

# Cores opcionais (desliga se não for TTY)
if [ -t 1 ]; then
  RED=$'\033[31m'
  GREEN=$'\033[32m'
  YELLOW=$'\033[33m'
  BOLD=$'\033[1m'
  RESET=$'\033[0m'
else
  RED=""; GREEN=""; YELLOW=""; BOLD=""; RESET=""
fi

failures=0
total=${#REQUIRED_DOCS[@]}

echo "${BOLD}Readiness check — project-genesis-boilerplate${RESET}"
echo "Limites: mínimo ${MIN_BYTES} bytes, máximo ${MAX_PLACEHOLDERS} placeholders _(...) por arquivo"
echo

for doc in "${REQUIRED_DOCS[@]}"; do
  if [ ! -f "$doc" ]; then
    printf "  ${RED}✗${RESET} %-55s ${RED}não encontrado${RESET}\n" "$doc"
    failures=$((failures + 1))
    continue
  fi

  size=$(wc -c < "$doc" 2>/dev/null | tr -d ' ')
  if [ -z "$size" ]; then size=0; fi

  # Contar placeholders no estilo "_(...)" — usados pelos templates para marcar
  # campos a serem preenchidos pelo usuário.
  placeholders=$(grep -o '_(' "$doc" 2>/dev/null | wc -l | tr -d ' ')
  if [ -z "$placeholders" ]; then placeholders=0; fi

  if [ "$size" -lt "$MIN_BYTES" ]; then
    printf "  ${YELLOW}✗${RESET} %-55s ${YELLOW}vazio ou pouco preenchido (%s bytes)${RESET}\n" "$doc" "$size"
    failures=$((failures + 1))
  elif [ "$placeholders" -gt "$MAX_PLACEHOLDERS" ]; then
    printf "  ${YELLOW}✗${RESET} %-55s ${YELLOW}template não preenchido (%s placeholders, %s bytes)${RESET}\n" "$doc" "$placeholders" "$size"
    failures=$((failures + 1))
  else
    printf "  ${GREEN}✓${RESET} %-55s ${GREEN}ok (%s bytes, %s placeholders)${RESET}\n" "$doc" "$size" "$placeholders"
  fi
done

echo

if [ "$failures" -eq 0 ]; then
  echo "${GREEN}${BOLD}APROVADO${RESET} — todos os $total documentos essenciais preenchidos."
  echo "Você pode rodar a skill review-readiness para revisão qualitativa, depois start-development."
  exit 0
else
  echo "${RED}${BOLD}BLOQUEADO${RESET} — $failures de $total documento(s) faltando ou vazio(s)."
  echo
  echo "Próximos passos sugeridos:"
  echo "  1. Rodar a skill apropriada para a fase pendente (ex.: init-project, choose-stack)."
  echo "  2. Preencher os documentos listados acima com conteúdo real (não apenas template)."
  echo "  3. Rodar este script novamente: bash scripts/check-readiness.sh"
  echo
  exit 1
fi
