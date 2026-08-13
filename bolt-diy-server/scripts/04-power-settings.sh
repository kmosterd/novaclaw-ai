#!/usr/bin/env bash
#
# 04-power-settings.sh — zorgt dat de Mac mini zich als server gedraagt.
# Vraagt om je wachtwoord: pmset vereist root.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

require_macos

info "Energie-instellingen aanpassen (sudo nodig)"

# sleep 0        : het systeem gaat nooit in slaapstand, anders is de server weg
# disksleep 0    : schijven niet parkeren
# displaysleep 10: scherm mag wel uit, dat scheelt stroom en doet niets af
# womp 1         : wake on network access
# autorestart 1  : automatisch opstarten na stroomuitval
# powernap 0     : geen halfwakkere toestand die verwarrend gedrag geeft
sudo pmset -a sleep 0 disksleep 0 displaysleep 10 womp 1 autorestart 1 powernap 0
ok "pmset bijgewerkt"

# Automatisch inloggen is nodig omdat we een per-gebruiker LaunchAgent draaien:
# zonder ingelogde sessie start die niet na een herstart.
if sudo defaults read /Library/Preferences/com.apple.loginwindow autoLoginUser >/dev/null 2>&1; then
  ok "Automatisch inloggen staat aan voor: $(sudo defaults read /Library/Preferences/com.apple.loginwindow autoLoginUser)"
else
  warn "Automatisch inloggen staat uit."
  warn "Na een herstart van de Mac mini start bolt.diy pas zodra iemand inlogt."
  warn "Aanzetten: Systeeminstellingen > Gebruikers en groepen > Automatisch inloggen."
  warn "Let op: dat kan niet als FileVault aan staat."
fi

echo
info "Huidige energie-instellingen:"
pmset -g custom | sed 's/^/     /'
