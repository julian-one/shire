import type { Handle } from '@sveltejs/kit';

const API_BASE = 'http://localhost:8080';

export const handle: Handle = async ({ event, resolve }) => {
	const accessToken = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');

	if (accessToken) {
		// Validate access token
		const response = await fetch(`${API_BASE}/me`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		if (response.ok) {
			event.locals.user = await response.json();
		} else if (response.status === 401 && refreshToken) {
			// Access token expired, try refresh
			const refreshed = await tryRefresh(refreshToken, event.cookies);
			if (refreshed) {
				event.locals.user = refreshed.user;
			}
		}
	} else if (refreshToken) {
		// No access token but have refresh token
		const refreshed = await tryRefresh(refreshToken, event.cookies);
		if (refreshed) {
			event.locals.user = refreshed.user;
		}
	}

	return resolve(event);
};

async function tryRefresh(
	refreshToken: string,
	cookies: { set: Function; delete: Function }
): Promise<{ user: any } | null> {
	try {
		const response = await fetch(`${API_BASE}/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: refreshToken })
		});

		if (!response.ok) {
			// Refresh failed, clear cookies
			cookies.delete('access_token', { path: '/' });
			cookies.delete('refresh_token', { path: '/' });
			return null;
		}

		const data = await response.json();

		// Update cookies with new tokens
		cookies.set('access_token', data.access_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 5
		});

		cookies.set('refresh_token', data.refresh_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24
		});

		return { user: data.user };
	} catch {
		return null;
	}
}
