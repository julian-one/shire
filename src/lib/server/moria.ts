import { env } from '$env/dynamic/private';

import { sessionCookie } from '$lib/server/session-cookie';
import { ROLES, type Identity, type LoginResult, type Role, type SessionToken, type User } from '$lib/types';

const endpoints = {
	health: '/health',
	me: '/me',
	login: '/login',
	logout: '/logout'
} as const;

const unavailable = { state: 'unavailable' } as const;

let base: URL | undefined;

const moriaUrl = (): URL => {
	if (!base) {
		if (!env.MORIA_API_URL) {
			throw new Error('MORIA_API_URL is not set');
		}
		base = new URL(env.MORIA_API_URL);
	}
	return base;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isRole = (value: unknown): value is Role => ROLES.includes(value as Role);

const parseUser = (value: unknown): User | undefined => {
	if (!isRecord(value)) {
		return undefined;
	}
	const { user_id, username, email, role, created_at, updated_at } = value;
	if (
		typeof user_id !== 'string' ||
		typeof username !== 'string' ||
		typeof email !== 'string' ||
		!isRole(role) ||
		typeof created_at !== 'string' ||
		typeof updated_at !== 'string'
	) {
		return undefined;
	}
	return { user_id, username, email, role, created_at, updated_at };
};

const errorMessage = async (response: Response): Promise<string> => {
	const fallback = `moria responded ${response.status}`;
	try {
		const body: unknown = await response.json();
		if (isRecord(body) && typeof body.error === 'string') {
			return body.error;
		}
		return fallback;
	} catch {
		return fallback;
	}
};

const request = async (
	fetch: typeof globalThis.fetch,
	path: string,
	init?: RequestInit
): Promise<Response | undefined> => {
	try {
		return await fetch(new URL(path, moriaUrl()), init);
	} catch (error) {
		console.error(`failed to reach moria for ${path}`, error);
		return undefined;
	}
};

export const moria = (fetch: typeof globalThis.fetch) => ({
	healthy: async (): Promise<boolean> => {
		const response = await request(fetch, endpoints.health, { signal: AbortSignal.timeout(2000) });
		return response?.ok ?? false;
	},

	me: async (token: SessionToken): Promise<Identity> => {
		const response = await request(fetch, endpoints.me, { headers: sessionCookie.forwardHeader(token) });
		if (!response) {
			return unavailable;
		}
		if (response.status === 401) {
			return { state: 'anonymous' };
		}
		if (!response.ok) {
			console.error(`moria rejected ${endpoints.me}`, await errorMessage(response));
			return unavailable;
		}
		const body: unknown = await response.json().catch(() => undefined);
		const user = parseUser(isRecord(body) ? body.user : undefined);
		if (!user) {
			console.error(`moria ${endpoints.me} returned an unrecognised shape`);
			return unavailable;
		}
		return { state: 'authenticated', user };
	},

	login: async (email: string, password: string): Promise<LoginResult> => {
		const credentials = Buffer.from(`${email}:${password}`).toString('base64');
		const response = await request(fetch, endpoints.login, {
			method: 'POST',
			headers: { Authorization: `Basic ${credentials}` }
		});
		if (!response) {
			return unavailable;
		}
		if (response.status === 401) {
			return { state: 'invalid' };
		}
		if (!response.ok) {
			console.error(`moria rejected ${endpoints.login}`, await errorMessage(response));
			return unavailable;
		}
		const body: unknown = await response.json().catch(() => undefined);
		if (!isRecord(body) || typeof body.token !== 'string' || typeof body.expires_at !== 'string') {
			console.error(`moria ${endpoints.login} returned an unrecognised shape`);
			return unavailable;
		}
		const expiresAt = new Date(body.expires_at);
		if (Number.isNaN(expiresAt.getTime())) {
			console.error(`moria ${endpoints.login} returned an unparseable expires_at`);
			return unavailable;
		}
		return { state: 'authenticated', token: body.token as SessionToken, expiresAt };
	},

	logout: async (token: SessionToken): Promise<void> => {
		await request(fetch, endpoints.logout, {
			method: 'POST',
			headers: sessionCookie.forwardHeader(token)
		});
	}
});
