import { list_users } from '$lib/server/moria';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// The (admin) layout guard runs concurrently — wait for it before fetching.
	await event.parent();
	return { users: await list_users(event) };
};
