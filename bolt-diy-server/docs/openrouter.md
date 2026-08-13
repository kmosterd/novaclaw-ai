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

## Waarom hier een patch voor nodig is

bolt.diy kiest zijn standaardprovider zo:

```ts
getDefaultProvider(): BaseProvider {
  return this._providers.values().next().value;   // de eerste die toevallig laadt
}
```

Dat is registratievolgorde, geen instelling. `DEFAULT_MODEL` staat er
hardgecodeerd naast. `shared/set-default-provider.sh` vervangt die twee regels
door een opzoeking op naam:

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
het tandwiel → **Providers** in bolt.diy. Die blijft dan in de browser van die
persoon en raakt de server niet. Handig als je de tool deelt en niet wilt dat
alles op jouw rekening komt.
