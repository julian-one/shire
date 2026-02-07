import { redirect } from '@sveltejs/kit';

import { routes } from '$lib/paths';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	if (locals.identity.state === 'authenticated') {
		redirect(303, routes.home);
	}
};
