#!/usr/bin/env bash
#
# status.sh — één blik op de gezondheid van de server.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

uid="$(id -u)"

info "bolt.diy server-status"
echo

# --- launchd ----------------------------------------------------------------
if launchctl print "gui/$uid/$BOLT_LABEL" >/dev/null 2>&1; then
  pid="$(launchctl print "gui/$uid/$BOLT_LABEL" | awk '/^[[:space:]]*pid = / {print $3; exit}')"
  last_exit="$(launchctl print "gui/$uid/$BOLT_LABEL" | awk '/last exit code = / {print $NF; exit}')"
  if [[ -n "$pid" ]]; then
    ok "Service draait (pid $pid)"
  else
    warn "Service is geladen maar draait niet (laatste exitcode: ${last_exit:-onbekend})"
  fi
else
  warn "Service niet geladen. Installeer met: scripts/03-service-install.sh"
fi

# --- HTTP -------------------------------------------------------------------
if code="$(curl -fsS -o /dev/null -w '%{http_code}' --max-time 5 "http://$BOLT_BIND:$BOLT_PORT/" 2>/dev/null)"; then
  ok "Antwoordt lokaal op http://$BOLT_BIND:$BOLT_PORT/ (HTTP $code)"
else
  warn "Geen antwoord op http://$BOLT_BIND:$BOLT_PORT/"
fi

# --- Cross-origin isolation -------------------------------------------------
# Zonder deze twee headers weigert de browser SharedArrayBuffer en blijft
# bolt.diy hangen op "Booting WebContainer".
headers="$(curl -fsSI --max-time 5 "http://$BOLT_BIND:$BOLT_PORT/" 2>/dev/null || true)"
if grep -qi 'cross-origin-embedder-policy' <<<"$headers" \
   && grep -qi 'cross-origin-opener-policy' <<<"$headers"; then
  ok "COOP/COEP-headers aanwezig (WebContainer kan starten)"
elif [[ -n "$headers" ]]; then
  warn "COOP/COEP-headers ontbreken — zie docs/troubleshooting.md"
fi

# --- Tailscale --------------------------------------------------------------
if ts="$(find_tailscale)"; then
  if "$ts" status >/dev/null 2>&1; then
    ok "Tailscale verbonden"
    if "$ts" serve status 2>/dev/null | grep -q "$BOLT_PORT"; then
      ok "Tailscale Serve verwijst naar poort $BOLT_PORT"
    else
      warn "Tailscale Serve is niet ingesteld. Draai: scripts/02-tailscale-setup.sh"
    fi
    if "$ts" funnel status 2>/dev/null | grep -qi 'funnel on'; then
      warn "Funnel staat AAN — bolt.diy is publiek bereikbaar op internet!"
      warn "Uitzetten: $ts funnel --https=443 off"
    fi
  else
    warn "Tailscale is niet verbonden"
  fi
else
  warn "Tailscale niet geinstalleerd"
fi

# --- Versie -----------------------------------------------------------------
if [[ -d "$BOLT_APP/.git" ]]; then
  ok "bolt.diy $(git -C "$BOLT_APP" rev-parse --short HEAD) ($(git -C "$BOLT_APP" log -1 --format=%cd --date=short))"
fi

# --- Energie ----------------------------------------------------------------
sleep_val="$(pmset -g custom 2>/dev/null | awk '/^[[:space:]]*sleep[[:space:]]/ {print $2; exit}')"
if [[ "$sleep_val" == "0" ]]; then
  ok "Slaapstand uit"
else
  warn "Slaapstand staat aan (sleep=${sleep_val:-?}) — server valt weg. Draai scripts/04-power-settings.sh"
fi

echo
if url="$(bolt_url 2>/dev/null)"; then
  info "Adres: ${C_BOLD}${url}${C_RESET}"
fi
