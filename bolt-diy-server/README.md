# bolt.diy op de Mac mini

Zelf gehoste [bolt.diy](https://github.com/stackblitz-labs/bolt.diy) — de open
source variant van bolt.new — op een Mac mini, veilig bereikbaar vanaf je
laptop of telefoon waar je ook bent.

Geen poorten open in je router, geen wachtwoord dat geraden kan worden, en je
API-sleutels blijven op je eigen machine.

---

## Snel starten

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

## Hoe het in elkaar zit

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

## Waarom Tailscale en niet gewoon een poort openzetten

bolt.diy heeft **geen ingebouwde login**. Zet je het op het open internet, dan
kan iedereen die de URL vindt jouw API-sleutels leegtrekken — dat kost echt
geld. Met Tailscale bestaat het adres niet voor de rest van het internet; alleen
apparaten die jij hebt aangemeld kunnen erbij. Inloggen bij Tailscale ís je
login.

Wil je toch een extra wachtwoordprompt erbovenop, dan staat in
[docs/remote-access.md](docs/remote-access.md) hoe je Caddy met basic auth
ertussen zet.

---

## Commando's

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

## Wat waar staat

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
├── Makefile                ← bedieningspaneel
├── .env.example            ← sjabloon voor je sleutels
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
└── docs/
    ├── remote-access.md    ← apparaten toevoegen, ACL's, extra wachtwoord
    ├── troubleshooting.md  ← als er iets niet werkt
    └── security.md         ← wat je zelf moet regelen
```

---

## Instellingen

De scripts lezen omgevingsvariabelen, met deze standaardwaarden:

| Variabele | Standaard | Betekenis |
|---|---|---|
| `BOLT_ROOT` | `~/bolt-diy` | Installatiemap |
| `BOLT_PORT` | `5173` | Lokale poort |
| `BOLT_BIND` | `127.0.0.1` | Bind-adres — wijzig dit niet zonder reden |
| `BOLT_REF` | `stable` | Branch of tag van bolt.diy |
| `BOLT_NODE_FORMULA` | `node@22` | Node-versie via Homebrew |

Bijvoorbeeld een andere poort:

```bash
export BOLT_PORT=5273
make service && make tailscale
```

---

## Vereisten

- Mac mini met macOS 13 of nieuwer (Apple Silicon of Intel), 8 GB RAM is genoeg
- [Homebrew](https://brew.sh)
- Xcode Command Line Tools (`xcode-select --install`)
- Een gratis [Tailscale](https://tailscale.com)-account
- Minstens één API-sleutel (Anthropic, OpenAI, of een andere provider)

`make preflight` controleert dit allemaal voordat er iets geïnstalleerd wordt.

---

## Verder lezen

- [docs/remote-access.md](docs/remote-access.md) — apparaten toevoegen, ACL's, basic auth
- [docs/troubleshooting.md](docs/troubleshooting.md) — als er iets niet werkt
- [docs/security.md](docs/security.md) — sleutels, limieten, FileVault
- [docker/README.md](docker/README.md) — alternatief met Docker

bolt.diy zelf: [github.com/stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy) (MIT)
