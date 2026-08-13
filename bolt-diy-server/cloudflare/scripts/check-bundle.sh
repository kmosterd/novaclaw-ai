#!/usr/bin/env bash
#
# check-bundle.sh — meet de Pages Functions-bundel tegen Cloudflare's limiet
# van 25 MiB, voordat je een deploy doet die alsnog geweigerd wordt.
#
# Belangrijk: er staat geen kant-en-klare worker in build/. Remix levert
# build/server/index.js, en wrangler bundelt die pas bij de deploy samen met
# functions/[[path]].ts tot de uiteindelijke worker. We laten wrangler die stap
# hier alvast doen, zodat we precies meten wat er straks geupload wordt.
#
# Ter referentie, gemeten op bolt.diy stable (augustus 2026):
#   onbewerkt 5,72 MiB - gecomprimeerd 1,01 MiB - 4% van de limiet.
# Er is dus ruimte zat; dit script is een vangnet voor als dat verandert.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

[[ -d "$BOLT_CF_APP" ]] || die "bolt.diy niet gevonden in $BOLT_CF_APP. Draai eerst scripts/01-prepare.sh."
[[ -f "$BOLT_CF_APP/build/server/index.js" ]] || die "Geen serverbundel gevonden.
       Draai eerst in $BOLT_CF_APP:  pnpm run build"

outdir="$(mktemp -d)"
trap 'rm -rf "$outdir"' EXIT

info "Worker compileren zoals wrangler dat bij een deploy doet"
if ! wrangler_run pages functions build --outdir="$outdir" >/dev/null 2>&1; then
  die "Compileren mislukt. Draai handmatig voor de volledige foutmelding:
       cd $BOLT_CF_APP && pnpm exec wrangler pages functions build --outdir=/tmp/fnbuild"
fi

bundle="$outdir/index.js"
[[ -f "$bundle" ]] || bundle="$(find "$outdir" -name '*.js' -type f | head -n1)"
[[ -f "$bundle" ]] || die "Geen gecompileerde worker gevonden in $outdir"

raw_bytes="$(wc -c < "$bundle")"
# Cloudflare toetst de gecomprimeerde omvang; gzip -9 benadert dat goed genoeg
# om te weten of je in de gevarenzone zit.
gz_bytes="$(gzip -9 -c "$bundle" | wc -c)"

pct=$(( gz_bytes * 100 / CF_BUNDLE_LIMIT ))

echo
printf '     Onbewerkt    : %s MiB\n' "$(mib "$raw_bytes")"
printf '     Gecomprimeerd: %s MiB\n' "$(mib "$gz_bytes")"
printf '     Limiet       : %s MiB  (%d%% gebruikt)\n' "$(mib "$CF_BUNDLE_LIMIT")" "$pct"

# --- Static assets hebben hun eigen, andere limieten ------------------------
if [[ -d "$BOLT_CF_APP/build/client" ]]; then
  file_count="$(find "$BOLT_CF_APP/build/client" -type f | wc -l | tr -d ' ')"
  biggest="$(find "$BOLT_CF_APP/build/client" -type f -printf '%s\n' 2>/dev/null | sort -rn | head -n1)"
  [[ -n "$biggest" ]] || biggest=0
  echo
  printf '     Assets       : %s bestanden, grootste %s MiB\n' "$file_count" "$(mib "$biggest")"
  printf '                    (limiet: 20.000 bestanden, 25 MiB per bestand)\n'
  if (( file_count > 20000 )); then
    warn "Te veel bestanden voor Cloudflare Pages."
  fi
fi
echo

if (( gz_bytes > CF_BUNDLE_LIMIT )); then
  die "Bundel is te groot voor Cloudflare Pages.
       Zie cloudflare/README.md, sectie 'Als de bundel ooit te groot wordt'."
elif (( pct >= 85 )); then
  warn "Bundel zit op ${pct}% van de limiet — krap."
  exit 0
else
  ok "Ruim binnen de limiet (${pct}%)."
fi
