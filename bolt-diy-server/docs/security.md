# Beveiliging

Geldt voor beide routes. De secties over `pmset`, FileVault en het LAN slaan
alleen op de Mac mini-opzet.

## Cloudflare Pages in het kort

| Maatregel | Waarom |
|---|---|
| Cloudflare Access ervoor | bolt.diy heeft géén eigen login; zonder Access staat je site open |
| Access ook op `*.<project>.pages.dev` | Preview-URL's vallen niet onder een policy op het kale hostname |
| Sleutels als **secret**, niet als variable | Versleuteld opgeslagen en niet terug te lezen in het dashboard |
| Sleutels niet in de bundel | `01-prepare.sh` bouwt met een lege `.env.local` |

Het gevaarlijke moment is tussen de eerste deploy en het aanzetten van Access.
Doe die twee direct achter elkaar en test in een privévenster.

## Wat de Mac mini-opzet afdekt

| Maatregel | Waarom |
|---|---|
| bolt.diy luistert op `127.0.0.1` | Niet bereikbaar vanaf je LAN, ook niet vanaf een gast op je wifi |
| Geen poorten open in de router | Geen aanvalsoppervlak op het publieke internet |
| Tailscale (WireGuard) | Verkeer versleuteld, alleen jouw aangemelde apparaten komen erbij |
| HTTPS via `tailscale serve` | Echt certificaat; ook nodig om WebContainers te laten werken |
| `.env` met `chmod 600` | Alleen jouw gebruiker leest de API-sleutels |
| `.gitignore` op `.env` en logs | Sleutels belanden niet per ongeluk in git |

## Waar je zelf op moet letten

### API-sleutels zijn geld

Iedereen die bolt.diy kan bereiken kan tokens verstoken op jouw rekening. Dat is
de belangrijkste reden om dit niet publiek te zetten.

- Zet een **maandlimiet** in bij Anthropic en OpenAI. Dit is de enige harde
  bovengrens die je hebt.
- Gebruik een **aparte sleutel** voor deze server, zodat je hem kunt intrekken
  zonder de rest te raken.
- Wil je per persoon afrekenen: laat de sleutels leeg in `~/bolt-diy/.env` en
  laat iedereen zijn eigen sleutel invullen in de bolt.diy-UI (tandwiel >
  Providers). Die blijft in de browser van die persoon.

### Wie er op je tailnet zit

Standaard mag elk apparaat in je tailnet bij elk ander apparaat. Deel je het
tailnet met anderen, beperk dat dan met ACL's — zie
[remote-access.md](remote-access.md#acls--beperk-welke-apparaten-erbij-mogen).

### Gegenereerde code draait in jouw browser

WebContainers voeren de code uit in een sandbox in je browser, niet op de Mac
mini. Dat is prettig — een LLM-fout kan je server niet slopen. Maar: een
`npm install` binnen bolt.diy haalt wel echte pakketten op. Bekijk wat er
geïnstalleerd wordt voordat je het klakkeloos laat draaien.

### Tokens voor GitHub en deploys

Zet je `VITE_GITHUB_ACCESS_TOKEN` of `VITE_VERCEL_ACCESS_TOKEN` in `.env`, dan
kan iedereen die bij bolt.diy kan ook namens jou pushen en deployen. Gebruik
fine-grained tokens met alleen de repositories die je nodig hebt.

### FileVault versus automatisch opstarten

Automatisch inloggen (nodig om na een stroomstoring vanzelf terug te komen)
werkt niet met FileVault. Staat de Mac mini ergens veilig, dan is automatisch
inloggen een redelijke keuze. Staat hij op een gedeelde plek, kies dan
FileVault en accepteer dat je na een herstart één keer moet inloggen.

## Onderhoud

Mac mini:

```bash
make update     # bolt.diy bijwerken (draait zichzelf terug bij een fout)
brew upgrade    # Node en Tailscale bijwerken
```

Cloudflare Pages:

```bash
cd cloudflare && make prepare && make deploy
```

Een keer per maand is voor beide ruim voldoende.

## Sleutel gelekt — wat nu

1. Trek de sleutel in bij de provider (Anthropic/OpenAI console).
2. Maak een nieuwe aan en zet die in je sleutelbestand:
   - Mac mini: `~/bolt-diy/.env`, daarna `make restart`
   - Cloudflare: `~/bolt-diy-cf/.env`, daarna `cd cloudflare && make secrets`
3. Controleer je verbruik van de afgelopen dagen op onverwachte pieken.

Is de sleutel in git beland: intrekken is het enige dat helpt. Een commit
terugdraaien haalt hem niet uit de geschiedenis van iedereen die al gekloond
had.
