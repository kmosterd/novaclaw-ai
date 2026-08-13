#!/usr/bin/env bash
#
# bootstrap.sh — de hele installatie in één keer, met prompts waar nodig.
#
# Loopt af: controle → bolt.diy ophalen en bouwen → sleutel vragen → optioneel
# lokaal proefdraaien → inloggen bij Cloudflare → sleutel als secret → deployen.
#
# Opnieuw draaien mag: elke stap is idempotent en werkt een bestaande
# installatie bij.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

ENV_FILE="${BOLT_CF_ENV_FILE:-$BOLT_CF_ROOT/.env}"

step() { echo; printf '%s\n' "${C_BOLD}${C_BLUE}── $* ──${C_RESET}"; }

cat <<BANNER

  bolt.diy op Cloudflare Pages
  ${C_BOLD}$(printf '%.0s─' {1..40})${C_RESET}

  Dit script:
    1. haalt bolt.diy op en bouwt het            (~10 min)
    2. vraagt je OpenRouter-sleutel              (verborgen invoer)
    3. laat je het lokaal uitproberen            (optioneel)
    4. logt in bij Cloudflare                    (opent je browser)
    5. zet de sleutel als versleuteld secret
    6. zet bolt.diy live

  Je sleutel komt in $ENV_FILE (alleen leesbaar voor jou)
  en gaat versleuteld naar Cloudflare. Hij komt niet in de bundel.

BANNER

read -r -p "  Doorgaan? [J/n] " go
[[ -z "$go" || "$go" =~ ^[JjYy]$ ]] || { echo "  Afgebroken."; exit 0; }

# ---------------------------------------------------------------------------
step "1/6  Systeemcontrole"
# ---------------------------------------------------------------------------

have git || die "git ontbreekt. Installeer de Command Line Tools: xcode-select --install"

if ! have node; then
  if have brew; then
    info "Node ontbreekt — installeren via Homebrew"
    brew install node@22
    eval "$(brew shellenv)"
    export PATH="$(brew --prefix)/opt/node@22/bin:$PATH"
  else
    die "Node en Homebrew ontbreken.
       Installeer Node 20 of nieuwer via https://nodejs.org en draai dit opnieuw."
  fi
fi

node_major="$(node -v | sed 's/^v\([0-9]*\).*/\1/')"
(( node_major >= 18 )) || die "Node $(node -v) is te oud; bolt.diy vereist >= 18.18.0"
ok "node $(node -v)"

# ---------------------------------------------------------------------------
step "2/6  bolt.diy ophalen en bouwen"
# ---------------------------------------------------------------------------
echo "  Dit is de lange stap. Koffie."
echo
"$SCRIPT_DIR/01-prepare.sh"

# ---------------------------------------------------------------------------
step "3/6  OpenRouter-sleutel"
# ---------------------------------------------------------------------------

mkdir -p "$(dirname "$ENV_FILE")"

if [[ -f "$ENV_FILE" ]] && grep -Eq '^OPEN_ROUTER_API_KEY=..+' "$ENV_FILE"; then
  ok "Er staat al een sleutel in $ENV_FILE"
  read -r -p "  Vervangen door een nieuwe? [j/N] " replace
  [[ "$replace" =~ ^[JjYy]$ ]] || skip_key=1
fi

if [[ "${skip_key:-0}" != "1" ]]; then
  echo "  Maak een sleutel op https://openrouter.ai/settings/keys"
  echo "  Zet daar meteen een credit limit — dat is je plafond als hij ooit lekt."
  echo
  # -s zodat de sleutel niet op je scherm of in je shell-geschiedenis komt.
  read -r -s -p "  Plak je OPEN_ROUTER_API_KEY (invoer blijft onzichtbaar): " api_key
  echo

  [[ -n "$api_key" ]] || die "Geen sleutel ingevoerd."

  if [[ ! "$api_key" =~ ^sk-or- ]]; then
    warn "Dit ziet er niet uit als een OpenRouter-sleutel (die beginnen met sk-or-)."
    read -r -p "  Toch doorgaan? [j/N] " anyway
    [[ "$anyway" =~ ^[JjYy]$ ]] || die "Afgebroken."
  fi

  # Bestaande regel vervangen, of toevoegen als hij er nog niet is.
  touch "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  if grep -q '^OPEN_ROUTER_API_KEY=' "$ENV_FILE"; then
    # Tijdelijk bestand naast het doel, niet in /tmp: het bevat de overige
    # regels en dus mogelijk andere sleutels, en zo blijft alles op dezelfde
    # schijf met dezelfde rechten.
    tmp="$(mktemp "$ENV_FILE.XXXXXX")"
    chmod 600 "$tmp"
    trap 'rm -f "$tmp"' EXIT
    grep -v '^OPEN_ROUTER_API_KEY=' "$ENV_FILE" > "$tmp"
    mv "$tmp" "$ENV_FILE"
    trap - EXIT
  fi
  printf 'OPEN_ROUTER_API_KEY=%s\n' "$api_key" >> "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  unset api_key
  ok "Sleutel opgeslagen in $ENV_FILE (chmod 600)"
