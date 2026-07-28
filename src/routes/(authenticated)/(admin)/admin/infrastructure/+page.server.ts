import type { PageServerLoad } from './$types';
import { ClusterController } from '$lib/controllers/cluster';

export const load: PageServerLoad = async () => {
	const cluster_controller = new ClusterController();
	const cluster = cluster_controller.fetch_health().catch(() => null);

	return {
		cluster
	};
};
