import { rivendell } from '$lib/server/rivendell';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const api = rivendell(fetch);
	const [nodes, deployments, pods, warnings, certificates] = await Promise.all([
		api.nodes(),
		api.deployments(),
		api.pods(),
		api.warnings(),
		api.certificates()
	]);

	return { nodes, deployments, pods, warnings, certificates };
};
