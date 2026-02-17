import type { PageServerLoad } from './$types';
import { UserController } from '$lib/controllers/user';
import type { ListOptions } from '$lib/types/user';

export const load: PageServerLoad = async ({ url }) => {
	const user_controller = new UserController();

	const search = url.searchParams.get('search') || '';
	const role = url.searchParams.get('role') || '';
	const order_by = url.searchParams.get('order_by') || 'created_at:desc';

	const options: ListOptions = {
		search,
		role,
		order_by
	};

	try {
		const users = await user_controller.List(options);
		return {
			users,
			search,
			role,
			order_by
		};
	} catch {
		return {
			users: [],
			search,
			role,
			order_by,
			error: 'Failed to load users'
		};
	}
};
