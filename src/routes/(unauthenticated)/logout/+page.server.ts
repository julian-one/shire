import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { AuthController } from '$lib/controllers/auth';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const auth = new AuthController();
		try {
			await auth.Logout();
		} catch {
			// nothing to do, just delete the cookie
		}
		cookies.delete('TOKEN', { path: '/' });

		redirect(303, '/');
	}
};
