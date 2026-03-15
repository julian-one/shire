import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!(await locals.getSession())) {
		redirect(302, '/login');
	}
};
