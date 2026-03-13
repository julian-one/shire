<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { tick } from 'svelte';
	import type { LogEntry } from '$lib/types/log';

	let { data } = $props();
	let logs = $derived(data.logs);
	let source = $derived(data.source);
	let levelFilter = $state('ALL');
	let search = $state('');
	let autoScroll = $state(true);
	let scrollContainer: HTMLDivElement | undefined = $state();

	const levels = ['ALL', 'ERROR', 'WARN', 'INFO', 'DEBUG'] as const;

	let filtered = $derived.by(() => {
		let result: LogEntry[] = logs.entries;

		if (levelFilter !== 'ALL') {
			result = result.filter((e) => e.level?.toUpperCase() === levelFilter);
		}

		if (search.trim()) {
			const q = search.trim().toLowerCase();
			result = result.filter((e) => {
				const text = `${e.msg} ${e.method ?? ''} ${e.path ?? ''} ${e.request_id ?? ''}`;
				return text.toLowerCase().includes(q);
			});
		}

		return result;
	});

	$effect(() => {
		const _entries = filtered;
		if (autoScroll && scrollContainer && _entries.length >= 0) {
			tick().then(() => {
				scrollContainer!.scrollTop = scrollContainer!.scrollHeight;
			});
		}
	});

	function formatTime(iso: string): string {
		if (!iso) return '';
		try {
			const d = new Date(iso);
			if (isNaN(d.getTime())) return iso;
			const h = d.getHours().toString().padStart(2, '0');
			const m = d.getMinutes().toString().padStart(2, '0');
			const s = d.getSeconds().toString().padStart(2, '0');
			const ms = d.getMilliseconds().toString().padStart(3, '0');
			return `${h}:${m}:${s}.${ms}`;
		} catch {
			return iso;
		}
	}

	function formatDuration(ns: number | undefined): string {
		if (ns === undefined || ns === null) return '';
		if (ns < 1_000) return `${ns}ns`;
		if (ns < 1_000_000) return `${(ns / 1_000).toFixed(1)}µs`;
		if (ns < 1_000_000_000) return `${(ns / 1_000_000).toFixed(1)}ms`;
		return `${(ns / 1_000_000_000).toFixed(2)}s`;
	}

	function levelBadge(level: string): string {
		switch (level?.toUpperCase()) {
			case 'ERROR':
				return 'badge-error';
			case 'WARN':
				return 'badge-warning';
			case 'DEBUG':
				return 'badge-ghost';
			default:
				return 'badge-info';
		}
	}

	function rowColor(level: string): string {
		switch (level?.toUpperCase()) {
			case 'ERROR':
				return 'bg-error/10 text-error-content';
			case 'WARN':
				return 'bg-warning/10 text-warning-content';
			default:
				return '';
		}
	}
</script>

<div class="space-y-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">Logs</h1>
			<p class="text-base-content/60 mt-1 text-sm md:text-base">
				{source === 'shire' ? 'Shire' : 'Citadel'} application logs
			</p>
		</div>
		<div class="flex items-center gap-3">
			<span class="badge badge-neutral">{filtered.length} lines</span>
			<button
				class="btn btn-sm btn-outline"
				onclick={() => invalidateAll()}>Refresh</button
			>
		</div>
	</header>

	<div
		role="tablist"
		class="tabs tabs-border"
	>
		<a
			role="tab"
			class="tab"
			class:tab-active={source === 'citadel'}
			href="/admin/logs?source=citadel">Citadel</a
		>
		<a
			role="tab"
			class="tab"
			class:tab-active={source === 'shire'}
			href="/admin/logs?source=shire">Shire</a
		>
	</div>

	<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
		<input
			id="log-search"
			type="text"
			placeholder="Search logs..."
			class="input input-sm input-bordered w-full sm:max-w-xs"
			bind:value={search}
		/>
		<select
			id="level-filter"
			class="select select-sm select-bordered"
			bind:value={levelFilter}
		>
			{#each levels as level (level)}
				<option value={level}>{level === 'ALL' ? 'All Levels' : level}</option>
			{/each}
		</select>
		<label class="label cursor-pointer gap-2">
			<span class="label-text text-sm">Auto-scroll</span>
			<input
				type="checkbox"
				class="toggle toggle-sm"
				bind:checked={autoScroll}
			/>
		</label>
	</div>

	{#if logs.error}
		<div class="alert">
			<span class="text-sm md:text-base">{logs.error}</span>
		</div>
	{/if}

	<div
		class="bg-base-200 border-base-content/10 max-h-[75vh] overflow-auto rounded-lg border"
		bind:this={scrollContainer}
	>
		{#if filtered.length > 0}
			<table class="table-xs table-pin-rows table">
				<thead>
					<tr>
						<th class="w-36">Time</th>
						<th class="w-16">Level</th>
						<th>Message</th>
						<th class="hidden lg:table-cell">Details</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as entry, i (i)}
						<tr class={rowColor(entry.level)}>
							<td class="font-mono text-xs whitespace-nowrap opacity-60">
								{formatTime(entry.time)}
							</td>
							<td>
								{#if entry.level}
									<span class="badge badge-xs {levelBadge(entry.level)}">
										{entry.level.toUpperCase()}
									</span>
								{/if}
							</td>
							<td
								class="max-w-xs font-mono text-xs break-all whitespace-pre-wrap"
								title={entry.msg}
							>
								{entry.msg}
							</td>
							<td class="hidden text-xs opacity-50 lg:table-cell">
								{#if entry.method}
									<span class="font-mono"
										>{entry.method}
										{entry.path}
										{#if entry.status}
											→ {entry.status}
										{/if}
										{#if entry.duration !== undefined}
											({formatDuration(entry.duration)})
										{/if}
									</span>
								{:else if entry.request_id}
									<span class="font-mono">{entry.request_id}</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else if !logs.error}
			<p class="text-base-content/40 py-8 text-center text-sm">No log lines available</p>
		{/if}
	</div>
</div>
