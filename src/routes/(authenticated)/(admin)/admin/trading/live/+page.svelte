<script lang="ts">
	import { TradingController } from '$lib/controllers/trading';
	import type { TradingSession } from '$lib/types/trading';
	import { onMount, onDestroy } from 'svelte';

	const trading_controller = new TradingController();

	let sessions = $state<TradingSession[]>([]);
	let loading = $state(true);
	let error = $state('');

	// Start form
	let symbol = $state('AAPL');
	let symbol_secondary = $state('MSFT');
	let strategy = $state('sma_crossover');
	let starting_capital = $state(100000);

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

	let starting = $state(false);
	let start_error = $state('');

	let interval_id: ReturnType<typeof setInterval>;

	async function load_sessions() {
		try {
			sessions = await trading_controller.list_live_sessions();
		} catch (err) {
			const e = err as { response?: { data?: string }; message?: string };
			error = e.response?.data || e.message || 'Failed to load sessions';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		load_sessions();
		interval_id = setInterval(load_sessions, 5000); // Poll every 5s
	});

	onDestroy(() => {
		if (interval_id) clearInterval(interval_id);
	});

	async function start_session() {
		starting = true;
		start_error = '';

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
			await trading_controller.start_live_session(symbols, strategy, starting_capital, parameters);
			load_sessions(); // Refresh
		} catch (err) {
			const e = err as { response?: { data?: string }; message?: string };
			start_error = e.response?.data || e.message || 'Failed to start session';
		} finally {
			starting = false;
		}
	}

	async function stop_session(id: string) {
		try {
			await trading_controller.stop_live_session(id);
			load_sessions();
		} catch {
			// Ignore error
		}
	}

	const format_date = (ts: string) => new Date(ts).toLocaleString();
</script>

