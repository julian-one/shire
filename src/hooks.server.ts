import { moria } from '$lib/server/moria';
import { sessionCookie } from '$lib/server/session-cookie';

import type { Handle } from '@sveltejs/kit';

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

	return resolve(event);
};
