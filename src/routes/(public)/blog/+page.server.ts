import type { PageServerLoad } from './$types';
import { PostController } from '$lib/controllers/post';
import type { ListOptions } from '$lib/types/post';

export const load: PageServerLoad = async ({ url, locals }) => {
	const post_controller = new PostController();

	const search = url.searchParams.get('search') || '';
	const order_by = url.searchParams.get('order_by') || 'created_at:desc';

	const options: ListOptions = {
		search,
		order_by,
		...((await locals.get_session()) ? {} : { public: true })
	};

	try {
		const posts = await post_controller.list(options);
		return {
			posts,
			search,
			order_by
		};
	} catch {
		return {
			posts: [],
			search,
			order_by,
			error: 'Failed to load posts'
		};
	}
};
