<script lang="ts">
	import type { ClusterNode, NamespaceSummary, ClusterHealth } from '$lib/types/cluster';
	import { ClusterController } from '$lib/controllers/cluster';
	import TimeSeriesChart from '$lib/components/TimeSeriesChart.svelte';
	import { onDestroy } from 'svelte';

	let { data } = $props();

	const cluster_controller = new ClusterController();

	const CPU_QUERY =
		'(1 - sum by (node) (rate(node_cpu_seconds_total{mode="idle"}[5m])) / sum by (node) (rate(node_cpu_seconds_total[5m]))) * 100';
	const MEM_QUERY = '(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100';
	const TEMP_QUERY = 'node_thermal_zone_temp{type="cpu-thermal"}';

	// Citadel RED metrics (require citadel /metrics scrape)
	const REQ_RATE_QUERY = 'sum(rate(citadel_http_requests_total[5m]))';
	const ERR_RATE_QUERY = 'sum(rate(citadel_http_requests_total{status=~"5.."}[5m]))';
	const P95_LATENCY_QUERY =
		'histogram_quantile(0.95, sum by (le) (rate(citadel_http_request_duration_seconds_bucket[5m])))';

	// Native panels (replace Grafana round-trips)
	const REQ_BY_STATUS_QUERY = 'sum by (status) (rate(citadel_http_requests_total[5m]))';
	const LOG_RATE_BY_NS_QUERY = 'sum by (namespace) (rate({namespace=~".+"}[5m]))';

	let selected_pod = $state<string | null>(null);
	let selected_namespace = $state<string | null>(null);
	let log_entries = $state<{ timestamp: string; line: string; container: string }[]>([]);
	let loading_logs = $state(false);
	let logs_error = $state('');
	let search_query = $state('');
	let selected_container = $state('all');
	let auto_refresh = $state(false);
	let auto_refresh_interval: any = null;
	let active_tab = $state<'overview' | 'pods' | 'monitoring'>('overview');
	let expanded_namespaces = $state<Record<string, boolean>>({});

	import { env } from '$env/dynamic/public';

	let live_cluster = $state<ClusterHealth | null>(null);
	let ws_status = $state<'connecting' | 'connected' | 'disconnected'>('connecting');
	let ws: WebSocket | null = null;
	let reconnect_timeout: any = null;

	function get_ws_url(): string {
		let api_url = env.PUBLIC_CITADEL_API_URL;
		if (!api_url) {
			if (typeof window !== 'undefined') {
				api_url = window.location.origin;
			} else {
				api_url = 'http://localhost:8080';
			}
		}
		const ws_proto = api_url.startsWith('https://') ? 'wss://' : 'ws://';
		const host_path = api_url.replace(/^https?:\/\//, '');
		const session_id = data.session?.session_id || '';
		return `${ws_proto}${host_path}/health/cluster/ws?token=${session_id}`;
	}

	function connect_ws() {
		if (typeof window === 'undefined') return;
		if (ws) {
			try {
				ws.close();
			} catch (e) {}
		}

		ws_status = 'connecting';
		const url = get_ws_url();
		ws = new WebSocket(url);

		ws.onopen = () => {
			ws_status = 'connected';
		};

		ws.onmessage = (event) => {
			try {
				const fresh = JSON.parse(event.data);
				if (fresh) {
					live_cluster = fresh;
				}
			} catch (err) {
				console.error('Failed to parse cluster health WebSocket message:', err);
			}
		};

		ws.onclose = () => {
			if (ws_status !== 'disconnected') {
				ws_status = 'disconnected';
				if (reconnect_timeout) clearTimeout(reconnect_timeout);
				reconnect_timeout = setTimeout(() => {
					connect_ws();
				}, 5000);
			}
		};

		ws.onerror = (err) => {
			console.error('Cluster health WebSocket error:', err);
			ws_status = 'disconnected';
		};
	}

	$effect(() => {
		connect_ws();
		return () => {
			ws_status = 'disconnected';
			if (reconnect_timeout) {
				clearTimeout(reconnect_timeout);
			}
			if (ws) {
				try {
					ws.close();
				} catch (e) {}
				ws = null;
			}
		};
	});

	let containers = $derived.by(() => {
		const set = new Set<string>();
		log_entries.forEach(e => {
			if (e.container) set.add(e.container);
		});
		return Array.from(set);
	});

	let filtered_entries = $derived.by(() => {
		return log_entries.filter(e => {
			const matches_container = selected_container === 'all' || e.container === selected_container;
			const matches_query = e.line.toLowerCase().includes(search_query.toLowerCase());
			return matches_container && matches_query;
		});
	});

	async function open_log_viewer(namespace: string, pod: string) {
		selected_namespace = namespace;
		selected_pod = pod;
		log_entries = [];
		logs_error = '';
		selected_container = 'all';
		search_query = '';
		await load_logs();

		if (auto_refresh) {
			start_auto_refresh();
		}
	}

	async function load_logs() {
		if (!selected_namespace || !selected_pod) return;
		loading_logs = true;
		try {
			log_entries = await cluster_controller.fetch_pod_logs(selected_namespace, selected_pod, 250);
			logs_error = '';
		} catch (err: any) {
			logs_error = err.response?.data?.error || err.message || 'Failed to fetch logs';
		} finally {
			loading_logs = false;
		}
	}

	function close_log_viewer() {
		selected_namespace = null;
		selected_pod = null;
		stop_auto_refresh();
	}

	function start_auto_refresh() {
		stop_auto_refresh();
		auto_refresh_interval = setInterval(async () => {
			if (selected_namespace && selected_pod && !loading_logs) {
				await load_logs();
			}
		}, 5000);
	}

	function stop_auto_refresh() {
		if (auto_refresh_interval) {
			clearInterval(auto_refresh_interval);
			auto_refresh_interval = null;
		}
	}

	$effect(() => {
		if (auto_refresh) {
			start_auto_refresh();
		} else {
			stop_auto_refresh();
		}
	});

	onDestroy(() => {
		stop_auto_refresh();
	});

	function format_time(tsStr: string): string {
		try {
			const date = new Date(tsStr);
			return date.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(date.getMilliseconds()).padStart(3, '0');
		} catch {
			return '';
		}
	}

	function get_grafana_url(cluster: any): string {
		const nodes = cluster?.nodes || [];
		const fridayNode = nodes.find((n: any) => n.name === 'friday' && n.internal_ip);
		const anyNode = fridayNode || nodes.find((n: any) => n.internal_ip);
		if (anyNode && anyNode.internal_ip) {
			return `http://${anyNode.internal_ip}:30030`;
		}
		if (typeof window !== 'undefined') {
			return `http://${window.location.hostname}:30030`;
		}
		return '';
	}

	function get_grafana_explore_link(namespace: string, pod: string, cluster: any): string {
		const host = get_grafana_url(cluster);
		const expr = `{namespace="${namespace}", pod="${pod}"}`;
		const queryState = ["now-1h", "now", "Loki", { expr }];
		return `${host}/explore?left=${encodeURIComponent(JSON.stringify(queryState))}`;
	}

	function status_color(status: string): string {
		return status === 'Ready' ? 'badge-success' : 'badge-error';
	}

	function phase_color(running: number, total: number): string {
		if (total === 0) return 'text-base-content/40';
		if (running === total) return 'text-success';
		if (running > 0) return 'text-warning';
		return 'text-error';
	}

	function format_memory(mb: number): string {
		if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
		return `${mb} MB`;
	}



	function pod_status_badge(ns: NamespaceSummary): string {
		if (ns.running === ns.total) return 'badge-success';
		if (ns.failed > 0) return 'badge-error';
		if (ns.pending > 0) return 'badge-warning';
		return 'badge-ghost';
	}

	function format_cpu_usage(nano: number): string {
		if (!nano) return '0 m';
		if (nano >= 1e6) {
			return `${(nano / 1e6).toFixed(1)} m`;
		}
		return `${(nano / 1e3).toFixed(0)} µ`;
	}

	function format_mem_usage(kb: number): string {
		if (!kb) return '0 KB';
		if (kb >= 1024 * 1024) {
			return `${(kb / (1024 * 1024)).toFixed(1)} GB`;
		}
		if (kb >= 1024) {
			return `${(kb / 1024).toFixed(1)} MB`;
		}
		return `${kb} KB`;
	}

	function cpu_pct(node: ClusterNode): number {
		if (!node.cpu_usage_nano) return 0;
		const capacity = parseFloat(node.cpu_capacity);
		if (!capacity) return 0;
		const usage_cores = node.cpu_usage_nano / 1e9;
		const pct = (usage_cores / capacity) * 100;
		return parseFloat(pct.toFixed(1));
	}

	function mem_pct(node: ClusterNode): number {
		if (!node.memory_usage_kb || !node.memory_capacity_mb) return 0;
		const usage_mb = node.memory_usage_kb / 1024;
		const pct = (usage_mb / node.memory_capacity_mb) * 100;
		return parseFloat(pct.toFixed(1));
	}

	function get_badge_class(status: string): string {
		switch (status) {
			case 'Running':
				return 'badge-success';
			case 'Completed':
			case 'Succeeded':
				return 'badge-ghost text-base-content/50';
			case 'Pending':
			case 'ContainerCreating':
				return 'badge-warning';
			default:
				return 'badge-error';
		}
	}

	function try_parse_json(line: string): any | null {
		try {
			const parsed = JSON.parse(line);
			if (parsed && typeof parsed === 'object') {
				return parsed;
			}
		} catch (e) {}
		return null;
	}

</script>

<div class="space-y-6 pb-8 md:pb-12">
	<header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">Infrastructure</h1>
			<p class="text-base-content/60 mt-1 text-sm">k3s cluster status & Raspberry Pi nodes</p>
		</div>
		<div class="flex items-center gap-2 self-start md:self-auto bg-base-200/50 border border-base-content/10 px-3 py-1.5 rounded text-xs font-semibold font-mono">
			{#if ws_status === 'connected'}
				<span class="w-2 h-2 rounded-full bg-success"></span>
				<span class="text-base-content/75">Live (WS)</span>
			{:else}
				<span class="w-2 h-2 rounded-full {ws_status === 'connecting' ? 'bg-warning' : 'bg-error'}"></span>
				<span class="text-base-content/75 uppercase">{ws_status}</span>
			{/if}
		</div>
	</header>

	<div class="divider"></div>

	{#await data.cluster}
		<!-- Loading state -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each Array(3) as _}
				<div class="card border border-base-content/10 bg-base-100/30">
					<div class="card-body p-5 gap-3">
						<div class="flex items-center justify-between">
							<span class="skeleton h-3 w-20 bg-base-content/10"></span>
							<span class="skeleton h-4 w-12 bg-base-content/10"></span>
						</div>
						<div class="flex items-baseline gap-2">
							<span class="skeleton h-8 w-24 bg-base-content/10"></span>
						</div>
						<div class="skeleton h-4 w-full bg-base-content/10 mt-2"></div>
					</div>
				</div>
			{/each}
		</div>	{:then initial_cluster}
		{#if initial_cluster}
			{@const cluster = live_cluster || initial_cluster}
			<!-- At-a-glance overview board (always visible, no tab) -->
			<div class="space-y-6">
				{#if data.alerts}
					{#await data.alerts then alertsResp}
						{#if alertsResp && alertsResp.status === 'success'}
							{@const firing = (alertsResp.data.groups || []).flatMap((g: any) => g.rules || []).filter((r: any) => r.state === 'firing')}
							{#if firing.length > 0}
								<div role="alert" class="alert alert-error border border-error/30 flex items-start gap-3">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
									<div class="min-w-0">
										<p class="font-bold">{firing.length} alert{firing.length > 1 ? 's' : ''} firing</p>
										<p class="text-sm opacity-80 truncate">{firing.map((r: any) => r.name).join(', ')}</p>
									</div>
								</div>
							{/if}
						{/if}
					{/await}
				{/if}

				<section class="space-y-3">
					<div class="flex items-baseline justify-between gap-2">
						<h2 class="text-lg font-black tracking-tight">System Response · live</h2>
						<span class="text-xs text-base-content/40 font-mono">citadel HTTP · 5m</span>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div class="card border border-base-content/10 bg-base-100/30 p-4">
							<div class="flex items-center gap-2 mb-3 border-b border-base-content/5 pb-2">
								<span class="w-2 h-2 rounded-full bg-primary"></span>
								<h3 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Request Rate</h3>
							</div>
							<TimeSeriesChart query={REQ_RATE_QUERY} value_suffix=" req/s" height={180} />
						</div>
						<div class="card border border-base-content/10 bg-base-100/30 p-4">
							<div class="flex items-center gap-2 mb-3 border-b border-base-content/5 pb-2">
								<span class="w-2 h-2 rounded-full bg-error"></span>
								<h3 class="text-xs font-bold uppercase tracking-wider text-base-content/60">5xx Errors</h3>
							</div>
							<TimeSeriesChart query={ERR_RATE_QUERY} value_suffix=" /s" height={180} />
						</div>
						<div class="card border border-base-content/10 bg-base-100/30 p-4">
							<div class="flex items-center gap-2 mb-3 border-b border-base-content/5 pb-2">
								<span class="w-2 h-2 rounded-full bg-accent"></span>
								<h3 class="text-xs font-bold uppercase tracking-wider text-base-content/60">p95 Latency</h3>
							</div>
							<TimeSeriesChart query={P95_LATENCY_QUERY} value_suffix=" s" height={180} />
						</div>
					</div>
					<p class="text-xs text-base-content/40">Empty until citadel receives traffic and Prometheus scrapes /metrics.</p>
				</section>

				<section class="space-y-3">
					<h2 class="text-lg font-black tracking-tight">Node Vitals</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{#each cluster.nodes as node}
							<div class="card border border-base-content/10 bg-base-100/30 p-4">
								<div class="flex items-center justify-between gap-2 border-b border-base-content/5 pb-2">
									<span class="font-bold tracking-tight truncate">{node.name}</span>
									<span class="badge {status_color(node.status)} badge-xs font-semibold shrink-0">{node.status}</span>
								</div>
								<div class="mt-3 space-y-3">
									<div>
										<div class="flex items-center justify-between text-xs text-base-content/60">
											<span>CPU</span>
											<span class="font-mono font-bold text-base-content">{cpu_pct(node)}%</span>
										</div>
										<progress class="progress progress-primary w-full mt-1" value={cpu_pct(node)} max="100"></progress>
									</div>
									<div>
										<div class="flex items-center justify-between text-xs text-base-content/60">
											<span>Memory</span>
											<span class="font-mono font-bold text-base-content">{mem_pct(node)}%</span>
										</div>
										<progress class="progress progress-secondary w-full mt-1" value={mem_pct(node)} max="100"></progress>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</section>
			</div>

			<div class="divider text-xs font-semibold uppercase tracking-wider text-base-content/40">Details</div>

			<!-- Segmented Tab Cards Dashboard -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<!-- Card 1: Nodes -->
				<button
					type="button"
					class="card border text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary {active_tab === 'overview' ? 'border-primary bg-primary/5' : 'border-base-content/10 bg-base-100/30'}"
					onclick={() => active_tab = 'overview'}
				>
					<div class="card-body p-5 gap-1.5">
						<div class="flex items-center justify-between">
							<span class="text-xs font-semibold uppercase tracking-wider text-base-content/50">Nodes Health</span>
							<span class="badge {active_tab === 'overview' ? 'badge-primary' : 'badge-ghost text-base-content/40'} badge-xs font-bold font-sans uppercase">Nodes</span>
						</div>
						<div class="flex items-baseline gap-2 mt-1">
							<span class="text-3xl font-black tracking-tight tabular-nums text-primary">
								{cluster.summary.nodes_ready}/{cluster.summary.total_nodes}
							</span>
							<span class="text-xs font-medium text-base-content/50">Ready</span>
						</div>
						<div class="text-xs font-medium mt-2 pt-2 border-t border-base-content/10">
							{#if cluster.summary.nodes_ready === cluster.summary.total_nodes}
								<span class="text-success flex items-center gap-1.5">
									<span class="w-1.5 h-1.5 rounded-full bg-success"></span>
									All nodes ready
								</span>
							{:else}
								<span class="text-error flex items-center gap-1.5">
									<span class="w-1.5 h-1.5 rounded-full bg-error"></span>
									{cluster.summary.total_nodes - cluster.summary.nodes_ready} node(s) down
								</span>
							{/if}
						</div>
					</div>
				</button>

				<!-- Card 2: Pods & Workloads -->
				<button
					type="button"
					class="card border text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary {active_tab === 'pods' ? 'border-secondary bg-secondary/5' : 'border-base-content/10 bg-base-100/30'}"
					onclick={() => active_tab = 'pods'}
				>
					<div class="card-body p-5 gap-1.5">
						<div class="flex items-center justify-between">
							<span class="text-xs font-semibold uppercase tracking-wider text-base-content/50">Pods & Workloads</span>
							<span class="badge {active_tab === 'pods' ? 'badge-secondary' : 'badge-ghost text-base-content/40'} badge-xs font-bold font-sans uppercase">Workloads</span>
						</div>
						<div class="flex items-baseline gap-2 mt-1">
							<span class="text-3xl font-black tracking-tight tabular-nums text-secondary">
								{cluster.summary.pods_running}/{cluster.summary.total_pods}
							</span>
							<span class="text-xs font-medium text-base-content/50">Running</span>
						</div>
						<div class="text-xs font-medium mt-2 pt-2 border-t border-base-content/10 flex items-center justify-between text-base-content/60 w-full">
							<span>{cluster.namespaces.length} namespaces</span>
							<span class="truncate max-w-[120px] font-mono text-xs opacity-70">
								{cluster.namespaces.map((n) => n.namespace).slice(0, 2).join(', ')}{#if cluster.namespaces.length > 2}...{/if}
							</span>
						</div>
					</div>
				</button>

				<!-- Card 3: Monitoring & Alerts -->
				<button
					type="button"
					class="card border text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent {active_tab === 'monitoring' ? 'border-accent bg-accent/5' : 'border-base-content/10 bg-base-100/30'}"
					onclick={() => active_tab = 'monitoring'}
				>
					<div class="card-body p-5 gap-1.5">
						<div class="flex items-center justify-between">
							<span class="text-xs font-semibold uppercase tracking-wider text-base-content/50">Alerts & Telemetry</span>
							<span class="badge {active_tab === 'monitoring' ? 'badge-accent' : 'badge-ghost text-base-content/40'} badge-xs font-bold font-sans uppercase">Monitoring</span>
						</div>
						<div class="flex items-baseline gap-2 mt-1">
							<span class="text-3xl font-black tracking-tight text-accent">
								{#if cluster.namespaces.find((n) => n.namespace === 'monitoring')}
									OK
								{:else}
									OFF
								{/if}
							</span>
							<span class="text-xs font-medium text-base-content/50">Telemetry Stack</span>
						</div>
						<div class="text-xs font-medium mt-2 pt-2 border-t border-base-content/10">
							{#if data.alerts}
								{#await data.alerts}
									<span class="text-base-content/40">Querying alerts...</span>
								{:then alertsResp}
									{#if alertsResp && alertsResp.status === 'success'}
										{@const groups = alertsResp.data.groups || []}
										{@const allRules = groups.flatMap((g: any) => g.rules || [])}
										{@const firingCount = allRules.filter((r: any) => r.state === 'firing').length}
										{#if firingCount > 0}
											<span class="text-error flex items-center gap-1.5 font-bold">
												<span class="w-1.5 h-1.5 rounded-full bg-error"></span>
												{firingCount} alert(s) firing
											</span>
										{:else}
											<span class="text-success flex items-center gap-1.5">
												<span class="w-1.5 h-1.5 rounded-full bg-success"></span>
												All rules healthy
											</span>
										{/if}
									{:else}
										<span class="text-base-content/60">Grafana connected</span>
									{/if}
								{:catch}
									<span class="text-warning">Alert rules offline</span>
								{/await}
							{:else}
								<span class="text-base-content/40">No alerts configured</span>
							{/if}
						</div>
					</div>
				</button>
			</div>

			<!-- Tab Content Areas -->
			{#if active_tab === 'overview'}
				<!-- Tab 1: Hardware & Node Status -->
				<div class="space-y-4 pt-2">
					<h2 class="text-lg font-black tracking-tight">Nodes Overview</h2>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						{#each cluster.nodes as node}
							<div class="card border-base-content/10 border bg-base-100 bg-base-100/30">
								<div class="card-body gap-4">
									<div class="flex items-center justify-between border-b border-base-content/10 pb-2">
										<h3 class="card-title text-base font-bold">
											<span>{node.name}</span>
											{#if node.roles.length > 0}
												<span class="badge badge-neutral badge-xs font-semibold">
													{node.roles.join(', ')}
												</span>
											{/if}
										</h3>
										<span class="badge {status_color(node.status)} badge-xs font-semibold">
											{node.status}
										</span>
									</div>

									<div class="flex flex-col lg:flex-row gap-6 items-center">
										<!-- Node Metadata Details (Left) -->
										<div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs lg:w-1/2 w-full">
											<div>
												<span class="text-base-content/50 text-xs">OS</span>
												<p class="font-bold truncate max-w-[150px]" title={node.os_image}>{node.os_image}</p>
											</div>
											<div>
												<span class="text-base-content/50 text-xs">Arch</span>
												<p class="font-bold">{node.architecture}</p>
											</div>
											<div>
												<span class="text-base-content/50 text-xs">CPU Capacity</span>
												<p class="font-bold">{node.cpu_capacity} cores</p>
											</div>
											<div>
												<span class="text-base-content/50 text-xs">Memory Capacity</span>
												<p class="font-bold">{format_memory(node.memory_capacity_mb)}</p>
											</div>
											<div>
												<span class="text-base-content/50 text-xs">Kubelet</span>
												<p class="font-bold">{node.kubelet_version}</p>
											</div>
											<div>
												<span class="text-base-content/50 text-xs">Uptime</span>
												<p class="font-bold">{node.uptime_days} days</p>
											</div>
										</div>

										<!-- Node Resource Utilization (Right) - Dials -->
										<div class="flex justify-around items-center gap-6 lg:w-1/2 w-full lg:border-l lg:border-base-content/10 lg:pl-6 py-2">
											<!-- CPU Dial -->
											<div class="flex flex-col items-center gap-2">
												<div class="radial-progress text-primary" style="--value:{cpu_pct(node)}; --size:4.5rem; --thickness: 6px;" role="progressbar">
													<span class="font-mono text-xs font-bold text-base-content">{cpu_pct(node)}%</span>
												</div>
												<span class="text-xs text-base-content/60 font-semibold uppercase tracking-wider text-center">CPU Usage</span>
												<span class="text-xs font-mono opacity-50">{format_cpu_usage(node.cpu_usage_nano)}</span>
											</div>

											<!-- Memory Dial -->
											<div class="flex flex-col items-center gap-2">
												<div class="radial-progress text-secondary" style="--value:{mem_pct(node)}; --size:4.5rem; --thickness: 6px;" role="progressbar">
													<span class="font-mono text-xs font-bold text-base-content">{mem_pct(node)}%</span>
												</div>
												<span class="text-xs text-base-content/60 font-semibold uppercase tracking-wider text-center">Memory</span>
												<span class="text-xs font-mono opacity-50">{format_mem_usage(node.memory_usage_kb)}</span>
											</div>
										</div>
									</div>

									<div class="text-base-content/40 border-t border-base-content/5 pt-2 text-xs flex justify-between">
										<span>Created {new Date(node.created_at).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric'
										})}</span>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<!-- Performance Graphs -->
					<div class="mt-8 space-y-4">
						<h2 class="text-lg font-black tracking-tight">Performance History (1h · live)</h2>
						<div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
							<div class="card border border-base-content/10 bg-base-100/30 p-4">
								<div class="flex items-center justify-between mb-3 border-b border-base-content/5 pb-2">
									<h3 class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2">
										<span class="w-2 h-2 rounded-full bg-primary"></span>
										<span>CPU Utilization</span>
									</h3>
									<span class="text-xs opacity-50 font-mono">PromQL</span>
								</div>
								<TimeSeriesChart query={CPU_QUERY} value_suffix="%" height={240} />
							</div>

							<div class="card border border-base-content/10 bg-base-100/30 p-4">
								<div class="flex items-center justify-between mb-3 border-b border-base-content/5 pb-2">
									<h3 class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2">
										<span class="w-2 h-2 rounded-full bg-secondary"></span>
										<span>Memory Utilization</span>
									</h3>
									<span class="text-xs opacity-50 font-mono">PromQL</span>
								</div>
								<TimeSeriesChart query={MEM_QUERY} value_suffix="%" height={240} />
							</div>

							<div class="card border border-base-content/10 bg-base-100/30 p-4">
								<div class="flex items-center justify-between mb-3 border-b border-base-content/5 pb-2">
									<h3 class="text-xs font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2">
										<span class="w-2 h-2 rounded-full bg-accent"></span>
										<span>Core Temperature</span>
									</h3>
									<span class="text-xs opacity-50 font-mono">PromQL</span>
								</div>
								<TimeSeriesChart query={TEMP_QUERY} value_suffix=" °C" height={240} />
							</div>
						</div>
					</div>
				</div>

			{:else if active_tab === 'pods'}
				<!-- Tab 2: Namespaces & Pods Tables -->
				<div class="space-y-4 pt-2">
					<h2 class="text-lg font-black tracking-tight">Namespaces & Pods</h2>
					<div class="space-y-3">
						{#each cluster.namespaces as ns}
							<div class="collapse-arrow border-base-content/10 collapse border bg-base-100 bg-base-100/30">
								<input
									type="checkbox"
									checked={expanded_namespaces[ns.namespace] ?? (ns.failed > 0 || ns.pending > 0)}
									onchange={(e) => {
										expanded_namespaces[ns.namespace] = e.currentTarget.checked;
									}}
								/>
								<div class="collapse-title font-sans">
									<div class="flex items-center gap-3 pr-8">
										<span class="font-black tracking-tight">{ns.namespace}</span>
										<span class="badge {pod_status_badge(ns)} badge-sm font-semibold">
											{ns.running}/{ns.total} running
										</span>
										{#if ns.pending > 0}
											<span class="badge badge-warning badge-sm font-semibold">{ns.pending} pending</span>
										{/if}
										{#if ns.failed > 0}
											<span class="badge badge-error badge-sm font-semibold">{ns.failed} failed</span>
										{/if}
									</div>
								</div>
								<div class="collapse-content">
									<div class="overflow-x-auto border-t border-base-content/5 mt-2 pt-2">
										<table class="table table-sm table-zebra w-full">
											<thead>
												<tr>
													<th class="font-bold">Pod Name</th>
													<th class="text-right font-bold w-32">CPU Usage</th>
													<th class="text-right font-bold w-32">Memory</th>
													<th class="text-right font-bold w-28">Status</th>
													<th class="text-right font-bold w-28">Actions</th>
												</tr>
											</thead>
											<tbody>
												{#each ns.pods as pod}
													<tr>
														<td class="font-mono text-xs truncate max-w-xs" title={pod.name}>{pod.name}</td>
														<td class="text-right font-mono text-xs text-base-content/60">
															{format_cpu_usage(pod.cpu_usage_nano)}
														</td>
														<td class="text-right font-mono text-xs text-base-content/60">
															{format_mem_usage(pod.memory_usage_kb)}
														</td>
														<td class="text-right">
															<span class="badge {get_badge_class(pod.status)} badge-xs font-sans font-semibold">
																{pod.status}
															</span>
														</td>
														<td class="text-right">
															<div class="flex justify-end gap-1">
																<button
																	type="button"
																	class="btn btn-xs btn-ghost btn-square"
																	title="View Logs"
																	onclick={() => open_log_viewer(ns.namespace, pod.name)}
																>
																	<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
																	</svg>
																</button>
																<a
																	href={get_grafana_explore_link(ns.namespace, pod.name, cluster)}
																	target="_blank"
																	rel="noreferrer"
																	class="btn btn-xs btn-ghost btn-square"
																	title="Explore in Grafana"
																>
																	<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
																	</svg>
																</a>
															</div>
														</td>
													</tr>
												{/each}
												{#if ns.pods.length === 0}
													<tr>
														<td colspan="5" class="text-center py-4 text-base-content/40 text-xs">No active pods</td>
													</tr>
												{/if}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Inline Log Viewer (Rendered contextually inside Pods tab) -->
				{#if selected_pod}
					<div class="card border-base-content/10 border bg-base-100 bg-base-100/30 mt-6" id="logs-panel">
						<div class="card-body p-6 gap-3">
							<!-- Header -->
							<div class="flex items-center justify-between border-b border-base-content/10 pb-4">
								<div>
									<h3 class="card-title text-lg font-black tracking-tight flex items-center gap-2">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
										<span>Log Stream: {selected_pod}</span>
									</h3>
									<p class="text-xs text-base-content/60 mt-0.5">Namespace: {selected_namespace}</p>
								</div>
								<button type="button" class="btn btn-sm btn-circle btn-ghost" onclick={close_log_viewer} aria-label="Close logs">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>

							<!-- Toolbar -->
							<div class="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-base-content/10 text-sm">
								<div class="flex items-center gap-4 flex-wrap">
									<!-- Container selector -->
									{#if containers.length > 0}
										<div class="flex items-center gap-2">
											<span class="text-xs text-base-content/60">Container:</span>
											<select class="select select-sm select-bordered bg-base-100 text-base-content border-base-content/25 font-sans" bind:value={selected_container}>
												<option value="all">All Containers</option>
												{#each containers as c}
													<option value={c}>{c}</option>
												{/each}
											</select>
										</div>
									{/if}

									<!-- Search bar -->
									<div class="relative">
										<input
											type="text"
											placeholder="Filter logs..."
											class="input input-sm input-bordered bg-base-100 text-base-content border-base-content/25 pr-8 w-48 font-sans"
											bind:value={search_query}
										/>
										{#if search_query}
											<button type="button" class="absolute right-2.5 top-1.5 text-base-content/40" onclick={() => search_query = ''} aria-label="Clear filter">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
												</svg>
											</button>
										{/if}
									</div>
								</div>

								<div class="flex items-center gap-4 font-sans">
									<!-- Auto refresh toggle -->
									<label class="label cursor-pointer gap-2 p-0">
										<span class="label-text text-base-content/70 text-xs font-semibold">Auto-refresh (5s)</span>
										<input type="checkbox" class="toggle toggle-primary toggle-sm" bind:checked={auto_refresh} />
									</label>

									<!-- Reload button -->
									<button type="button" class="btn btn-sm btn-primary gap-1" onclick={load_logs} disabled={loading_logs}>
										{#if loading_logs}
											<span class="loading loading-spinner loading-xs"></span>
										{:else}
											<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
											</svg>
										{/if}
										<span>Refresh</span>
									</button>
								</div>
							</div>

							<!-- Log view body -->
							<div class="h-96 overflow-y-auto bg-base-200/50 rounded-lg p-4 font-mono text-xs mt-4 select-text leading-relaxed border border-base-content/5 relative">
								{#if loading_logs && log_entries.length === 0}
									<div class="absolute inset-0 flex items-center justify-center bg-base-200/80">
										<div class="flex flex-col items-center gap-2 font-sans">
											<span class="loading loading-spinner loading-md text-primary"></span>
											<span class="text-base-content/60 text-xs">Streaming logs...</span>
										</div>
									</div>
								{:else if logs_error}
									<div class="absolute inset-0 flex items-center justify-center bg-base-200/90 p-6 text-center font-sans">
										<div class="max-w-md space-y-2">
											<span class="text-error">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
												</svg>
											</span>
											<h4 class="font-bold text-error">Failed to Load Logs</h4>
											<p class="text-base-content/60 text-xs">{logs_error}</p>
											<button type="button" class="btn btn-xs btn-outline btn-error mt-2" onclick={load_logs}>Try Again</button>
										</div>
									</div>
								{:else if filtered_entries.length === 0}
									<div class="absolute inset-0 flex items-center justify-center text-base-content/40 text-xs font-sans">
										No logs found.
									</div>
								{:else}
									<div class="space-y-1.5">
										{#each filtered_entries as log}
											{@const parsed = try_parse_json(log.line)}
											<div class="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 px-3 py-1.5 rounded-lg border border-base-content/5 bg-base-100/50">
												<!-- Timestamp -->
												<span class="text-base-content/40 select-none w-24 shrink-0 font-mono text-xs mt-0.5">
													{format_time(parsed?.time || log.timestamp)}
												</span>
												<!-- Container badge (if multiple) -->
												{#if containers.length > 1}
													<span class="badge badge-outline text-xs h-4 leading-none px-1.5 font-sans font-bold select-none shrink-0 border-base-content/20 text-base-content/50 mt-0.5">
														{log.container}
													</span>
												{/if}

												{#if parsed}
													<!-- Level Badge -->
													{@const level = parsed.level?.toUpperCase() || 'INFO'}
													{@const attrs = Object.entries(parsed).filter(([key]) => !['time', 'level', 'msg', 'message'].includes(key))}
													<span class="badge {level === 'ERROR' || level === 'FATAL' ? 'badge-error' : level === 'WARN' ? 'badge-warning' : 'badge-success'} badge-xs font-mono font-bold shrink-0 mt-0.5 uppercase py-0 px-1">
														{level}
													</span>

													<div class="flex-1 min-w-0">
														<!-- Message -->
														<p class="text-xs font-mono text-base-content whitespace-pre-wrap break-all leading-normal">{parsed.msg || parsed.message || log.line}</p>

														<!-- Attributes -->
														{#if attrs.length > 0}
															<div class="flex flex-wrap gap-1.5 mt-1.5">
																{#each attrs as [key, val]}
																	<span class="badge badge-neutral text-xs h-auto py-0.5 px-1.5 font-mono border-base-content/5 text-base-content/70">
																		<span class="opacity-55 mr-1">{key}:</span>
																		<span class="font-semibold">{typeof val === 'object' ? JSON.stringify(val) : val}</span>
																	</span>
																{/each}
															</div>
														{/if}
													</div>
												{:else}
													<!-- Fallback for plain text logs -->
													<span class="badge badge-ghost badge-xs font-mono font-bold shrink-0 mt-0.5 py-0 px-1">
														LOG
													</span>
													<span class="whitespace-pre-wrap break-all text-xs text-base-content/95 font-mono flex-1 leading-normal">{log.line}</span>
												{/if}
											</div>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			{:else if active_tab === 'monitoring'}
				{#if cluster.namespaces.find((n) => n.namespace === 'monitoring')}
					{@const monitoring_ns = cluster.namespaces.find((n) => n.namespace === 'monitoring')!}
					{@const loki_pod = monitoring_ns.pods.find(p => p.name.startsWith('loki-'))}
					{@const grafana_pod = monitoring_ns.pods.find(p => p.name.startsWith('grafana-'))}
					{@const promtail_pods = monitoring_ns.pods.filter(p => p.name.startsWith('promtail-'))}
					<!-- Tab 3: Monitoring Stack & Active Alerts -->
					<div class="space-y-4 pt-2">
						<h2 class="text-lg font-black tracking-tight">Monitoring Stack & Alerts</h2>

					<!-- Native telemetry panels (PLG data rendered in-app, no Grafana hop) -->
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div class="card border border-base-content/10 bg-base-100/30 p-4">
							<div class="flex items-center justify-between mb-3 border-b border-base-content/5 pb-2">
								<h3 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Request Rate by Status</h3>
								<span class="text-xs opacity-50 font-mono">Prometheus</span>
							</div>
							<TimeSeriesChart query={REQ_BY_STATUS_QUERY} series_label="status" value_suffix=" req/s" height={220} />
						</div>
						<div class="card border border-base-content/10 bg-base-100/30 p-4">
							<div class="flex items-center justify-between mb-3 border-b border-base-content/5 pb-2">
								<h3 class="text-xs font-bold uppercase tracking-wider text-base-content/60">Log Rate by Namespace</h3>
								<span class="text-xs opacity-50 font-mono">Loki</span>
							</div>
							<TimeSeriesChart source="loki" query={LOG_RATE_BY_NS_QUERY} series_label="namespace" value_suffix=" /s" height={220} />
						</div>
					</div>

					<!-- Stack components health card -->
					<div class="card border-base-content/10 border bg-base-100 bg-base-100/30">
						<div class="card-body p-4 md:p-6 gap-3">
							<div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-base-content/10 pb-3">
								<div>
									<h3 class="card-title text-base md:text-lg font-black tracking-tight">Monitoring Stack Status</h3>
									<p class="text-base-content/60 text-xs">Promtail &rarr; Loki &rarr; Grafana logs pipeline</p>
								</div>
								
								<div class="flex flex-wrap gap-2">
									<a
										href={get_grafana_url(cluster)}
										target="_blank"
										rel="noreferrer"
										class="btn btn-xs btn-outline btn-secondary font-sans"
									>
										<span>Grafana Home</span>
									</a>
									<a
										href="{get_grafana_url(cluster)}/d/k8s-logs/kubernetes-logs-dashboard"
										target="_blank"
										rel="noreferrer"
										class="btn btn-xs btn-outline btn-secondary font-sans"
									>
										<span>Kubernetes Logs</span>
									</a>
									<a
										href="{get_grafana_url(cluster)}/d/industries-overview/industries-applications-dashboard"
										target="_blank"
										rel="noreferrer"
										class="btn btn-xs btn-outline btn-secondary font-sans"
									>
										<span>Industries Overview</span>
									</a>
									<a
										href="{get_grafana_url(cluster)}/alerting/list"
										target="_blank"
										rel="noreferrer"
										class="btn btn-xs btn-outline btn-secondary font-sans"
									>
										<span>Alert Rules</span>
									</a>
								</div>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
								<!-- Loki -->
								<div class="flex items-center gap-3 p-3 rounded-xl bg-base-200/50 border border-base-content/5">
									<div class="text-primary">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
										</svg>
									</div>
									<div class="flex-1 min-w-0">
										<p class="text-xs font-black truncate">Loki (Storage)</p>
										{#if loki_pod}
											<p class="text-xs text-base-content/50 font-mono truncate">{loki_pod.name}</p>
											<div class="flex items-center gap-1.5 mt-1">
												<span class="badge {get_badge_class(loki_pod.status)} badge-xs py-0 px-1 font-bold">{loki_pod.status}</span>
												<span class="text-xs font-mono text-base-content/60">{format_mem_usage(loki_pod.memory_usage_kb)}</span>
											</div>
										{:else}
											<p class="text-xs text-error font-semibold mt-0.5">Not found</p>
										{/if}
									</div>
									{#if loki_pod}
										<button type="button" class="btn btn-xs btn-ghost btn-square" onclick={() => { open_log_viewer('monitoring', loki_pod.name); active_tab = 'pods'; }} title="Loki Logs">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
										</button>
									{/if}
								</div>

								<!-- Grafana -->
								<div class="flex items-center gap-3 p-3 rounded-xl bg-base-200/50 border border-base-content/5">
									<div class="text-secondary">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
										</svg>
									</div>
									<div class="flex-1 min-w-0">
										<p class="text-xs font-black truncate">Grafana (Visuals)</p>
										{#if grafana_pod}
											<p class="text-xs text-base-content/50 font-mono truncate">{grafana_pod.name}</p>
											<div class="flex items-center gap-1.5 mt-1">
												<span class="badge {get_badge_class(grafana_pod.status)} badge-xs py-0 px-1 font-bold">{grafana_pod.status}</span>
												<span class="text-xs font-mono text-base-content/60">{format_mem_usage(grafana_pod.memory_usage_kb)}</span>
											</div>
										{:else}
											<p class="text-xs text-error font-semibold mt-0.5">Not found</p>
										{/if}
									</div>
									{#if grafana_pod}
										<button type="button" class="btn btn-xs btn-ghost btn-square" onclick={() => { open_log_viewer('monitoring', grafana_pod.name); active_tab = 'pods'; }} title="Grafana Logs">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
										</button>
									{/if}
								</div>

								<!-- Promtail -->
								<div class="flex items-center gap-3 p-3 rounded-xl bg-base-200/50 border border-base-content/5">
									<div class="text-accent">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
										</svg>
									</div>
									<div class="flex-1 min-w-0">
										<p class="text-xs font-black truncate">Promtail (Agent)</p>
										{#if promtail_pods.length > 0}
											<p class="text-xs text-base-content/50 truncate font-semibold mt-0.5">{promtail_pods.length} agent pod(s)</p>
											<div class="flex items-center gap-1.5 mt-1">
												<span class="badge {promtail_pods.every((p: any) => p.status === 'Running') ? 'badge-success' : 'badge-warning'} badge-xs py-0 px-1 font-bold">
													{promtail_pods.every((p: any) => p.status === 'Running') ? 'Healthy' : 'Warning'}
												</span>
												<span class="text-xs font-mono text-base-content/60">
													{format_mem_usage(promtail_pods.reduce((acc: number, p: any) => acc + p.memory_usage_kb, 0))} total
												</span>
											</div>
										{:else}
											<p class="text-xs text-error font-semibold mt-0.5">Not found</p>
										{/if}
									</div>
									{#if promtail_pods.length > 0}
										<button type="button" class="btn btn-xs btn-ghost btn-square" onclick={() => { open_log_viewer('monitoring', promtail_pods[0].name); active_tab = 'pods'; }} title="Promtail Agent Logs">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
										</button>
									{/if}
								</div>
							</div>
						</div>
					</div>

					<!-- Alerts rules status card -->
					{#if data.alerts}
						{#await data.alerts}
							<div class="card border-base-content/10 border bg-base-100/50">
								<div class="card-body p-4 md:p-6 gap-3">
									<h3 class="card-title text-base md:text-lg font-black tracking-tight">Active Alert Rules</h3>
									<div class="skeleton h-12 w-full"></div>
								</div>
							</div>
						{:then alertsResp}
							{#if alertsResp && alertsResp.status === 'success' && alertsResp.data?.groups?.length > 0}
								{@const groups = alertsResp.data.groups}
								{@const allRules = groups.flatMap((g: any) => g.rules || [])}
								<div class="card border-base-content/10 border bg-base-100 bg-base-100/30">
									<div class="card-body p-4 md:p-6 gap-4">
										<div class="border-b border-base-content/10 pb-3">
											<h3 class="card-title text-base md:text-lg font-black tracking-tight">Active Alert Rules</h3>
											<p class="text-base-content/60 text-xs">Real-time alerts configured in Grafana</p>
										</div>

										<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
											{#each allRules as rule}
												{@const isFiring = rule.state === 'firing'}
												{@const isPending = rule.state === 'pending'}
												<div class="flex flex-col p-4 rounded-xl border bg-base-200/50 {isFiring ? 'border-error/50 bg-error/5' : isPending ? 'border-warning/50 bg-warning/5' : 'border-base-content/5'}">
													<div class="flex justify-between items-start gap-2">
														<div>
															<p class="text-sm font-black">{rule.name}</p>
															<p class="text-xs text-base-content/50 font-mono mt-0.5 truncate max-w-xs md:max-w-md" title={rule.query}>{rule.query}</p>
														</div>
														<span class="badge font-sans font-bold text-xs py-0.5 px-2 {isFiring ? 'badge-error' : isPending ? 'badge-warning' : 'badge-ghost text-base-content/50'}">
															{rule.state.toUpperCase()}
														</span>
													</div>

													{#if rule.annotations?.description}
														<p class="text-xs text-base-content/70 mt-2 leading-relaxed">{rule.annotations.description}</p>
													{/if}

													<div class="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-base-content/5 text-xs text-base-content/60 font-mono">
														<div class="flex items-center gap-1.5">
															<span>Severity:</span>
															<span class="font-bold font-sans uppercase {rule.labels?.severity === 'critical' ? 'text-error' : 'text-warning'}">
																{rule.labels?.severity || 'unknown'}
															</span>
														</div>
														<div class="flex items-center gap-1.5">
															<span>Health:</span>
															<span class="font-bold uppercase {rule.health === 'ok' ? 'text-success' : 'text-error'}">
																{rule.health}
															</span>
														</div>
													</div>
												</div>
											{/each}
										</div>
									</div>
								</div>
							{/if}
						{:catch error}
							<div class="card border-error/25 border bg-base-100">
								<div class="card-body p-4 md:p-6 text-center text-error">
									<p class="text-sm font-bold">Failed to load active alert rules from Grafana</p>
								</div>
							</div>
						{/await}
					{/if}
					</div>
				{:else}
					<div class="card border-base-content/10 border bg-base-100 bg-base-100/30 p-6 text-center text-base-content/50 mt-4">
						Monitoring namespace not found in this cluster.
					</div>
				{/if}
			{/if}
		{:else}
			<!-- Unavailable state -->
			<div class="card border-base-content/10 border bg-base-100 bg-base-100/30">
				<div class="card-body items-center text-center p-6">
					<span class="text-error mb-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
						</svg>
					</span>
					<h2 class="card-title text-lg font-black tracking-tight">Cluster Unavailable</h2>
					<p class="text-base-content/60 max-w-md">
						Unable to reach the Kubernetes API. This typically means citadel is running outside of
						the cluster or the API server is unreachable.
					</p>
				</div>
			</div>
		{/if}
	{/await}
</div>
