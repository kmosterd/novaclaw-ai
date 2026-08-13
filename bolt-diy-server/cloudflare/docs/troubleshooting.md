# Problemen oplossen — Cloudflare Pages

## De site is open, iedereen kan erbij

Cloudflare Access staat niet (goed) aan. Dit is het enige probleem in dit
document dat geld kost, dus behandel het eerst.

Test in een privévenster: je hoort een Cloudflare-loginpagina te zien, geen
bolt.diy. Zie je de tool meteen, controleer dan in
[one.dash.cloudflare.com](https://one.dash.cloudflare.com) onder
**Access → Applications** of het **Public hostname** exact klopt — zonder
`https://` en zonder afsluitende schuine streep.

Denk ook aan de preview-URL's (`<hash>.novaclaw-bolt.pages.dev`). Die vallen
niet onder een policy op het kale hostname. Zie
[access-setup.md](access-setup.md#let-op-bij-pagesdev).

---

## Blijft hangen op "Booting WebContainer"

De browser krijgt geen cross-origin isolation. Open de console (⌥⌘I) en typ:

```js
crossOriginIsolated   // moet true zijn
```

Is dit `false`, controleer de headers:

```bash
curl -sI https://novaclaw-bolt.pages.dev/ | grep -i cross-origin
```

Verwacht:

```
cross-origin-embedder-policy: require-corp
cross-origin-opener-policy: same-origin
```

bolt.diy zet deze zelf in `app/entry.server.tsx`, dus ze horen er te staan.
Ontbreken ze, dan is de deploy niet goed gegaan of serveert Cloudflare een
gecachete oude versie — doe een nieuwe deploy en probeer het in een privévenster.

Op `*.pages.dev` heb je altijd HTTPS, dus het secure-context-probleem uit de
Mac mini-opzet speelt hier niet.

**Browser:** Chrome of Edge werken het best. Firefox vereist dat
`dom.postMessage.sharedArrayBuffer.withCOOP_COEP` aanstaat; Safari is
wisselvallig.

---

## Deploy geweigerd wegens bundelgrootte

```
Error: Pages Functions bundle size is over the limit of 25.0 MiB
```

Meet eerst waar je staat:

```bash
make check
```

Ter referentie: op `stable` is dit 1,01 MiB gecomprimeerd, oftewel 4 % van de
limiet. Zit je er ineens overheen, dan is er iets fundamenteels veranderd in
bolt.diy. Zie [README.md](../README.md#als-de-bundel-ooit-te-groot-wordt).

---

## `wrangler login` opent geen browser

Werk je op een machine zonder browser, gebruik dan een API-token:

1. Maak een token op
   [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
   met de template **Edit Cloudflare Workers**.
2. Zet hem in je omgeving:

```bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...     # staat rechtsonder in het dashboard
make deploy
```

Zet zo'n token niet in een bestand dat in git belandt.

---

## "Project not found" of de verkeerde projectnaam

De projectnaam komt uit `BOLT_CF_PROJECT`, niet uit `wrangler.toml` (daar staat
`name = "bolt"`, wat we bewust overschrijven met `--project-name`).

```bash
export BOLT_CF_PROJECT=novaclaw-bolt
make deploy
```

Bestaande projecten bekijken:

```bash
cd ~/bolt-diy-cf/app && pnpm exec wrangler pages project list
```

---

## Een model geeft 401 of ontbreekt

De sleutels staan als secrets bij Cloudflare, niet in de bundel. Opnieuw zetten:

```bash
$EDITOR ~/bolt-diy-cf/.env
make secrets
```

Een herdeploy is niet nodig. Controleren welke secrets er staan (waarden zijn
niet leesbaar, dat is de bedoeling):

```bash
cd ~/bolt-diy-cf/app && pnpm exec wrangler pages secret list --project-name=novaclaw-bolt
```

Let op: `02-secrets.sh` slaat lege regels bewust over. Staat er `OPENAI_API_KEY=`
zonder waarde in je `.env`, dan wordt die niet gezet — en ook niet gewist.

---

## Ollama of LM Studio werkt niet

Dat klopt en is niet op te lossen. Een worker draait op Cloudflare's netwerk en
kan niet bij een model op jouw machine. Wil je lokale modellen, gebruik dan de
Mac mini-opzet in de map hierboven.

---

## Een deploy terugdraaien

Via het dashboard: **Workers & Pages → je project → Deployments → ⋯ → Rollback**.
Dat gaat direct en vereist geen nieuwe build.

---

## Live meekijken wat de worker doet

```bash
make logs
```

Toont de verzoeken en eventuele fouten terwijl ze binnenkomen. Handig om te zien
of een API-sleutel wel aankomt.
