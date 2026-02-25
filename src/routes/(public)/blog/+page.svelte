<script lang="ts">
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import PostHeader from './PostHeader.svelte';
	import PostList from './PostList.svelte';

	let { data } = $props();

	let search = $derived(data.search);
	let order_by = $derived(data.order_by);

	let debounce_timer: NodeJS.Timeout;

	function update_url() {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		if (search) params.set('search', search);
		else params.delete('search');

		if (order_by && order_by !== 'created_at:desc') params.set('order_by', order_by);
		else params.delete('order_by');

		goto(`?${params.toString()}`, { replaceState: true, keepFocus: true, noScroll: true });
	}

	function handle_search(event: Event) {
		search = (event.target as HTMLInputElement).value;
		clearTimeout(debounce_timer);
		debounce_timer = setTimeout(update_url, 300);
	}

	function handle_sort(new_order_by: string) {
		order_by = new_order_by;
		update_url();
	}

	function handle_clear_filters() {
		search = '';
		order_by = 'created_at:desc';
		update_url();
	}
</script>

<div class="space-y-4">
	<PostHeader
		total_posts={data.posts.length}
		session={data.session}
		bind:search
		{order_by}
		on_search={handle_search}
		on_sort={handle_sort}
		on_clear={handle_clear_filters}
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
		session={data.session}
		user={data.user}
	/>
</div>
