import { RecipeController } from '$lib/controllers/recipe';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const controller = new RecipeController();

	const options = {
		search: url.searchParams.get('search') || '',
		cuisine: url.searchParams.get('cuisine') || '',
		category: url.searchParams.get('category') || '',
		bookmarks: url.searchParams.get('bookmarks') || '',
		order_by: url.searchParams.get('order_by') || ''
	};

	const offset = parseInt(url.searchParams.get('offset') || '0', 10) || 0;

	try {
		const [result, bookmarked_ids] = await Promise.all([
			controller.list({ ...options, offset }),
			controller.list_bookmarked_ids().catch(() => [] as string[])
		]);

		return {
			recipes: result.items,
			total: result.total,
			limit: result.limit,
			offset: result.offset,
			bookmarked_ids,
			...options
		};
	} catch {
		return {
			recipes: [],
			total: 0,
			limit: 20,
			offset: 0,
			bookmarked_ids: [] as string[],
			...options,
			error: 'Failed to load recipes'
		};
	}
};
