import type { Handle } from '@sveltejs/kit';
import { getSessionId, clearSessionCookie } from '$lib/server/auth';
import { getMe, AuthError } from '$lib/server/api';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = getSessionId(event.cookies);

	if (sessionId) {
		try {
			event.locals.user = await getMe(sessionId);
		} catch (e) {
			if (e instanceof AuthError && e.status === 401) {
				clearSessionCookie(event.cookies);
			}
		}
	}

	return resolve(event);
};
