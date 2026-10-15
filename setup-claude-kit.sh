#!/usr/bin/env bash
# Kit Claude Code — Portfolio Andry « L'Odyssée »
# À lancer à la racine du dépôt, APRÈS create-next-app (tâche P0.3 de docs/TASKS.md).
# Installe les skills au niveau du projet (.claude/skills) et les MCP au niveau du projet (.mcp.json).
# Chaque commande continue même si une autre échoue : relis le récapitulatif à la fin.

set -u
FAILED=()

run() {
  echo ""
  echo "▶ $*"
  if ! "$@"; then
    FAILED+=("$*")
  fi
}

skill() { run npx -y skills add "$1" --skill "$2" --agent claude-code -y; }

echo "== Skills =="

# Next.js / React (Vercel)
skill vercel-labs/vercel-plugin nextjs
skill vercel-labs/agent-skills vercel-react-best-practices
skill vercel-labs/agent-skills vercel-react-view-transitions

# Supabase (officiel)
skill supabase/agent-skills supabase

# Motion : Emil Kowalski
skill emilkowalski/skill animate
skill emilkowalski/skill review-animations
skill emilkowalski/skill break-ui

# GSAP (officiel GreenSock)
skill greensock/gsap-skills gsap-scrolltrigger
skill greensock/gsap-skills gsap-react

# SEO et qualité web (Addy Osmani)
skill addyosmani/web-quality-skills seo
skill addyosmani/web-quality-skills web-quality-audit

echo ""
echo "== MCP (niveau projet, .mcp.json) =="
run claude mcp add --scope project playwright -- npx @playwright/mcp@latest
run npx -y shadcn@latest mcp init --client claude

echo ""
echo "== Récapitulatif =="
if [ ${#FAILED[@]} -eq 0 ]; then
  echo "Tout est installé."
else
  echo "À reprendre à la main (le nom d'une skill a peut-être changé) :"
  for f in "${FAILED[@]}"; do echo "  - $f"; done
  echo "Astuce : 'npx skills add <dépôt> --agent claude-code' sans --skill affiche la liste des skills disponibles."
fi

cat <<'EOF'

Étapes suivantes, dans Claude Code :
  1. npx impeccable install          (choisir Claude Code, installation projet)
  2. /impeccable init                (garder PRODUCT.md et DESIGN.md existants)
  3. /impeccable hooks on            (puis approuver les hooks)
  4. /output-style                   (choisir « Learning »)
  5. /mcp                            (vérifier que playwright et shadcn sont connectés)
  6. Lire docs/TASKS.md et lancer T01
EOF