<svelte:head>
	<title>Live Paper Trading | Admin</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="breadcrumbs text-base-content/70 -mb-4 text-sm font-semibold">
		<ul>
			<li><a href="/admin">Dashboard</a></li>
			<li>Trading</li>
			<li>Live Paper Trading</li>
		</ul>
	</div>

	<div class="flex flex-col gap-2">
		<h1 class="text-3xl font-black tracking-tight md:text-4xl">Live Paper Trading</h1>
		<p class="text-base-content/70 text-base md:text-lg">Run strategies in real-time using Alpaca Paper Trading.</p>
	</div>

	<div class="bg-base-100 border-base-content/10 flex flex-col gap-4 rounded-lg border p-4">
		<h2 class="text-xl font-bold">Start New Session</h2>

		<div class="flex flex-col flex-wrap items-end gap-4 sm:flex-row">
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
				<label class="label"><span class="label-text font-bold">Starting Capital</span></label>
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
		</div>

		<div class="mt-2 flex flex-col flex-wrap items-end gap-4 sm:flex-row">
			{#if strategy === 'sma_crossover'}
				<div class="form-control w-full sm:max-w-[8rem]">
					<label class="label"><span class="label-text text-xs font-bold">Short Period</span></label>
					<input
						type="number"
						bind:value={sma_short_period}
						class="input input-bordered input-sm w-full"
					/>
				</div>
				<div class="form-control w-full sm:max-w-[8rem]">
					<label class="label"><span class="label-text text-xs font-bold">Long Period</span></label>
					<input
						type="number"
						bind:value={sma_long_period}
						class="input input-bordered input-sm w-full"
					/>
				</div>
			{:else if strategy === 'rsi_reversion'}
				<div class="form-control w-full sm:max-w-[8rem]">
					<label class="label"><span class="label-text text-xs font-bold">Period</span></label>
					<input
						type="number"
						bind:value={rsi_period}
						class="input input-bordered input-sm w-full"
					/>
				</div>
				<div class="form-control w-full sm:max-w-[8rem]">
					<label class="label"><span class="label-text text-xs font-bold">Oversold</span></label>
					<input
						type="number"
						bind:value={rsi_oversold}
						class="input input-bordered input-sm w-full"
					/>
				</div>
				<div class="form-control w-full sm:max-w-[8rem]">
					<label class="label"><span class="label-text text-xs font-bold">Overbought</span></label>
					<input
						type="number"
						bind:value={rsi_overbought}
						class="input input-bordered input-sm w-full"
					/>
				</div>
			{:else if strategy === 'bollinger_bands'}
				<div class="form-control w-full sm:max-w-[8rem]">
					<label class="label"><span class="label-text text-xs font-bold">Period</span></label>
					<input
						type="number"
						bind:value={bb_period}
						class="input input-bordered input-sm w-full"
					/>
				</div>
				<div class="form-control w-full sm:max-w-[8rem]">
					<label class="label"><span class="label-text text-xs font-bold">Std Dev</span></label>
					<input
						type="number"
						bind:value={bb_std_dev}
						step="0.1"
						class="input input-bordered input-sm w-full"
					/>
				</div>
			{:else if strategy === 'pairs_trading'}
				<div class="form-control w-full sm:max-w-[8rem]">
					<label class="label"><span class="label-text text-xs font-bold">Lookback</span></label>
					<input
						type="number"
						bind:value={pt_period}
						class="input input-bordered input-sm w-full"
					/>
				</div>
				<div class="form-control w-full sm:max-w-[8rem]">
					<label class="label"><span class="label-text text-xs font-bold">Entry Z</span></label>
					<input
						type="number"
						bind:value={pt_entry_z}
						step="0.1"
						class="input input-bordered input-sm w-full"
					/>
				</div>
				<div class="form-control w-full sm:max-w-[8rem]">
					<label class="label"><span class="label-text text-xs font-bold">Exit Z</span></label>
					<input
						type="number"
						bind:value={pt_exit_z}
						step="0.1"
						class="input input-bordered input-sm w-full"
					/>
				</div>
			{/if}
			<button
				class="btn btn-primary btn-sm ml-auto"
				onclick={start_session}
				disabled={starting}
			>
				{#if starting}
					<span class="loading loading-spinner loading-xs"></span>
				{:else}
					Start Engine
				{/if}
			</button>
		</div>

		{#if start_error}
			<div class="alert alert-error mt-2 py-2">
				<span>{start_error}</span>
			</div>
		{/if}
	</div>

	<div class="bg-base-100 border-base-content/10 overflow-hidden rounded-lg border">
		<h2 class="p-4 pb-0 text-xl font-bold">Sessions</h2>
		<div class="overflow-x-auto p-4">
			{#if loading && sessions.length === 0}
				<div class="flex justify-center p-8"><span class="loading loading-spinner"></span></div>
			{:else if error}
				<div class="alert alert-error"><span>{error}</span></div>
			{:else}
				<table class="table-zebra table w-full">
					<thead>
						<tr>
							<th>Session ID</th>
							<th>Strategy</th>
							<th>Status</th>
							<th>Started</th>
							<th>Ended</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each sessions as session (session.session_id)}
							<tr>
								<td class="font-mono text-sm">
									<a
										href="/admin/trading/live/{session.session_id}"
										class="link link-primary"
									>
										{session.session_id.split('-')[0]}...
									</a>
								</td>
								<td class="text-xs font-semibold uppercase">{session.strategy.replace('_', ' ')}</td>
								<td>
									{#if session.status === 'running'}
										<span class="badge badge-success badge-sm font-bold uppercase">Running</span>
									{:else if session.status === 'stopped'}
										<span class="badge badge-neutral badge-sm font-bold uppercase">Stopped</span>
									{:else}
										<span class="badge badge-error badge-sm font-bold uppercase">{session.status}</span>
									{/if}
								</td>
								<td class="text-sm">{format_date(session.started_at)}</td>
								<td class="text-base-content/50 text-sm">{session.ended_at ? format_date(session.ended_at) : '-'}</td>
								<td>
									{#if session.status === 'running'}
										<button
											class="btn btn-error btn-xs"
											onclick={() => stop_session(session.session_id)}>Stop</button
										>
									{:else}
										<a
											href="/admin/trading/live/{session.session_id}"
											class="btn btn-neutral btn-xs">View</a
										>
									{/if}
								</td>
							</tr>
						{:else}
							<tr>
								<td
									colspan="6"
									class="text-center italic text-base-content/50 py-8">No trading sessions found.</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
</div>
