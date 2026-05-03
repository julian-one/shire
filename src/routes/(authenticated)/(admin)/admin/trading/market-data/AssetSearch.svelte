<script lang="ts">
	import { TradingController } from '$lib/controllers/trading';
	import type { Asset } from '$lib/types/trading';
	import { onMount, onDestroy } from 'svelte';

	const trading_controller = new TradingController();

	let search_query = $state('');
	let search_results = $state<Asset[]>([]);
	let search_loading = $state(false);
	let is_dropdown_open = $state(false);
	let search_timeout: ReturnType<typeof setTimeout>;

	let container_ref: HTMLElement;

	function handle_search_input(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		search_query = val;

		if (search_timeout) clearTimeout(search_timeout);

		if (search_query.length < 1) {
			search_results = [];
			is_dropdown_open = false;
			return;
		}

		search_loading = true;
		is_dropdown_open = true;

		search_timeout = setTimeout(async () => {
			try {
				const results = await trading_controller.search_assets(val);
				search_results = results || [];
			} catch {
				search_results = [];
			} finally {
				search_loading = false;
			}
		}, 200); // 200ms debounce
	}

	function handle_click_outside(e: MouseEvent) {
		if (is_dropdown_open && container_ref && !container_ref.contains(e.target as Node)) {
			is_dropdown_open = false;
		}
	}

	onMount(() => {
		document.addEventListener('mousedown', handle_click_outside);
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('mousedown', handle_click_outside);
		}
	});

	function handle_select() {
		is_dropdown_open = false;
		search_query = ''; // clear on selection
		search_results = [];
	}
</script>

<div
	bind:this={container_ref}
	class="dropdown relative z-50 w-full sm:w-64 md:w-80"
	class:dropdown-open={is_dropdown_open}
>
	<input
		type="text"
		name="symbol"
		value={search_query}
		oninput={handle_search_input}
		onfocus={() => {
			if (search_results.length > 0 || search_query.length > 0) is_dropdown_open = true;
		}}
		placeholder="Search asset..."
		class="input input-bordered w-full"
		autocomplete="off"
	/>
	<ul
		class="dropdown-content menu bg-base-100 border-base-content/10 rounded-box z-50 mt-2 max-h-80 w-full flex-nowrap overflow-y-auto border p-2 shadow-lg"
	>
		{#if search_loading}
			<li class="disabled"><a><span class="loading loading-spinner loading-md"></span> Loading...</a></li>
		{:else if search_results.length === 0 && search_query.length > 0}
			<li class="disabled"><a>No assets found</a></li>
		{:else}
			{#each search_results as asset (asset.symbol)}
				<li>
					<a
						href="/admin/trading/market-data?symbol={asset.symbol}"
						class="flex flex-col items-start gap-1 py-2"
						onclick={() => handle_select()}
					>
						<span class="font-bold">{asset.symbol}</span>
						<span class="text-base-content/50 text-xs">{asset.name}</span>
					</a>
				</li>
			{/each}
		{/if}
	</ul>
</div>
