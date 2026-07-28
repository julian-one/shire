import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import axios from 'axios';

export const Moria = axios.create({
	baseURL: env.PUBLIC_MORIA_API_URL ?? 'http://localhost:8081',
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

// Client-side: attach the session token as a Bearer header since the TOKEN cookie
// belongs to the frontend's domain and won't be sent cross-origin to the backend.
// Server-side auth is handled separately in context.server.ts via AsyncLocalStorage.
if (browser) {
	Moria.interceptors.request.use(async (config) => {
		const { page } = await import('$app/state');
		const token = page.data.session?.session_id;
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	});
}
