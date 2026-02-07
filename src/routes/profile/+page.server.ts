import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.identity.state !== 'authenticated') {
		redirect(303, '/login');
	}

	return { user: locals.identity.user };
};
