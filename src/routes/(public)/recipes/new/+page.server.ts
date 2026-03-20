import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!(await locals.get_session())) {
		redirect(302, '/login');
	}
};
