#!/usr/bin/env bash
#
# preview.sh — draait de gebouwde bundel lokaal, zodat je je API-sleutel en de
# modelkeuze kunt uitproberen vóórdat er iets publiek op internet staat.
#
# Waarom dit lokaal gewoon werkt: WebContainers eisen een secure context, en
# browsers rekenen `localhost` daar altijd toe — ook zonder HTTPS. Je hebt hier
# dus geen certificaat of tunnel voor nodig.
#
# Stoppen met ctrl-c. Er wordt niets naar Cloudflare gestuurd.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

ENV_FILE="${BOLT_CF_ENV_FILE:-$BOLT_CF_ROOT/.env}"

[[ -d "$BOLT_CF_APP/build/client" ]] || die "Geen build gevonden. Draai eerst: make prepare"

if [[ ! -f "$ENV_FILE" ]]; then
  die "Sleutelbestand $ENV_FILE ontbreekt. Draai eerst: make secrets
       (die maakt het bestand aan als het er nog niet is)"
fi

if ! grep -Eq '^[A-Za-z_][A-Za-z0-9_]*=.+' "$ENV_FILE"; then
  warn "Er staat nog geen ingevulde sleutel in $ENV_FILE."
  warn "bolt.diy start wel, maar je kunt pas iets genereren met een sleutel."
  warn "Je kunt hem ook in de UI invullen: tandwiel > Providers."
fi

cd "$BOLT_CF_APP"

# Lokaal draaien we met de sleutels uit .env.local, net als de Mac mini-opzet.
# Op Cloudflare komen ze uit de projectinstellingen; dit bestand gaat daar niet
# heen, want 01-prepare.sh bouwt met een lege .env.local.
install -m 600 "$ENV_FILE" "$BOLT_CF_APP/.env.local"
chmod +x ./bindings.sh 2>/dev/null || true

export WRANGLER_SEND_METRICS=false
export NODE_ENV=production

info "bolt.diy start lokaal op ${C_BOLD}http://127.0.0.1:$BOLT_PORT${C_RESET}"
echo "     Ctrl-C om te stoppen. Er gaat niets naar Cloudflare."
echo

bindings="$(./bindings.sh)"

# shellcheck disable=SC2086
exec pnpm exec wrangler pages dev ./build/client $bindings \
  --ip 127.0.0.1 \
  --port "$BOLT_PORT" \
  --no-show-interactive-dev-session
