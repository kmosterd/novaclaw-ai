# OpenRouter in bolt.diy

Eén sleutel, één rekening, toegang tot vrijwel elk model. Je kunt per chat
wisselen tussen Claude, GPT, Gemini, DeepSeek of Qwen zonder ergens een nieuw
account te maken.

## Instellen

1. Maak een sleutel op [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys).
2. Zet hem in je sleutelbestand:

   ```bash
   # Cloudflare Pages
   $EDITOR ~/bolt-diy-cf/.env      # OPEN_ROUTER_API_KEY=sk-or-v1-...
   cd bolt-diy-server/cloudflare && make secrets

   # Mac mini
   $EDITOR ~/bolt-diy/.env
   cd bolt-diy-server && make restart
   ```

Dat is alles. De installatiescripts zetten OpenRouter al als standaardprovider,
dus bolt.diy staat er meteen op ingesteld.

## Een model kiezen

Linksboven in bolt.diy staan twee dropdowns: provider en model. De modellenlijst
wordt **live bij OpenRouter opgehaald** en toont per model de prijs en het
contextvenster, ongeveer zo:

```
Anthropic: Claude Sonnet 4.5 - in:$3.00 out:$15.00 - context 200k
```

Die lijst komt van `openrouter.ai/api/v1/models` en heeft geen API-sleutel
nodig, dus hij is ook zichtbaar voordat je een sleutel invult.

**Kies daar een actueel model.** De standaard staat op
`anthropic/claude-3.5-sonnet` omdat dat model in bolt.diy's eigen ingebouwde
lijst staat en dus gegarandeerd werkt, ook als het ophalen van de live lijst
een keer faalt. Het is niet het nieuwste model — dat verandert te snel om in een
script te zetten.

### Je keuze geldt per browser, 30 dagen

bolt.diy bewaart je keuze in cookies:

```ts
Cookies.set('selectedModel', newModel, { expires: 30 });
Cookies.set('selectedProvider', newProvider.name, { expires: 30 });
```

Gevolgen die je merkt:

- Op een **ander apparaat of een andere browser** begin je opnieuw bij de
  standaard uit `BOLT_MODEL`.
- Na **30 dagen** zonder gebruik val je terug op die standaard.
- In een **privévenster** geldt je keuze alleen voor die sessie.

Deel je de tool met anderen, zet dan een goede `BOLT_MODEL` (zie hieronder).
Dan hoeft niemand eerst iets aan te klikken.

### De providerlijst opschonen

bolt.diy registreert 19 providers, ook die waarvoor je geen sleutel hebt. Dat
maakt de dropdown onoverzichtelijk. Zet ze uit via tandwiel → **Providers**;
alleen OpenRouter aanlaten volstaat.

Ook die instelling is per browser — hij gaat naar localStorage en een cookie,
niet naar de server.

## De standaard veranderen

Wil je dat bolt.diy standaard op een ander model opent, geef dan het model-ID op
zoals OpenRouter het noemt (met de `provider/model`-vorm uit de lijst):

```bash
export BOLT_MODEL='anthropic/claude-sonnet-4.5'

# Cloudflare Pages
cd bolt-diy-server/cloudflare && make prepare && make deploy

# Mac mini
cd bolt-diy-server && make update
```

Een verkeerd gespeld ID geeft geen foutmelding bij het bouwen — je ziet het pas
als de eerste chat faalt. Kopieer het ID daarom uit de dropdown in bolt.diy.

Een andere provider dan OpenRouter kan ook:

```bash
export BOLT_PROVIDER=Anthropic BOLT_MODEL=claude-sonnet-4-5
```

## Langere antwoorden toestaan

bolt.diy begrenst elk antwoord op **8000 tokens**, ongeacht wat het model
aankan. Dat staat hardgecodeerd in de OpenRouter-provider en loopt door naar
`maxTokens` in de `streamText`-aanroep.

Je merkt dit bij grote bestanden: het model kapt af, bolt.diy hervat automatisch,
maar maximaal twee keer (`MAX_RESPONSE_SEGMENTS = 2`). Daarna houdt het op en
zie je afgebroken code.

Ophogen:

```bash
export BOLT_MAX_TOKENS=16000

# Cloudflare Pages
cd bolt-diy-server/cloudflare && make prepare && make deploy

# Mac mini
cd bolt-diy-server && make update
```

