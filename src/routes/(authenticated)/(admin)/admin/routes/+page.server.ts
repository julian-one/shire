import { fail } from '@sveltejs/kit';

import { probe_specs, run_probes } from '$lib/server/probe';
import type { Actions, PageServerLoad } from './$types';

// Static metadata only. If this load ever fetches data it must
// `await parent()` first — the (admin) layout guard runs concurrently.
export const load: PageServerLoad = () => {
	return { probes: probe_specs() };
};

export const actions: Actions = {
	verify_all: async (event) => {
		// Layout guards do not run for form actions — enforce admin here too.
		if (event.locals.user?.role !== 'admin') {
			return fail(403, { error: 'Forbidden: admin access required' });
		}
		return { results: await run_probes(event) };
	}
};
