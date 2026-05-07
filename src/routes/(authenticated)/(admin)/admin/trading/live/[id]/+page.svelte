<script lang="ts">
	import type { PageData } from './$types';
	import { TradingController } from '$lib/controllers/trading';
	import { onMount, onDestroy } from 'svelte';

	let { data } = $props<{ data: PageData }>();

	let session = $state(data.details.session);
	let orders = $state(data.details.orders);

	const trading_controller = new TradingController();
	let interval_id: ReturnType<typeof setInterval>;

	async function refresh_details() {
		try {
			const details = await trading_controller.get_live_session_details(session.session_id);
			session = details.session;
			orders = details.orders;
		} catch {
			// Ignore error
		}
	}

	onMount(() => {
		if (session.status === 'running') {
			interval_id = setInterval(refresh_details, 5000);
		}
	});

	onDestroy(() => {
		if (interval_id) clearInterval(interval_id);
	});

	async function stop_session() {
		try {
			await trading_controller.stop_live_session(session.session_id);
			refresh_details();
		} catch {
			// Ignore error
		}
	}

	const format_date = (ts: string) => new Date(ts).toLocaleString();
	const format_money = (val: number | null) =>
		val ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val) : '-';
</script>

<svelte:head>
	<title>Session Details | Live Paper Trading</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="breadcrumbs text-base-content/70 -mb-4 text-sm font-semibold">
		<ul>
			<li><a href="/admin">Dashboard</a></li>
			<li><a href="/admin/trading/live">Live Paper Trading</a></li>
			<li class="font-mono text-xs">{session.session_id.split('-')[0]}</li>
		</ul>
	</div>

	<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
		<div class="flex flex-col gap-2">
			<h1 class="text-3xl font-black tracking-tight md:text-4xl">Session Details</h1>
			<p class="text-base-content/70 font-mono text-sm">{session.session_id}</p>
		</div>
		{#if session.status === 'running'}
			<button
				class="btn btn-error"
				onclick={stop_session}>Stop Session</button
			>
		{/if}
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
		<div class="stat bg-base-100 border-base-content/10 rounded-lg border">
			<div class="stat-title">Strategy</div>
			<div class="stat-value text-xl tracking-tighter uppercase">{session.strategy.replace('_', ' ')}</div>
		</div>
		<div class="stat bg-base-100 border-base-content/10 rounded-lg border">
			<div class="stat-title">Status</div>
			<div class="stat-value text-xl">
				{#if session.status === 'running'}
					<span class="text-success uppercase">Running</span>
				{:else if session.status === 'stopped'}
					<span class="text-base-content/50 uppercase">Stopped</span>
				{:else}
					<span class="text-error uppercase">{session.status}</span>
				{/if}
			</div>
		</div>
		<div class="stat bg-base-100 border-base-content/10 rounded-lg border">
			<div class="stat-title">Started At</div>
			<div class="stat-value text-lg tracking-tight">{format_date(session.started_at)}</div>
		</div>
		<div class="stat bg-base-100 border-base-content/10 rounded-lg border">
			<div class="stat-title">Ended At</div>
			<div class="stat-value text-lg tracking-tight">{session.ended_at ? format_date(session.ended_at) : '-'}</div>
		</div>
	</div>

	<div class="bg-base-100 border-base-content/10 overflow-hidden rounded-lg border">
		<h2 class="p-4 pb-0 text-xl font-bold">Orders</h2>
		<div class="overflow-x-auto p-4">
			<table class="table-zebra table w-full">
				<thead>
					<tr>
						<th>Date</th>
						<th>Symbol</th>
						<th>Side</th>
						<th>Type</th>
						<th>Status</th>
						<th>Qty</th>
						<th>Filled</th>
						<th>Avg Price</th>
					</tr>
				</thead>
				<tbody>
					{#each orders as order (order.order_id)}
						<tr>
							<td class="text-sm">{format_date(order.created_at)}</td>
							<td class="font-bold">{order.symbol}</td>
							<td>
								{#if order.side === 'buy'}
									<span class="badge badge-success badge-sm font-bold uppercase">Buy</span>
								{:else}
									<span class="badge badge-error badge-sm font-bold uppercase">Sell</span>
								{/if}
							</td>
							<td class="text-xs font-semibold uppercase">{order.type}</td>
							<td>
								{#if order.status === 'filled'}
									<span class="badge badge-success badge-sm">Filled</span>
								{:else if order.status === 'new' || order.status === 'accepted' || order.status === 'pending_new'}
									<span class="badge badge-info badge-sm">{order.status}</span>
								{:else}
									<span class="badge badge-neutral badge-sm">{order.status}</span>
								{/if}
							</td>
							<td>{order.qty}</td>
							<td>{order.filled_qty}</td>
							<td class="font-mono">{format_money(order.avg_price)}</td>
						</tr>
					{:else}
						<tr>
							<td
								colspan="8"
								class="text-center italic text-base-content/50 py-8">No orders placed yet.</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
