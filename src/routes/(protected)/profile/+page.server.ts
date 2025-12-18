import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// User is guaranteed by (protected) layout
	return {};
};
