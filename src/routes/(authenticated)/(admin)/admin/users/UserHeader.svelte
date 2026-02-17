<script lang="ts">
	type Props = {
		total_users: number;
	};

	let { total_users }: Props = $props();
</script>

<header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Users</h1>
	</div>
	<div class="flex items-center gap-2">
		<div class="stats bg-base-100 border-base-content/5 border shadow-sm">
			<div class="stat px-4 py-2">
				<div class="stat-title text-xs">Total Users</div>
				<div class="stat-value text-lg">{total_users}</div>
			</div>
		</div>
	</div>
</header>
