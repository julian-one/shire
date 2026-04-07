import type { PageServerLoad } from './$types';
import { PostController } from '$lib/controllers/post';
import type { ListOptions } from '$lib/types/post';

export const load: PageServerLoad = async ({ url, locals }) => {
	const post_controller = new PostController();

	const options = {
		search: url.searchParams.get('search') || '',
		my_posts: url.searchParams.get('my_posts') || '',
		order_by: url.searchParams.get('order_by') || ''
	};

	const offset = parseInt(url.searchParams.get('offset') || '0', 10) || 0;

	const has_active_filters = Object.values(options).some((v) => v !== '');

	const list_options: ListOptions = {
		...options,
		offset,
		...((await locals.get_session()) ? {} : { public: true })
	};

	try {
		const result = await post_controller.list(list_options);
		return {
			posts: result.items,
			total: result.total,
			limit: result.limit,
			offset: result.offset,
			...options,
			has_active_filters
		};
	} catch {
		return {
			posts: [],
			total: 0,
			limit: 20,
			offset: 0,
			...options,
			has_active_filters,
			error: 'Failed to load posts'
		};
	}
};
