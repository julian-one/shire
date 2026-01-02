import { API_BASE, getAccessToken, getRefreshToken, setAuthCookies, clearAuthCookies } from '$lib/server/auth';
import { refresh } from '$lib/server/api';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	let accessToken = getAccessToken(cookies);
	const refreshToken = getRefreshToken(cookies);

	if (!accessToken && !refreshToken) {
		throw error(401, 'Unauthorized');
	}

	// If no access token but we have refresh token, try to refresh
	if (!accessToken && refreshToken) {
		try {
			const data = await refresh(refreshToken);
			setAuthCookies(cookies, data.access_token, data.refresh_token);
			accessToken = data.access_token;
		} catch {
			clearAuthCookies(cookies);
			throw error(401, 'Session expired');
		}
	}

	const params = new URLSearchParams();

	const level = url.searchParams.get('level');
	const search = url.searchParams.get('search');
	const start = url.searchParams.get('start');
	const end = url.searchParams.get('end');

	if (level) params.set('level', level);
	if (search) params.set('search', search);
	if (start) params.set('start', start);
	if (end) params.set('end', end);

	const apiUrl = `${API_BASE}/logs/stream${params.toString() ? '?' + params.toString() : ''}`;

	let response = await fetch(apiUrl, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'text/event-stream'
		}
	});

	// If 401 and we have a refresh token, try to refresh and retry
	if (response.status === 401 && refreshToken) {
		try {
			const data = await refresh(refreshToken);
			setAuthCookies(cookies, data.access_token, data.refresh_token);
			accessToken = data.access_token;

			response = await fetch(apiUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: 'text/event-stream'
				}
			});
		} catch {
			clearAuthCookies(cookies);
			throw error(401, 'Session expired');
		}
	}

	if (!response.ok) {
		throw error(response.status, 'Failed to connect to logs stream');
	}

	if (!response.body) {
		throw error(500, 'No response body');
	}

	return new Response(response.body, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
			'X-Accel-Buffering': 'no'
		}
	});
};
