import { env } from '$env/dynamic/private';

import { sessionCookie, type SessionToken } from '$lib/server/session-cookie';
import type { User } from '$lib/types';

export type Identity = { state: 'authenticated'; user: User } | { state: 'anonymous' } | { state: 'unavailable' };

export type LoginResult =
	| { state: 'authenticated'; token: SessionToken; expiresAt: Date }
	| { state: 'invalid' }
	| { state: 'unavailable' };

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

const parseUser = (value: unknown): User | undefined => {
	if (!isRecord(value)) {
		return undefined;
	}
	const { user_id, username, email, role, created_at, updated_at } = value;
	if (
		typeof user_id !== 'string' ||
		typeof username !== 'string' ||
		typeof email !== 'string' ||
		(role !== 'admin' && role !== 'user') ||
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

export const moria = (fetch: typeof globalThis.fetch) => ({
	me: async (token: SessionToken): Promise<Identity> => {
		let response: Response;
		try {
			response = await fetch(new URL('/me', moriaUrl()), {
				headers: sessionCookie.forwardHeader(token)
			});
		} catch (error) {
			console.error('failed to reach moria for /me', error);
			return { state: 'unavailable' };
		}
		if (response.status === 401) {
			return { state: 'anonymous' };
		}
		if (!response.ok) {
			console.error('moria rejected /me', await errorMessage(response));
			return { state: 'unavailable' };
		}
		const body: unknown = await response.json().catch(() => undefined);
		const user = parseUser(isRecord(body) ? body.user : undefined);
		if (!user) {
			console.error('moria /me returned an unrecognised shape');
			return { state: 'unavailable' };
		}
		return { state: 'authenticated', user };
	},

	login: async (email: string, password: string): Promise<LoginResult> => {
		const credentials = Buffer.from(`${email}:${password}`).toString('base64');
		let response: Response;
		try {
			response = await fetch(new URL('/login', moriaUrl()), {
				method: 'POST',
				headers: { Authorization: `Basic ${credentials}` }
			});
		} catch (error) {
			console.error('failed to reach moria for /login', error);
			return { state: 'unavailable' };
		}
		if (response.status === 401) {
			return { state: 'invalid' };
		}
		if (!response.ok) {
			console.error('moria rejected /login', await errorMessage(response));
			return { state: 'unavailable' };
		}
		const body: unknown = await response.json().catch(() => undefined);
		if (!isRecord(body) || typeof body.token !== 'string' || typeof body.expires_at !== 'string') {
			console.error('moria /login returned an unrecognised shape');
			return { state: 'unavailable' };
		}
		const expiresAt = new Date(body.expires_at);
		if (Number.isNaN(expiresAt.getTime())) {
			console.error('moria /login returned an unparseable expires_at');
			return { state: 'unavailable' };
		}
		return { state: 'authenticated', token: body.token as SessionToken, expiresAt };
	},

	logout: async (token: SessionToken): Promise<void> => {
		try {
			await fetch(new URL('/logout', moriaUrl()), {
				method: 'POST',
				headers: sessionCookie.forwardHeader(token)
			});
		} catch (error) {
			console.error('failed to logout against moria', error);
		}
	},

	healthy: async (): Promise<boolean> => {
		try {
			const response = await fetch(new URL('/health', moriaUrl()), {
				signal: AbortSignal.timeout(2000)
			});
			return response.ok;
		} catch {
			return false;
		}
	}
});
