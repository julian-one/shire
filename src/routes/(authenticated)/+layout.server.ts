import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, route }) => {
	if (route.id?.includes('(admin)') && locals.user?.role !== 'admin') {
		error(403, 'Forbidden: admin access required');
	}
	return {};
};
