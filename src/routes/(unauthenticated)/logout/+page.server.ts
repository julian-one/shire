import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { AuthController } from '$lib/controllers/auth';
import sessionCache from '$lib/server/session-cache';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const token = cookies.get('TOKEN');
		const auth = new AuthController();
		try {
			await auth.Logout();
		} catch {
			// nothing to do, just delete the cookie
		}
		if (token) sessionCache.evict(token);
		cookies.delete('TOKEN', { path: '/' });

		redirect(303, '/');
	}
};
