#!/usr/bin/env bash
#
# 00-preflight.sh — controleert of deze Mac mini klaar is voor de installatie.
# Verandert niets aan het systeem; alleen lezen en rapporteren.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

problems=0
note_problem() { warn "$*"; problems=$((problems + 1)); }

info "Systeemcontrole"

require_macos
ok "macOS $(sw_vers -productVersion) op $(uname -m)"

# --- Homebrew ---------------------------------------------------------------
if prefix="$(brew_prefix)"; then
  ok "Homebrew gevonden in $prefix"
else
  note_problem "Homebrew ontbreekt. Installeer met:
       /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
fi

# --- Command line tools (nodig voor git en native builds) -------------------
if xcode-select -p >/dev/null 2>&1; then
  ok "Xcode Command Line Tools aanwezig"
else
  note_problem "Command Line Tools ontbreken. Installeer met: xcode-select --install"
fi

# --- Git --------------------------------------------------------------------
if have git; then
  ok "git $(git --version | awk '{print $3}')"
else
  note_problem "git ontbreekt (komt mee met de Command Line Tools)"
fi

# --- Node -------------------------------------------------------------------
if load_brew_env 2>/dev/null && have node; then
  node_major="$(node -v | sed 's/^v\([0-9]*\).*/\1/')"
  if (( node_major >= 18 )); then
    ok "node $(node -v)"
  else
    note_problem "node $(node -v) is te oud; bolt.diy vereist >= 18.18.0 (01-install.sh regelt $BOLT_NODE_FORMULA)"
  fi
else
  info "  node nog niet geinstalleerd — 01-install.sh installeert $BOLT_NODE_FORMULA"
fi

# --- Tailscale --------------------------------------------------------------
if ts="$(find_tailscale)"; then
  ok "Tailscale CLI: $ts"
  if "$ts" status >/dev/null 2>&1; then
    ok "Tailscale is verbonden"
  else
    info "  Tailscale nog niet ingelogd — 02-tailscale-setup.sh regelt dit"
  fi
else
  info "  Tailscale nog niet geinstalleerd — 02-tailscale-setup.sh regelt dit"
fi

# --- Poort vrij? ------------------------------------------------------------
if lsof -nP -iTCP:"$BOLT_PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  note_problem "Poort $BOLT_PORT is al in gebruik door:
$(lsof -nP -iTCP:"$BOLT_PORT" -sTCP:LISTEN | sed 's/^/         /')
       Stop dat proces of zet BOLT_PORT op een vrije poort."
else
  ok "Poort $BOLT_PORT is vrij"
fi

# --- Schijfruimte -----------------------------------------------------------
avail_kb="$(df -k "$HOME" | awk 'NR==2 {print $4}')"
avail_gb=$(( avail_kb / 1024 / 1024 ))
if (( avail_gb >= 5 )); then
  ok "Vrije schijfruimte: ${avail_gb} GB"
else
  note_problem "Nog maar ${avail_gb} GB vrij. De installatie (node_modules + build) vraagt ~3-4 GB."
fi

# --- Slaapstand -------------------------------------------------------------
sleep_val="$(pmset -g custom 2>/dev/null | awk '/^[[:space:]]*sleep[[:space:]]/ {print $2; exit}')"
if [[ "$sleep_val" == "0" ]]; then
  ok "Systeemslaap staat uit"
else
  info "  Systeemslaap staat aan (sleep=${sleep_val:-onbekend}) — 04-power-settings.sh zet dit uit"
fi

echo
if (( problems == 0 )); then
  info "Alles in orde. Volgende stap: scripts/01-install.sh"
else
  die "$problems punt(en) vragen aandacht — zie hierboven."
fi
