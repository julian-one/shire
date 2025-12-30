import type { Handle } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type { User } from '$lib/types/user';
import {
	setAuthCookies,
	clearAuthCookies,
	getAccessToken,
	getRefreshToken
} from '$lib/server/auth';
import { getMe, refresh, AuthError } from '$lib/server/api';

export const handle: Handle = async ({ event, resolve }) => {
	const accessToken = getAccessToken(event.cookies);
	const refreshToken = getRefreshToken(event.cookies);

	if (accessToken) {
		try {
			event.locals.user = await getMe(accessToken);
		} catch (e) {
			if (e instanceof AuthError && e.status === 401 && refreshToken) {
				const user = await tryRefresh(refreshToken, event.cookies);
				if (user) {
					event.locals.user = user;
				}
			}
		}
	} else if (refreshToken) {
		const user = await tryRefresh(refreshToken, event.cookies);
		if (user) {
			event.locals.user = user;
		}
	}

	return resolve(event);
};

async function tryRefresh(refreshToken: string, cookies: Cookies): Promise<User | null> {
	try {
		const data = await refresh(refreshToken);
		setAuthCookies(cookies, data.access_token, data.refresh_token);
		return data.user;
	} catch {
		clearAuthCookies(cookies);
		return null;
	}
}
