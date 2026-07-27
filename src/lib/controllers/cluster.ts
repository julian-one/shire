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

	async fetch_prometheus_metrics(query: string, rangeSeconds = 3600, step = '1m'): Promise<any> {
		const end = Math.floor(Date.now() / 1000);
		const start = end - rangeSeconds;
		const { data } = await Citadel.get<any>(`/health/metrics?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}`);
		return data;
	}

	async fetch_loki_metrics(query: string, rangeSeconds = 3600, step = '1m'): Promise<any> {
		const end = Math.floor(Date.now() / 1000);
		const start = end - rangeSeconds;
		const { data } = await Citadel.get<any>(`/health/loki?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}`);
		return data;
	}
}
