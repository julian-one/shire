<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	let current_path = $derived(page.url.pathname);
</script>

<div class="flex flex-col gap-6">
	<!-- Trading Navigation Tabs -->
	<div class="tabs tabs-bordered w-full">
		<a
			href="/admin/trading"
			class="tab {current_path === '/admin/trading' ? 'tab-active font-bold' : ''}"
		>
			Account
		</a>
		<a
			href="/admin/trading/portfolio"
			class="tab {current_path.startsWith('/admin/trading/portfolio') ? 'tab-active font-bold' : ''}"
		>
			Portfolio
		</a>
		<a
			href="/admin/trading/market-data"
			class="tab {current_path.startsWith('/admin/trading/market-data') ? 'tab-active font-bold' : ''}"
		>
			Market Data
		</a>
		<a
			href="/admin/trading/live"
			class="tab {current_path.startsWith('/admin/trading/live') ? 'tab-active font-bold' : ''}"
		>
			Live Engines
		</a>
		<a
			href="/admin/trading/backtest"
			class="tab {current_path.startsWith('/admin/trading/backtest') ? 'tab-active font-bold' : ''}"
		>
			Backtesting
		</a>
	</div>

	<!-- Render the sub-page content -->
	<div class="w-full">
		{@render children()}
	</div>
</div>
