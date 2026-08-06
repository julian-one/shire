import { redirect } from '@sveltejs/kit';

import { logout } from '$lib/server/moria';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		try {
			await logout(event);
		} catch {
			// Best-effort: clear the browser cookie even if moria is unreachable.
		}
		event.cookies.delete('TOKEN', { path: '/' });
		redirect(303, '/');
	}
};
