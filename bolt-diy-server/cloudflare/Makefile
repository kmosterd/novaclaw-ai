# bolt.diy op Cloudflare Pages — bedieningspaneel.
# Draai `make` voor een overzicht.

SHELL := /bin/bash
S     := ./scripts

.DEFAULT_GOAL := help
.PHONY: help prepare check preview secrets deploy setup url logs

help: ## Toon dit overzicht
	@echo "bolt.diy op Cloudflare Pages — beschikbare commando's:"
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'
	@echo
	@echo "Eerste keer? Draai:  make setup"
	@echo "Daarna NIET vergeten: login instellen, zie docs/access-setup.md"

prepare: ## Haal bolt.diy op en bouw de bundel
	@$(S)/01-prepare.sh

check: ## Meet de bundel tegen Cloudflare's limiet van 25 MiB
	@$(S)/check-bundle.sh

preview: ## Draai bolt.diy lokaal op http://127.0.0.1:5173 om je sleutel te testen
	@$(S)/preview.sh

secrets: ## Zet je API-sleutels als Cloudflare Pages secrets
	@$(S)/02-secrets.sh

deploy: ## Zet de bundel live op Cloudflare Pages
	@$(S)/03-deploy.sh

setup: prepare secrets deploy ## Volledige installatie in één keer
	@echo
	@echo "Nu nog de login aanzetten — zonder dat staat je site open:"
	@echo "  docs/access-setup.md"

url: ## Toon het adres van je Pages-project
	@source $(S)/lib/common.sh && echo "https://$$BOLT_CF_PROJECT.pages.dev"

logs: ## Volg de live logs van de worker (ctrl-c om te stoppen)
	@source $(S)/lib/common.sh \
		&& cd $$BOLT_CF_APP \
		&& pnpm exec wrangler pages deployment tail --project-name=$$BOLT_CF_PROJECT
