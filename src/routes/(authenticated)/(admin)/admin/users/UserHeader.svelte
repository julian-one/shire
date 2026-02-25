<script lang="ts">
	type Props = {
		total_users: number;
	};

	let { total_users }: Props = $props();
</script>

<header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">Users</h1>
	</div>
	<div class="flex items-center gap-2">
		<div class="stats bg-base-100 border-base-content/10 border">
			<div class="stat px-4 py-2">
				<div class="stat-title text-xs">Total Users</div>
				<div class="stat-value text-lg">{total_users}</div>
			</div>
		</div>
	</div>
</header>
