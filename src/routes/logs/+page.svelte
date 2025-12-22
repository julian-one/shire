<script lang="ts">
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';

	interface LogEntry {
		time: string;
		level: string;
		msg: string;
		attrs?: Record<string, unknown>;
	}

	let { data }: PageProps = $props();

	let logs = $state<LogEntry[]>([]);
	let connectionStatus = $state<'connecting' | 'connected' | 'disconnected'>('disconnected');
	let connectionError = $state<string | null>(null);
	let loadingHistory = $state(false);
	let eventSource: EventSource | null = null;
	let logContainer: HTMLDivElement | null = null;
	let autoScroll = $state(true);
	let searchQuery = $state('');
	let selectedLevels = $state<Set<string>>(new Set(['DEBUG', 'INFO', 'WARN', 'ERROR']));

	const MAX_LOGS = 1000;
	const API_BASE = 'http://localhost:8080';

	let filteredLogs = $derived.by(() => {
		return logs.filter((log) => {
			if (!selectedLevels.has(log.level)) return false;
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const msgMatch = log.msg.toLowerCase().includes(query);
				const attrsMatch = log.attrs
					? JSON.stringify(log.attrs).toLowerCase().includes(query)
					: false;
				if (!msgMatch && !attrsMatch) return false;
			}
			return true;
		});
	});

	async function loadHistoricalLogs() {
		if (!data.accessToken) {
			connectionError = 'No access token for history';
			return;
		}

		loadingHistory = true;
		try {
			const response = await fetch(`${API_BASE}/logs/history?limit=${MAX_LOGS}`, {
				headers: {
					Authorization: `Bearer ${data.accessToken}`
				}
			});

			if (response.ok) {
				const history: LogEntry[] = await response.json();
				logs = history;
			} else {
				connectionError = `History failed: ${response.status} ${response.statusText}`;
			}
		} catch (e) {
			connectionError = `History error: ${e}`;
		} finally {
			loadingHistory = false;
		}
	}

	function connect() {
		if (!data.accessToken) {
			connectionStatus = 'disconnected';
			connectionError = 'No access token available';
			return;
		}

		connectionStatus = 'connecting';
		connectionError = null;

		const url = `${API_BASE}/logs/stream?token=${data.accessToken}`;

		// SSE with auth via query param (EventSource doesn't support custom headers)
		eventSource = new EventSource(url);

		eventSource.onopen = () => {
			connectionStatus = 'connected';
			connectionError = null;
		};

		eventSource.onmessage = (event) => {
			try {
				const entry: LogEntry = JSON.parse(event.data);
				logs = [...logs.slice(-(MAX_LOGS - 1)), entry];

				if (autoScroll && logContainer) {
					requestAnimationFrame(() => {
						logContainer?.scrollTo({ top: logContainer.scrollHeight, behavior: 'smooth' });
					});
				}
			} catch {
				// Ignore parse errors
			}
		};

		eventSource.onerror = (e) => {
			connectionError = `SSE error (readyState: ${eventSource?.readyState})`;
			if (eventSource?.readyState === EventSource.CLOSED) {
				connectionStatus = 'disconnected';
			}
			// EventSource auto-reconnects unless CLOSED
		};
	}

	function disconnect() {
		eventSource?.close();
		eventSource = null;
		connectionStatus = 'disconnected';
	}

	function clearLogs() {
		logs = [];
	}

	function toggleLevel(level: string) {
		const newSet = new Set(selectedLevels);
		if (newSet.has(level)) {
			newSet.delete(level);
		} else {
			newSet.add(level);
		}
		selectedLevels = newSet;
	}

	function getLevelBadgeClass(level: string): string {
		switch (level) {
			case 'DEBUG':
				return 'badge-ghost';
			case 'INFO':
				return 'badge-info';
			case 'WARN':
				return 'badge-warning';
			case 'ERROR':
				return 'badge-error';
			default:
				return 'badge-ghost';
		}
	}

	function formatTime(time: string): string {
		const date = new Date(time);
		return date.toLocaleTimeString();
	}

	onMount(() => {
		loadHistoricalLogs().then(() => connect());
		return () => disconnect();
	});
</script>

<div class="min-h-screen bg-base-200 py-8">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h2 class="text-3xl font-bold">Server Logs</h2>
				<p class="mt-1 text-base-content/70">Historical and real-time logs from the backend</p>
			</div>
			<div class="flex items-center gap-2">
				<span
					class="badge {connectionStatus === 'connected'
						? 'badge-success'
						: connectionStatus === 'connecting'
							? 'badge-warning'
							: 'badge-ghost'}"
				>
					{connectionStatus}
				</span>
				{#if connectionError}
					<span class="text-sm text-error">{connectionError}</span>
				{/if}
				{#if connectionStatus === 'disconnected'}
					<button class="btn btn-sm btn-primary" onclick={connect}>Reconnect</button>
				{/if}
			</div>
		</div>

		<div class="card mb-4 bg-base-100 shadow-xl">
			<div class="card-body py-4">
				<div class="flex flex-wrap items-center gap-4">
					<div class="form-control">
						<input
							type="text"
							placeholder="Search logs..."
							class="input input-bordered input-sm w-64"
							bind:value={searchQuery}
						/>
					</div>

					<div class="flex items-center gap-2">
						<span class="text-sm font-medium">Levels:</span>
						{#each ['DEBUG', 'INFO', 'WARN', 'ERROR'] as level}
							<label class="label cursor-pointer gap-1">
								<input
									type="checkbox"
									class="checkbox checkbox-sm"
									checked={selectedLevels.has(level)}
									onchange={() => toggleLevel(level)}
								/>
								<span class="label-text text-xs">{level}</span>
							</label>
						{/each}
					</div>

					<div class="flex items-center gap-2">
						<label class="label cursor-pointer gap-1">
							<input type="checkbox" class="toggle toggle-sm" bind:checked={autoScroll} />
							<span class="label-text text-xs">Auto-scroll</span>
						</label>
					</div>

					<button class="btn btn-ghost btn-sm" onclick={clearLogs}>Clear</button>

					<div class="ml-auto text-sm text-base-content/50">
						{filteredLogs.length} / {logs.length} logs
					</div>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div
				class="card-body h-[600px] overflow-y-auto p-0 font-mono text-sm"
				bind:this={logContainer}
			>
				{#if loadingHistory}
					<div class="flex h-full items-center justify-center text-base-content/50">
						<span class="loading loading-spinner loading-md"></span>
						<span class="ml-2">Loading historical logs...</span>
					</div>
				{:else if filteredLogs.length === 0}
					<div class="flex h-full items-center justify-center text-base-content/50">
						{#if logs.length === 0}
							No logs available
						{:else}
							No logs match your filters
						{/if}
					</div>
				{:else}
					<table class="table table-xs">
						<thead class="sticky top-0 bg-base-100">
							<tr>
								<th class="w-24">Time</th>
								<th class="w-20">Level</th>
								<th>Message</th>
								<th class="w-64">Attributes</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredLogs as log}
								<tr class="hover:bg-base-200">
									<td class="text-base-content/60">{formatTime(log.time)}</td>
									<td>
										<span class="badge badge-sm {getLevelBadgeClass(log.level)}">{log.level}</span>
									</td>
									<td class="max-w-md truncate">{log.msg}</td>
									<td class="max-w-64 truncate text-base-content/60">
										{#if log.attrs}
											{JSON.stringify(log.attrs)}
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</div>
	</div>
</div>
