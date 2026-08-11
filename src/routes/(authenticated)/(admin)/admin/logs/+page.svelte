<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Alert from '$lib/components/Alert.svelte';
	import { format_timestamp } from '$lib/helpers/format';
	import type { LogLine } from '$lib/types/logs';

	import LogLines from './LogLines.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let auto_refresh = $state(false);

	$effect(() => {
		if (!auto_refresh) return;
		const timer = setInterval(() => invalidateAll(), 10_000);
		return () => clearInterval(timer);
	});

	const lines: LogLine[] = $derived(data.mode === 'history' ? data.history.lines : (data.lines ?? []));
	const error_count = $derived(lines.filter((line) => line.level === 'ERROR').length);
	const warn_count = $derived(lines.filter((line) => line.level === 'WARN').length);

	const selected_pod = $derived(
		data.mode === 'live' ? data.pods.find((pod) => pod.name === data.selected.pod) : undefined
	);

	function phase_badge(phase: string) {
		if (phase === 'Running') return 'badge-success';
		if (phase === 'Pending') return 'badge-warning';
		if (phase === 'Failed') return 'badge-error';
		return 'badge-ghost';
	}

	function log_url(options: { container?: string; tail?: number } = {}) {
		if (data.mode !== 'live') return '';
		let url = `/admin/logs?pod=${encodeURIComponent(data.selected.pod ?? '')}`;
		const container = options.container ?? data.selected.container;
		if (container) {
			url += `&container=${encodeURIComponent(container)}`;
		}
		return `${url}&tail=${options.tail ?? data.selected.tail}`;
	}
</script>

{#snippet summary(order: string)}
	<p class="text-base-content/60 flex flex-wrap items-center gap-2 text-sm md:text-base">
		<span>{lines.length} lines, {order}</span>
		{#if error_count > 0}
			<span class="badge badge-error badge-sm">{error_count} ERROR</span>
		{/if}
		{#if warn_count > 0}
			<span class="badge badge-warning badge-sm">{warn_count} WARN</span>
		{/if}
	</p>
{/snippet}

<main class="flex flex-1 flex-col gap-4 p-4 md:p-6">
	<div class="flex flex-wrap items-center gap-4">
		<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">Logs</h1>
		<div
			role="tablist"
			class="tabs tabs-border"
		>
			<a
				role="tab"
				href="/admin/logs"
				class="tab {data.mode === 'live' ? 'tab-active' : ''}">Live</a
			>
			<a
				role="tab"
				href="/admin/logs?mode=history"
				class="tab {data.mode === 'history' ? 'tab-active' : ''}">History</a
			>
		</div>
		<label class="ml-auto flex cursor-pointer items-center gap-2 text-sm">
			<input
				type="checkbox"
				class="toggle toggle-sm"
				bind:checked={auto_refresh}
			/>
			Auto-refresh (10s)
		</label>
	</div>

	{#if data.mode === 'live'}
		{#if data.pods_error}
			<Alert message={data.pods_error} />
		{:else}
			<div class="rounded-box border-base-content/10 bg-base-100 overflow-x-auto border">
				<table class="table">
					<thead>
						<tr>
							<th>Pod</th>
							<th>Phase</th>
							<th>Ready</th>
							<th class="hidden md:table-cell">Restarts</th>
							<th class="hidden md:table-cell">Node</th>
							<th class="hidden lg:table-cell">Started (UTC)</th>
						</tr>
					</thead>
					<tbody>
						{#each data.pods as pod (pod.name)}
							<tr>
								<td>
									<a
										href="/admin/logs?pod={encodeURIComponent(pod.name)}"
										class="link">{pod.name}</a
									>
								</td>
								<td><span class="badge {phase_badge(pod.phase)}">{pod.phase}</span></td>
								<td>{pod.containers.filter((c) => c.ready).length}/{pod.containers.length}</td>
								<td class="hidden md:table-cell">
									{pod.containers.reduce((sum, c) => sum + c.restarts, 0)}
								</td>
								<td class="hidden md:table-cell">{pod.node}</td>
								<td class="hidden text-xs whitespace-nowrap md:text-sm lg:table-cell">
									{pod.start_time ? format_timestamp(pod.start_time) : ''}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if data.selected.pod}
			<div class="flex flex-wrap items-center gap-2">
				<h2 class="text-lg font-bold md:text-xl">{data.selected.pod}</h2>
				{#if selected_pod && selected_pod.containers.length > 1}
					{#each selected_pod.containers as container (container.name)}
						<a
							href={log_url({ container: container.name })}
							class="btn btn-xs {container.name === data.selected.container ? 'btn-primary' : 'btn-ghost'}"
							>{container.name}</a
						>
					{/each}
				{/if}
				<div class="ml-auto flex items-center gap-2">
					{#each data.tails as tail (tail)}
						<a
							href={log_url({ tail })}
							class="btn btn-xs {tail === data.selected.tail ? 'btn-primary' : 'btn-ghost'}">{tail}</a
						>
					{/each}
					<a
						href={log_url()}
						class="btn btn-sm">Refresh</a
					>
				</div>
			</div>
			{#if data.log_error}
				<Alert message={data.log_error} />
			{:else if lines.length === 0}
				<p class="text-base-content/60 text-sm md:text-base">No output.</p>
			{:else}
				<LogLines {lines} />
				{@render summary('oldest first')}
			{/if}
		{/if}
	{:else}
		{@const history = data.history}
		<form class="flex flex-wrap items-end gap-2">
			<input
				type="hidden"
				name="mode"
				value="history"
			/>
			<div class="flex flex-col gap-1">
				<label
					class="label"
					for="source">Source</label
				>
				<select
					id="source"
					name="source"
					class="select"
					value={history.source}
				>
					<option value="">all</option>
					<optgroup label="services">
						{#each data.containers as container (container)}
							<option value={container}>{container}</option>
						{/each}
					</optgroup>
					<optgroup label="system units">
						{#each data.units as unit (unit)}
							<option value={'unit:' + unit}>{unit}</option>
						{/each}
					</optgroup>
				</select>
			</div>
			<div class="flex flex-col gap-1">
				<label
					class="label"
					for="q">Contains</label
				>
				<input
					id="q"
					name="q"
					class="input"
					autocomplete="off"
					value={history.q}
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label
					class="label"
					for="since">Since</label
				>
				<select
					id="since"
					name="since"
					class="select"
					value={history.since}
				>
					{#each data.sinces as since (since)}
						<option value={since}>{since}</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-col gap-1">
				<label
					class="label"
					for="level">Level</label
				>
				<select
					id="level"
					name="level"
					class="select"
					value={history.level}
				>
					<option value="">any</option>
					{#each data.levels as level (level)}
						<option value={level}>{level}</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-col gap-1">
				<label
					class="label"
					for="limit">Limit</label
				>
				<select
					id="limit"
					name="limit"
					class="select"
					value={history.limit}
				>
					{#each data.limits as limit (limit)}
						<option value={limit}>{limit}</option>
					{/each}
				</select>
			</div>
			<button class="btn btn-primary">Search</button>
		</form>
		{#if history.error}
			<Alert message={history.error} />
		{:else if lines.length === 0}
			<p class="text-base-content/60 text-sm md:text-base">No matches.</p>
		{:else}
			<LogLines {lines} />
			{@render summary('newest first')}
		{/if}
	{/if}
</main>
