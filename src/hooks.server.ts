import { error, redirect } from '@sveltejs/kit';

import { moria } from '$lib/server/moria';
import { sessionCookie } from '$lib/server/session-cookie';

import type { Handle } from '@sveltejs/kit';

const protectedRoutes = ['/profile', '/settings'];

export const handle: Handle = async ({ event, resolve }) => {
	const token = sessionCookie.read(event.cookies);
	if (token) {
		event.locals.identity = await moria(event.fetch).me(token);
		if (event.locals.identity.state === 'anonymous') {
			sessionCookie.clear(event.cookies);
		}
	} else {
		event.locals.identity = { state: 'anonymous' };
	}

	const { pathname } = event.url;
	const identity = event.locals.identity;

	if (
		identity.state !== 'authenticated' &&
		protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))
	) {
		if (identity.state === 'unavailable') {
			error(503, 'Sign-in is temporarily unavailable. Try again shortly.');
		}
		redirect(303, '/login');
	}

	if (identity.state === 'authenticated' && pathname === '/login') {
		redirect(303, '/');
	}

	return resolve(event);
};
