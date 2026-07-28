import { Citadel } from '$lib/controllers/citadel';
import type { ClusterHealth } from '$lib/types/cluster';

export class ClusterController {
	async fetch_health(): Promise<ClusterHealth | null> {
		const { data } = await Citadel.get<ClusterHealth>('/health/cluster');
		return data;
	}

	async fetch_pod_logs(namespace: string, pod: string, limit = 100): Promise<{ timestamp: string; line: string; container: string }[]> {
		const { data } = await Citadel.get<any>(`/health/logs?namespace=${namespace}&pod=${pod}&limit=${limit}`);
		return data;
	}
}
