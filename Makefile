.PHONY: dev prod

dev:
	MORIA_API_URL=http://localhost:8080 RIVENDELL_API_URL=http://localhost:8081 npm run dev

prod:
	@kubectl --context stark port-forward svc/moria 8081:80 & pfm=$$!; kubectl --context stark port-forward svc/rivendell 8083:80 & pfr=$$!; trap 'kill $$pfm $$pfr 2>/dev/null' EXIT INT TERM; sleep 1; MORIA_API_URL=http://localhost:8081 RIVENDELL_API_URL=http://localhost:8083 npm run dev
