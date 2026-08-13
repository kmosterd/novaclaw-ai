# Alternatief: bolt.diy in Docker

De hoofdinstallatie draait bolt.diy **native** onder `launchd`. Dat is bewust:
op een Mac mini die als server dient is dat de betrouwbaarste route.

## Waarom native de standaard is

- **Docker Desktop vereist een grafische login.** Herstart de Mac mini en er is
  niemand die inlogt, dan start Docker Desktop niet en dus bolt.diy ook niet.
  `launchd` heeft dat probleem niet.
- **Extra geheugen.** Docker draait op macOS in een Linux-VM. Dat kost al snel
  2 GB voordat bolt.diy ook maar iets doet.
- **bolt.diy is gewoon een Node-app.** De isolatie die een container biedt
  voegt hier weinig toe: de code die je genereert draait sowieso in de browser
  (WebContainers), niet op de server.

## Wanneer Docker wél handig is

- Je draait al meer diensten met Docker Compose op deze machine.
- Je wilt bolt.diy strikt gescheiden houden van de rest van het systeem.
- Je wilt tussen versies wisselen door alleen de image-tag aan te passen.

## Installatie

Docker-engine installeren (Colima is een goede, headless-vriendelijke keuze
zonder Docker Desktop):

```bash
brew install colima docker docker-compose
colima start --cpu 2 --memory 4 --disk 20
brew services start colima      # zodat de VM meestart na een herstart
```

Sleutels en container starten:

```bash
cd bolt-diy-server/docker
cp ~/bolt-diy/.env .env         # of vul .env hier rechtstreeks
chmod 600 .env
docker compose up -d
docker compose logs -f
```

Toegang op afstand werkt precies hetzelfde als bij de native installatie —
Tailscale Serve praat met `127.0.0.1:5173`:

```bash
../scripts/02-tailscale-setup.sh
```

## Beheer

| Actie | Commando |
|---|---|
| Status | `docker compose ps` |
| Logs | `docker compose logs -f` |
| Herstarten | `docker compose restart` |
| Bijwerken | `docker compose pull && docker compose up -d` |
| Stoppen | `docker compose down` |

## Let op bij Apple Silicon

De prebuilt image `ghcr.io/stackblitz-labs/bolt.diy:latest` wordt niet altijd
voor `arm64` gepubliceerd. Krijg je bij het starten een melding over een
platform-mismatch, of is de container extreem traag, controleer dan eerst:

```bash
docker image inspect ghcr.io/stackblitz-labs/bolt.diy:latest --format '{{.Architecture}}'
```

Staat daar `amd64`, dan draait hij onder emulatie. Bouw in dat geval zelf een
native image:

```bash
git clone https://github.com/stackblitz-labs/bolt.diy.git ~/bolt-diy-src
cd ~/bolt-diy-src && git checkout stable
docker build -t bolt-diy:local --target bolt-ai-production .
```

en vervang in `docker-compose.yml` de regel `image:` door `image: bolt-diy:local`.

Gaat dit je te ver: de native installatie heeft dit probleem niet.
