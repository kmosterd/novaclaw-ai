#!/usr/bin/env bash
#
# 02-tailscale-setup.sh — richt de beveiligde toegang op afstand in.
#
# Wat dit doet:
#   1. Tailscale installeren (indien nodig) en deze Mac mini aanmelden.
#   2. `tailscale serve` voor HTTPS op poort 443 richting 127.0.0.1:$BOLT_PORT.
#
# Waarom HTTPS verplicht is: bolt.diy draait je code in de browser met
# WebContainers. Die hebben SharedArrayBuffer nodig, en dat vereist cross-origin
# isolation, wat browsers alleen toestaan in een secure context. Over plat HTTP
# op een Tailscale-IP werkt de tool dus niet. `tailscale serve` regelt een echt
# Let's Encrypt-certificaat op je *.ts.net-naam en lost dat op.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

require_macos

# --- Installeren ------------------------------------------------------------
if ! ts="$(find_tailscale)"; then
  info "Tailscale installeren"
  load_brew_env || die "Homebrew niet gevonden. Draai eerst scripts/00-preflight.sh."
  brew install --cask tailscale-app 2>/dev/null \
    || brew install --cask tailscale \
    || die "Installatie mislukt. Download handmatig via https://tailscale.com/download/mac"
  ts="$(find_tailscale)" || die "Tailscale CLI niet gevonden na installatie.
       Open de Tailscale-app één keer handmatig en draai dit script opnieuw."
fi
ok "Tailscale CLI: $ts"

# Handige snelkoppeling zodat je later gewoon `tailscale` kunt typen.
if [[ ! -e /usr/local/bin/tailscale && "$ts" != "/usr/local/bin/tailscale" ]]; then
  if sudo ln -sf "$ts" /usr/local/bin/tailscale 2>/dev/null; then
    ok "Symlink /usr/local/bin/tailscale aangemaakt"
  else
    info "  (kon geen symlink maken in /usr/local/bin — niet erg)"
  fi
fi

# --- Aanmelden --------------------------------------------------------------
if "$ts" status >/dev/null 2>&1; then
  ok "Deze machine zit al in je tailnet"
else
  info "Aanmelden bij je tailnet — er opent zo een browser om in te loggen"
  # --ssh niet aanzetten: we willen alleen HTTP-toegang tot bolt.diy.
  "$ts" up || die "Aanmelden mislukt"
  ok "Aangemeld"
fi

hostname_full="$(ts_dnsname)" || die "Kon de MagicDNS-naam van deze machine niet bepalen.
       Zet MagicDNS aan in de admin console: https://login.tailscale.com/admin/dns"

ok "MagicDNS-naam: $hostname_full"

# --- HTTPS-certificaten ------------------------------------------------------
# `tailscale serve --https` werkt alleen als HTTPS Certificates aan staat in de
# tailnet-instellingen. Dat is een eenmalige klik in de admin console.
info "HTTPS-proxy instellen naar 127.0.0.1:$BOLT_PORT"

if "$ts" serve --bg --https=443 "http://127.0.0.1:$BOLT_PORT"; then
  ok "Serve actief"
else
  die "tailscale serve mislukt.

       Meest voorkomende oorzaak: HTTPS Certificates staat uit voor je tailnet.
       Zet aan op https://login.tailscale.com/admin/dns (sectie HTTPS Certificates)
       en draai dit script daarna opnieuw."
fi

# Funnel expliciet dicht: we willen dit NIET op het publieke internet.
if "$ts" funnel status 2>/dev/null | grep -qi 'funnel on\|https://'; then
  warn "Tailscale Funnel lijkt aan te staan — dat zet bolt.diy op het open internet."
  warn "Uitzetten met: $ts funnel --https=443 off"
fi

echo
info "Toegang op afstand staat klaar."
echo
echo "     ${C_BOLD}https://$hostname_full${C_RESET}"
echo
echo "     Bereikbaar vanaf elk apparaat waarop jij bent ingelogd in Tailscale."
echo "     Installeer de Tailscale-app op je laptop/telefoon en log in met"
echo "     hetzelfde account — dat is meteen je login."
echo
echo "     Let op: de site geeft nu nog een foutmelding tot de bolt.diy-service"
echo "     draait. Volgende stap: scripts/03-service-install.sh"
