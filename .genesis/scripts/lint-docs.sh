#!/usr/bin/env bash
# scripts/lint-docs.sh
#
# Lint estrutural do project-genesis-boilerplate.
#
# Verifica:
#   - Cada .claude/skills/*/SKILL.md tem frontmatter com name: e description:
#   - Cada .claude/agents/*.md tem frontmatter com name:, description:, tools:
#   - Cada .claude/rules/*.md tem as 6 seções obrigatórias
#   - Cada templates/*.md tem > 500 bytes
#   - Links Markdown relativos apontam para arquivos existentes
#
# Sai com 0 se tudo verde, 1 se houver problema.

set -u

if [ -t 1 ]; then
  RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  RED=""; GREEN=""; YELLOW=""; BOLD=""; RESET=""
fi

failures=0

err() { printf "  ${RED}✗${RESET} %s\n" "$*"; failures=$((failures+1)); }
ok()  { printf "  ${GREEN}✓${RESET} %s\n" "$*"; }
section() { printf "\n${BOLD}%s${RESET}\n" "$*"; }

# Garantir que rodamos da raiz do repo
if [ ! -f CLAUDE.md ] || [ ! -d .claude ]; then
  echo "${RED}erro:${RESET} rode da raiz do repositório (precisa de CLAUDE.md e .claude/)" >&2
  exit 1
fi

# --- skills ---
section "Skills"
expected_skills=40
found_skills=0
for d in .claude/skills/*/; do
  [ -d "$d" ] || continue
  f="${d}SKILL.md"
  found_skills=$((found_skills+1))
  if [ ! -f "$f" ]; then
    err "$d sem SKILL.md"
    continue
  fi
  if ! head -10 "$f" | grep -q '^name:'; then
    err "$f sem 'name:' no frontmatter"
    continue
  fi
  if ! head -10 "$f" | grep -q '^description:'; then
    err "$f sem 'description:' no frontmatter"
    continue
  fi
  if ! head -15 "$f" | grep -q '^phase:'; then
    err "$f sem 'phase:' no frontmatter"
    continue
  fi
  ok "$f"
done
if [ "$found_skills" -ne "$expected_skills" ]; then
  err "esperava $expected_skills skills, encontrou $found_skills"
fi

# --- skills: rules: aponta pra arquivos existentes ---
section "Skills — rules: válidas"
for d in .claude/skills/*/; do
  [ -d "$d" ] || continue
  f="${d}SKILL.md"
  [ -f "$f" ] || continue
  # Extrair rules: do frontmatter
  in_fm=0
  in_rules=0
  while IFS= read -r line; do
    if [ "$line" = "---" ]; then
      in_fm=$((in_fm+1))
      [ $in_fm -ge 2 ] && break
      continue
    fi
    [ $in_fm -ne 1 ] && continue
    if [ "$line" = "rules:" ]; then
      in_rules=1
      continue
    fi
    if [ $in_rules -eq 1 ]; then
      if [[ "$line" =~ ^[[:space:]]*-[[:space:]]+(.+)$ ]]; then
        rule_name="${BASH_REMATCH[1]}"
        rule_file=".claude/rules/${rule_name}.md"
        if [ ! -f "$rule_file" ]; then
          err "$f declara rule inexistente: $rule_name"
        fi
      else
        in_rules=0
      fi
    fi
  done < "$f"
done

