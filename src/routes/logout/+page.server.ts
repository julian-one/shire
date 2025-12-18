import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { logout } from '$lib/server/api';
import { clearSessionCookie, getSessionId } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const sessionId = getSessionId(cookies);

		if (sessionId) {
			try {
				await logout(sessionId);
			} catch {
				// Ignore errors - we'll clear cookies anyway
			}
		}

		clearSessionCookie(cookies);
		throw redirect(302, '/login');
	}
};
