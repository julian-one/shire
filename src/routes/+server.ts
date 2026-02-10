import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (locals.session) {
		redirect(303, '/profile');
	} else {
		redirect(303, '/login');
	}
};
