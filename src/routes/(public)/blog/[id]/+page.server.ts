import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { PostController } from '$lib/controllers/post';

export const load: PageServerLoad = async ({ params, locals }) => {
	const post_controller = new PostController();

	try {
		const post = await post_controller.ById(params.id);
		if (!(await locals.getSession()) && !post.public) {
			error(404, 'Not found');
		}
		return { post };
	} catch (e) {
		if (e && typeof e === 'object' && 'status' in e) {
			throw e;
		}
		error(404, 'Not found');
	}
};
