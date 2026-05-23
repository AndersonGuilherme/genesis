#!/usr/bin/env bash
# scripts/genesis-init.sh
#
# Bootstrap de um novo projeto a partir do project-genesis-boilerplate.
#
# Uso:
#   bash scripts/genesis-init.sh <nome-do-projeto> [destino]
#
# Argumentos:
#   nome-do-projeto   nome do diretório / projeto novo (obrigatório, kebab-case)
#   destino           caminho onde criar (opcional, default: ./<nome-do-projeto>)
#
# Comportamento:
#   1. Copia o boilerplate para o destino (cópia local se rodado dentro do repo,
#      git clone --depth 1 caso contrário).
#   2. Remove .git/ do clone, faz git init limpo.
#   3. Remove examples/ (não polui projeto novo).
#   4. Substitui placeholder __PROJECT_NAME__ por <nome-do-projeto> nos docs.
#   5. Zera PROJECT_STATE.md (mantém estrutura, limpa progresso).
#   6. Mostra próximo passo.
#
# Variáveis de ambiente:
#   BOILERPLATE_REPO   URL do GitHub (default: https://github.com/AndersonGuilherme/genesis.git)
#   GENESIS_KEEP_EXAMPLES   se "1", mantém examples/ no projeto novo

set -euo pipefail

BOILERPLATE_REPO="${BOILERPLATE_REPO:-https://github.com/AndersonGuilherme/genesis.git}"
KEEP_EXAMPLES="${GENESIS_KEEP_EXAMPLES:-0}"

if [ -t 1 ]; then
  RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  RED=""; GREEN=""; YELLOW=""; BOLD=""; RESET=""
fi

die() { echo "${RED}erro:${RESET} $*" >&2; exit 1; }
info() { echo "${BOLD}»${RESET} $*"; }
ok()   { echo "  ${GREEN}✓${RESET} $*"; }

# --- argumentos ---
if [ $# -lt 1 ]; then
  cat >&2 <<EOF
Uso: bash scripts/genesis-init.sh <nome-do-projeto> [destino]
Exemplo: bash scripts/genesis-init.sh meu-projeto ./meu-projeto
EOF
  exit 1
fi

NAME="$1"
DEST="${2:-./$NAME}"

if ! echo "$NAME" | grep -Eq '^[a-z][a-z0-9-]*$'; then
  die "nome do projeto deve ser kebab-case (a-z, 0-9, -), começando com letra. Recebido: '$NAME'"
fi

if [ -e "$DEST" ]; then
  die "destino já existe: $DEST. Apague antes ou escolha outro caminho."
fi

# --- detectar origem: local vs git clone ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BOILERPLATE_DIR="$(dirname "$SCRIPT_DIR")"

# Se estamos rodando de dentro do próprio boilerplate, copia local.
if [ -f "$BOILERPLATE_DIR/CLAUDE.md" ] && [ -d "$BOILERPLATE_DIR/.claude/skills" ]; then
  SOURCE_MODE="local"
  SOURCE_PATH="$BOILERPLATE_DIR"
else
  SOURCE_MODE="git"
  SOURCE_PATH="$BOILERPLATE_REPO"
fi

info "criando projeto '${BOLD}$NAME${RESET}' em ${BOLD}$DEST${RESET}"
info "origem: $SOURCE_MODE ($SOURCE_PATH)"

# --- copiar/clonar ---
if [ "$SOURCE_MODE" = "local" ]; then
  # rsync exclui pastas que não devem ir
  if command -v rsync >/dev/null 2>&1; then
    rsync -a \
      --exclude='.git' \
      --exclude='node_modules' \
      --exclude='.venv' \
      --exclude='__pycache__' \
      "$SOURCE_PATH/" "$DEST/"
  else
    # fallback: cp -R com remoção depois
    cp -R "$SOURCE_PATH" "$DEST"
    rm -rf "$DEST/.git" 2>/dev/null || true
  fi
  ok "boilerplate copiado localmente"
else
  git clone --depth 1 "$SOURCE_PATH" "$DEST" >/dev/null 2>&1 \
    || die "git clone falhou ($SOURCE_PATH)"
  rm -rf "$DEST/.git"
  ok "boilerplate clonado do GitHub"
fi

cd "$DEST"

# --- limpeza opcional ---
if [ "$KEEP_EXAMPLES" != "1" ]; then
  rm -rf examples
  ok "examples/ removido (GENESIS_KEEP_EXAMPLES=1 mantém)"
fi

# --- substituir __PROJECT_NAME__ em docs (se houver) ---
# Busca-substitui em arquivos texto. Limite a docs/, README.md e CLAUDE.md.
TARGETS=()
[ -f "README.md" ] && TARGETS+=("README.md")
[ -f "CLAUDE.md" ] && TARGETS+=("CLAUDE.md")
[ -d "docs" ] && while IFS= read -r f; do TARGETS+=("$f"); done < <(find docs -type f -name '*.md')

if [ ${#TARGETS[@]} -gt 0 ]; then
  # macOS sed precisa de "" após -i; Linux precisa nada. Usar sed portátil via arquivo temp.
  for f in "${TARGETS[@]}"; do
    if grep -q '__PROJECT_NAME__' "$f" 2>/dev/null; then
      tmp="$(mktemp)"
      sed "s/__PROJECT_NAME__/$NAME/g" "$f" > "$tmp" && mv "$tmp" "$f"
    fi
  done
  ok "placeholders __PROJECT_NAME__ substituídos onde encontrados"
fi

# --- zerar PROJECT_STATE.md (mantém template, limpa só datas e fase) ---
if [ -f docs/PROJECT_STATE.md ]; then
  tmp="$(mktemp)"
  sed -E \
    -e "s/^(\| Nome do projeto \|).*$/\1 $NAME |/" \
    -e "s/^(\| Data de início \|).*$/\1 $(date -u +%Y-%m-%d) |/" \
    -e "s/^(\| Última atualização \|).*$/\1 $(date -u +%Y-%m-%d) |/" \
    -e "s/^(\| Estágio \|).*$/\1 ideia |/" \
    -e "s/^(\*\*Fase ativa agora:\*\*).*$/\1 1 — identidade do projeto |/" \
    docs/PROJECT_STATE.md > "$tmp" && mv "$tmp" docs/PROJECT_STATE.md
  ok "docs/PROJECT_STATE.md zerado para o projeto novo"
fi

# --- git init limpo ---
git init -b main >/dev/null 2>&1
ok "git init feito (branch main)"

# --- mensagem final ---
cat <<EOF

${GREEN}${BOLD}Projeto '$NAME' criado em $DEST${RESET}

Próximos passos:
  ${BOLD}1.${RESET} cd $DEST
  ${BOLD}2.${RESET} Abra o Claude Code aqui (ou seu cliente de Claude Agent SDK).
  ${BOLD}3.${RESET} Diga: "vamos iniciar o projeto"
  ${BOLD}4.${RESET} Deixe a mentoria conduzir.

Para checar prontidão a qualquer momento:
  bash scripts/check-readiness.sh

Para remover o gate de hooks temporariamente:
  export GENESIS_HOOKS_DISABLE=1

Boa jornada.
EOF
