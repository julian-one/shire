import { Buffer } from 'node:buffer';

import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

import type { Session } from '$lib/types/session';
import type { Role, User } from '$lib/types/user';

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

export function get_session(event: RequestEvent, session_id: string) {
	return moria_fetch<Session>(event, `/sessions/${encodeURIComponent(session_id)}`);
}

export function get_user(event: RequestEvent, user_id: string) {
	return moria_fetch<User>(event, `/users/${encodeURIComponent(user_id)}`);
}

export function list_users(event: RequestEvent) {
	return moria_fetch<{ items: User[]; total: number }>(event, '/users');
}

export function create_user(event: RequestEvent, username: string, email: string, password: string, role: Role) {
	return moria_fetch<User>(event, '/users', {
		method: 'POST',
		body: JSON.stringify({ username, email, password, role })
	});
}

export function update_username(event: RequestEvent, user_id: string, username: string) {
	return moria_fetch<User>(event, `/users/${encodeURIComponent(user_id)}`, {
		method: 'PATCH',
		body: JSON.stringify({ username })
	});
}

export function update_role(event: RequestEvent, user_id: string, role: Role) {
	return moria_fetch<void>(event, `/users/${encodeURIComponent(user_id)}/role`, {
		method: 'PATCH',
		body: JSON.stringify({ role })
	});
}

export function list_sessions(event: RequestEvent, user_id: string) {
	return moria_fetch<{ items: Session[]; total: number }>(event, `/users/${encodeURIComponent(user_id)}/sessions`);
}

export function delete_session(event: RequestEvent, session_id: string) {
	return moria_fetch<void>(event, `/sessions/${encodeURIComponent(session_id)}`, {
		method: 'DELETE'
	});
}

export function delete_user_sessions(event: RequestEvent, user_id: string) {
	return moria_fetch<void>(event, `/users/${encodeURIComponent(user_id)}/sessions`, {
		method: 'DELETE'
	});
}
