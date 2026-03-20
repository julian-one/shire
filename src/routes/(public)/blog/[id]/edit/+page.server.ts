import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { PostController } from '$lib/controllers/post';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!(await locals.get_session())) {
		redirect(302, '/login');
	}

	const post_controller = new PostController();

	try {
		const post = await post_controller.by_id(params.id);
		const user = await locals.get_user();
		if (user?.user_id !== post.user_id) {
			error(403, 'Forbidden');
		}
		return { post };
	} catch (e) {
		if (e && typeof e === 'object' && 'status' in e) {
			throw e;
		}
		return {
			post: null,
			error: 'Failed to load post'
		};
	}
};
