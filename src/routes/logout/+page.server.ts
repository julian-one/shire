import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { logout } from '$lib/server/api';
import { clearAuthCookies, getAccessToken } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const accessToken = getAccessToken(cookies);

		if (accessToken) {
			try {
				await logout(accessToken);
			} catch {
				// Ignore errors - we'll clear cookies anyway
			}
		}

		clearAuthCookies(cookies);
		throw redirect(302, '/login');
	}
};
