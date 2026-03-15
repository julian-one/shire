import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		session: await locals.getSession(),
		user: await locals.getUser(),
		theme: locals.theme
	};
};
