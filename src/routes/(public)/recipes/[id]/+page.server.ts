import { RecipeController } from '$lib/controllers/recipe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const controller = new RecipeController();
	await parent();

	const recipe = await controller.by_id(params.id);

	let recipe_reviews: Awaited<ReturnType<typeof controller.list_recipe_reviews>> = [];

	try {
		recipe_reviews = await controller.list_recipe_reviews(params.id);
	} catch {
		// Silently fail — non-critical data
	}

	return {
		recipe,
		recipe_reviews
	};
};
