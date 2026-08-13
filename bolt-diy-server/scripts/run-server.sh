#!/usr/bin/env bash
#
# run-server.sh — het startcommando dat launchd draait.
# Niet bedoeld om handmatig te starten; gebruik `make start` / `make logs`.
#
# Waarom een wrapper en niet het commando rechtstreeks in de plist: launchd
# voert een argv uit, geen shell. bolt.diy heeft shell-expansie nodig omdat
# bindings.sh de API-sleutels als wrangler-argumenten uitspuugt.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

load_brew_env || true
have node || die "node staat niet op PATH. Draai scripts/01-install.sh opnieuw."

[[ -d "$BOLT_APP" ]] || die "bolt.diy niet gevonden in $BOLT_APP. Draai scripts/01-install.sh."
[[ -d "$BOLT_APP/build/client" ]] || die "Geen build gevonden. Draai: cd $BOLT_APP && pnpm run build"

cd "$BOLT_APP"

# Sleutels uit de centrale .env overnemen. Zo hoef je maar op één plek te
# bewerken en pikt een herstart de wijziging vanzelf op.
if [[ -f "$BOLT_ROOT/.env" ]]; then
  install -m 600 "$BOLT_ROOT/.env" "$BOLT_APP/.env.local"
else
  die "Sleutelbestand $BOLT_ROOT/.env ontbreekt."
fi

chmod +x ./bindings.sh 2>/dev/null || true

# Geen telemetrie en geen interactieve prompts vanuit een achtergronddienst.
export WRANGLER_SEND_METRICS=false
export CI=1
export NODE_ENV=production

# bindings.sh zet .env.local om in `--binding KEY=value`-argumenten.
# De woordsplitsing hieronder is opzettelijk.
bindings="$(./bindings.sh)"

# shellcheck disable=SC2086
exec pnpm exec wrangler pages dev ./build/client $bindings \
  --ip "$BOLT_BIND" \
  --port "$BOLT_PORT" \
  --no-show-interactive-dev-session
