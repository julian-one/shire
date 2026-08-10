import { Buffer } from 'node:buffer';

import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

import type { ProbeResult, ProbeSpec } from '$lib/types/probe';

// Non-UUID sentinel: can never collide with a real row, so bogus-id probes
// (including the DELETEs, which 204 on zero rows) are structurally harmless.
const BOGUS_ID = 'probe-nonexistent';

interface Probe extends ProbeSpec {
	request_path: (own_user_id: string) => string;
	// Off by default so the logout probe can never destroy the real session.
	forward_token?: boolean;
	body?: Record<string, string>;
	basic_auth?: { identifier: string; password: string };
}

const PROBES: Probe[] = [
	{
		id: 'health',
		method: 'GET',
		path: '/health',
		description: 'Plain health check',
		expect: 200,
		request_path: () => '/health'
	},
	{
		id: 'login',
		method: 'POST',
		path: '/login',
		description: 'Invalid credentials are rejected',
		expect: 401,
		request_path: () => '/login',
		basic_auth: { identifier: 'probe', password: 'probe' }
	},
	{
		id: 'logout',
		method: 'POST',
		path: '/logout',
		description: 'Best-effort logout without a token',
		expect: 204,
		request_path: () => '/logout'
	},
	{
		id: 'list_users',
		method: 'GET',
		path: '/users',
		description: 'List users with the admin session',
		expect: 200,
		request_path: () => '/users',
		forward_token: true
	},
	{
		id: 'get_user',
		method: 'GET',
		path: '/users/{id}',
		description: 'Fetch your own user',
		expect: 200,
		request_path: (own_user_id) => `/users/${encodeURIComponent(own_user_id)}`,
		forward_token: true
	},
	{
		id: 'update_user',
		method: 'PATCH',
		path: '/users/{id}',
		description: 'Empty username is rejected',
		expect: 400,
		request_path: () => `/users/${BOGUS_ID}`,
		forward_token: true,
		body: {}
	},
	{
		id: 'update_password',
		method: 'PATCH',
		path: '/users/{id}/password',
		description: 'Password change is self-only',
		expect: 403,
		request_path: () => `/users/${BOGUS_ID}/password`,
		forward_token: true,
		body: { new_password: 'probe' }
	},
	{
		id: 'update_role',
		method: 'PATCH',
		path: '/users/{id}/role',
		description: 'Invalid role is rejected',
		expect: 400,
		request_path: () => `/users/${BOGUS_ID}/role`,
		forward_token: true,
		body: { role: 'invalid' }
	},
	{
		id: 'get_session',
		method: 'GET',
		path: '/sessions/{id}',
		description: 'Unknown session is not found',
		expect: 404,
		request_path: () => `/sessions/${BOGUS_ID}`,
		forward_token: true
	},
	{
		id: 'delete_session',
		method: 'DELETE',
		path: '/sessions/{id}',
		description: 'Deleting an unknown session is a no-op',
		expect: 204,
		request_path: () => `/sessions/${BOGUS_ID}`,
		forward_token: true
	},
	{
		id: 'list_sessions',
		method: 'GET',
		path: '/users/{id}/sessions',
		description: 'Unknown user has no sessions',
		expect: 200,
		request_path: () => `/users/${BOGUS_ID}/sessions`,
		forward_token: true
	},
	{
		id: 'delete_sessions',
		method: 'DELETE',
		path: '/users/{id}/sessions',
		description: 'Deleting sessions of an unknown user is a no-op',
		expect: 204,
		request_path: () => `/users/${BOGUS_ID}/sessions`,
		forward_token: true
	}
];

export function probe_specs(): ProbeSpec[] {
	return PROBES.map(({ id, method, path, description, expect }) => ({
		id,
		method,
		path,
		description,
		expect
	}));
}

// Results cross the devalue serialization boundary as action data, so this
// must never throw and must return plain objects only.
async function run_probe(event: RequestEvent, probe: Probe): Promise<ProbeResult> {
	const headers = new Headers();
	headers.set('X-Forwarded-For', event.getClientAddress());
	if (probe.body) {
		headers.set('Content-Type', 'application/json');
	}
	if (probe.basic_auth) {
		const { identifier, password } = probe.basic_auth;
		headers.set('Authorization', `Basic ${Buffer.from(`${identifier}:${password}`).toString('base64')}`);
	}
	if (probe.forward_token) {
		const token = event.cookies.get('TOKEN');
		if (token) {
			headers.set('Cookie', `TOKEN=${encodeURIComponent(token)}`);
		}
	}

	const start = performance.now();
	try {
		const response = await fetch(
			(env.MORIA_API_URL ?? 'http://localhost:8081') + probe.request_path(event.locals.user?.user_id ?? BOGUS_ID),
			{
				method: probe.method,
				headers,
				body: probe.body ? JSON.stringify(probe.body) : undefined,
				signal: AbortSignal.timeout(5000)
			}
		);
		const duration_ms = Math.round(performance.now() - start);
		const pass = response.status === probe.expect;
		let detail = '';
		if (!pass) {
			try {
				detail = (await response.text()).slice(0, 200);
			} catch {
				// unreadable body
			}
		}
		return { id: probe.id, status: response.status, pass, duration_ms, detail };
	} catch (error) {
		return {
			id: probe.id,
			status: 0,
			pass: false,
			duration_ms: Math.round(performance.now() - start),
			detail: `unreachable: ${error instanceof Error ? error.message : String(error)}`
		};
	}
}

export function run_probes(event: RequestEvent): Promise<ProbeResult[]> {
	return Promise.all(PROBES.map((probe) => run_probe(event, probe)));
}
