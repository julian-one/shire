<script lang="ts">
	import { format_timestamp } from '$lib/helpers/format';
	import type { LogLine } from '$lib/types/logs';

	let { lines }: { lines: LogLine[] } = $props();

	function badge_class(level: string) {
		if (level === 'ERROR') return 'badge-error';
		if (level === 'WARN') return 'badge-warning';
		return 'badge-ghost';
	}

	function sorted_fields(fields: Record<string, string>) {
		return Object.entries(fields).sort(([a], [b]) => a.localeCompare(b));
	}

	function fields_line(fields: Record<string, string>) {
		return sorted_fields(fields)
			.map(([key, value]) => `${key}=${value}`)
			.join(' ');
	}
</script>

<div class="rounded-box border-base-content/10 bg-base-100 border font-mono text-xs">
	{#each lines as line, i (i)}
		<details class="border-base-content/5 border-b last:border-b-0">
			<summary
				class="hover:bg-base-content/5 flex cursor-pointer items-center gap-2 px-3 py-1 select-none [&::-webkit-details-marker]:hidden"
				style="list-style: none"
			>
				<span class="text-base-content/50 shrink-0 whitespace-nowrap">{format_timestamp(line.time)}</span>
				{#if line.level}
					<span class="badge badge-xs shrink-0 {badge_class(line.level)}">{line.level}</span>
				{/if}
				{#if line.container}
					<span class="badge badge-ghost badge-xs shrink-0">{line.container}</span>
				{/if}
				<span class="min-w-0 truncate">{line.msg || '—'}</span>
				{#if Object.keys(line.fields).length > 0}
					<span class="text-base-content/50 hidden min-w-0 flex-1 truncate sm:inline">{fields_line(line.fields)}</span>
				{/if}
			</summary>
			<div class="border-base-content/5 bg-base-200/50 border-t px-3 py-2">
				{#if line.msg}
					<p class="break-all whitespace-pre-wrap">{line.msg}</p>
				{/if}
				{#if line.pod || Object.keys(line.fields).length > 0}
					<div class="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
						{#if line.pod}
							<span class="text-base-content/50">pod</span>
							<span class="break-all">{line.pod}</span>
						{/if}
						{#each sorted_fields(line.fields) as [key, value] (key)}
							<span class="text-base-content/50">{key}</span>
							<span class="break-all">{value}</span>
						{/each}
					</div>
				{/if}
			</div>
		</details>
	{/each}
</div>
