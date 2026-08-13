# bolt.diy op de Mac mini — bedieningspaneel.
# Draai `make` voor een overzicht.

SHELL := /bin/bash
S     := ./scripts
LABEL := ai.novaclaw.boltdiy
UID   := $(shell id -u)
LOGS  := $(HOME)/bolt-diy/logs
PLIST := $(HOME)/Library/LaunchAgents/$(LABEL).plist

.DEFAULT_GOAL := help
.PHONY: help preflight install tailscale service power setup start stop restart status logs errors update url uninstall purge

help: ## Toon dit overzicht
	@echo "bolt.diy server — beschikbare commando's:"
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
	@echo
	@echo "Eerste keer? Draai:  make setup"

# --- Installatie ------------------------------------------------------------

preflight: ## Controleer of deze Mac klaar is (verandert niets)
	@$(S)/00-preflight.sh

install: ## Installeer Node + bolt.diy en bouw de app
	@$(S)/01-install.sh

tailscale: ## Richt toegang op afstand in via Tailscale (HTTPS)
	@$(S)/02-tailscale-setup.sh

service: ## Installeer bolt.diy als achtergronddienst (launchd)
	@$(S)/03-service-install.sh

power: ## Zet slaapstand uit zodat de server blijft draaien
	@$(S)/04-power-settings.sh

setup: preflight install tailscale service power ## Volledige installatie in één keer
	@echo
	@$(S)/status.sh

# --- Dagelijks gebruik ------------------------------------------------------

start: ## Start de service
	@test -f "$(PLIST)" || { echo "Service nog niet geinstalleerd — draai: make service"; exit 1; }
	@launchctl bootstrap "gui/$(UID)" "$(PLIST)" 2>/dev/null || true
	@launchctl kickstart "gui/$(UID)/$(LABEL)" && echo "gestart"

# SIGTERM volstaat niet: KeepAlive ziet een niet-nul exit en start meteen
# opnieuw. bootout haalt de job uit launchd, dus die blijft ook echt weg.
stop: ## Stop de service
	@launchctl bootout "gui/$(UID)/$(LABEL)" 2>/dev/null && echo "gestopt" \
		|| echo "was al gestopt"

restart: ## Herstart de service (nodig na wijzigen van .env)
	@launchctl kickstart -k "gui/$(UID)/$(LABEL)" 2>/dev/null && echo "herstart" \
		|| $(MAKE) --no-print-directory start

status: ## Toon de status van server, Tailscale en energie-instellingen
	@$(S)/status.sh

# -F blijft doorlopen als launchd het logbestand net (opnieuw) aanmaakt.
logs: ## Volg de logs live (ctrl-c om te stoppen)
	@mkdir -p $(LOGS) && touch $(LOGS)/boltdiy.out.log $(LOGS)/boltdiy.err.log
	@tail -n 20 -F $(LOGS)/boltdiy.out.log $(LOGS)/boltdiy.err.log

errors: ## Toon de laatste 50 foutregels
	@test -s $(LOGS)/boltdiy.err.log \
		&& tail -n 50 $(LOGS)/boltdiy.err.log \
		|| echo "Geen fouten gelogd."

url: ## Toon het adres waarop bolt.diy bereikbaar is
	@source $(S)/lib/common.sh && bolt_url && echo || echo "Tailscale nog niet ingericht — draai: make tailscale"

update: ## Werk bolt.diy bij naar de nieuwste versie
	@$(S)/update.sh

# --- Opruimen ---------------------------------------------------------------

uninstall: ## Verwijder de service en de Tailscale-proxy (data blijft staan)
	@$(S)/uninstall.sh

purge: ## Verwijder alles, inclusief je API-sleutels
	@$(S)/uninstall.sh --purge
