.PHONY: build dev preview test verify image

MORIA_URL = http://localhost:8000

build:
	@MORIA_URL='$(MORIA_URL)' npm run build

dev:
	@MORIA_URL='$(MORIA_URL)' npm run dev -- --host

preview:
	@MORIA_URL='$(MORIA_URL)' npm run preview -- --host

test:
	@MORIA_URL='$(MORIA_URL)' npm run test

verify:
	@npm run lint
	@npm run check
	@MORIA_URL='$(MORIA_URL)' npm run test

image:
	@docker build -t julianone/shire .
