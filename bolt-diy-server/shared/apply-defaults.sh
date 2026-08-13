#!/usr/bin/env bash
#
# apply-defaults.sh <app-dir> — zet de standaardprovider, het standaardmodel en
# de maximale antwoordlengte van bolt.diy.
#
# Waarom dit nodig is: geen van deze drie is instelbaar in bolt.diy.
#
#   1. De standaardprovider komt uit
#        getDefaultProvider() { return this._providers.values().next().value }
#      oftewel "de eerste die toevallig geregistreerd is" — registratievolgorde,
#      geen instelling.
#   2. DEFAULT_MODEL staat er hardgecodeerd naast.
#   3. maxTokenAllowed staat op 8000 voor elk OpenRouter-model, ongeacht wat het
#      model werkelijk aankan. Dat loopt door naar maxTokens in de streamText-
#      aanroep en begrenst dus de lengte van elk antwoord.
#
# De patches zijn klein en idempotent, en worden na elke verse clone opnieuw
# toegepast door 01-install.sh / 01-prepare.sh.
#
# Gebruik:
#   BOLT_PROVIDER=OpenRouter BOLT_MODEL=anthropic/claude-3.5-sonnet \
#   BOLT_MAX_TOKENS=16000 ./apply-defaults.sh ~/bolt-diy-cf/app

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

# Maximale lengte van één antwoord, in tokens. 8000 is bolt.diy's eigen waarde;
# die houden we aan als standaard zodat er niets verandert als je hier niets
# instelt. Hoger zetten kan, maar zie de waarschuwing onderaan dit script.
MAX_TOKENS="${BOLT_MAX_TOKENS:-8000}"

if [[ -t 1 ]]; then C_G=$'\033[32m'; C_Y=$'\033[33m'; C_R=$'\033[0m'
else C_G=""; C_Y=""; C_R=""; fi

ok()   { echo "  ${C_G}ok${C_R} $*"; }
warn() { echo "  ${C_Y}!!${C_R} $*" >&2; }

[[ "$MAX_TOKENS" =~ ^[1-9][0-9]*$ ]] \
  || { echo "BOLT_MAX_TOKENS moet een positief geheel getal zijn, kreeg: $MAX_TOKENS" >&2; exit 2; }

CONSTANTS="$APP_DIR/app/utils/constants.ts"
OPENROUTER="$APP_DIR/app/lib/modules/llm/providers/open-router.ts"
LLM_CONSTANTS="$APP_DIR/app/lib/.server/llm/constants.ts"

[[ -f "$CONSTANTS" ]] || { warn "$CONSTANTS niet gevonden — patch overgeslagen"; exit 1; }

# ---------------------------------------------------------------------------
# 1. DEFAULT_MODEL
# ---------------------------------------------------------------------------
if grep -q "^export const DEFAULT_MODEL = '$MODEL';" "$CONSTANTS"; then
  ok "DEFAULT_MODEL stond al op $MODEL"
elif grep -qE "^export const DEFAULT_MODEL = '[^']*';" "$CONSTANTS"; then
  # | als scheidingsteken: model-ID's bevatten een /.
  sed -i.bak -E "s|^export const DEFAULT_MODEL = '[^']*';|export const DEFAULT_MODEL = '$MODEL';|" "$CONSTANTS"
  ok "DEFAULT_MODEL -> $MODEL"
else
  warn "Regel DEFAULT_MODEL niet herkend — bolt.diy is veranderd. Controleer $CONSTANTS."
fi

# ---------------------------------------------------------------------------
# 2. DEFAULT_PROVIDER
# ---------------------------------------------------------------------------
# We vervangen de aanroep door een opzoeking op naam, met de oorspronkelijke
# aanroep als terugval. Zo blijft de app werken als de provider ooit hernoemd
# wordt of ontbreekt, in plaats van te crashen op undefined.
if grep -q "llmManager.getProvider('$PROVIDER')" "$CONSTANTS"; then
  ok "DEFAULT_PROVIDER stond al op $PROVIDER"
elif grep -q "^export const DEFAULT_PROVIDER = llmManager.getDefaultProvider();" "$CONSTANTS"; then
  sed -i.bak2 \
    "s|^export const DEFAULT_PROVIDER = llmManager.getDefaultProvider();|export const DEFAULT_PROVIDER = llmManager.getProvider('$PROVIDER') ?? llmManager.getDefaultProvider();|" \
    "$CONSTANTS"
  ok "DEFAULT_PROVIDER -> $PROVIDER"
