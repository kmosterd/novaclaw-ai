# Problemen oplossen

Begin altijd hier:

```bash
make status
make errors
```

---

## De pagina blijft hangen op "Booting WebContainer" / lege chat

Bijna altijd hetzelfde: de browser krijgt geen **cross-origin isolation** en
weigert daarom `SharedArrayBuffer`.

**Controleer eerst welke URL je gebruikt.** Het moet de HTTPS-naam zijn:

- ✅ `https://mac-mini.jouw-tailnet.ts.net`
- ❌ `http://100.101.102.103:5173` (kaal Tailscale-IP, geen secure context)
- ❌ `http://mac-mini.local:5173`

Open de JavaScript-console (⌥⌘I) en typ:

```js
crossOriginIsolated   // moet true zijn
```

Is dit `false`, controleer dan of de headers doorkomen:

```bash
curl -sI https://<jouw-adres>/ | grep -i cross-origin
```

Verwacht:

```
cross-origin-embedder-policy: require-corp
cross-origin-opener-policy: same-origin
```

Ontbreken ze, dan zit er iets tussen dat ze wegfiltert — een extra
reverse proxy, een bedrijfs-VPN of een browserextensie. Test in een privévenster
met extensies uit.

**Browser.** WebContainers werken het best in Chrome of Edge. Safari is
wisselvallig; Firefox vereist dat `dom.postMessage.sharedArrayBuffer.withCOOP_COEP`
aan staat.

---

## `tailscale serve` geeft een certificaatfout

HTTPS-certificaten staan uit voor je tailnet. Dat is een eenmalige instelling:

1. Ga naar [login.tailscale.com/admin/dns](https://login.tailscale.com/admin/dns)
2. Zet **MagicDNS** aan
3. Zet **HTTPS Certificates** aan
4. Draai `scripts/02-tailscale-setup.sh` opnieuw

Het eerste certificaat kan een halve minuut duren.

---

## De service start niet

```bash
make errors
launchctl print gui/$(id -u)/ai.novaclaw.boltdiy | head -n 40
```

**"node: command not found"** — de `PATH` in de plist klopt niet meer, meestal
na een Homebrew-upgrade. Opnieuw genereren:

```bash
make service
```

**"Cannot find module" of "build not found"** — de build ontbreekt of is stuk:

```bash
cd ~/bolt-diy/app && pnpm install --frozen-lockfile && pnpm run build
make restart
```

**Meteen weer weg na starten** — `KeepAlive` probeert het elke 10 seconden
opnieuw, wat de logs snel laat vollopen. Zet hem stil terwijl je zoekt:

```bash
launchctl bootout gui/$(id -u)/ai.novaclaw.boltdiy
```

en draai het startcommando handmatig om de fout direct te zien:

```bash
./scripts/run-server.sh
```

---

## Poort 5173 is bezet

```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN
```

Draaide er nog een oude handmatige `pnpm dev`? Stop die. Wil je een andere
poort, zet dan `BOLT_PORT` en installeer de service en de proxy opnieuw:

```bash
export BOLT_PORT=5273
make service
make tailscale
```

---

## Na een herstart van de Mac mini is de server weg

De service is een **LaunchAgent** en draait binnen jouw gebruikerssessie. Zonder
ingelogde gebruiker start hij niet.

Zet automatisch inloggen aan: Systeeminstellingen > Gebruikers en groepen >
Automatisch inloggen. Dit kan **niet** met FileVault aan — dat is een echte
afweging: FileVault beschermt je schijf als de machine gestolen wordt,
automatisch inloggen zorgt dat de server na een stroomstoring vanzelf terugkomt.

Wil je FileVault houden, dan moet je na elke herstart één keer handmatig
inloggen (mag ook via Schermdeling over Tailscale).

Controleer ook of de slaapstand echt uit staat:

```bash
pmset -g custom | grep -E '^\s+sleep'    # moet 0 zijn
make power                               # zet het goed
```

---

## Modellen ontbreken of geven een 401

De sleutels komen uit `~/bolt-diy/.env`. Na wijzigen is een herstart nodig:

```bash
$EDITOR ~/bolt-diy/.env
make restart
```

Controleer dat de sleutel echt is meegegeven (waarden worden niet getoond):

```bash
grep -c '^[A-Z_]*API_KEY=..*' ~/bolt-diy/.env
```

Je kunt sleutels ook per gebruiker in de bolt.diy-UI zetten (tandwiel >
Providers). Die blijven in de browser en raken de server niet.

---

## Alles is traag

bolt.diy stuurt bij elke prompt veel context mee. Op een 8 GB Mac mini kan
`wrangler` samen met een browser krap zitten.

```bash
top -l 1 -o mem | head -n 15
```

Wat helpt: minder tabbladen met bolt.diy open, `DEFAULT_NUM_CTX` verlagen in
`~/bolt-diy/.env`, of een kleiner model kiezen. Merk op dat de zwaarste
belasting bij de **browser** ligt, niet bij de Mac mini — de WebContainer draait
op het apparaat waarop je zit te werken.

---

## Terug naar de vorige versie

`make update` draait een mislukte build zelf terug. Wil je handmatig terug:

```bash
cd ~/bolt-diy/app
git log --oneline -10
git checkout <commit>
pnpm install --frozen-lockfile && pnpm run build
make restart
```

---

## Opnieuw beginnen

```bash
make uninstall     # service en proxy weg, ~/bolt-diy blijft (incl. sleutels)
make purge         # alles weg, ook je sleutels
```
