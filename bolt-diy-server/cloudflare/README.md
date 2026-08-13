# bolt.diy op Cloudflare Pages

bolt.diy volledig op Cloudflare, zonder eigen hardware. Altijd bereikbaar,
overal snel, en niets dat thuis kan uitvallen.

Dit is bolt.diy's **eigen doelplatform**: er zit een `wrangler.toml` in de
repository met `pages_build_output_dir` en `nodejs_compat`, en `package.json`
heeft een kant-en-klare `deploy`-opdracht. We doen hier dus niets exotisch.

---

## Snel starten

```bash
cd bolt-diy-server/cloudflare
make setup
```

Dat doet drie dingen: bolt.diy ophalen en bouwen (met OpenRouter als
standaardprovider), je API-sleutels als secrets naar Cloudflare zetten, en
deployen. Je krijgt een adres als `https://novaclaw-bolt.pages.dev`.

Je hebt maar één sleutel nodig: `OPEN_ROUTER_API_KEY`. Zie
[../docs/openrouter.md](../docs/openrouter.md).

**Daarna direct de login aanzetten** — zie [docs/access-setup.md](docs/access-setup.md).
Tot dat gebeurd is staat je site open voor iedereen, met jouw API-sleutels
erachter.

---

## Is het bundle-limiet een probleem?

Nee. Dit is de meestgenoemde reden waarom mensen denken dat bolt.diy niet op
Cloudflare kan, dus het is gemeten in plaats van geschat — op `stable`,
augustus 2026:

| | gemeten | limiet | gebruikt |
|---|---|---|---|
| Pages Functions bundel | 5,72 MiB onbewerkt, **1,01 MiB gecomprimeerd** | 25 MiB | **4 %** |
| Client-assets | 15 MB, 356 bestanden, grootste 3,6 MiB | 20.000 bestanden, 25 MiB per bestand | ruim onder |

Er is dus geen enkele reden om providers te slopen of trucs uit te halen.
`make check` meet dit opnieuw bij elke build, zodat je het merkt als een
toekomstige versie van bolt.diy er alsnog overheen gaat.

Waar de verwarring vandaan komt: mensen die bolt.diy op Cloudflare *Workers*
proberen te zetten in plaats van *Pages* lopen tegen een veel krappere limiet
aan (3 MiB gratis, 10 MiB betaald). Pages Functions krijgen 25 MiB.

---

## Wat je hiervoor inruilt

Eerlijk over de nadelen ten opzichte van de Mac mini-opzet:

| | Cloudflare Pages | Mac mini |
|---|---|---|
| Beschikbaarheid | Altijd aan, wereldwijd snel | Valt weg bij stroomuitval of een slapende Mac |
| Onderhoud | Niets | Node bijwerken, launchd, slaapstand |
| Je API-sleutels | Versleuteld bij Cloudflare | Op je eigen schijf |
| Lokale modellen (Ollama) | **Niet mogelijk** | Werkt |
| Login | Cloudflare Access, gratis tot 50 gebruikers | Tailscale-account |
| Kosten | Gratis binnen de free tier | Stroom |

Het echte verlies is **Ollama**: een worker op Cloudflare kan niet bij een
model dat op jouw machine draait. Gebruik je alleen API-providers zoals
Anthropic of OpenAI, dan merk je hier niets van.

De Mac mini-opzet blijft beschikbaar in de map hierboven; ze bijten elkaar niet.

---

## Commando's

```
make prepare   Haal bolt.diy op en bouw de bundel
make check     Meet de bundel tegen het limiet van 25 MiB
make secrets   Zet je API-sleutels als Cloudflare secrets
make deploy    Zet de bundel live
make setup     Alles hierboven in één keer
make url       Toon het adres van je project
make logs      Volg de live logs van de worker
```

---

## Instellingen

