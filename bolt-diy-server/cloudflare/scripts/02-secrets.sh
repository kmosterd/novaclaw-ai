#!/usr/bin/env bash
#
# 02-secrets.sh — zet je API-sleutels als Cloudflare Pages secrets.
#
# Waarom secrets en geen gewone environment variables: secrets zijn versleuteld
# opgeslagen en niet meer terug te lezen in het dashboard. Een gewone variable
# staat er leesbaar in, en iedereen met toegang tot je Cloudflare-account kan
# hem overschrijven of kopieren.
#
# De sleutels komen NIET in de bundel terecht. bolt.diy leest ze op de server
# uit de Cloudflare-omgeving, per verzoek.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# De .env.example ligt een niveau hoger, gedeeld met de Mac mini-opzet.
ENV_TEMPLATE="$(cd "$SCRIPT_DIR/../.." && pwd)/.env.example"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

ENV_FILE="${BOLT_CF_ENV_FILE:-$BOLT_CF_ROOT/.env}"

[[ -d "$BOLT_CF_APP" ]] || die "bolt.diy niet gevonden. Draai eerst scripts/01-prepare.sh."

# --- Sleutelbestand ---------------------------------------------------------
if [[ ! -f "$ENV_FILE" ]]; then
  mkdir -p "$(dirname "$ENV_FILE")"
  cp "$ENV_TEMPLATE" "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  die "Sleutelbestand aangemaakt: $ENV_FILE
       Vul minstens één API-sleutel in en draai dit script opnieuw."
fi
chmod 600 "$ENV_FILE"

# --- Inloggen ---------------------------------------------------------------
if ! wrangler_run whoami >/dev/null 2>&1; then
  info "Inloggen bij Cloudflare — er opent zo een browser"
  wrangler_run login || die "Inloggen mislukt"
fi
ok "Ingelogd als: $(wrangler_run whoami 2>/dev/null | grep -oE '[^ ]+@[^ ]+' | head -n1 || echo 'onbekend')"

# --- Sleutels doorzetten ----------------------------------------------------
info "Sleutels naar project '$BOLT_CF_PROJECT'"

count=0
skipped=0

while IFS= read -r line || [[ -n "$line" ]]; do
  # Commentaar en lege regels overslaan.
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  [[ "$line" =~ ^[[:space:]]*$ ]] && continue
  [[ "$line" == *=* ]] || continue

  key="${line%%=*}"
  value="${line#*=}"
  key="$(printf '%s' "$key" | tr -d '[:space:]')"

  # Omringende aanhalingstekens weghalen, die horen niet bij de waarde.
  value="${value%\"}"; value="${value#\"}"
  value="${value%\'}"; value="${value#\'}"

  # Lege waarden niet doorzetten: dan blijft een eerder gezette sleutel staan
  # in plaats van dat we hem per ongeluk leegmaken.
  if [[ -z "$value" ]]; then
    skipped=$((skipped + 1))
    continue
  fi

  # Waarde via stdin, zodat hij niet in je shell-geschiedenis of in ps belandt.
  if printf '%s' "$value" | wrangler_run pages secret put "$key" \
       --project-name="$BOLT_CF_PROJECT" >/dev/null 2>&1; then
    ok "$key"
    count=$((count + 1))
  else
    warn "$key kon niet gezet worden"
  fi
done < "$ENV_FILE"

echo
if (( count == 0 )); then
  die "Geen enkele sleutel gezet. Staat er wel een ingevulde waarde in $ENV_FILE?"
fi

ok "$count sleutel(s) gezet, $skipped lege regel(s) overgeslagen"
info "Volgende stap: scripts/03-deploy.sh"
