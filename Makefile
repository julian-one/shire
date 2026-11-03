.PHONY: build dev preview

MORIA_URL = http://localhost:8000

build:
	@MORIA_URL='$(MORIA_URL)' npm run build

dev:
	@MORIA_URL='$(MORIA_URL)' npm run dev -- --host

preview:
	@MORIA_URL='$(MORIA_URL)' npm run preview -- --host

