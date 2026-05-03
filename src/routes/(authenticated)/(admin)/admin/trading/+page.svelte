<script lang="ts">
	let { data } = $props();
	let account = $derived(data.account);
	let load_error = $derived(data.error);
</script>

<svelte:head>
	<title>Trading Account | Admin</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-2">
		<h1 class="text-3xl font-black tracking-tight md:text-4xl">Trading Account</h1>
		<p class="text-base-content/70 text-base md:text-lg">
			Live view of your connected broker account status and buying power.
		</p>
	</div>

	{#if load_error}
		<div class="alert alert-error">
			<span>{load_error}</span>
		</div>
	{:else if account}
		<div class="stats stats-vertical lg:stats-horizontal border-base-content/10 bg-base-100 border">
			<div class="stat">
				<div class="stat-title">Portfolio Value</div>
				<div class="stat-value text-primary"
					>${parseFloat(account.portfolio_value).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div
				>
				<div class="stat-desc">Status: {account.status}</div>
			</div>

			<div class="stat">
				<div class="stat-title">Buying Power</div>
				<div class="stat-value"
					>${parseFloat(account.buying_power).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div
				>
				<div class="stat-desc"
					>Daytrading: ${parseFloat(account.daytrading_buying_power).toLocaleString('en-US', {
						minimumFractionDigits: 2
					})}</div
				>
			</div>

			<div class="stat">
				<div class="stat-title">Cash</div>
				<div class="stat-value">${parseFloat(account.cash).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
				<div class="stat-desc">Currency: {account.currency}</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<div class="card bg-base-100 border-base-content/10 border">
				<div class="card-body">
					<h2 class="card-title">Account Details</h2>
					<table class="table-sm mt-4 table">
						<tbody>
							<tr>
								<td class="font-bold">Account #</td>
								<td>{account.account_number}</td>
							</tr>
							<tr>
								<td class="font-bold">ID</td>
								<td class="text-xs break-all">{account.id}</td>
							</tr>
							<tr>
								<td class="font-bold">Created At</td>
								<td>{new Date(account.created_at).toLocaleDateString()}</td>
							</tr>
							<tr>
								<td class="font-bold">Pattern Day Trader</td>
								<td>
									{#if account.pattern_day_trader}
										<div class="badge badge-warning">Yes</div>
									{:else}
										<div class="badge badge-success">No</div>
									{/if}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="card bg-base-100 border-base-content/10 border">
				<div class="card-body">
					<h2 class="card-title">Trading Status</h2>
					<table class="table-sm mt-4 table">
						<tbody>
							<tr>
								<td class="font-bold">Trading Blocked</td>
								<td>
									{#if account.trading_blocked}
										<div class="badge badge-error">Yes</div>
									{:else}
										<div class="badge badge-success">No</div>
									{/if}
								</td>
							</tr>
							<tr>
								<td class="font-bold">Transfers Blocked</td>
								<td>
									{#if account.transfers_blocked}
										<div class="badge badge-error">Yes</div>
									{:else}
										<div class="badge badge-success">No</div>
									{/if}
								</td>
							</tr>
							<tr>
								<td class="font-bold">Account Blocked</td>
								<td>
									{#if account.account_blocked}
										<div class="badge badge-error">Yes</div>
									{:else}
										<div class="badge badge-success">No</div>
									{/if}
								</td>
							</tr>
							<tr>
								<td class="font-bold">Shorting Enabled</td>
								<td>
									{#if account.shorting_enabled}
										<div class="badge badge-success">Yes</div>
									{:else}
										<div class="badge badge-neutral">No</div>
									{/if}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{/if}
</div>