fi

# ---------------------------------------------------------------------------
step "4/6  Lokaal uitproberen (optioneel)"
# ---------------------------------------------------------------------------
echo "  Je kunt bolt.diy eerst op je eigen Mac testen, vóórdat er iets"
echo "  publiek op internet staat. Ctrl-C sluit het weer af."
echo
read -r -p "  Nu lokaal starten? [j/N] " prev
if [[ "$prev" =~ ^[JjYy]$ ]]; then
  echo
  info "Open straks http://127.0.0.1:$BOLT_PORT in Chrome of Edge"
  echo "  Ctrl-C als je klaar bent — het script gaat daarna verder."
  echo
  # Ctrl-C mag alleen de preview stoppen, niet dit script.
  trap 'echo; info "Preview gestopt, we gaan verder"' INT
  "$SCRIPT_DIR/preview.sh" || true
  trap - INT
fi

# ---------------------------------------------------------------------------
step "5/6  Inloggen bij Cloudflare"
# ---------------------------------------------------------------------------

if wrangler_run whoami >/dev/null 2>&1; then
  ok "Al ingelogd bij Cloudflare"
else
  echo "  Er opent nu een browservenster om in te loggen."
  echo "  Heb je nog geen account: maak er gratis een op dash.cloudflare.com."
  echo
  read -r -p "  Klaar om in te loggen? [J/n] " dologin
  if [[ -z "$dologin" || "$dologin" =~ ^[JjYy]$ ]]; then
    wrangler_run login || die "Inloggen mislukt."
  else
    die "Zonder inloggen kan er niet gedeployd worden. Draai dit script opnieuw als je zover bent."
  fi
fi

# ---------------------------------------------------------------------------
step "6/6  Sleutel wegzetten en deployen"
# ---------------------------------------------------------------------------

"$SCRIPT_DIR/02-secrets.sh"
"$SCRIPT_DIR/03-deploy.sh"

url="https://$BOLT_CF_PROJECT.pages.dev"

cat <<SLOT

  ${C_BOLD}${C_RED}$(printf '%.0s━' {1..64})${C_RESET}
  ${C_BOLD}NU METEEN DOEN: zet de login aan${C_RESET}

  Je site staat live op:
      ${C_BOLD}$url${C_RESET}

  Maar hij is op dit moment ${C_BOLD}voor iedereen op internet bereikbaar${C_RESET},
  met jouw OpenRouter-sleutel erachter. Zet dit nu goed:

   1. Ga naar https://one.dash.cloudflare.com
      (eerste keer: kies het gratis plan en verzin een teamnaam)

   2. Access > Applications > Add an application > Self-hosted

   3. Application name : bolt.diy
      Public hostname  : $BOLT_CF_PROJECT.pages.dev
      Session duration : 24 hours

   4. Policy toevoegen:
      Action  : Allow
      Include : Emails > jouw e-mailadres

   5. Herhaal stap 2-4 voor hostname:
      ${C_BOLD}*.$BOLT_CF_PROJECT.pages.dev${C_RESET}
      Zonder deze tweede is elke preview-deploy een achterdeur zonder login.

   6. Controleer in een privevenster dat je een Cloudflare-loginscherm
      krijgt en niet meteen bolt.diy.

  Uitgebreid: cloudflare/docs/access-setup.md
  ${C_BOLD}${C_RED}$(printf '%.0s━' {1..64})${C_RESET}

SLOT
