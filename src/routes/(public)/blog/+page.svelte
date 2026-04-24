<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Pagination from '$lib/components/Pagination.svelte';
	import PostList from './PostList.svelte';
	import BlogFilters from './BlogFilters.svelte';

	let { data } = $props();

	let search = $derived(data.search);
	let my_posts = $derived(data.my_posts);
	let order_by = $derived(data.order_by);
	let session = $derived(page.data.session);

	let timer: ReturnType<typeof setTimeout>;

	function apply_now() {
		const u = new URL(page.url);
		if (search) u.searchParams.set('search', search);
		else u.searchParams.delete('search');

		if (my_posts) u.searchParams.set('my_posts', my_posts);
		else u.searchParams.delete('my_posts');

		if (order_by) u.searchParams.set('order_by', order_by);
		else u.searchParams.delete('order_by');

		u.searchParams.delete('offset');
		goto(u, { keepFocus: true, noScroll: true, replaceState: true });
	}

	function trigger_update() {
		clearTimeout(timer);
		timer = setTimeout(apply_now, 300);
	}

	function handle_sort(value: string) {
		order_by = value;
		apply_now();
	}

	function handle_clear_all() {
		search = '';
		my_posts = '';
		apply_now();
	}
</script>

<div class="space-y-4 pb-8 md:pb-12">
	<header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">Blog</h1>
			<p class="text-base-content/60 text-sm md:text-base">
				{data.total}
				{data.total === 1 ? 'post' : 'posts'}
			</p>
		</div>
		{#if session}
			<a
				href="/blog/new"
				class="btn btn-primary"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-5 w-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 4.5v15m7.5-7.5h-15"
					/>
				</svg>
				New Post
			</a>
		{/if}
	</header>

	<BlogFilters
		bind:search
		bind:my_posts
		has_session={!!session}
		on_search={trigger_update}
		on_filter_change={apply_now}
		on_clear_all={handle_clear_all}
	/>

	{#if data.error}
		<div class="alert alert-error">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{data.error}</span>
		</div>
	{/if}

	<PostList
		posts={data.posts}
		{session}
		has_active_filters={!!(search || my_posts)}
		{order_by}
		on_sort={handle_sort}
	/>

	<Pagination
		total={data.total}
		limit={data.limit}
		offset={data.offset}
	/>
</div>
