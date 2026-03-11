import { RecipeController } from '$lib/controllers/recipe';
import type { ListOptions } from '$lib/types/recipe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const controller = new RecipeController();

	const search = url.searchParams.get('search') || '';
	const order_by = url.searchParams.get('order_by') || 'created_at:desc';
	const cuisine = url.searchParams.get('cuisine') || '';
	const category = url.searchParams.get('category') || '';

	const options: ListOptions = {
		search,
		order_by,
		cuisine,
		category
	};

	try {
		const recipes = await controller.List(options);
		return {
			recipes,
			search,
			order_by,
			cuisine,
			category
		};
	} catch {
		return {
			recipes: [],
			search,
			order_by,
			cuisine,
			category,
			error: 'Failed to load recipes'
		};
	}
};
