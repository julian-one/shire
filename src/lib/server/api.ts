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
	access_token: string;
	refresh_token: string;
	user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
	const res = await fetch(`${API_BASE}/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});

	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new AuthError(res.status, data.error || 'Invalid credentials');
	}

	return res.json();
}

export async function register(
	username: string,
	email: string,
	password: string
): Promise<AuthResponse> {
	const res = await fetch(`${API_BASE}/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, email, password })
	});

	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new AuthError(res.status, data.error || 'Registration failed');
	}

	return res.json();
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
	const res = await fetch(`${API_BASE}/refresh`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ refresh_token: refreshToken })
	});

	if (!res.ok) {
		throw new AuthError(res.status, 'Token refresh failed');
	}

	return res.json();
}

export async function logout(accessToken: string): Promise<void> {
	await fetch(`${API_BASE}/logout`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${accessToken}` }
	});
}

export async function getMe(accessToken: string): Promise<User> {
	const res = await fetch(`${API_BASE}/me`, {
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	if (!res.ok) {
		throw new AuthError(res.status, 'Failed to get user');
	}

	return res.json();
}
