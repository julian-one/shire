<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main class="flex flex-1 flex-col items-center justify-center gap-6 p-4">
	<img
		src="/images/shire.webp"
		alt="The Shire"
		class="border-base-content/10 w-full max-w-md rounded-lg border"
	/>
	<p class="text-base md:text-lg">hello from the shire!</p>
	<div class="flex flex-col items-center gap-2 sm:flex-row">
		{#if data.moria_health}
			<span class="badge badge-success">moria: {data.moria_health.status}</span>
			<span class="text-base-content/60 text-xs md:text-sm">{data.moria_health.time}</span>
		{:else}
			<span class="badge badge-error">moria: unreachable</span>
		{/if}
	</div>
</main>
