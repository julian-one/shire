<script lang="ts">
	import type { Session } from '$lib/types/session';

	type Props = {
		total_posts: number;
		session: Session | null;
		search: string;
		order_by: string;
		on_search: (event: Event) => void;
		on_sort: (order_by: string) => void;
		on_clear: () => void;
	};

	let { total_posts, session, search = $bindable(), order_by, on_search, on_sort, on_clear }: Props = $props();

	let has_active_filters = $derived(search !== '' || order_by !== 'created_at:desc');

	const sort_options = [
		{ label: 'Newest', value: 'created_at:desc' },
		{ label: 'Oldest', value: 'created_at:asc' },
		{ label: 'A\u2013Z', value: 'title:asc' },
		{ label: 'Z\u2013A', value: 'title:desc' }
	];
</script>

<header class="space-y-4">
	<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-xl font-black tracking-tight md:text-2xl">Blog</h1>
			<p class="text-base-content/60 text-sm md:text-base">
				{total_posts}
				{total_posts === 1 ? 'post' : 'posts'}
			</p>
		</div>
		{#if session}
			<a
				href="/blog/new"
				class="btn btn-primary btn-sm">Write</a
			>
		{/if}
	</div>

	<div class="flex flex-col gap-2 sm:flex-row sm:items-center">
		<input
			type="text"
			placeholder="Search posts..."
			class="input input-bordered input-sm w-full sm:max-w-xs"
			value={search}
			oninput={on_search}
		/>
		<div class="flex items-center gap-2">
			<div class="join">
				{#each sort_options as option (option.value)}
					<button
						class="btn join-item btn-sm {order_by === option.value ? 'btn-active' : ''}"
						onclick={() => on_sort(option.value)}
					>
						{option.label}
					</button>
				{/each}
			</div>
			{#if has_active_filters}
				<button
					class="btn btn-ghost btn-sm"
					onclick={on_clear}>Clear</button
				>
			{/if}
		</div>
	</div>
</header>
