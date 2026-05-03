<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { createChart, CandlestickSeries, ColorType } from 'lightweight-charts';
	import AssetSearch from './AssetSearch.svelte';

	let { data } = $props();
	let symbol = $derived(data.symbol);
	let bars = $derived(data.bars);
	let load_error = $derived(data.error);

	// EventSource logic
	let event_source = $state<EventSource | null>(null);
	type LiveTrade = { t: string; p: number; s: number; c?: string[] };
	let live_trades = $state<LiveTrade[]>([]);
	const max_live_trades = 50;

	$effect(() => {
		if (symbol && page.data.session?.session_id) {
			// Clean up previous connection and state
			if (event_source) {
				event_source.close();
				event_source = null;
			}
			live_trades = [];

			const base_url = env.PUBLIC_CITADEL_API_URL || 'http://localhost:8080';
			const token = page.data.session.session_id;
			const stream_url = `${base_url}/trading/stocks/stream?symbol=${symbol}&token=${token}`;

			event_source = new EventSource(stream_url, { withCredentials: true });

			event_source.onmessage = (event) => {
				try {
					const trade = JSON.parse(event.data);
					live_trades.unshift(trade);
					if (live_trades.length > max_live_trades) {
						live_trades.pop();
					}
				} catch {
					// ignore
				}
			};

			event_source.onerror = () => {
				// ignore
			};
		}
	});

	onDestroy(() => {
		if (event_source) {
			event_source.close();
		}
	});

	const format_time = (ts: string) => new Date(ts).toLocaleTimeString();

	let chart_container = $state<HTMLElement | null>(null);

	$effect(() => {
		if (chart_container && bars && bars.length > 0) {
			const chart = createChart(chart_container, {
				height: 400,
				layout: {
					background: { type: ColorType.Solid, color: 'transparent' },
					textColor: '#888' // Neutral text color for axis
				},
				grid: {
					vertLines: { color: 'rgba(128, 128, 128, 0.1)' },
					horzLines: { color: 'rgba(128, 128, 128, 0.1)' }
				},
				timeScale: {
					borderColor: 'rgba(128, 128, 128, 0.1)'
				},
				rightPriceScale: {
					borderColor: 'rgba(128, 128, 128, 0.1)'
				}
			});

			const candle_series = chart.addSeries(CandlestickSeries, {
				upColor: '#00a96e', // DaisyUI success
				downColor: '#ff5861', // DaisyUI error
				borderVisible: false,
				wickUpColor: '#00a96e',
				wickDownColor: '#ff5861'
			});

			const chart_data = [...bars]
				.sort((a, b) => new Date(a.t).getTime() - new Date(b.t).getTime())
				.map((b) => ({
					time: b.t.split('T')[0],
					open: b.o,
					high: b.h,
					low: b.l,
					close: b.c
				}));

			candle_series.setData(chart_data);

			const handle_resize = () => {
				if (chart_container) {
					chart.applyOptions({ width: chart_container.clientWidth });
				}
			};

			window.addEventListener('resize', handle_resize);
			// Trigger initial resize to fit container
			handle_resize();

			return () => {
				window.removeEventListener('resize', handle_resize);
				chart.remove();
			};
		}
	});
</script>

<svelte:head>
	<title>Market Data | Admin</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="breadcrumbs text-base-content/70 -mb-4 text-sm font-semibold">
		<ul>
			<li><a href="/admin">Dashboard</a></li>
			<li>Trading</li>
			<li>Market Data</li>
		</ul>
	</div>

	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div class="flex flex-col gap-2">
			<h1 class="text-3xl font-black tracking-tight md:text-4xl">{symbol} Market Data</h1>
			<p class="text-base-content/70 text-base md:text-lg"> Live tape and historical price bars. </p>
		</div>
		<AssetSearch />
	</div>

	{#if load_error}
		<div class="alert alert-error">
			<span>{load_error}</span>
		</div>
	{:else}
		<!-- Live Tape Section -->
		<div class="bg-base-100 border-base-content/10 flex flex-col gap-4 rounded-lg border p-4">
			<h2 class="flex items-center gap-2 text-xl font-bold">
				Live Tape
				{#if event_source}
					<span class="badge badge-success badge-sm animate-pulse">Live</span>
				{:else}
					<span class="badge badge-error badge-sm">Disconnected</span>
				{/if}
			</h2>
			<div class="overflow-x-auto">
				<table class="table-zebra table-sm table w-full">
					<thead>
						<tr>
							<th>Time</th>
							<th>Price</th>
							<th>Size</th>
							<th>Conditions</th>
						</tr>
					</thead>
					<tbody>
						{#each live_trades as trade (trade.t + trade.p + trade.s)}
							<tr>
								<td class="text-base-content/70 font-bold">{format_time(trade.t)}</td>
								<td class="font-semibold">${trade.p.toFixed(2)}</td>
								<td>{trade.s.toLocaleString()}</td>
								<td class="text-base-content/50 text-xs">{trade.c ? trade.c.join(', ') : ''}</td>
							</tr>
						{:else}
							<tr>
								<td
									colspan="4"
									class="text-base-content/50 py-4 text-center italic"
									>Waiting for live trades... (Market may be closed)</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		{#if bars && bars.length > 0}
			<h2 class="mt-4 text-xl font-bold">Historical Daily Chart</h2>
			<div class="bg-base-100 border-base-content/10 overflow-hidden rounded-lg border p-4">
				<div
					bind:this={chart_container}
					class="w-full"
				></div>
			</div>
		{:else}
			<div class="alert alert-info mt-4">
				<span>No market data found for {symbol}.</span>
			</div>
		{/if}
	{/if}
</div>
