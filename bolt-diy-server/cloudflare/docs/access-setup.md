# Login instellen met Cloudflare Access

bolt.diy heeft **geen ingebouwde login**. Zodra je het op Pages zet staat het
voor iedereen op internet open — inclusief jouw API-sleutels. Cloudflare Access
zet er een echte loginpagina voor.

Dit is geen optionele afwerking. Doe het **direct na de eerste deploy**, voordat
de URL ergens blijft staan.

## Kosten

Gratis tot 50 gebruikers op het Zero Trust-plan. Voor persoonlijk gebruik betaal
je hier niets voor. Boven de 50 actieve gebruikers is het $7 per gebruiker per
maand, en worden nieuwe gebruikers geweigerd tot je upgradet.

## Instellen

Dit gaat via het dashboard; er is geen script voor omdat het eenmalig is en een
API-token met Zero Trust-rechten zou vereisen.

1. Ga naar [one.dash.cloudflare.com](https://one.dash.cloudflare.com) en kies je
   account. Bij de eerste keer word je door een korte onboarding geleid — kies
   het **Free**-plan en verzin een teamnaam (die wordt
   `<teamnaam>.cloudflareaccess.com`).

2. Ga naar **Access → Applications → Add an application → Self-hosted**.

3. Vul in:

   | Veld | Waarde |
   |---|---|
   | Application name | `bolt.diy` |
   | Session duration | 24 uur (of langer; je logt dan minder vaak in) |
   | Public hostname | `novaclaw-bolt.pages.dev` |

   Gebruik je een eigen (sub)domein, vul dat dan in plaats daarvan in.

4. **Policy toevoegen:**

   | Veld | Waarde |
   |---|---|
   | Policy name | `Alleen ik` |
   | Action | Allow |
   | Include | Emails → `karsten.mosterd@gmail.com` |

   Wil je meer mensen toelaten: voeg extra e-mailadressen toe, of gebruik
   *Emails ending in* met je eigen domein.

5. Bij **Login methods** kun je het laten staan op **One-time PIN** — je krijgt
   dan een code per mail. Wil je met één klik inloggen, koppel dan Google of
   GitHub onder **Settings → Authentication → Login methods**.

6. Opslaan.

## Controleren dat het werkt

Open je Pages-URL in een privévenster. Je hoort nu de Cloudflare-loginpagina te
zien, niet bolt.diy. Zie je de tool meteen, dan pakt de policy het hostname niet
— controleer of het **Public hostname** exact klopt (zonder `https://` en zonder
afsluitende schuine streep).

Doe deze test echt. Een verkeerd getypte hostname geeft geen foutmelding; het
resultaat is stilletjes een open site.

## Let op bij `*.pages.dev`

Cloudflare maakt bij elke deploy ook een preview-URL aan, in de vorm
`<hash>.novaclaw-bolt.pages.dev`. Die valt **niet** onder een policy die alleen
op `novaclaw-bolt.pages.dev` staat.

Voeg daarom een tweede applicatie toe met als hostname `*.novaclaw-bolt.pages.dev`
en dezelfde policy. Anders is elke oude deploy een achterdeur zonder login.

Alternatief: zet preview-deployments helemaal uit onder
**Workers & Pages → je project → Settings → Builds & deployments →
Preview deployments → Disabled**.

## Sleutels intrekken als er toch iets misgaat

Ging de URL rond voordat Access aanstond? Ga ervan uit dat je sleutels gezien
zijn:

1. Trek ze in bij de provider (Anthropic/OpenAI console).
2. Maak nieuwe aan en zet ze opnieuw: `./scripts/02-secrets.sh`
3. Controleer je verbruik van de afgelopen dagen.
