<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { Recipe, Bookmark } from '$lib/types/recipe';
	import RecipeHeader from './RecipeHeader.svelte';
	import RecipeList from './RecipeList.svelte';
	import RecipeFilters from './RecipeFilters.svelte';

	let { data } = $props();
	let recipes = $derived(data.recipes as Recipe[]);
	let bookmarked_ids = $derived(new Set(((data.user_bookmarks as Bookmark[]) || []).map((b) => b.recipe_id)));
	let session = $derived(page.data.session);

	let search = $derived(data.search);
	let cuisine = $derived(data.cuisine);
	let category = $derived(data.category);
	let bookmarks = $derived(data.bookmarks);
	let order_by = $derived(data.order_by);

	let timer: ReturnType<typeof setTimeout>;

	function apply_now() {
		const u = new URL(page.url);
		if (search) u.searchParams.set('search', search);
		else u.searchParams.delete('search');
		if (cuisine) u.searchParams.set('cuisine', cuisine);
		else u.searchParams.delete('cuisine');
		if (category) u.searchParams.set('category', category);
		else u.searchParams.delete('category');
		if (bookmarks) u.searchParams.set('bookmarks', bookmarks);
		else u.searchParams.delete('bookmarks');
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
		cuisine = '';
		category = '';
		bookmarks = '';
		// We purposefully keep order_by unchanged, just clear filters
		apply_now();
	}
</script>

<div class="space-y-4 pb-8 md:pb-12">
	<RecipeHeader
		total_recipes={data.total}
		{session}
	/>

	<RecipeFilters
		bind:search
		bind:cuisine
		bind:category
		bind:bookmarks
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

	<RecipeList
		{recipes}
		{bookmarked_ids}
		{session}
		has_active_filters={!!(search || cuisine || category || bookmarks)}
		{order_by}
		on_sort={handle_sort}
	/>

	<Pagination
		total={data.total}
		limit={data.limit}
		offset={data.offset}
	/>
</div>
