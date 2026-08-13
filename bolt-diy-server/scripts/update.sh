#!/usr/bin/env bash
#
# update.sh — haalt de nieuwste bolt.diy op, bouwt opnieuw en herstart.
# Bij een mislukte build blijft de oude, werkende build staan.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

require_macos
load_brew_env || true
[[ -d "$BOLT_APP/.git" ]] || die "bolt.diy niet gevonden in $BOLT_APP."

uid="$(id -u)"
cd "$BOLT_APP"

before="$(git rev-parse HEAD)"

info "Nieuwe versie ophalen ($BOLT_REF)"
git fetch --tags --prune origin
git checkout "$BOLT_REF"
if git symbolic-ref -q HEAD >/dev/null; then
  git pull --ff-only origin "$BOLT_REF"
fi

after="$(git rev-parse HEAD)"
if [[ "$before" == "$after" ]]; then
  ok "Al op de nieuwste versie ($(git rev-parse --short HEAD)). Niets te doen."
  exit 0
fi

info "Update: ${before:0:7} -> ${after:0:7}"
git log --oneline "$before..$after" | head -n 20 | sed 's/^/     /'

# Build naar een kopie zou netter zijn, maar bolt.diy bouwt in-place. We maken
# daarom een backup van de werkende build en zetten die terug bij een fout.
backup=""
if [[ -d build ]]; then
  backup="$BOLT_ROOT/build.previous"
  rm -rf "$backup"
  cp -R build "$backup"
  ok "Backup van de huidige build gemaakt"
fi

restore_backup() {
  if [[ -n "$backup" && -d "$backup" ]]; then
    warn "Build mislukt — vorige versie terugzetten"
    git checkout "$before" --quiet
    rm -rf build && mv "$backup" build
    launchctl kickstart -k "gui/$uid/$BOLT_LABEL" 2>/dev/null || true
    die "Update teruggedraaid. De server draait weer op ${before:0:7}."
  fi
  die "Build mislukt en er was geen backup om terug te zetten."
}

info "Dependencies bijwerken"
pnpm install --frozen-lockfile || restore_backup

info "Opnieuw bouwen"
install -m 600 "$BOLT_ROOT/.env" "$BOLT_APP/.env.local"
pnpm run build || restore_backup

rm -rf "$backup"

info "Service herstarten"
launchctl kickstart -k "gui/$uid/$BOLT_LABEL"

for i in $(seq 1 60); do
  if curl -fsS -o /dev/null --max-time 2 "http://$BOLT_BIND:$BOLT_PORT/" 2>/dev/null; then
    ok "Bijgewerkt naar $(git rev-parse --short HEAD) en weer online (na ${i}s)"
    exit 0
  fi
  sleep 1
done

warn "Service reageert niet na de update. Logs: tail -n 50 $BOLT_LOGS/boltdiy.err.log"
exit 1
