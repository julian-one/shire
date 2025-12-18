import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const API_BASE = 'http://localhost:8080';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const accessToken = cookies.get('access_token');

		// Call backend to invalidate tokens
		if (accessToken) {
			try {
				await fetch(`${API_BASE}/logout`, {
					method: 'POST',
					headers: { Authorization: `Bearer ${accessToken}` }
				});
			} catch {
				// Ignore errors - we'll clear cookies anyway
			}
		}

		// Clear cookies
		cookies.delete('access_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });

		throw redirect(302, '/login');
	}
};
