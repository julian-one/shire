import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import axios from 'axios';

export const Citadel = axios.create({
	baseURL: env.PUBLIC_CITADEL_API_URL ?? 'http://localhost:8080',
	headers: {
		'Content-Type': 'application/json',
		'Cache-Control': 'no-cache',
		Accept: '*/*'
	},
	withCredentials: true,
	paramsSerializer: {
		indexes: null
	}
});

// Add a request interceptor to include the TOKEN cookie for server-side requests
Citadel.interceptors.request.use(async (config) => {
	if (!browser) {
		const { CitadelContext } = await import('$lib/controllers/citadel.server');
		const token = CitadelContext.getStore();
		if (token) {
			config.headers['Cookie'] = `TOKEN=${token}`;
		}
	}
	return config;
});
