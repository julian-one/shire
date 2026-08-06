import { Buffer } from 'node:buffer';

import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

import type { Session } from '$lib/types/session';
import type { User } from '$lib/types/user';

export class MoriaError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

async function moria_fetch<T>(event: RequestEvent, path: string, init: RequestInit = {}): Promise<T> {
	const headers = new Headers(init.headers);
	headers.set('X-Forwarded-For', event.getClientAddress());
	if (init.body) {
		headers.set('Content-Type', 'application/json');
	}

	const token = event.cookies.get('TOKEN');
	if (token) {
		headers.set('Cookie', `TOKEN=${encodeURIComponent(token)}`);
	}

	const response = await fetch((env.MORIA_API_URL ?? 'http://localhost:8081') + path, {
		...init,
		headers
	});
	if (!response.ok) {
		let message = `moria responded ${response.status}`;
		try {
			message = ((await response.json()) as { error?: string }).error ?? message;
		} catch {
			// non-JSON error body
		}
		throw new MoriaError(response.status, message);
	}
	if (response.status === 204) {
		return undefined as T;
	}
	return response.json() as Promise<T>;
}

export function health(event: RequestEvent) {
	return moria_fetch<{ status: string; time: string }>(event, '/health');
}

export function register(event: RequestEvent, username: string, email: string) {
	return moria_fetch<{ email: string; message: string }>(event, '/register', {
		method: 'POST',
		body: JSON.stringify({ username, email })
	});
}

export function verify_registration(event: RequestEvent, code: string) {
	return moria_fetch<{ valid: boolean; token: string; username: string }>(event, '/register/verify', {
		method: 'POST',
		body: JSON.stringify({ token: code })
	});
}

export function complete_registration(event: RequestEvent, code: string, password: string) {
	return moria_fetch<Session>(event, '/register/complete', {
		method: 'POST',
		body: JSON.stringify({ token: code, password })
	});
}

export function login(event: RequestEvent, identifier: string, password: string) {
	return moria_fetch<Session>(event, '/login', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${Buffer.from(`${identifier}:${password}`).toString('base64')}`
		}
	});
}

export function logout(event: RequestEvent) {
	return moria_fetch<void>(event, '/logout', { method: 'POST' });
}

export function forgot_password(event: RequestEvent, email: string) {
	return moria_fetch<{ message: string }>(event, '/forgot-password', {
		method: 'POST',
		body: JSON.stringify({ email })
	});
}

export function reset_password(event: RequestEvent, token: string, password: string) {
	return moria_fetch<{ message: string }>(event, '/reset-password', {
		method: 'POST',
		body: JSON.stringify({ token, password })
	});
}

export function get_session(event: RequestEvent, session_id: string) {
	return moria_fetch<Session>(event, `/sessions/${encodeURIComponent(session_id)}`);
}

export function get_user(event: RequestEvent, user_id: string) {
	return moria_fetch<User>(event, `/users/${encodeURIComponent(user_id)}`);
}
