#!/usr/bin/env bash
# Gedeelde configuratie en helpers voor alle bolt-diy-server scripts.
# Wordt ge-sourced, niet direct uitgevoerd.

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuratie (overschrijfbaar via omgevingsvariabelen)
# ---------------------------------------------------------------------------

# Installatiemap op de Mac mini. Hier komt de bolt.diy checkout, logs en .env.
BOLT_ROOT="${BOLT_ROOT:-$HOME/bolt-diy}"

# Map met de bolt.diy broncode (git checkout).
BOLT_APP="$BOLT_ROOT/app"

# Logmap voor stdout/stderr van de launchd-service.
BOLT_LOGS="$BOLT_ROOT/logs"

# Upstream repository en de branch/tag die we uitchecken.
BOLT_REPO="${BOLT_REPO:-https://github.com/stackblitz-labs/bolt.diy.git}"
BOLT_REF="${BOLT_REF:-stable}"

# Poort waarop bolt.diy luistert. Bewust alleen op loopback (zie BOLT_BIND).
BOLT_PORT="${BOLT_PORT:-5173}"

# Bind-adres. 127.0.0.1 betekent: NIET bereikbaar vanaf je LAN of internet.
# Tailscale Serve is de enige weg naar binnen. Wijzig dit niet zonder reden.
BOLT_BIND="${BOLT_BIND:-127.0.0.1}"

# launchd service-label en plist-locatie (per-gebruiker LaunchAgent).
BOLT_LABEL="${BOLT_LABEL:-ai.novaclaw.boltdiy}"
BOLT_PLIST="$HOME/Library/LaunchAgents/$BOLT_LABEL.plist"

# Node-versie die we via Homebrew installeren. bolt.diy vraagt >= 18.18.0,
# de upstream Dockerfile gebruikt 22. We volgen de Dockerfile.
BOLT_NODE_FORMULA="${BOLT_NODE_FORMULA:-node@22}"

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

# ---------------------------------------------------------------------------
# Tailscale CLI opsporen
#
# Afhankelijk van hoe Tailscale geinstalleerd is staat de CLI op een andere
# plek. De App Store-build verstopt hem in de .app bundle.
# ---------------------------------------------------------------------------
find_tailscale() {
  local candidate
  for candidate in \
    "$(command -v tailscale 2>/dev/null || true)" \
    /usr/local/bin/tailscale \
    /opt/homebrew/bin/tailscale \
    "/Applications/Tailscale.app/Contents/MacOS/Tailscale"
  do
    [[ -n "$candidate" && -x "$candidate" ]] && { printf '%s' "$candidate"; return 0; }
  done
  return 1
}

# Homebrew-prefix bepalen (verschilt tussen Apple Silicon en Intel).
brew_prefix() {
  if [[ -x /opt/homebrew/bin/brew ]]; then
    printf '/opt/homebrew'
  elif [[ -x /usr/local/bin/brew ]]; then
    printf '/usr/local'
  else
    return 1
  fi
}

# Zet Homebrew (en de gekozen Node) op PATH voor de huidige shell.
load_brew_env() {
  local prefix
  prefix="$(brew_prefix)" || return 1
  eval "$("$prefix/bin/brew" shellenv)"
  # Homebrew's versioned node formulas zijn keg-only: expliciet op PATH zetten.
  local node_bin="$prefix/opt/$BOLT_NODE_FORMULA/bin"
  [[ -d "$node_bin" ]] && export PATH="$node_bin:$PATH"
  return 0
}

require_macos() {
  [[ "$(uname -s)" == "Darwin" ]] || die "Deze scripts zijn voor macOS. Gedetecteerd: $(uname -s)"
}

# De MagicDNS-naam van deze machine, zonder afsluitende punt.
#
# --peers=false is belangrijk: zonder die vlag staat er ook een DNSName per
# peer in de uitvoer en pakken we mogelijk de naam van een ander apparaat.
# grep -o matcht elk voorkomen apart, zodat compacte JSON op één regel niet
# alsnog de laatste match oplevert zoals een greedy sed zou doen.
ts_dnsname() {
  local ts name
  ts="$(find_tailscale)" || return 1
  name="$("$ts" status --json --peers=false 2>/dev/null \
    | grep -o '"DNSName"[[:space:]]*:[[:space:]]*"[^"]*"' \
    | head -n1 \
    | sed 's/.*"\([^"]*\)"$/\1/')"
  [[ -n "$name" ]] || return 1
  printf '%s' "${name%.}"
}

# De URL waarop bolt.diy bereikbaar is binnen je tailnet.
# Faalt zolang Tailscale nog niet is ingericht.
bolt_url() {
  local name
  name="$(ts_dnsname)" || return 1
  printf 'https://%s' "$name"
}
