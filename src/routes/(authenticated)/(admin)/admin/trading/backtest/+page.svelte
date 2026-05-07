<script lang="ts">
	import { TradingController } from '$lib/controllers/trading';
	import type { Portfolio } from '$lib/types/trading';
	import { createChart, LineSeries, ColorType } from 'lightweight-charts';
	import { SvelteDate } from 'svelte/reactivity';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let backtests = $derived(data.backtests || []);

	const trading_controller = new TradingController();

	const today = new SvelteDate();
	const two_years_ago = new SvelteDate(today);
	two_years_ago.setFullYear(today.getFullYear() - 2);

	let symbol = $state('AAPL');
	let symbol_secondary = $state('MSFT');
	// Default to last 2 years
	let start_date = $state(two_years_ago.toISOString().split('T')[0]);
	let end_date = $state(today.toISOString().split('T')[0]);
	let strategy = $state('sma_crossover');
	let starting_capital = $state(100);

	let sma_short_period = $state(10);
	let sma_long_period = $state(50);
	let rsi_period = $state(14);
	let rsi_oversold = $state(30);
	let rsi_overbought = $state(70);
	let bb_period = $state(20);
	let bb_std_dev = $state(2);
	let pt_period = $state(20);
	let pt_entry_z = $state(2.0);
	let pt_exit_z = $state(0.0);

	let loading = $state(false);
	let error = $state('');
	let portfolio = $state<Portfolio | null>(null);

	let chart_container = $state<HTMLElement | null>(null);

	async function run_backtest() {
		loading = true;
		error = '';
		portfolio = null;

		let symbols = [symbol];
		if (strategy === 'pairs_trading') {
			symbols.push(symbol_secondary);
		}

		let parameters: Record<string, unknown> = {};
		if (strategy === 'sma_crossover') {
			parameters = { short_period: sma_short_period, long_period: sma_long_period };
		} else if (strategy === 'rsi_reversion') {
			parameters = { period: rsi_period, oversold: rsi_oversold, overbought: rsi_overbought };
		} else if (strategy === 'bollinger_bands') {
			parameters = { period: bb_period, std_dev: bb_std_dev };
		} else if (strategy === 'pairs_trading') {
			parameters = { period: pt_period, entry_z: pt_entry_z, exit_z: pt_exit_z };
		}

		try {
			const res = await trading_controller.run_backtest(
				symbols,
				new Date(start_date).toISOString(),
				new Date(end_date).toISOString(),
				strategy,
				starting_capital,
				parameters
			);
			portfolio = res.portfolio;
			await invalidateAll(); // refresh backtest history
		} catch (err) {
			const e = err as { response?: { data?: string }; message?: string };
			error = e.response?.data || e.message || 'Backtest failed';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (chart_container && portfolio && portfolio.equity_log.length > 0) {
			const chart = createChart(chart_container, {
				height: 400,
				layout: {
					background: { type: ColorType.Solid, color: 'transparent' },
					textColor: '#888'
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

			const line_series = chart.addSeries(LineSeries, {
				color: '#3b82f6', // Tailwind blue-500
				lineWidth: 2
			});

			const chart_data = portfolio.equity_log.map((log) => ({
				time: log.timestamp.split('T')[0],
				value: log.equity
			}));

			line_series.setData(chart_data);
			chart.timeScale().fitContent();

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

	const format_money = (val: number) =>
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
	const format_percent = (val: number) =>
		new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(val);
	const format_date = (ts: string) => new Date(ts).toLocaleDateString();
</script>

<svelte:head>
	<title>Backtesting | Admin</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="breadcrumbs text-base-content/70 -mb-4 text-sm font-semibold">
		<ul>
			<li><a href="/admin">Dashboard</a></li>
			<li>Trading</li>
			<li>Backtest Simulator</li>
		</ul>
	</div>

	<div class="flex flex-col gap-2">
		<h1 class="text-3xl font-black tracking-tight md:text-4xl">Backtest Simulator</h1>
		<p class="text-base-content/70 text-base md:text-lg">Run historical simulations on trading strategies.</p>
	</div>

	<div class="bg-base-100 border-base-content/10 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-end">
		<div class="form-control w-full sm:max-w-xs">
			<label class="label"><span class="label-text font-bold">Symbol</span></label>
			<input
				type="text"
				bind:value={symbol}
				class="input input-bordered w-full uppercase"
				placeholder="AAPL"
			/>
		</div>
		<div class="form-control w-full sm:max-w-xs">
			<label class="label"><span class="label-text font-bold">Start Date</span></label>
			<input
				type="date"
				bind:value={start_date}
				class="input input-bordered w-full"
			/>
		</div>
		<div class="form-control w-full sm:max-w-xs">
			<label class="label"><span class="label-text font-bold">End Date</span></label>
			<input
				type="date"
				bind:value={end_date}
				class="input input-bordered w-full"
			/>
		</div>
		<div class="form-control w-full sm:max-w-xs">
			<label class="label"><span class="label-text font-bold">Strategy</span></label>
			<select
				bind:value={strategy}
				class="select select-bordered w-full"
			>
				<option value="sma_crossover">SMA Crossover</option>
				<option value="rsi_reversion">RSI Mean Reversion</option>
				<option value="bollinger_bands">Bollinger Bands</option>
				<option value="pairs_trading">Pairs Trading</option>
			</select>
		</div>
		{#if strategy === 'pairs_trading'}
			<div class="form-control w-full sm:max-w-xs">
				<label class="label"><span class="label-text font-bold">Secondary Symbol</span></label>
				<input
					type="text"
					bind:value={symbol_secondary}
					class="input input-bordered w-full uppercase"
					placeholder="MSFT"
				/>
			</div>
		{/if}
		<div class="form-control w-full sm:max-w-xs">
			<label class="label"><span class="label-text font-bold">Initial Capital</span></label>
			<div class="input input-bordered flex items-center gap-2">
				<span class="text-base-content/50 font-bold">$</span>
				<input
					type="number"
					bind:value={starting_capital}
					class="w-full bg-transparent outline-none"
					min="1"
				/>
			</div>
		</div>
		<button
			class="btn btn-primary mt-4 w-full sm:mt-0 sm:w-auto"
			onclick={run_backtest}
			disabled={loading}
		>
			{#if loading}
				<span class="loading loading-spinner"></span> Running...
			{:else}
				Run Backtest
			{/if}
		</button>
	</div>

	<div class="bg-base-100 border-base-content/10 flex flex-wrap items-end gap-4 rounded-lg border p-4">
		<h3 class="w-full text-lg font-bold">Strategy Parameters</h3>
		{#if strategy === 'sma_crossover'}
			<div class="form-control w-full sm:max-w-xs">
				<label class="label"><span class="label-text font-bold">Short Period</span></label>
				<input
					type="number"
					bind:value={sma_short_period}
					class="input input-bordered w-full"
				/>
			</div>
			<div class="form-control w-full sm:max-w-xs">
				<label class="label"><span class="label-text font-bold">Long Period</span></label>
				<input
					type="number"
					bind:value={sma_long_period}
					class="input input-bordered w-full"
				/>
			</div>
		{:else if strategy === 'rsi_reversion'}
			<div class="form-control w-full sm:max-w-xs">
				<label class="label"><span class="label-text font-bold">Period</span></label>
				<input
					type="number"
					bind:value={rsi_period}
					class="input input-bordered w-full"
				/>
			</div>
			<div class="form-control w-full sm:max-w-xs">
				<label class="label"><span class="label-text font-bold">Oversold Threshold</span></label>
				<input
					type="number"
					bind:value={rsi_oversold}
					class="input input-bordered w-full"
				/>
			</div>
			<div class="form-control w-full sm:max-w-xs">
				<label class="label"><span class="label-text font-bold">Overbought Threshold</span></label>
				<input
					type="number"
					bind:value={rsi_overbought}
					class="input input-bordered w-full"
				/>
			</div>
		{:else if strategy === 'bollinger_bands'}
			<div class="form-control w-full sm:max-w-xs">
				<label class="label"><span class="label-text font-bold">Period</span></label>
				<input
					type="number"
					bind:value={bb_period}
					class="input input-bordered w-full"
				/>
			</div>
			<div class="form-control w-full sm:max-w-xs">
				<label class="label"><span class="label-text font-bold">Std Dev Multiplier</span></label>
				<input
					type="number"
					bind:value={bb_std_dev}
					step="0.1"
					class="input input-bordered w-full"
				/>
			</div>
		{:else if strategy === 'pairs_trading'}
			<div class="form-control w-full sm:max-w-xs">
				<label class="label"><span class="label-text font-bold">Lookback Period</span></label>
				<input
					type="number"
					bind:value={pt_period}
					class="input input-bordered w-full"
				/>
			</div>
			<div class="form-control w-full sm:max-w-xs">
				<label class="label"><span class="label-text font-bold">Entry Z-Score</span></label>
				<input
					type="number"
					bind:value={pt_entry_z}
					step="0.1"
					class="input input-bordered w-full"
				/>
			</div>
			<div class="form-control w-full sm:max-w-xs">
				<label class="label"><span class="label-text font-bold">Exit Z-Score</span></label>
				<input
					type="number"
					bind:value={pt_exit_z}
					step="0.1"
					class="input input-bordered w-full"
				/>
			</div>
		{/if}
	</div>

	{#if error}
		<div class="alert alert-error">
			<span>{error}</span>
		</div>
	{/if}

	{#if portfolio}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-5">
			<div class="stat bg-base-100 border-base-content/10 rounded-lg border">
				<div class="stat-title">Starting Equity</div>
				<div class="stat-value text-xl">{format_money(starting_capital)}</div>
			</div>
			<div class="stat bg-base-100 border-base-content/10 rounded-lg border">
				<div class="stat-title">Ending Equity</div>
				<div
					class="stat-value text-xl {portfolio.equity_log[portfolio.equity_log.length - 1].equity >= starting_capital
						? 'text-success'
						: 'text-error'}"
				>
					{format_money(portfolio.equity_log[portfolio.equity_log.length - 1].equity)}
				</div>
			</div>
			<div class="stat bg-base-100 border-base-content/10 rounded-lg border">
				<div class="stat-title">Total Return</div>
				<div class="stat-value text-xl {portfolio.metrics.total_return >= 0 ? 'text-success' : 'text-error'}">
					{format_percent(portfolio.metrics.total_return)}
				</div>
			</div>
			<div class="stat bg-base-100 border-base-content/10 rounded-lg border">
				<div class="stat-title">Sharpe Ratio</div>
				<div class="stat-value text-xl">{portfolio.metrics.sharpe_ratio.toFixed(2)}</div>
			</div>
			<div class="stat bg-base-100 border-base-content/10 rounded-lg border">
				<div class="stat-title">Max Drawdown</div>
				<div class="stat-value text-error text-xl">{format_percent(portfolio.metrics.max_drawdown)}</div>
			</div>
		</div>

		<div class="bg-base-100 border-base-content/10 rounded-lg border p-4">
			<h2 class="mb-4 text-xl font-bold">Equity Curve</h2>
			<div
				bind:this={chart_container}
				class="w-full"
			></div>
		</div>

		<div class="bg-base-100 border-base-content/10 overflow-hidden rounded-lg border">
			<h2 class="p-4 pb-0 text-xl font-bold">Trade History</h2>
			<div class="overflow-x-auto p-4">
				<table class="table-zebra table w-full">
					<thead>
						<tr>
							<th>Date</th>
							<th>Side</th>
							<th>Symbol</th>
							<th>Quantity</th>
							<th>Price</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						{#each [...portfolio.trades].reverse() as trade (trade.timestamp + trade.symbol + trade.side)}
							<tr>
								<td class="font-bold">{format_date(trade.timestamp)}</td>
								<td>
									{#if trade.side === 'buy'}
										<span class="badge badge-success badge-sm font-bold uppercase">Buy</span>
									{:else}
										<span class="badge badge-error badge-sm font-bold uppercase">Sell</span>
									{/if}
								</td>
								<td class="font-semibold">{trade.symbol}</td>
								<td>{trade.quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
								<td>{format_money(trade.price)}</td>
								<td class="text-base-content/70">{format_money(trade.price * trade.quantity)}</td>
							</tr>
						{:else}
							<tr>
								<td
									colspan="6"
									class="text-center italic text-base-content/50 py-4">No trades executed.</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

	<div class="bg-base-100 border-base-content/10 mt-8 rounded-lg border">
		<h2 class="p-4 pb-0 text-xl font-bold">Backtest History</h2>
		<div class="overflow-x-auto p-4">
			<table class="table-zebra table-sm table w-full">
				<thead>
					<tr>
						<th>Date Run</th>
						<th>Strategy</th>
						<th>Symbols</th>
						<th>Period</th>
						<th>Total Return</th>
						<th>Sharpe</th>
						<th>Max DD</th>
					</tr>
				</thead>
				<tbody>
					{#each backtests as bt (bt.backtest_id)}
						{@const metrics = JSON.parse(bt.metrics || '{}')}
						{@const symbols = JSON.parse(bt.symbols || '[]')}
						<tr>
							<td class="text-base-content/70 text-xs">{new Date(bt.created_at).toLocaleString()}</td>
							<td class="font-bold">{bt.strategy}</td>
							<td>{symbols.join(', ')}</td>
							<td class="text-xs">{bt.start_date.split('T')[0]} to {bt.end_date.split('T')[0]}</td>
							<td class="font-bold {(metrics.total_return || 0) >= 0 ? 'text-success' : 'text-error'}">
								{format_percent(metrics.total_return || 0)}
							</td>
							<td>{(metrics.sharpe_ratio || 0).toFixed(2)}</td>
							<td class="text-error">{format_percent(metrics.max_drawdown || 0)}</td>
						</tr>
					{:else}
						<tr>
							<td
								colspan="7"
								class="text-center italic text-base-content/50 py-4">No historical backtests found.</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
