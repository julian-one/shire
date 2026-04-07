<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Pagination from '$lib/components/Pagination.svelte';
	import PostHeader from './PostHeader.svelte';
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
	<PostHeader
		total_posts={data.total}
		{session}
	/>

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
