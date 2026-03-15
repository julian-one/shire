import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, route }) => {
	// role-based access control (RBAC) check
	const user = await locals.getUser();
	if (route.id?.includes('(admin)') && user?.role !== 'admin') {
		error(403, 'Forbidden: You do not have permission to access this resource.');
	}

	return {};
};
