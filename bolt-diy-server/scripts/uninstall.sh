#!/usr/bin/env bash
#
# uninstall.sh — verwijdert de service en de Tailscale-proxy.
# Laat $BOLT_ROOT met je .env en projecten staan, tenzij je --purge meegeeft.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

require_macos
uid="$(id -u)"
purge=0
[[ "${1:-}" == "--purge" ]] && purge=1

info "Service stoppen en verwijderen"
launchctl bootout "gui/$uid/$BOLT_LABEL" 2>/dev/null || true
rm -f "$BOLT_PLIST"
ok "LaunchAgent verwijderd"

if ts="$(find_tailscale)"; then
  info "Tailscale Serve terugdraaien"
  "$ts" serve reset 2>/dev/null || warn "Kon serve niet resetten; controleer met: $ts serve status"
  ok "Serve gereset"
fi

if (( purge )); then
  warn "Verwijdert nu ALLES onder $BOLT_ROOT, inclusief je API-sleutels."
  read -r -p "     Typ 'ja' om door te gaan: " answer
  if [[ "$answer" == "ja" ]]; then
    rm -rf "$BOLT_ROOT"
    ok "$BOLT_ROOT verwijderd"
  else
    info "Afgebroken; $BOLT_ROOT staat er nog."
  fi
else
  info "$BOLT_ROOT is blijven staan (inclusief .env). Volledig wissen: $0 --purge"
fi
