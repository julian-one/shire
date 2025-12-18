import { API_BASE } from './auth';
import type { User } from '$lib/types/user';

export class AuthError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
		this.name = 'AuthError';
	}
}

export interface AuthResponse {
	user_id: number;
	username: string;
	email: string;
}

function extractSessionId(setCookie: string | null): string {
	if (!setCookie) throw new AuthError(500, 'No session cookie received');
	const match = setCookie.match(/session_id=([^;]+)/);
	if (!match) throw new AuthError(500, 'Invalid session cookie format');
	return match[1];
}

export async function login(
	email: string,
	password: string
): Promise<{ user: AuthResponse; sessionId: string }> {
	const res = await fetch(`${API_BASE}/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});

	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new AuthError(res.status, data.error || 'Invalid credentials');
	}

	const sessionId = extractSessionId(res.headers.get('set-cookie'));
	const user = await res.json();

	return { user, sessionId };
}

export async function register(
	username: string,
	email: string,
	password: string
): Promise<{ user: AuthResponse; sessionId: string }> {
	const res = await fetch(`${API_BASE}/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, email, password })
	});

	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new AuthError(res.status, data.error || 'Registration failed');
	}

	const sessionId = extractSessionId(res.headers.get('set-cookie'));
	const user = await res.json();

	return { user, sessionId };
}

export async function logout(sessionId: string): Promise<void> {
	await fetch(`${API_BASE}/logout`, {
		method: 'POST',
		headers: { Cookie: `session_id=${sessionId}` }
	});
}

export async function getMe(sessionId: string): Promise<User> {
	const res = await fetch(`${API_BASE}/me`, {
		headers: { Cookie: `session_id=${sessionId}` }
	});

	if (!res.ok) {
		throw new AuthError(res.status, 'Failed to get user');
	}

	return res.json();
}