# --- agents ---
section "Agents"
expected_agents=18
found_agents=0
for f in .claude/agents/*.md; do
  [ -f "$f" ] || continue
  found_agents=$((found_agents+1))
  if ! head -10 "$f" | grep -q '^name:';        then err "$f sem 'name:'"; continue; fi
  if ! head -10 "$f" | grep -q '^description:'; then err "$f sem 'description:'"; continue; fi
  if ! head -10 "$f" | grep -q '^tools:';       then err "$f sem 'tools:'"; continue; fi
  if ! head -15 "$f" | grep -q '^phase:';       then err "$f sem 'phase:'"; continue; fi
  ok "$f"
done
if [ "$found_agents" -ne "$expected_agents" ]; then
  err "esperava $expected_agents agents, encontrou $found_agents"
fi

# --- rules ---
section "Rules"
required_sections=("## Princípio" "## Por que existe" "## Como aplicar" "## Exemplos bons" "## Exemplos ruins" "## Exceções")
expected_rules=36
found_rules=0
for f in .claude/rules/*.md; do
  [ -f "$f" ] || continue
  found_rules=$((found_rules+1))
  missing=""
  if ! head -10 "$f" | grep -q '^name:'; then
    missing="$missing\n    - falta frontmatter 'name:'"
  fi
  if ! head -10 "$f" | grep -q '^description:'; then
    missing="$missing\n    - falta frontmatter 'description:'"
  fi
  if ! head -15 "$f" | grep -q '^phase:'; then
    missing="$missing\n    - falta frontmatter 'phase:'"
  fi
  for s in "${required_sections[@]}"; do
    if ! grep -qF "$s" "$f"; then
      missing="$missing\n    - falta seção: $s"
    fi
  done
  if [ -n "$missing" ]; then
    err "$f$(echo -e "$missing")"
  else
    ok "$f"
  fi
done
if [ "$found_rules" -ne "$expected_rules" ]; then
  err "esperava $expected_rules rules, encontrou $found_rules"
fi

# --- templates ---
section "Templates"
expected_templates=24
found_templates=0
for f in .genesis/templates/*.md; do
  [ -f "$f" ] || continue
  found_templates=$((found_templates+1))
  size=$(wc -c < "$f" | tr -d ' ')
  if [ "$size" -lt 500 ]; then
    err "$f muito pequeno ($size bytes, mínimo 500)"
  else
    ok "$f ($size bytes)"
  fi
done
if [ "$found_templates" -ne "$expected_templates" ]; then
  err "esperava $expected_templates templates, encontrou $found_templates"
fi

# --- links markdown internos ---
section "Links Markdown internos"
broken=0
checked=0
# Procurar padrão ](caminho) — só links que começam com . ou letra (relativos)
# Excluir URLs (http, https, mailto) e âncoras puras (#).
while IFS=: read -r file rest; do
  # Extrai todos os ](...) na linha
  echo "$rest" | grep -oE '\]\([^)]+\)' | while read -r link; do
    target="${link#](}"
    target="${target%)}"
    # Pular URLs e âncoras
    case "$target" in
      http*|mailto:*|\#*|javascript:*)
        continue
        ;;
    esac
    # Remover âncoras
    target_path="${target%%#*}"
    [ -z "$target_path" ] && continue
    # Caminho absoluto interno: começar com / vira raiz do repo
    if [ "${target_path:0:1}" = "/" ]; then
      resolved=".$target_path"
    else
      dir="$(dirname "$file")"
      resolved="$dir/$target_path"
    fi
    if [ ! -e "$resolved" ]; then
      echo "BROKEN|$file|$target_path|$resolved"
    fi
  done
done < <(find . -name '*.md' -not -name '*.template.md' -not -path './.git/*' -not -path './node_modules/*' -not -path './docs/superpowers/*' | xargs grep -nH '\](' 2>/dev/null) > /tmp/lint-docs-links.out

broken=$(grep -c '^BROKEN|' /tmp/lint-docs-links.out 2>/dev/null || echo 0)
broken=${broken//[^0-9]/}
[ -z "$broken" ] && broken=0

if [ "$broken" -gt 0 ]; then
  err "$broken link(s) quebrado(s):"
  awk -F'|' '/^BROKEN/{printf "      %s\n        target: %s\n        resolved: %s\n", $2, $3, $4}' /tmp/lint-docs-links.out | head -40
  if [ "$broken" -gt 13 ]; then
    echo "      ... (mais $((broken-13)) omitidos)"
  fi
else
  ok "nenhum link quebrado"
fi

# --- resultado ---
section "Resultado"
if [ "$failures" -eq 0 ]; then
  echo "${GREEN}${BOLD}APROVADO${RESET} — lint passou."
  exit 0
else
  echo "${RED}${BOLD}FALHOU${RESET} — $failures problema(s) encontrado(s)."
  exit 1
fi
