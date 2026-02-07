import { fail, redirect } from '@sveltejs/kit';

import { moria } from '$lib/server/moria';
import { sessionCookie } from '$lib/server/session-cookie';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '');
		const password = String(data.get('password') ?? '');

		const result = await moria(fetch).login(email, password);

		if (result.state === 'invalid') {
			return fail(401, { email, error: 'Invalid email or password.' });
		}
		if (result.state === 'unavailable') {
			return fail(503, { email, error: 'Unable to reach the server. Try again.' });
		}

		sessionCookie.issue(cookies, result.token, result.expiresAt);

		redirect(303, '/');
	}
};
