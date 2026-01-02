<script lang="ts">
	import { browser } from '$app/environment';
	import type { LogEntry } from '$lib/types/logs';

	const LOG_LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const;

	let logs = $state<LogEntry[]>([]);
	let connected = $state(false);
	let error = $state<string | null>(null);
	let historicalComplete = $state(false);
	let autoScroll = $state(true);

	let selectedLevels = $state<Set<string>>(new Set(['DEBUG', 'INFO', 'WARN', 'ERROR']));
	let searchQuery = $state('');
	let startTime = $state('');
	let endTime = $state('');

	let eventSource: EventSource | null = null;
	let logsContainer: HTMLDivElement;

	let filteredLogs = $derived.by(() => {
		return logs.filter((log) => {
			if (!selectedLevels.has(log.level)) return false;
			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase();
				const matchesMsg = log.msg.toLowerCase().includes(query);
				const matchesRequestId = log.request_id?.toLowerCase().includes(query);
				const matchesAttrs = log.attrs
					? JSON.stringify(log.attrs).toLowerCase().includes(query)
					: false;
				if (!matchesMsg && !matchesRequestId && !matchesAttrs) return false;
			}
			return true;
		});
	});

	function getLevelClass(level: string): string {
		switch (level) {
			case 'ERROR':
				return 'text-error';
			case 'WARN':
				return 'text-warning';
			case 'INFO':
				return 'text-info';
			case 'DEBUG':
				return 'text-base-content/50';
			default:
				return '';
		}
	}

	function getLevelBadgeClass(level: string): string {
		switch (level) {
			case 'ERROR':
				return 'badge-error';
			case 'WARN':
				return 'badge-warning';
			case 'INFO':
				return 'badge-info';
			case 'DEBUG':
				return 'badge-ghost';
			default:
				return 'badge-neutral';
		}
	}

	function formatTime(timeStr: string): string {
		const date = new Date(timeStr);
		return date.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			fractionalSecondDigits: 3
		});
	}

	function formatDate(timeStr: string): string {
		const date = new Date(timeStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function toggleLevel(level: string) {
		const newLevels = new Set(selectedLevels);
		if (newLevels.has(level)) {
			newLevels.delete(level);
		} else {
			newLevels.add(level);
		}
		selectedLevels = newLevels;
	}

	function buildStreamUrl(): string {
		const params = new URLSearchParams();

		if (startTime) {
			params.set('start', new Date(startTime).toISOString());
		}

		if (endTime) {
			params.set('end', new Date(endTime).toISOString());
		}

		return `/api/logs/stream${params.toString() ? '?' + params.toString() : ''}`;
	}

	function connect() {
		if (!browser) return;

		disconnect();
		logs = [];
		error = null;
		historicalComplete = false;

		const url = buildStreamUrl();
		eventSource = new EventSource(url);

		eventSource.onopen = () => {
			connected = true;
		};

		eventSource.addEventListener('log', (event) => {
			try {
				const logEntry: LogEntry = JSON.parse(event.data);
				logs = [...logs, logEntry];

				if (autoScroll && logsContainer) {
					requestAnimationFrame(() => {
						logsContainer.scrollTop = logsContainer.scrollHeight;
					});
				}
			} catch (e) {
				console.error('Failed to parse log entry:', e);
			}
		});

		eventSource.addEventListener('marker', (event) => {
			try {
				const marker = JSON.parse(event.data);
				if (marker.type === 'historical_complete') {
					historicalComplete = true;
				}
			} catch (e) {
				console.error('Failed to parse marker:', e);
			}
		});

		eventSource.onerror = () => {
			if (connected) {
				error = 'Connection lost';
				connected = false;
			} else {
				error = 'Failed to connect';
			}
			eventSource?.close();
			eventSource = null;

			setTimeout(() => {
				if (!eventSource) connect();
			}, 3000);
		};
	}

	function disconnect() {
		if (eventSource) {
			eventSource.close();
			eventSource = null;
		}
		connected = false;
	}

	function refresh() {
		connect();
	}

	function clearLogs() {
		logs = [];
	}

	$effect(() => {
		if (browser) {
			connect();
		}
		return () => {
			disconnect();
		};
	});
</script>

<div class="flex h-[calc(100vh-64px)] flex-col bg-base-200">
	<div class="border-b border-base-300 bg-base-100 p-4">
		<div class="mx-auto max-w-7xl">
			<div class="flex flex-wrap items-center gap-4">
				<div class="flex items-center gap-2">
					<span class="text-sm font-medium">Levels:</span>
					{#each LOG_LEVELS as level}
						<label class="flex cursor-pointer items-center gap-1">
							<input
								type="checkbox"
								checked={selectedLevels.has(level)}
								onchange={() => toggleLevel(level)}
								class="checkbox checkbox-sm"
							/>
							<span class="text-sm {getLevelClass(level)}">{level}</span>
						</label>
					{/each}
				</div>

				<div class="divider divider-horizontal mx-0"></div>

				<div class="flex items-center gap-2">
					<input
						type="text"
						placeholder="Search logs..."
						bind:value={searchQuery}
						class="input input-bordered input-sm w-48"
					/>
				</div>

				<div class="divider divider-horizontal mx-0"></div>

				<div class="flex items-center gap-2">
					<label class="flex items-center gap-1">
						<span class="text-sm">From:</span>
						<input
							type="datetime-local"
							bind:value={startTime}
							class="input input-bordered input-sm"
						/>
					</label>
					<label class="flex items-center gap-1">
						<span class="text-sm">To:</span>
						<input
							type="datetime-local"
							bind:value={endTime}
							class="input input-bordered input-sm"
						/>
					</label>
					<button onclick={refresh} class="btn btn-ghost btn-sm" title="Reload with time range">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
							<path d="M3 3v5h5" />
							<path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
							<path d="M16 21h5v-5" />
						</svg>
					</button>
				</div>

				<div class="ml-auto flex items-center gap-2">
					<label class="flex cursor-pointer items-center gap-1">
						<input type="checkbox" bind:checked={autoScroll} class="checkbox checkbox-sm" />
						<span class="text-sm">Auto-scroll</span>
					</label>

					<button onclick={clearLogs} class="btn btn-ghost btn-sm" disabled={logs.length === 0}>
						Clear
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="flex items-center gap-2 border-b border-base-300 bg-base-100 px-4 py-2">
		<div class="flex items-center gap-2">
			{#if connected}
				<span class="badge badge-success badge-sm gap-1">
					<span class="h-2 w-2 animate-pulse rounded-full bg-success-content"></span>
					Live
				</span>
			{:else if error}
				<span class="badge badge-error badge-sm">Reconnecting...</span>
			{:else}
				<span class="badge badge-neutral badge-sm">Connecting...</span>
			{/if}

			{#if historicalComplete}
				<span class="badge badge-info badge-sm">Historical loaded</span>
			{/if}
		</div>

		<span class="text-sm text-base-content/50">
			{filteredLogs.length}{filteredLogs.length !== logs.length ? ` / ${logs.length}` : ''} entries
		</span>

		{#if error}
			<span class="text-sm text-error">{error}</span>
		{/if}
	</div>

	<div bind:this={logsContainer} class="flex-1 overflow-auto bg-base-300 p-2 font-mono text-sm">
		{#if filteredLogs.length === 0}
			<div class="flex h-full items-center justify-center text-base-content/50">
				{#if logs.length === 0}
					<span>Waiting for logs...</span>
				{:else}
					<span>No logs match the current filters</span>
				{/if}
			</div>
		{:else}
			<div class="space-y-1">
				{#each filteredLogs as log, i (i)}
					<div class="flex gap-2 rounded bg-base-100 px-2 py-1 hover:bg-base-200">
						<span class="shrink-0 text-base-content/40" title={formatDate(log.time)}>
							{formatTime(log.time)}
						</span>
						<span class="badge badge-sm shrink-0 {getLevelBadgeClass(log.level)}">
							{log.level}
						</span>
						{#if log.request_id}
							<span class="shrink-0 text-primary/60" title="Request ID">
								[{log.request_id.slice(0, 8)}]
							</span>
						{/if}
						<span class="flex-1 break-all {getLevelClass(log.level)}">
							{log.msg}
						</span>
						{#if log.attrs && Object.keys(log.attrs).length > 0}
							<span
								class="shrink-0 text-base-content/40"
								title={JSON.stringify(log.attrs, null, 2)}
							>
								+{Object.keys(log.attrs).length} attrs
							</span>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
