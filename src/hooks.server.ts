import { redirect, type Handle } from '@sveltejs/kit';

import { get_session, get_user } from '$lib/server/moria';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('TOKEN');
	if (token) {
		try {
			const session = await get_session(event, token);
			event.locals.session = session;
			event.locals.user = await get_user(event, session.user_id);
		} catch {
			event.cookies.delete('TOKEN', { path: '/' });
		}
	}

	// Default-deny: only (unauthenticated) routes and the landing page are
	// public. Unknown routes get the same redirect, so nothing is enumerable.
	const is_public = event.route.id?.includes('(unauthenticated)') === true || event.url.pathname === '/';
	if (!is_public && !event.locals.session) {
		redirect(302, '/login');
	}

	return resolve(event);
};
