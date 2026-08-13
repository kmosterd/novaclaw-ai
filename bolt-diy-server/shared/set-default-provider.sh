#!/usr/bin/env bash
#
# set-default-provider.sh <app-dir> — zet de standaardprovider en het
# standaardmodel van bolt.diy.
#
# Waarom dit nodig is: bolt.diy kiest zijn standaardprovider met
#   getDefaultProvider() { return this._providers.values().next().value }
# oftewel "de eerste die toevallig geregistreerd is". Dat is registratievolgorde
# en niet iets wat je kunt instellen. DEFAULT_MODEL staat er hardgecodeerd
# naast. Zonder deze patch begint iedere nieuwe bezoeker bij een willekeurige
# provider en moet die zelf OpenRouter aanklikken.
#
# De patch is klein en idempotent, en wordt na elke verse clone opnieuw
# toegepast door 01-install.sh / 01-prepare.sh.
#
# Gebruik:
#   BOLT_PROVIDER=OpenRouter BOLT_MODEL=anthropic/claude-3.5-sonnet \
#     ./set-default-provider.sh ~/bolt-diy-cf/app

set -euo pipefail

APP_DIR="${1:-}"
[[ -n "$APP_DIR" ]] || { echo "Gebruik: $0 <app-dir>" >&2; exit 2; }

# Provider zoals bolt.diy hem noemt (zie app/lib/modules/llm/providers/).
PROVIDER="${BOLT_PROVIDER:-OpenRouter}"

# Model-ID zoals OpenRouter hem kent. De standaard hieronder staat in bolt.diy's
# eigen staticModels-lijst, dus die werkt gegarandeerd — ook als het ophalen van
# de live modellenlijst faalt. Nieuwere modellen kies je in de UI, of zet je
# hier; zie docs/openrouter.md.
MODEL="${BOLT_MODEL:-anthropic/claude-3.5-sonnet}"

TARGET="$APP_DIR/app/utils/constants.ts"

if [[ -t 1 ]]; then C_G=$'\033[32m'; C_Y=$'\033[33m'; C_R=$'\033[0m'
else C_G=""; C_Y=""; C_R=""; fi

[[ -f "$TARGET" ]] || { echo "  !! $TARGET niet gevonden — patch overgeslagen" >&2; exit 1; }

changed=0

# --- DEFAULT_MODEL ----------------------------------------------------------
if grep -q "^export const DEFAULT_MODEL = '$MODEL';" "$TARGET"; then
  echo "  ${C_G}ok${C_R} DEFAULT_MODEL stond al op $MODEL"
elif grep -qE "^export const DEFAULT_MODEL = '[^']*';" "$TARGET"; then
  # | als scheidingsteken: model-ID's bevatten een /.
  sed -i.bak -E "s|^export const DEFAULT_MODEL = '[^']*';|export const DEFAULT_MODEL = '$MODEL';|" "$TARGET"
  echo "  ${C_G}ok${C_R} DEFAULT_MODEL -> $MODEL"
  changed=1
else
  echo "  ${C_Y}!!${C_R} Regel DEFAULT_MODEL niet herkend — bolt.diy is veranderd." >&2
  echo "     Controleer $TARGET handmatig." >&2
fi

# --- DEFAULT_PROVIDER -------------------------------------------------------
# We vervangen de aanroep door een opzoeking op naam, met de oorspronkelijke
# aanroep als terugval. Zo blijft de app werken als de provider ooit hernoemd
# wordt of ontbreekt, in plaats van te crashen op undefined.
if grep -q "llmManager.getProvider('$PROVIDER')" "$TARGET"; then
  echo "  ${C_G}ok${C_R} DEFAULT_PROVIDER stond al op $PROVIDER"
elif grep -q "^export const DEFAULT_PROVIDER = llmManager.getDefaultProvider();" "$TARGET"; then
  sed -i.bak2 \
    "s|^export const DEFAULT_PROVIDER = llmManager.getDefaultProvider();|export const DEFAULT_PROVIDER = llmManager.getProvider('$PROVIDER') ?? llmManager.getDefaultProvider();|" \
    "$TARGET"
  echo "  ${C_G}ok${C_R} DEFAULT_PROVIDER -> $PROVIDER"
  changed=1
else
  echo "  ${C_Y}!!${C_R} Regel DEFAULT_PROVIDER niet herkend — bolt.diy is veranderd." >&2
  echo "     Controleer $TARGET handmatig." >&2
fi

rm -f "$TARGET.bak" "$TARGET.bak2"

if (( changed )); then
  echo "  ${C_G}ok${C_R} Standaard staat nu op $PROVIDER / $MODEL"
fi
