<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let verifying = $state(false);
	let results_by_id = $derived(new Map((form?.results ?? []).map((r) => [r.id, r])));
	let pass_count = $derived((form?.results ?? []).filter((r) => r.pass).length);
</script>

<main class="flex flex-1 flex-col gap-4 p-4 md:p-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">Route verifier</h1>
		<form
			method="POST"
			action="?/verify_all"
			use:enhance={() => {
				verifying = true;
				return async ({ update }) => {
					await update();
					verifying = false;
				};
			}}
		>
			<button
				class="btn btn-primary"
				disabled={verifying}
			>
				{#if verifying}
					<span class="loading loading-spinner"></span>
				{/if}
				Verify all
			</button>
		</form>
	</div>
	{#if form?.error}
		<Alert message={form.error} />
	{/if}
	{#if form?.results}
		<Alert
			kind={pass_count === data.probes.length ? 'success' : 'error'}
			message="{pass_count}/{data.probes.length} routes passing"
		/>
	{/if}
	<div class="rounded-box border-base-content/10 bg-base-100 overflow-x-auto border">
		<table class="table">
			<thead>
				<tr>
					<th>Method</th>
					<th>Path</th>
					<th class="hidden lg:table-cell">Probe</th>
					<th class="hidden md:table-cell">Expect</th>
					<th>Got</th>
					<th class="hidden md:table-cell">ms</th>
					<th>Result</th>
				</tr>
			</thead>
			<tbody>
				{#each data.probes as probe (probe.id)}
					{@const result = results_by_id.get(probe.id)}
					<tr>
						<td class="text-xs whitespace-nowrap md:text-sm">{probe.method}</td>
						<td class="text-xs whitespace-nowrap md:text-sm">
							{probe.path}
							{#if result && !result.pass && result.detail}
								<div class="text-error max-w-xs truncate text-xs">{result.detail}</div>
							{/if}
						</td>
						<td class="hidden lg:table-cell">{probe.description}</td>
						<td class="hidden md:table-cell">{probe.expect}</td>
						<td>
							{#if result}
								{result.status}
							{:else}
								<span class="text-base-content/60">&mdash;</span>
							{/if}
						</td>
						<td class="hidden md:table-cell">
							{#if result}
								{result.duration_ms}
							{:else}
								<span class="text-base-content/60">&mdash;</span>
							{/if}
						</td>
						<td>
							{#if result}
								<span class="badge {result.pass ? 'badge-success' : 'badge-error'}">
									{result.pass ? 'pass' : 'fail'}
								</span>
							{:else}
								<span class="text-base-content/60">&mdash;</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
