#!/usr/bin/env bash
#
# 01-prepare.sh — haalt bolt.diy op en bouwt de productiebundle lokaal.
# Werkt op macOS en Linux; er komt niets op Cloudflare terecht in deze stap.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

# --- Node -------------------------------------------------------------------
have node || die "Node ontbreekt. Installeer Node 20 of nieuwer via https://nodejs.org
       of met Homebrew: brew install node@22"

node_major="$(node -v | sed 's/^v\([0-9]*\).*/\1/')"
(( node_major >= 18 )) || die "Node $(node -v) is te oud; bolt.diy vereist >= 18.18.0"
ok "node $(node -v)"

# --- pnpm -------------------------------------------------------------------
# bolt.diy pint pnpm via het "packageManager"-veld; corepack respecteert dat.
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
if have corepack; then
  corepack enable >/dev/null 2>&1 || true
  ok "corepack actief"
elif have pnpm; then
  ok "pnpm $(pnpm --version)"
else
  die "Noch corepack noch pnpm gevonden. Installeer pnpm: npm install -g pnpm"
fi

# --- Ophalen ----------------------------------------------------------------
mkdir -p "$BOLT_CF_ROOT"

if [[ -d "$BOLT_CF_APP/.git" ]]; then
  info "bolt.diy bijwerken naar '$BOLT_REF'"
  git -C "$BOLT_CF_APP" fetch --tags --prune origin
  git -C "$BOLT_CF_APP" checkout "$BOLT_REF"
  if git -C "$BOLT_CF_APP" symbolic-ref -q HEAD >/dev/null; then
    git -C "$BOLT_CF_APP" pull --ff-only origin "$BOLT_REF"
  fi
else
  info "bolt.diy klonen"
  git clone --branch "$BOLT_REF" "$BOLT_REPO" "$BOLT_CF_APP"
fi
ok "bolt.diy op $(git -C "$BOLT_CF_APP" rev-parse --short HEAD) ($BOLT_REF)"

cd "$BOLT_CF_APP"

# --- Bouwen -----------------------------------------------------------------
info "Dependencies installeren (paar minuten)"
pnpm install --frozen-lockfile

# bindings.sh en de build verwachten een .env.local. Op Cloudflare komen de
# echte sleutels uit de projectinstellingen (zie 02-secrets.sh), dus een leeg
# bestand volstaat hier — we willen geen sleutels in de bundel bakken.
: > .env.local
chmod 600 .env.local

info "Productiebundle bouwen"
pnpm run build
ok "Build klaar"

echo
info "Bundelgrootte controleren tegen Cloudflare's limiet"
"$SCRIPT_DIR/check-bundle.sh"

echo
info "Volgende stap: scripts/02-secrets.sh (API-sleutels naar Cloudflare)"
