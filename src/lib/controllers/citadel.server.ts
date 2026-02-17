import { AsyncLocalStorage } from 'node:async_hooks';
import { Citadel } from '$lib/controllers/citadel';

export const CitadelContext = new AsyncLocalStorage<string | undefined>();

// Server-side: attach the TOKEN cookie from the request-scoped AsyncLocalStorage
// context (set in hooks.server.ts). Client-side auth is handled separately in
// citadel.ts via a Bearer header.
Citadel.interceptors.request.use((config) => {
	const token = CitadelContext.getStore();
	if (token) {
		config.headers['Cookie'] = `TOKEN=${token}`;
	}
	return config;
});
