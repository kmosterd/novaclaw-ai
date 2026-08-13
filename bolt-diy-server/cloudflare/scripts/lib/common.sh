#!/usr/bin/env bash
# Gedeelde configuratie voor de Cloudflare Pages-scripts.
# Wordt ge-sourced, niet direct uitgevoerd.

set -euo pipefail

# Naam van het Cloudflare Pages-project. Bepaalt ook je adres:
# https://<BOLT_CF_PROJECT>.pages.dev
BOLT_CF_PROJECT="${BOLT_CF_PROJECT:-novaclaw-bolt}"

# Werkmap waarin bolt.diy wordt gekloond en gebouwd.
BOLT_CF_ROOT="${BOLT_CF_ROOT:-$HOME/bolt-diy-cf}"
# Overschrijfbaar, zodat je de scripts ook op een bestaande checkout van
# bolt.diy kunt richten zonder opnieuw te klonen.
BOLT_CF_APP="${BOLT_CF_APP:-$BOLT_CF_ROOT/app}"

BOLT_REPO="${BOLT_REPO:-https://github.com/stackblitz-labs/bolt.diy.git}"
BOLT_REF="${BOLT_REF:-stable}"

# Poort voor `make preview`, het lokale proefdraaien. Speelt geen rol bij de
# deploy naar Cloudflare.
BOLT_PORT="${BOLT_PORT:-5173}"

# Cloudflare's harde limiet voor een Pages Functions-bundel, in bytes.
# Overschrijden betekent: deploy geweigerd. check-bundle.sh meet hiertegen.
CF_BUNDLE_LIMIT=$((25 * 1024 * 1024))

# ---------------------------------------------------------------------------
# Output-helpers
# ---------------------------------------------------------------------------

if [[ -t 1 ]]; then
  C_RESET=$'\033[0m'; C_RED=$'\033[31m'; C_GREEN=$'\033[32m'
  C_YELLOW=$'\033[33m'; C_BLUE=$'\033[34m'; C_BOLD=$'\033[1m'
else
  C_RESET=""; C_RED=""; C_GREEN=""; C_YELLOW=""; C_BLUE=""; C_BOLD=""
fi

info()  { printf '%s==>%s %s\n' "$C_BLUE$C_BOLD" "$C_RESET" "$*"; }
ok()    { printf '%s  ok%s %s\n' "$C_GREEN" "$C_RESET" "$*"; }
warn()  { printf '%s  !!%s %s\n' "$C_YELLOW" "$C_RESET" "$*" >&2; }
die()   { printf '%s FOUT%s %s\n' "$C_RED$C_BOLD" "$C_RESET" "$*" >&2; exit 1; }

have() { command -v "$1" >/dev/null 2>&1; }

# Bytes naar MiB met één decimaal, zonder afhankelijk te zijn van bc.
mib() { awk -v b="$1" 'BEGIN { printf "%.1f", b / 1048576 }'; }

# wrangler draaien uit de node_modules van bolt.diy, zodat we altijd de versie
# gebruiken waarmee het project getest is.
wrangler_run() {
  ( cd "$BOLT_CF_APP" && pnpm exec wrangler "$@" )
}