| Variabele | Standaard | Betekenis |
|---|---|---|
| `BOLT_CF_PROJECT` | `novaclaw-bolt` | Projectnaam, bepaalt je `*.pages.dev`-adres |
| `BOLT_CF_ROOT` | `~/bolt-diy-cf` | Werkmap voor de checkout en build |
| `BOLT_CF_APP` | `$BOLT_CF_ROOT/app` | Bestaande checkout hergebruiken |
| `BOLT_CF_ENV_FILE` | `$BOLT_CF_ROOT/.env` | Waar je sleutels staan |
| `BOLT_REF` | `stable` | Branch of tag van bolt.diy |
| `BOLT_PROVIDER` | `OpenRouter` | Standaardprovider bij het openen |
| `BOLT_MODEL` | `anthropic/claude-3.5-sonnet` | Standaardmodel |

Andere projectnaam:

```bash
export BOLT_CF_PROJECT=mijn-bolt
make deploy        # wordt https://mijn-bolt.pages.dev
```

---

## Sleutels

Ze staan in `~/bolt-diy-cf/.env` (`chmod 600`) en gaan als **secrets** naar
Cloudflare — versleuteld, niet terug te lezen in het dashboard, en ze komen
niet in de bundel terecht. bolt.diy leest ze per verzoek uit de omgeving.

Sleutel gewijzigd of toegevoegd:

```bash
$EDITOR ~/bolt-diy-cf/.env
make secrets
```

Een herdeploy is niet nodig — secrets werken los van de bundel.

Wil je liever helemaal geen sleutels op Cloudflare: laat het bestand leeg en
laat iedereen zijn eigen sleutel invullen in de bolt.diy-UI (tandwiel →
Providers). Die blijft dan in de browser van die persoon.

---

## Bijwerken

```bash
make prepare && make deploy
```

`make prepare` haalt de nieuwste `stable` op, bouwt opnieuw en meet meteen de
bundel. Gaat er iets mis, dan blijft de vorige deploy gewoon draaien — een
mislukte build wordt nooit geupload.

Terug naar een eerdere versie kan zonder te bouwen, via
**Workers & Pages → je project → Deployments → ⋯ → Rollback**.

---

## Automatisch bouwen bij elke push

De scripts hierboven bouwen op je eigen machine. Wil je dat Cloudflare het doet:
fork [bolt.diy](https://github.com/stackblitz-labs/bolt.diy) naar je eigen
account en koppel die fork onder **Workers & Pages → Create → Pages → Connect to
Git**. Instellingen:

| Veld | Waarde |
|---|---|
| Build command | `pnpm run build` |
| Build output directory | `build/client` |
| Environment variable | `NODE_VERSION` = `22` |

Je sleutels zet je dan als **Secret** in de projectinstellingen in plaats van
met `make secrets`.

Nadeel: je zit vast aan wat er in je fork staat, en je moet die zelf
gesynchroniseerd houden met upstream.

---

## Als de bundel ooit te groot wordt

Op dit moment zit je op 4 % van de limiet, dus dit is theorie. Mocht een
toekomstige versie er wel overheen gaan, dan meldt `make check` dat vóór de
deploy. Wat dan helpt, in volgorde van opbrengst:

1. Kijk welke bestanden groot zijn — `make check` toont de bundel, en
   `wrangler pages functions build --outdir=/tmp/fn` laat je hem inspecteren.
2. Providers die je niet gebruikt uitschakelen in
   `app/lib/modules/llm/registry.ts`. Elke provider sleept een eigen SDK mee.
3. Als laatste redmiddel: terug naar de Mac mini-opzet, die geen limiet kent.

---

## Verder lezen

- [docs/access-setup.md](docs/access-setup.md) — login instellen (doe dit)
- [docs/troubleshooting.md](docs/troubleshooting.md) — als er iets niet werkt
- [../docs/openrouter.md](../docs/openrouter.md) — OpenRouter instellen, model kiezen, kosten beperken
- [../docs/security.md](../docs/security.md) — sleutels, limieten, wat te doen bij een lek