Let op: dit is de **antwoord**lengte, niet het contextvenster. Je invoer was al
onbeperkt (tot wat het model aankan); alleen het antwoord was gekapt.

**Zet dit niet blind hoog.** Vraag je meer output dan een model ondersteunt, dan
krijg je een API-fout in plaats van een kort antwoord. 16000 is een veilige stap;
boven de 32000 waarschuwt het script je. Werkt een model ineens niet meer nadat
je dit hebt verhoogd, zet het dan terug naar 8000.

De statische modellenlijst in bolt.diy blijft hierbij met rust gelaten. Die
waarden zijn per model gekozen (4096 voor Cohere Command, 8000 voor Grok, 64000
voor de rest) en gelden alleen als het ophalen van de live lijst faalt — daar
blanco een hogere waarde overheen zetten zou een model boven zijn eigen limiet
duwen.

## Waarom hier een patch voor nodig is

bolt.diy kiest zijn standaardprovider zo:

```ts
getDefaultProvider(): BaseProvider {
  return this._providers.values().next().value;   // de eerste die toevallig laadt
}
```

Dat is registratievolgorde, geen instelling. `DEFAULT_MODEL` en de
antwoordlengte staan er hardgecodeerd naast. `shared/apply-defaults.sh` past
alle drie aan; voor de provider wordt de aanroep een opzoeking op naam:

```ts
export const DEFAULT_PROVIDER = llmManager.getProvider('OpenRouter') ?? llmManager.getDefaultProvider();
```

De oorspronkelijke aanroep blijft als terugval staan, zodat de app blijft werken
als de provider ooit hernoemd wordt in plaats van te crashen. De patch draait
automatisch bij elke installatie en update, is idempotent, en meldt het als
bolt.diy de betreffende regels verandert.

## Kosten in de hand houden

OpenRouter werkt met een saldo dat je vooraf opwaardeert — je kunt dus niet voor
verrassingen komen te staan zoals bij een provider die achteraf factureert. Toch
twee dingen doen:

1. Zet een **limiet op de sleutel** zelf (bij het aanmaken, veld *Credit limit*).
   Lekt de sleutel, dan is dat bedrag je maximale schade.
2. Houd [openrouter.ai/activity](https://openrouter.ai/activity) in de gaten na
   de eerste dagen. bolt.diy stuurt bij elke prompt de hele projectcontext mee,
   dus het verbruik per bericht ligt hoger dan bij een gewone chat.

Wordt het te duur, kies dan een goedkoper model in de dropdown — dat kan
midden in een gesprek, zonder iets opnieuw in te stellen.

## Sleutel per persoon in plaats van op de server

Laat `OPEN_ROUTER_API_KEY` leeg en laat iedereen zijn eigen sleutel invullen via
het tandwiel → **Providers** in bolt.diy. Handig als je de tool deelt en niet
wilt dat alles op jouw rekening komt.

Let wel op wat dat technisch is. bolt.diy bewaart zo'n sleutel in een cookie:

```ts
Cookies.set('apiKeys', JSON.stringify(newApiKeys));
```

Een cookie gaat bij **elk verzoek** mee naar de server. De sleutel blijft dus
niet netjes in de browser hangen zoals de term "in de browser opslaan"
suggereert; hij reist alleen niet naar Cloudflare's projectinstellingen. Op je
eigen HTTPS-adres achter Access is dat prima, maar reken er niet op als
isolatiemaatregel tussen gebruikers onderling.

Wil je harde scheiding van rekeningen, geef dan iedereen een eigen OpenRouter-
sleutel mét eigen credit limit — dat is de grens die telt.

## Overzicht: waar staat wat

| Instelling | Waar bewaard | Geldt voor | Herbouw nodig? |
|---|---|---|---|
| Model in de dropdown | Cookie, 30 dagen | Alleen die browser | Nee |
| Provider in de dropdown | Cookie, 30 dagen | Alleen die browser | Nee |
| Providers aan/uit | localStorage + cookie | Alleen die browser | Nee |
| Sleutel via de UI | Cookie | Alleen die browser | Nee |
| `BOLT_MODEL` | In de bundel | Iedereen, als startpunt | Ja |
| `BOLT_PROVIDER` | In de bundel | Iedereen, als startpunt | Ja |
| `BOLT_MAX_TOKENS` | In de bundel | Iedereen | Ja |
| `OPEN_ROUTER_API_KEY` | Cloudflare secret / `.env` | Iedereen die binnenkomt | Nee |
