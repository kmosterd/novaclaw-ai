# Toegang op afstand

## Hoe het werkt

```
   jouw laptop / telefoon                        Mac mini (thuis/kantoor)
   ┌──────────────────────┐                      ┌────────────────────────────┐
   │ browser              │                      │                            │
   │  https://mini.<tail> │                      │  tailscale serve  :443     │
   │        │             │   versleutelde       │        │  (HTTPS, echt      │
   │  Tailscale-client ───┼──── WireGuard-────────┼───────►│   Let's Encrypt-   │
   │                      │      tunnel          │        │   certificaat)     │
   └──────────────────────┘                      │        ▼                    │
                                                 │  bolt.diy 127.0.0.1:5173    │
                                                 └────────────────────────────┘
```

Er staat **geen enkele poort open** op je router. Het verkeer loopt door een
WireGuard-tunnel die Tailscale opzet tussen jouw apparaten onderling.

## Wat is hier de "login"?

Je logt in bij **Tailscale**, niet bij bolt.diy. Alleen apparaten die jij hebt
aangemeld bij jouw tailnet kunnen het adres überhaupt bereiken; voor de rest van
het internet bestaat het niet. Dat is sterker dan een wachtwoordveld op een
publieke site: een aanvaller kan geen wachtwoord raden op een deur die hij niet
kan vinden.

bolt.diy zelf heeft geen ingebouwde gebruikersaccounts. Wil je een extra slot,
zie "Extra beveiliging" hieronder.

## Een nieuw apparaat toevoegen

1. Installeer Tailscale: [tailscale.com/download](https://tailscale.com/download)
   (macOS, Windows, Linux, iOS, Android).
2. Log in met **hetzelfde account** als op de Mac mini.
3. Open `https://<naam-van-je-mini>.<jouw-tailnet>.ts.net`.

Het exacte adres krijg je met:

```bash
make url
```

Op iOS en Android moet de Tailscale-VPN actief zijn (schuifje aan) voordat het
adres werkt.

## Waarom HTTPS geen luxe is

bolt.diy draait de code die je genereert in je browser via **WebContainers**.
Die hebben `SharedArrayBuffer` nodig, en browsers geven dat alleen vrij als de
pagina *cross-origin isolated* is — wat weer alleen mag in een **secure
context**: HTTPS of `localhost`.

Gevolg: `http://100.x.y.z:5173` (het kale Tailscale-IP) laadt de interface wel,
maar blijft hangen bij het opstarten van de WebContainer. Gebruik altijd de
`https://...ts.net`-URL.

## Extra beveiliging

### ACL's — beperk welke apparaten erbij mogen

Standaard mag elk apparaat in je tailnet bij elk ander apparaat. Wil je bolt.diy
alleen vanaf je laptop en telefoon bereikbaar maken, gebruik dan tags en een
ACL-regel in de [admin console](https://login.tailscale.com/admin/acls):

```jsonc
{
  "tagOwners": {
    "tag:boltserver": ["autogroup:admin"],
    "tag:trusted":    ["autogroup:admin"]
  },
  "acls": [
    {
      "action": "accept",
      "src":    ["tag:trusted"],
      "dst":    ["tag:boltserver:443"]
    }
  ]
}
```

Wijs daarna `tag:boltserver` toe aan de Mac mini en `tag:trusted` aan je eigen
apparaten (Machines > ⋯ > Edit ACL tags).

### Tailnet lock

Voorkomt dat iemand met toegang tot je Tailscale-account stiekem een nieuw
apparaat toevoegt. Aanzetten via Settings > Tailnet lock. Bewaar de sleutel
buiten je tailnet.

### Basic auth bovenop Tailscale

Wil je per se nog een wachtwoordprompt — bijvoorbeeld omdat er meerdere mensen
op je tailnet zitten die niet allemaal bij bolt.diy mogen — zet dan Caddy
ertussen:

```bash
brew install caddy
caddy hash-password            # noteer de hash
```

`~/bolt-diy/Caddyfile`:

```caddyfile
:5174 {
    basic_auth {
        karsten <PLAK_HIER_DE_HASH>
    }
    reverse_proxy 127.0.0.1:5173 {
        # Deze headers zijn wat WebContainers laat werken. Caddy geeft ze
        # standaard door, maar we zetten ze expliciet zodat een toekomstige
        # wijziging in bolt.diy dit niet stilletjes sloopt.
        header_down Cross-Origin-Embedder-Policy require-corp
        header_down Cross-Origin-Opener-Policy   same-origin
    }
}
```

Start Caddy en laat Tailscale naar 5174 wijzen in plaats van 5173:

```bash
brew services start caddy
tailscale serve --bg --https=443 http://127.0.0.1:5174
```

### Wat je níét moet doen

`tailscale funnel` zet je server op het **open internet**, voor iedereen
bereikbaar, zonder enige login. Bij bolt.diy betekent dat: wildvreemden die op
jouw rekening tokens verstoken bij Anthropic of OpenAI. `make status`
waarschuwt als Funnel per ongeluk aan staat.

Uitzetten:

```bash
tailscale funnel --https=443 off
```
