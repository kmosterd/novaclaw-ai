#!/usr/bin/env bash
#
# 03-service-install.sh — installeert bolt.diy als launchd-service.
# Daarna start de tool automatisch mee met de Mac mini en herstart hij
# vanzelf na een crash.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

require_macos

[[ -d "$BOLT_APP" ]] || die "bolt.diy niet gevonden in $BOLT_APP. Draai eerst scripts/01-install.sh."

# Waarschuw als er nog geen enkele sleutel is ingevuld — dan start de tool wel,
# maar kun je er niets mee.
if ! grep -Eq '^[A-Za-z_][A-Za-z0-9_]*=.+' "$BOLT_ROOT/.env" 2>/dev/null; then
  warn "Er staat nog geen ingevulde API-sleutel in $BOLT_ROOT/.env."
  warn "De service start wel, maar bolt.diy kan pas iets zonder sleutel via de UI."
fi

mkdir -p "$BOLT_LOGS" "$HOME/Library/LaunchAgents"

# PATH voor de service: Homebrew-node moet erbij, anders vindt launchd node niet.
load_brew_env || true
service_path="$PATH"

info "LaunchAgent schrijven naar $BOLT_PLIST"

# Placeholders invullen. We gebruiken | als scheidingsteken omdat paden / bevatten.
sed \
  -e "s|__LABEL__|$BOLT_LABEL|g" \
  -e "s|__RUN_SERVER__|$SCRIPT_DIR/run-server.sh|g" \
  -e "s|__BOLT_APP__|$BOLT_APP|g" \
  -e "s|__BOLT_LOGS__|$BOLT_LOGS|g" \
  -e "s|__BOLT_ROOT__|$BOLT_ROOT|g" \
  -e "s|__BOLT_PORT__|$BOLT_PORT|g" \
  -e "s|__BOLT_BIND__|$BOLT_BIND|g" \
  -e "s|__PATH__|$service_path|g" \
  -e "s|__HOME__|$HOME|g" \
  "$PROJECT_DIR/launchd/boltdiy.plist.template" > "$BOLT_PLIST"

plutil -lint "$BOLT_PLIST" >/dev/null || die "De gegenereerde plist is ongeldig: $BOLT_PLIST"
ok "plist geldig"

chmod +x "$SCRIPT_DIR"/*.sh

# --- Laden ------------------------------------------------------------------
uid="$(id -u)"
info "Service laden"

# Eerst een eventuele oude versie eruit, anders pakt launchd de wijziging niet op.
launchctl bootout "gui/$uid/$BOLT_LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$uid" "$BOLT_PLIST"
launchctl enable "gui/$uid/$BOLT_LABEL"
launchctl kickstart -k "gui/$uid/$BOLT_LABEL"
ok "Service '$BOLT_LABEL' geladen"

# --- Wachten tot de poort luistert ------------------------------------------
info "Wachten tot bolt.diy antwoordt op $BOLT_BIND:$BOLT_PORT"
for i in $(seq 1 60); do
  if curl -fsS -o /dev/null --max-time 2 "http://$BOLT_BIND:$BOLT_PORT/" 2>/dev/null; then
    ok "bolt.diy draait (na ${i}s)"
    started=1
    break
  fi
  sleep 1
done

if [[ "${started:-0}" != "1" ]]; then
  warn "Nog geen antwoord na 60 seconden. Bekijk de logs:"
  echo "       tail -n 50 $BOLT_LOGS/boltdiy.err.log"
  exit 1
fi

echo
if url="$(bolt_url 2>/dev/null)"; then
  info "Klaar. Open op je laptop of telefoon (met Tailscale ingelogd):"
  echo
  echo "     ${C_BOLD}${url}${C_RESET}"
else
  info "Klaar. Richt de toegang op afstand nog in: scripts/02-tailscale-setup.sh"
fi
