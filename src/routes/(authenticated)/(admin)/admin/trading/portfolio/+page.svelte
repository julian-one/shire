<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { TradingController } from '$lib/controllers/trading';
	import { createChart, LineSeries, ColorType } from 'lightweight-charts';

	let { data } = $props();
	let positions = $derived(data.positions || []);
	let history = $derived(data.history);
	let load_error = $derived(data.error);

	let is_submitting = $state(false);
	let trade_error = $state('');
	let trade_success = $state('');

	let trade_symbol = $state('');
	let trade_qty = $state<number>(1);
	let trade_side = $state<'buy' | 'sell'>('buy');
	let trade_type = $state<'market' | 'limit'>('market');
	let trade_limit = $state<number | undefined>(undefined);

	let chart_container = $state<HTMLElement | null>(null);

	$effect(() => {
		if (chart_container && history && history.timestamp && history.equity) {
			const chart = createChart(chart_container, {
				height: 300,
				layout: {
					background: { type: ColorType.Solid, color: 'transparent' },
					textColor: '#888'
				},
				grid: {
					vertLines: { color: 'rgba(128, 128, 128, 0.1)' },
					horzLines: { color: 'rgba(128, 128, 128, 0.1)' }
				},
				rightPriceScale: {
					borderColor: 'rgba(128, 128, 128, 0.1)'
				},
				timeScale: {
					borderColor: 'rgba(128, 128, 128, 0.1)',
					timeVisible: history.timeframe !== '1D'
				}
			});

			const line_series = chart.addSeries(LineSeries, {
				color: '#00a96e', // DaisyUI success color (green)
				lineWidth: 2
			});

			// Check if overall PnL is negative to use red color
			const latest_pl = history.profit_loss_pct[history.profit_loss_pct.length - 1];
			if (latest_pl < 0) {
				line_series.applyOptions({ color: '#ff5861' }); // DaisyUI error color (red)
			}

			const chart_data = history.timestamp.map((ts, i) => ({
				// Lightweight charts needs unix timestamp in seconds for time based data
				time: ts as import('lightweight-charts').Time,
				value: history.equity[i]
			}));

			line_series.setData(chart_data);

			const handle_resize = () => {
				if (chart_container) {
					chart.applyOptions({ width: chart_container.clientWidth });
				}
			};

			window.addEventListener('resize', handle_resize);
			handle_resize();

			return () => {
				window.removeEventListener('resize', handle_resize);
				chart.remove();
			};
		}
	});

	async function handle_trade(e: Event) {
		e.preventDefault();
		if (!trade_symbol || trade_qty <= 0) return;

		is_submitting = true;
		trade_error = '';
		trade_success = '';

		try {
			const controller = new TradingController();
			await controller.place_order({
				symbol: trade_symbol.toUpperCase(),
				quantity: trade_qty,
				side: trade_side,
				type: trade_type,
				limit: trade_type === 'limit' ? trade_limit : undefined
			});

			trade_success = `Successfully placed ${trade_side} order for ${trade_qty} ${trade_symbol.toUpperCase()}`;
			trade_symbol = '';
			trade_qty = 1;
			trade_type = 'market';
			trade_limit = undefined;

			// Refresh data
			await invalidateAll();
		} catch (err) {
			const e = err as { response?: { data?: { error?: string } }; message?: string };
			trade_error = e.response?.data?.error || e.message || 'Failed to place order';
		} finally {
			is_submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Portfolio | Admin</title>
</svelte:head>

<div class="mt-4 flex flex-col gap-6">
	<div class="flex flex-col gap-2">
		<h1 class="text-3xl font-black tracking-tight md:text-4xl">Portfolio</h1>
		<p class="text-base-content/70 text-base md:text-lg"> Manage your current holdings and place manual trades. </p>
	</div>

	{#if load_error}
		<div class="alert alert-error">
			<span>{load_error}</span>
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Left Column: Chart & Positions -->
		<div class="flex flex-col gap-6 lg:col-span-2">
			<!-- Chart -->
			<div class="card bg-base-100 border-base-content/10 border">
				<div class="card-body">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="card-title">Equity History (1M)</h2>
						{#if history}
							{@const latest_pl = history.profit_loss[history.profit_loss.length - 1] || 0}
							{@const latest_pl_pct = (history.profit_loss_pct[history.profit_loss_pct.length - 1] || 0) * 100}
							<div class="text-right">
								<div class="text-xl font-bold"
									>${history.base_value.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})}</div
								>
								<div class="text-sm font-semibold {latest_pl >= 0 ? 'text-success' : 'text-error'}">
									{latest_pl >= 0 ? '+' : ''}${latest_pl.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({latest_pl_pct.toFixed(
										2
									)}%)
								</div>
							</div>
						{/if}
					</div>
					{#if history && history.timestamp && history.timestamp.length > 0}
						<div
							bind:this={chart_container}
							class="w-full"
						></div>
					{:else}
						<div class="alert alert-info">No portfolio history available yet.</div>
					{/if}
				</div>
			</div>

			<!-- Positions Table -->
			<div class="card bg-base-100 border-base-content/10 border">
				<div class="card-body">
					<h2 class="card-title">Current Positions</h2>
					{#if positions.length > 0}
						<div class="mt-4 overflow-x-auto">
							<table class="table-sm table w-full">
								<thead>
									<tr>
										<th>Symbol</th>
										<th>Qty</th>
										<th>Market Value</th>
										<th>Avg Cost</th>
										<th>Current Price</th>
										<th>Unrealized P/L</th>
									</tr>
								</thead>
								<tbody>
									{#each positions as pos (pos.symbol)}
										{@const pl_pct = parseFloat(pos.unrealized_plpc) * 100}
										{@const pl = parseFloat(pos.unrealized_pl)}
										<tr>
											<td class="font-bold">{pos.symbol}</td>
											<td>{pos.qty}</td>
											<td>${parseFloat(pos.market_value).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
											<td>${parseFloat(pos.avg_entry_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td
											>
											<td>${parseFloat(pos.current_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
											<td class="font-bold {pl >= 0 ? 'text-success' : 'text-error'}">
												{pl >= 0 ? '+' : ''}${pl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
												({pl_pct.toFixed(2)}%)
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{:else}
						<div class="alert alert-info mt-4">
							<span>You do not have any open positions.</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Right Column: Trade Form -->
		<div class="card bg-base-100 border-base-content/10 h-fit border">
			<div class="card-body">
				<h2 class="card-title">Place Order</h2>
				<p class="text-base-content/70 text-sm">Manually buy or sell assets to construct your portfolio.</p>

				{#if trade_error}
					<div class="alert alert-error mt-4 p-2 text-sm">
						<span>{trade_error}</span>
					</div>
				{/if}

				{#if trade_success}
					<div class="alert alert-success mt-4 p-2 text-sm">
						<span>{trade_success}</span>
					</div>
				{/if}

				<form
					class="mt-4 flex flex-col gap-4"
					onsubmit={handle_trade}
				>
					<div class="form-control">
						<label class="label"><span class="label-text font-bold">Action</span></label>
						<div class="join w-full">
							<button
								type="button"
								class="btn join-item w-1/2 {trade_side === 'buy' ? 'btn-success' : 'btn-outline'}"
								onclick={() => (trade_side = 'buy')}
							>
								Buy
							</button>
							<button
								type="button"
								class="btn join-item w-1/2 {trade_side === 'sell' ? 'btn-error' : 'btn-outline'}"
								onclick={() => (trade_side = 'sell')}
							>
								Sell
							</button>
						</div>
					</div>

					<div class="form-control">
						<label
							class="label"
							for="symbol"><span class="label-text font-bold">Symbol</span></label
						>
						<input
							type="text"
							id="symbol"
							bind:value={trade_symbol}
							placeholder="e.g. AAPL"
							class="input input-bordered uppercase"
							required
						/>
					</div>

					<div class="form-control">
						<label
							class="label"
							for="qty"><span class="label-text font-bold">Quantity</span></label
						>
						<input
							type="number"
							id="qty"
							bind:value={trade_qty}
							min="0.000000001"
							step="any"
							class="input input-bordered"
							required
						/>
					</div>

					<div class="form-control">
						<label class="label"><span class="label-text font-bold">Order Type</span></label>
						<select
							class="select select-bordered"
							bind:value={trade_type}
						>
							<option value="market">Market</option>
							<option value="limit">Limit</option>
						</select>
					</div>

					{#if trade_type === 'limit'}
						<div class="form-control">
							<label
								class="label"
								for="limit"><span class="label-text font-bold">Limit Price</span></label
							>
							<input
								type="number"
								id="limit"
								bind:value={trade_limit}
								min="0.01"
								step="any"
								class="input input-bordered"
								placeholder="e.g. 150.00"
								required
							/>
						</div>
					{/if}

					<div class="form-control mt-4">
						<button
							type="submit"
							class="btn btn-primary"
							disabled={is_submitting || !trade_symbol || trade_qty <= 0}
						>
							{#if is_submitting}
								<span class="loading loading-spinner"></span>
							{/if}
							Submit Order
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
