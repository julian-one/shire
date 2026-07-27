import type { PageServerLoad } from './$types';
import { ClusterController } from '$lib/controllers/cluster';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ fetch }) => {
	const cluster_controller = new ClusterController();
	const cluster = cluster_controller.fetch_health().catch(() => null);

	const grafana_user = env.GRAFANA_USER;
	const grafana_password = env.GRAFANA_PASSWORD;

	let alerts: Promise<any> | null = null;
	if (grafana_user && grafana_password) {
		const basic = Buffer.from(`${grafana_user}:${grafana_password}`).toString('base64');
		alerts = fetch('http://grafana.monitoring.svc.cluster.local:3000/api/prometheus/grafana/api/v1/rules', {
			headers: {
				'Authorization': `Basic ${basic}`
			}
		})
		.then(async (res) => {
			if (res.ok) {
				return res.json();
			}
			throw new Error(`Grafana alerts status: ${res.status}`);
		})
		.catch((err) => {
			console.error('Failed to fetch Grafana alerts:', err);
			return null;
		});
	} else {
		console.warn('GRAFANA_USER / GRAFANA_PASSWORD not set; skipping Grafana alerts fetch');
	}

	return {
		cluster,
		alerts
	};
};
