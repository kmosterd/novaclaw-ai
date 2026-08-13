#!/usr/bin/env bash
#
# 01-install.sh — installeert Node, haalt bolt.diy op en bouwt de productiebundle.
# Idempotent: opnieuw draaien werkt de bestaande installatie bij.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

require_macos

# --- Node via Homebrew ------------------------------------------------------
info "Node installeren ($BOLT_NODE_FORMULA)"
load_brew_env || die "Homebrew niet gevonden. Draai eerst scripts/00-preflight.sh."

if brew list --formula "$BOLT_NODE_FORMULA" >/dev/null 2>&1; then
  ok "$BOLT_NODE_FORMULA staat er al"
else
  brew install "$BOLT_NODE_FORMULA"
fi
load_brew_env
have node || die "node staat niet op PATH na installatie van $BOLT_NODE_FORMULA"
ok "node $(node -v)"

# --- pnpm -------------------------------------------------------------------
# bolt.diy pint pnpm via het "packageManager"-veld. Corepack respecteert dat
# en installeert precies de juiste versie. Node 25+ levert corepack niet meer
# mee, vandaar de terugval op een globale npm-installatie.
info "pnpm klaarzetten"
if have corepack; then
  corepack enable >/dev/null 2>&1 || warn "corepack enable gaf een fout; ga door"
  ok "corepack actief (pnpm-versie volgt package.json)"
elif have pnpm; then
  ok "pnpm $(pnpm --version) gevonden"
else
  npm install -g pnpm@9.14.4
  ok "pnpm $(pnpm --version) geinstalleerd"
fi

# --- Mapstructuur -----------------------------------------------------------
info "Mapstructuur aanmaken in $BOLT_ROOT"
mkdir -p "$BOLT_ROOT" "$BOLT_LOGS"
ok "$BOLT_ROOT"

# --- bolt.diy ophalen -------------------------------------------------------
if [[ -d "$BOLT_APP/.git" ]]; then
  info "bolt.diy bijwerken naar '$BOLT_REF'"
  git -C "$BOLT_APP" fetch --tags --prune origin
  git -C "$BOLT_APP" checkout "$BOLT_REF"
  # Alleen fast-forwarden als we op een branch zitten; bij een tag/commit
  # staat HEAD los en heeft pull geen zin.
  if git -C "$BOLT_APP" symbolic-ref -q HEAD >/dev/null; then
    git -C "$BOLT_APP" pull --ff-only origin "$BOLT_REF"
  fi
else
  info "bolt.diy klonen van $BOLT_REPO"
  git clone "$BOLT_REPO" "$BOLT_APP"
  git -C "$BOLT_APP" checkout "$BOLT_REF"
fi
ok "bolt.diy op $(git -C "$BOLT_APP" rev-parse --short HEAD) ($BOLT_REF)"

# --- .env -------------------------------------------------------------------
# Eén bron van waarheid voor de API-sleutels: $BOLT_ROOT/.env.
# Die kopieren we naar app/.env.local, waar bolt.diy hem verwacht.
if [[ ! -f "$BOLT_ROOT/.env" ]]; then
  cp "$PROJECT_DIR/.env.example" "$BOLT_ROOT/.env"
  chmod 600 "$BOLT_ROOT/.env"
  warn "Nieuw sleutelbestand aangemaakt: $BOLT_ROOT/.env
       Vul hier minstens één API-sleutel in voordat je de service start."
else
  chmod 600 "$BOLT_ROOT/.env"
  ok "Bestaande $BOLT_ROOT/.env behouden"
fi

# --- Standaarden instellen --------------------------------------------------
# Zonder dit begint iedere bezoeker bij een willekeurige provider. Moet vóór de
# build, want de waarden worden mee gecompileerd.
info "Standaarden zetten: ${BOLT_PROVIDER:-OpenRouter} / max ${BOLT_MAX_TOKENS:-8000} tokens"
"$PROJECT_DIR/shared/apply-defaults.sh" "$BOLT_APP" \
  || warn "Patch mislukt; bolt.diy start dan op een willekeurige provider"

# --- Dependencies en build --------------------------------------------------
info "Dependencies installeren (dit duurt een paar minuten)"
cd "$BOLT_APP"
pnpm install --frozen-lockfile

info "Productiebundle bouwen"
# bindings.sh leest .env.local en geeft de sleutels als wrangler-bindings door.
# Zonder dit bestand faalt de start, dus we zorgen dat het er is voor de build.
cp "$BOLT_ROOT/.env" "$BOLT_APP/.env.local"
chmod 600 "$BOLT_APP/.env.local"
chmod +x "$BOLT_APP/bindings.sh" 2>/dev/null || true
pnpm run build
ok "Build klaar in $BOLT_APP/build/client"

echo
info "Installatie afgerond. Volgende stappen:"
echo "     1. Vul je API-sleutels in:  \$EDITOR $BOLT_ROOT/.env"
echo "     2. Tailscale inrichten:     scripts/02-tailscale-setup.sh"
echo "     3. Service installeren:     scripts/03-service-install.sh"
echo "     4. Slaapstand uitzetten:    scripts/04-power-settings.sh"
