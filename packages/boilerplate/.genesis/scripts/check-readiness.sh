#!/usr/bin/env bash
# scripts/check-readiness.sh
#
# Multi-gate readiness check por phase do lifecycle.
#
# Verifica se os documentos essenciais da phase pedida existem e foram
# realmente preenchidos. Retorna 0 se tudo OK, 1 se algo está faltando.
#
# Uso:
#   bash .genesis/scripts/check-readiness.sh                 # default: --planning
#   bash .genesis/scripts/check-readiness.sh --planning      # planning gate
#   bash .genesis/scripts/check-readiness.sh --security      # security gate
#   bash .genesis/scripts/check-readiness.sh --lgpd          # lgpd gate
#   bash .genesis/scripts/check-readiness.sh --pre-launch    # tudo + checklist launch
#   bash .genesis/scripts/check-readiness.sh --all           # sequencial de todos
#
# Filtros aplicados a cada documento essencial:
#   - Arquivo precisa existir
#   - Arquivo precisa ter mais de MIN_BYTES (default 800)
#   - Arquivo precisa ter MENOS placeholders "_(...)" do que MAX_PLACEHOLDERS (default 5).
#     Isso descarta templates não-preenchidos.
#
# Para customizar:
#   MIN_BYTES=1000 MAX_PLACEHOLDERS=3 bash .genesis/scripts/check-readiness.sh

set -u

MIN_BYTES="${MIN_BYTES:-800}"
MAX_PLACEHOLDERS="${MAX_PLACEHOLDERS:-5}"

# ---------------------------------------------------------------------
# REQUIRED_DOCS por phase — mantenha sincronizado com docs/PROJECT_STATE.md
# ---------------------------------------------------------------------

REQUIRED_DOCS_PLANNING=(
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

REQUIRED_DOCS_SECURITY=(
  "docs/security/threat-model.md"
  "docs/security/auth-strategy.md"
  "docs/security/secrets-management.md"
  "docs/security/audit-logging.md"
  "docs/security/vuln-scan-strategy.md"
)

REQUIRED_DOCS_LGPD=(
  "docs/security/lgpd/data-inventory.md"
  "docs/security/lgpd/consent-strategy.md"
  "docs/security/lgpd/retention-policy.md"
  "docs/security/lgpd/subject-rights.md"
  "docs/security/lgpd/vendor-dpa.md"
  "docs/security/lgpd/incident-notification-plan.md"
)

REQUIRED_DOCS_PRELAUNCH=(
  "docs/launch/launch-readiness.md"
  "docs/launch/security-final-review.md"
  "docs/launch/lgpd-compliance-check.md"
  "docs/launch/performance-baseline.md"
  "docs/operations/observability.md"
  "docs/operations/slos.md"
  "docs/operations/incident-response.md"
  "docs/operations/backup-restore.md"
  "docs/deployment/ci-pipeline.md"
  "docs/deployment/cd-pipeline.md"
  "docs/deployment/deployment-strategy.md"
)

# ---------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------

MODE="${1:---planning}"

case "$MODE" in
  --planning|--security|--lgpd|--pre-launch|--all|-h|--help)
    ;;
  *)
    echo "erro: modo desconhecido: $MODE" >&2
    echo "modos válidos: --planning | --security | --lgpd | --pre-launch | --all" >&2
    exit 2
    ;;
esac

if [ "$MODE" = "-h" ] || [ "$MODE" = "--help" ]; then
  sed -n '1,25p' "$0"
  exit 0
fi

# ---------------------------------------------------------------------
# Cores
# ---------------------------------------------------------------------

if [ -t 1 ]; then
  RED=$'\033[31m'
  GREEN=$'\033[32m'
  YELLOW=$'\033[33m'
  BOLD=$'\033[1m'
  RESET=$'\033[0m'
else
  RED=""; GREEN=""; YELLOW=""; BOLD=""; RESET=""
fi

# ---------------------------------------------------------------------
# Função que valida uma lista de docs
# Retorna 0 se OK, 1 se houver falha. Imprime relatório.
# ---------------------------------------------------------------------

