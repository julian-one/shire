import { SessionStore } from '$lib/server/session';
import type { Actions } from './$types';

export const actions: Actions = {
	invalidate_session: async ({ cookies }) => {
		const token = cookies.get('TOKEN');
		if (token) {
			SessionStore.evict(token);
		}
	}
};
