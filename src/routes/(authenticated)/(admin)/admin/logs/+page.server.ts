import { entry_to_line, parse_pod_log } from '$lib/helpers/logs';
import { get_pod_log, list_pods, MoriaError, query_logs } from '$lib/server/moria';
import type { KubePod } from '$lib/types/kube';
import type { LogLine } from '$lib/types/logs';

import type { PageServerLoad } from './$types';

const tails = [100, 200, 500, 1000, 2000];
const sinces = ['15m', '1h', '6h', '24h', '7d', '30d'];
const levels = ['INFO', 'WARN', 'ERROR'];
const limits = [100, 200, 500, 1000];
// The picker is a fixed list: the pod API is namespaced to industries, but
// victorialogs holds the whole cluster, so the list can't be derived from it.
const containers = ['shire', 'rivendell', 'moria', 'victorialogs', 'vlagent', 'traefik', 'coredns'];
// journald streams — the Pis' systemd units, not containers.
const units = ['k3s.service', 'k3s-agent.service'];

export const load: PageServerLoad = async (event) => {
	// The (admin) layout guard runs concurrently — wait for it before fetching.
	await event.parent();

	if (event.url.searchParams.get('mode') === 'history') {
		const source = event.url.searchParams.get('source') ?? '';
		const q = event.url.searchParams.get('q') ?? '';
		const since_param = event.url.searchParams.get('since') ?? '';
		const since = sinces.includes(since_param) ? since_param : '1h';
		const level_param = event.url.searchParams.get('level') ?? '';
		const level = levels.includes(level_param) ? level_param : '';
		const limit_param = Number(event.url.searchParams.get('limit'));
		const limit = limits.includes(limit_param) ? limit_param : 200;

		const unit = source.startsWith('unit:') ? source.slice('unit:'.length) : undefined;
		const container = unit ? undefined : source;

		let lines: LogLine[] = [];
		let error: string | undefined;
		try {
			const { items } = await query_logs(event, { container, unit, q, since, level, limit });
			lines = items.map(entry_to_line);
		} catch (err) {
			error = err instanceof MoriaError ? err.message : 'history unavailable';
		}
		return {
			mode: 'history' as const,
			history: { lines, error, source, q, since, level, limit },
			containers,
			units,
			sinces,
			levels,
			limits
		};
	}

	let pods: KubePod[] = [];
	let pods_error: string | undefined;
	try {
		pods = (await list_pods(event)).items;
	} catch (error) {
		pods_error = error instanceof MoriaError ? error.message : 'pod list unavailable';
	}

	const pod = event.url.searchParams.get('pod') ?? undefined;
	const container = event.url.searchParams.get('container') ?? undefined;
	const tail_param = Number(event.url.searchParams.get('tail'));
	const tail = tails.includes(tail_param) ? tail_param : 200;

	let lines: LogLine[] | undefined;
	let log_error: string | undefined;
	if (pod) {
		try {
			lines = parse_pod_log(await get_pod_log(event, pod, { container, tail }));
		} catch (error) {
			log_error = error instanceof MoriaError ? error.message : 'log unavailable';
		}
	}

	return { mode: 'live' as const, pods, pods_error, selected: { pod, container, tail }, tails, lines, log_error };
};