check_docs() {
  local phase="$1"
  shift
  local docs=("$@")
  local failures=0
  local total=${#docs[@]}

  printf "${BOLD}Gate: %s${RESET}\n" "$phase"
  printf "Limites: mínimo %s bytes, máximo %s placeholders _(...) por arquivo\n\n" "$MIN_BYTES" "$MAX_PLACEHOLDERS"

  for doc in "${docs[@]}"; do
    if [ ! -f "$doc" ]; then
      printf "  ${RED}✗${RESET} %-55s ${RED}não encontrado${RESET}\n" "$doc"
      failures=$((failures + 1))
      continue
    fi

    size=$(wc -c < "$doc" 2>/dev/null | tr -d ' ')
    if [ -z "$size" ]; then size=0; fi

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
    printf "${GREEN}${BOLD}APROVADO${RESET} — todos os %s documentos do gate '%s' preenchidos.\n\n" "$total" "$phase"
    return 0
  else
    printf "${RED}${BOLD}BLOQUEADO${RESET} — %s de %s documento(s) faltando ou vazio(s) no gate '%s'.\n\n" "$failures" "$total" "$phase"
    return 1
  fi
}

# ---------------------------------------------------------------------
# Dispatch
# ---------------------------------------------------------------------

overall_failures=0

case "$MODE" in
  --planning)
    check_docs "planning" "${REQUIRED_DOCS_PLANNING[@]}" || overall_failures=1
    ;;
  --security)
    check_docs "security" "${REQUIRED_DOCS_SECURITY[@]}" || overall_failures=1
    ;;
  --lgpd)
    check_docs "lgpd" "${REQUIRED_DOCS_LGPD[@]}" || overall_failures=1
    ;;
  --pre-launch)
    check_docs "planning" "${REQUIRED_DOCS_PLANNING[@]}" || overall_failures=1
    check_docs "security" "${REQUIRED_DOCS_SECURITY[@]}" || overall_failures=1
    check_docs "lgpd" "${REQUIRED_DOCS_LGPD[@]}" || overall_failures=1
    check_docs "pre-launch" "${REQUIRED_DOCS_PRELAUNCH[@]}" || overall_failures=1
    ;;
  --all)
    check_docs "planning" "${REQUIRED_DOCS_PLANNING[@]}" || overall_failures=1
    check_docs "security" "${REQUIRED_DOCS_SECURITY[@]}" || overall_failures=1
    check_docs "lgpd" "${REQUIRED_DOCS_LGPD[@]}" || overall_failures=1
    check_docs "pre-launch" "${REQUIRED_DOCS_PRELAUNCH[@]}" || overall_failures=1
    ;;
esac

if [ "$overall_failures" -eq 0 ]; then
  printf "%s%sTUDO OK%s\n" "$GREEN" "$BOLD" "$RESET"
  echo "Próximo passo sugerido:"
  case "$MODE" in
    --planning)   echo "  Rodar phase security: invocar skills sec-* a partir de sec-threat-model." ;;
    --security)   echo "  Rodar phase lgpd: invocar lgpd-data-inventory." ;;
    --lgpd)       echo "  Rodar phase development: invocar dev-start-development." ;;
    --pre-launch) echo "  Reunião go/no-go com leads + DPO + IC oncall. Após assinatura: go-live." ;;
    --all)        echo "  Todos os gates passaram. Pronto pra go-live (após reunião go/no-go formal)." ;;
  esac
  exit 0
else
  printf "%s%sBLOQUEADO%s — corrija os itens acima e rode de novo.\n\n" "$RED" "$BOLD" "$RESET"
  echo "Próximos passos sugeridos:"
  echo "  1. Rodar a skill apropriada pra phase pendente."
  echo "  2. Preencher os documentos listados com conteúdo real (não apenas template)."
  echo "  3. Rodar este script novamente: bash .genesis/scripts/check-readiness.sh $MODE"
  echo
  exit 1
fi
