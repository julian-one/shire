import { AsyncLocalStorage } from 'node:async_hooks';
import type { InternalAxiosRequestConfig } from 'axios';
import { Citadel } from '$lib/controllers/citadel';
import { Moria } from '$lib/controllers/moria';

export const ApiContext = new AsyncLocalStorage<string | undefined>();

// Server-side: attach the TOKEN cookie from the request-scoped AsyncLocalStorage
// context (set in hooks.server.ts) to both backends. Client-side auth is handled
// separately in citadel.ts and moria.ts via a Bearer header.
const attach_token = (config: InternalAxiosRequestConfig) => {
	const token = ApiContext.getStore();
	if (token) {
		config.headers['Cookie'] = `TOKEN=${token}`;
	}
	return config;
};

Citadel.interceptors.request.use(attach_token);
Moria.interceptors.request.use(attach_token);
