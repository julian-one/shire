import { RecipeController } from '$lib/controllers/recipe';
import type { LayoutServerLoad } from './$types';
import type { Bookmark } from '$lib/types/recipe';

export const load: LayoutServerLoad = async () => {
	const controller = new RecipeController();
	let user_bookmarks: Bookmark[] = [];

	try {
		user_bookmarks = await controller.list_bookmarks();
	} catch {
		// Silently fail — non-critical data or user not logged in
	}

	return {
		user_bookmarks
	};
};
