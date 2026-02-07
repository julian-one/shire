import { error, redirect } from '@sveltejs/kit';

import { routes } from '$lib/paths';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	if (locals.identity.state === 'unavailable') {
		error(503, 'Sign-in is temporarily unavailable. Try again shortly.');
	}
	if (locals.identity.state !== 'authenticated') {
		redirect(303, routes.login);
	}

	return { user: locals.identity.user };
};
