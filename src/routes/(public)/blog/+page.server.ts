import type { PageServerLoad } from './$types';
import { PostController } from '$lib/controllers/post';
import { UserController } from '$lib/controllers/user';
import type { ListOptions } from '$lib/types/post';
import type { User } from '$lib/types/user';

export const load: PageServerLoad = async ({ url }) => {
	const post_controller = new PostController();
	const user_controller = new UserController();

	const options = {
		search: url.searchParams.get('search') || '',
		authors: url.searchParams.get('authors') || '',
		public: url.searchParams.get('public') || '',
		order_by: url.searchParams.get('order_by') || ''
	};

	const offset = parseInt(url.searchParams.get('offset') || '0', 10) || 0;

	const has_active_filters = Object.values(options).some((v) => v !== '');

	const list_options: ListOptions = {
		...options,
		offset
	};

	let initial_users: User[] = [];
	if (options.authors) {
		const author_ids = options.authors.split(',');
		try {
			const users = await Promise.all(author_ids.map((id) => user_controller.by_id(id)));
			initial_users = users;
		} catch {
			// ignore
		}
	}

	try {
		const result = await post_controller.list(list_options);
		return {
			posts: result.items,
			total: result.total,
			limit: result.limit,
			offset: result.offset,
			initial_users,
			...options,
			has_active_filters
		};
	} catch {
		return {
			posts: [],
			total: 0,
			limit: 20,
			offset: 0,
			initial_users,
			...options,
			has_active_filters,
			error: 'Failed to load posts'
		};
	}
};
