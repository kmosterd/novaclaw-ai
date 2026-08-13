#!/usr/bin/env bash
#
# 03-deploy.sh — zet de gebouwde bundel op Cloudflare Pages.
# Weigert te deployen als de bundel over de limiet gaat, zodat je een nette
# foutmelding krijgt in plaats van een half afgebroken upload.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

[[ -d "$BOLT_CF_APP/build/client" ]] || die "Geen build gevonden. Draai eerst scripts/01-prepare.sh."

# --- Controles vooraf -------------------------------------------------------
info "Bundelgrootte controleren"
"$SCRIPT_DIR/check-bundle.sh" || die "Deploy afgebroken: de bundel past niet."

if ! wrangler_run whoami >/dev/null 2>&1; then
  info "Inloggen bij Cloudflare"
  wrangler_run login || die "Inloggen mislukt"
fi

# --- Project aanmaken als het nog niet bestaat ------------------------------
if wrangler_run pages project list 2>/dev/null | grep -qw "$BOLT_CF_PROJECT"; then
  ok "Project '$BOLT_CF_PROJECT' bestaat al"
else
  info "Project '$BOLT_CF_PROJECT' aanmaken"
  wrangler_run pages project create "$BOLT_CF_PROJECT" \
    --production-branch=main \
    || die "Aanmaken mislukt. Bestaat de naam al bij een ander account?"
  ok "Project aangemaakt"
fi

# --- Deployen ---------------------------------------------------------------
info "Uploaden naar Cloudflare Pages"
wrangler_run pages deploy build/client \
  --project-name="$BOLT_CF_PROJECT" \
  --commit-dirty=true \
  || die "Deploy mislukt — zie de uitvoer hierboven."

url="https://$BOLT_CF_PROJECT.pages.dev"

echo
ok "Live op ${C_BOLD}${url}${C_RESET}"
echo
warn "LET OP: deze URL is nu voor IEDEREEN op internet bereikbaar, en jouw"
warn "API-sleutels zitten erachter. Zet Cloudflare Access aan vóór je hem deelt"
warn "of ergens laat staan — zie cloudflare/README.md, sectie 'Login instellen'."
