import { redirect } from '@sveltejs/kit';

import { moria } from '$lib/server/moria';
import { sessionCookie } from '$lib/server/session-cookie';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies, fetch }) => {
		const token = sessionCookie.read(cookies);
		if (token) {
			await moria(fetch).logout(token);
		}

		sessionCookie.clear(cookies);
		redirect(303, '/login');
	}
};
