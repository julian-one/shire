import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		session: await locals.get_session(),
		user: await locals.get_user(),
		theme: locals.theme
	};
};
