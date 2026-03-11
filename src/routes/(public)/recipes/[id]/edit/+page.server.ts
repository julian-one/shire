import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { RecipeController } from '$lib/controllers/recipe';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.session) {
		redirect(302, '/login');
	}

	const controller = new RecipeController();

	try {
		const recipe = await controller.ById(params.id);
		if (locals.user?.user_id !== recipe.user_id) {
			error(403, 'Forbidden');
		}
		return { recipe };
	} catch (e) {
		if (e && typeof e === 'object' && 'status' in e) {
			throw e;
		}
		error(404, 'Not found');
	}
};
