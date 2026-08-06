import type { PageServerLoad } from './$types';

import { health } from '$lib/server/moria';

export const load: PageServerLoad = async (event) => {
	try {
		return { moria_health: await health(event) };
	} catch {
		return { moria_health: null };
	}
};
