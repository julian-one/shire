import { RecipeController } from '$lib/controllers/recipe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const controller = new RecipeController();
	const recipe = await controller.ById(params.id);
	return {
		recipe
	};
};
