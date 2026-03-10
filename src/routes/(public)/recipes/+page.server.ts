import { RecipeController } from '$lib/controllers/recipe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const controller = new RecipeController();
	const recipes = await controller.List();
	return {
		recipes
	};
};
