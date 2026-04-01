import { RecipeController } from '$lib/controllers/recipe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const controller = new RecipeController();
	const { session } = await parent();

	const recipe = await controller.by_id(params.id);

	let bookmarked = false;
	let recipe_logs: Awaited<ReturnType<typeof controller.list_recipe_logs>> = [];

	if (session) {
		try {
			[bookmarked, recipe_logs] = await Promise.all([
				controller.is_bookmarked(params.id),
				controller.list_recipe_logs(params.id)
			]);
		} catch {
			// Silently fail — non-critical data
		}
	}

	return {
		recipe,
		bookmarked,
		recipe_logs
	};
};
