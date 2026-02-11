import { UserController } from '$lib/controllers/user';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const userController = new UserController();
	const user = await userController.ById(params.id);

	return {
		user
	};
};