else
  warn "Regel DEFAULT_PROVIDER niet herkend — bolt.diy is veranderd. Controleer $CONSTANTS."
fi

rm -f "$CONSTANTS.bak" "$CONSTANTS.bak2"

# ---------------------------------------------------------------------------
# 3. Maximale antwoordlengte
# ---------------------------------------------------------------------------
# Twee plekken, want ze dekken verschillende gevallen:
#
#   open-router.ts    maxTokenAllowed in getDynamicModels. Dat is de regel die
#                     er werkelijk toe doet: live opgehaalde modellen verdringen
#                     de statische bij gelijke naam, dus vrijwel elk model dat
#                     je kiest krijgt deze waarde.
#
#                     De statische modellen laten we met rust. Hun waarden zijn
#                     niet uniform (4096 voor Cohere Command, 8000 voor Grok,
#                     64000 voor de rest) en per model gekozen; daar blanco een
#                     hogere waarde overheen zetten zou een model boven zijn
#                     eigen limiet duwen. Ze tellen alleen mee als het ophalen
#                     van de live lijst faalt.
#
#   llm/constants.ts  MAX_TOKENS, de terugval voor providers die zelf geen
#                     maxTokenAllowed opgeven.

patched_any=0

if [[ -f "$OPENROUTER" ]]; then
  # De dynamische regel herkennen we aan de voorafgaande `provider: this.name,`;
  # de statische gebruiken `provider: 'OpenRouter',`. Let op dat sommige
  # statische modellen op één regel staan zonder afsluitende komma achter het
  # getal, dus we vervangen alleen het getal zelf en laten de rest staan.
  current="$(awk '
    /provider: this\.name,/ { seen = 1; next }
    seen && match($0, /maxTokenAllowed:[[:space:]]*[0-9]+/) {
      line = substr($0, RSTART, RLENGTH)
      sub(/[^0-9]*/, "", line)
      print line
      exit
    }
    seen && /[^[:space:]]/ { seen = 0 }
  ' "$OPENROUTER")"

  if [[ -z "$current" ]]; then
    warn "maxTokenAllowed in getDynamicModels niet gevonden — bolt.diy is veranderd."
    warn "   Controleer $OPENROUTER."
  elif [[ "$current" == "$MAX_TOKENS" ]]; then
    ok "maxTokenAllowed (dynamisch) stond al op $MAX_TOKENS"
  else
    awk -v want="$MAX_TOKENS" '
      /provider: this\.name,/ { seen = 1; print; next }
      seen && match($0, /maxTokenAllowed:[[:space:]]*[0-9]+/) {
        sub(/maxTokenAllowed:[[:space:]]*[0-9]+/, "maxTokenAllowed: " want)
        seen = 0
        print
        next
      }
      { print }
    ' "$OPENROUTER" > "$OPENROUTER.tmp" && mv "$OPENROUTER.tmp" "$OPENROUTER"
    ok "maxTokenAllowed (dynamisch) $current -> $MAX_TOKENS"
    patched_any=1
  fi
else
  warn "$OPENROUTER niet gevonden — antwoordlengte niet aangepast"
fi

if [[ -f "$LLM_CONSTANTS" ]]; then
  if grep -q "^export const MAX_TOKENS = $MAX_TOKENS;" "$LLM_CONSTANTS"; then
    ok "MAX_TOKENS stond al op $MAX_TOKENS"
  elif grep -qE "^export const MAX_TOKENS = [0-9]+;" "$LLM_CONSTANTS"; then
    sed -i.bak -E "s|^export const MAX_TOKENS = [0-9]+;|export const MAX_TOKENS = $MAX_TOKENS;|" "$LLM_CONSTANTS"
    rm -f "$LLM_CONSTANTS.bak"
    ok "MAX_TOKENS -> $MAX_TOKENS"
    patched_any=1
  else
    warn "Regel MAX_TOKENS niet herkend — bolt.diy is veranderd. Controleer $LLM_CONSTANTS."
  fi
fi

# Waarschuwing bij een waarde die veel modellen niet aankunnen. De provider
# antwoordt dan met een 400 in plaats van dat bolt.diy het netjes afvangt.
if (( patched_any )) && (( MAX_TOKENS > 32000 )); then
  warn "$MAX_TOKENS is hoog. Modellen die zoveel output niet ondersteunen geven"
  warn "   een API-fout in plaats van een kort antwoord. Zie docs/openrouter.md."
fi

ok "Standaard: $PROVIDER / $MODEL / max $MAX_TOKENS tokens per antwoord"
