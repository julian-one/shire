import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { AuthController } from '$lib/controllers/auth';
import { SessionStore } from '$lib/server/session';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const token = cookies.get('TOKEN');
		const auth = new AuthController();
		try {
			await auth.logout();
		} catch {
			// nothing to do, just delete the cookie
		}
		if (token) SessionStore.evict(token);
		cookies.delete('TOKEN', { path: '/' });

		redirect(303, '/');
	}
};
