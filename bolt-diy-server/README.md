# bolt.diy zelf hosten

Zelf gehoste [bolt.diy](https://github.com/stackblitz-labs/bolt.diy) — de open
source variant van bolt.new — veilig bereikbaar vanaf je laptop of telefoon,
waar je ook bent.

Er zijn twee routes. Ze staan naast elkaar en bijten elkaar niet.

| | [Cloudflare Pages](cloudflare/) | [Mac mini](#mac-mini) |
|---|---|---|
| Hardware nodig | Geen | Mac mini die aan blijft |
| Beschikbaarheid | Altijd aan, wereldwijd snel | Valt weg bij stroomuitval |
| Onderhoud | Niets | Node, launchd, slaapstand |
| Login | Cloudflare Access (gratis tot 50 gebruikers) | Tailscale-account |
| API-sleutels | Versleuteld bij Cloudflare | Op je eigen schijf |
| Lokale modellen (Ollama) | Niet mogelijk | Werkt |
| Kosten | Gratis binnen de free tier | Stroom |

**Begin bij Cloudflare Pages** tenzij je lokale modellen wilt draaien of je
sleutels per se op eigen hardware wilt houden. Het is bolt.diy's eigen
doelplatform — de repository bevat een `wrangler.toml` en een kant-en-klare
`deploy`-opdracht — en er is niets dat kan uitvallen.

```bash
git clone -b claude/bolt-diy-mac-mini-server-vzb6ki \
  https://github.com/kmosterd/novaclaw-ai.git ~/novaclaw-ai
cd ~/novaclaw-ai/bolt-diy-server/cloudflare && ./scripts/bootstrap.sh
```

Eén blok in Terminal; het script vraagt onderweg wat het nodig heeft.

Zie [cloudflare/README.md](cloudflare/README.md). Het bundle-limiet van 25 MiB
waar mensen over struikelen is gemeten en geen probleem: bolt.diy gebruikt er
**4 %** van.

---

<a name="mac-mini"></a>

## Route 2: Mac mini

Geen poorten open in je router, geen wachtwoord dat geraden kan worden, en je
API-sleutels blijven op je eigen machine.

### Snel starten

Op de **Mac mini**:

```bash
git clone https://github.com/kmosterd/novaclaw-ai.git
cd novaclaw-ai/bolt-diy-server
make setup
```

`make setup` doet vier dingen: Node en bolt.diy installeren, Tailscale
inrichten, de achtergronddienst aanzetten en de slaapstand uitschakelen. Reken
op 10-15 minuten, waarvan het meeste wachten op `pnpm install`.

Daarna je API-sleutels invullen en herstarten:

```bash
$EDITOR ~/bolt-diy/.env
make restart
make url
```

Op je **laptop of telefoon**: installeer [Tailscale](https://tailscale.com/download),
log in met hetzelfde account, en open het adres uit `make url`.

Klaar. Vibe coden vanaf de bank.

---

### Hoe het in elkaar zit

```
   jouw laptop / telefoon                        Mac mini
   ┌──────────────────────┐                      ┌────────────────────────────┐
   │ browser              │                      │                            │
   │  ├ bolt.diy UI       │                      │  tailscale serve  :443     │
   │  └ WebContainer      │   WireGuard-tunnel   │        │  HTTPS + echt cert │
   │     (je code draait  │◄────versleuteld─────►│        ▼                    │
   │      hier!)          │                      │  bolt.diy 127.0.0.1:5173    │
   │                      │                      │  (launchd, start vanzelf)  │
   │ Tailscale-client     │                      │        │                    │
   └──────────────────────┘                      │        ▼ API-sleutels       │
                                                 │  Anthropic / OpenAI / ...  │
                                                 └────────────────────────────┘
```

Twee dingen die vaak verrassen:

**De code die je genereert draait in je browser, niet op de Mac mini.**
bolt.diy gebruikt WebContainers — een Node-omgeving in WebAssembly. De Mac mini
serveert alleen de applicatie en bewaart je sleutels. De zwaarste belasting ligt
dus bij het apparaat waarop je zit te werken.

**HTTPS is verplicht, niet optioneel.** WebContainers hebben `SharedArrayBuffer`
nodig, en dat geven browsers alleen vrij in een *cross-origin isolated secure
context*. Over `http://100.x.y.z:5173` laadt de interface wel, maar blijft de
tool hangen bij het opstarten. Vandaar `tailscale serve`: dat levert een echt
Let's Encrypt-certificaat op je `*.ts.net`-naam.

---

### Waarom Tailscale en niet gewoon een poort openzetten

bolt.diy heeft **geen ingebouwde login**. Zet je het op het open internet, dan
kan iedereen die de URL vindt jouw API-sleutels leegtrekken — dat kost echt
geld. Met Tailscale bestaat het adres niet voor de rest van het internet; alleen
apparaten die jij hebt aangemeld kunnen erbij. Inloggen bij Tailscale ís je
login.

Wil je toch een extra wachtwoordprompt erbovenop, dan staat in
[docs/remote-access.md](docs/remote-access.md) hoe je Caddy met basic auth
ertussen zet.

---

### Commando's

```
make preflight   Controleer of deze Mac klaar is (verandert niets)
make setup       Volledige installatie in één keer
make status      Status van server, Tailscale en energie-instellingen
make url         Toon het adres waarop bolt.diy bereikbaar is
make logs        Volg de logs live
make errors      Laatste 50 foutregels
make restart     Herstart (nodig na wijzigen van .env)
make update      Werk bolt.diy bij naar de nieuwste versie
make uninstall   Verwijder de service (je sleutels blijven staan)
```

Stap voor stap installeren kan ook: `make preflight`, `make install`,
`make tailscale`, `make service`, `make power`.

---

### Wat waar staat

Op de Mac mini, na installatie:

```
~/bolt-diy/
├── .env                    ← jouw API-sleutels (chmod 600, staat niet in git)
├── app/                    ← bolt.diy broncode + build
└── logs/                   ← boltdiy.out.log en boltdiy.err.log

~/Library/LaunchAgents/ai.novaclaw.boltdiy.plist
```

In deze repository:

```
bolt-diy-server/
├── .env.example            ← sjabloon voor je sleutels (beide routes)
│
├── cloudflare/             ← ROUTE 1: Cloudflare Pages
│   ├── Makefile
│   ├── scripts/
│   │   ├── bootstrap.sh    ← alles in één keer, met prompts
│   │   ├── 01-prepare.sh   ← ophalen + bouwen
│   │   ├── preview.sh      ← lokaal proefdraaien
│   │   ├── 02-secrets.sh   ← sleutels als Cloudflare secrets
│   │   ├── 03-deploy.sh    ← live zetten
│   │   └── check-bundle.sh ← meet tegen het limiet van 25 MiB
│   └── docs/
│       ├── access-setup.md ← login instellen (verplicht!)
│       └── troubleshooting.md
│
├── Makefile                ← ROUTE 2: bedieningspaneel Mac mini
├── scripts/
│   ├── 00-preflight.sh     ← systeemcontrole
│   ├── 01-install.sh       ← Node + bolt.diy + build
│   ├── 02-tailscale-setup.sh
│   ├── 03-service-install.sh
│   ├── 04-power-settings.sh
│   ├── run-server.sh       ← startcommando dat launchd draait
│   ├── status.sh / update.sh / uninstall.sh
│   └── lib/common.sh       ← gedeelde configuratie
├── launchd/                ← plist-sjabloon
├── docker/                 ← alternatieve installatie met Docker
│
├── shared/                 ← gebruikt door beide routes
│   └── apply-defaults.sh   ← provider, model en antwoordlengte
└── docs/
    ├── openrouter.md       ← OpenRouter, model kiezen, kosten (beide routes)
    ├── security.md         ← wat je zelf moet regelen (beide routes)
    ├── remote-access.md    ← apparaten toevoegen, ACL's, extra wachtwoord
    └── troubleshooting.md  ← als er iets niet werkt
```

---

### Instellingen

De scripts lezen omgevingsvariabelen, met deze standaardwaarden:

| Variabele | Standaard | Betekenis |
|---|---|---|
| `BOLT_ROOT` | `~/bolt-diy` | Installatiemap |
| `BOLT_PORT` | `5173` | Lokale poort |
| `BOLT_BIND` | `127.0.0.1` | Bind-adres — wijzig dit niet zonder reden |
| `BOLT_REF` | `stable` | Branch of tag van bolt.diy |
| `BOLT_NODE_FORMULA` | `node@22` | Node-versie via Homebrew |
| `BOLT_PROVIDER` | `OpenRouter` | Standaardprovider bij het openen |
| `BOLT_MODEL` | `anthropic/claude-3.5-sonnet` | Standaardmodel |
| `BOLT_MAX_TOKENS` | `8000` | Max tokens per antwoord — zie docs/openrouter.md |

Bijvoorbeeld een andere poort:

```bash
export BOLT_PORT=5273
make service && make tailscale
```

---

### Vereisten

- Mac mini met macOS 13 of nieuwer (Apple Silicon of Intel), 8 GB RAM is genoeg
- [Homebrew](https://brew.sh)
- Xcode Command Line Tools (`xcode-select --install`)
- Een gratis [Tailscale](https://tailscale.com)-account
- Een [OpenRouter](https://openrouter.ai/settings/keys)-sleutel (of een andere provider)

`make preflight` controleert dit allemaal voordat er iets geïnstalleerd wordt.

---

## Verder lezen

**Cloudflare Pages:**

- [cloudflare/README.md](cloudflare/README.md) — installatie, bundelmetingen, bijwerken
- [cloudflare/docs/access-setup.md](cloudflare/docs/access-setup.md) — login instellen
- [cloudflare/docs/troubleshooting.md](cloudflare/docs/troubleshooting.md) — als er iets niet werkt

**Mac mini:**

- [docs/remote-access.md](docs/remote-access.md) — apparaten toevoegen, ACL's, basic auth
- [docs/troubleshooting.md](docs/troubleshooting.md) — als er iets niet werkt
- [docker/README.md](docker/README.md) — alternatief met Docker

**Beide:**

- [docs/openrouter.md](docs/openrouter.md) — OpenRouter instellen, model kiezen, kosten beperken
- [docs/security.md](docs/security.md) — sleutels, limieten, wat te doen bij een lek

bolt.diy zelf: [github.com/stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy) (MIT)
