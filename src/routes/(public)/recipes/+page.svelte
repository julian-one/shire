<script lang="ts">
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import Select from '$lib/components/Select.svelte';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import type { Recipe } from '$lib/types/recipe';
	import { Cuisine, Category } from '$lib/types/recipe';

	let { data } = $props();
	let recipes = $derived(data.recipes as Recipe[]);
	let bookmarked_ids = $derived(new Set(data.bookmarked_ids as string[]));
	let session = $derived(page.data.session);

	let bookmarked_recipes = $derived(recipes.filter((r) => bookmarked_ids.has(r.recipe_id)));
	let other_recipes = $derived(recipes.filter((r) => !bookmarked_ids.has(r.recipe_id)));

	let search = $derived(data.search);
	let order_by = $derived(data.order_by);
	let cuisine = $derived(data.cuisine);
	let category = $derived(data.category);

	let debounce_timer: NodeJS.Timeout;

	let has_active_filters = $derived(
		search !== '' || order_by !== 'created_at:desc' || cuisine !== '' || category !== ''
	);

	const sort_options = [
		{ label: 'Newest', value: 'created_at:desc' },
		{ label: 'Oldest', value: 'created_at:asc' },
		{ label: 'A\u2013Z', value: 'title:asc' },
		{ label: 'Z\u2013A', value: 'title:desc' }
	];

	function update_url() {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		if (search) params.set('search', search);
		else params.delete('search');

		if (order_by && order_by !== 'created_at:desc') params.set('order_by', order_by);
		else params.delete('order_by');

		if (cuisine) params.set('cuisine', cuisine);
		else params.delete('cuisine');

		if (category) params.set('category', category);
		else params.delete('category');

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

	const cuisine_options = [
		{ value: '', label: 'All cuisines' },
		...Object.values(Cuisine).map((c) => ({ value: c, label: c }))
	];
	const category_options = [
		{ value: '', label: 'All categories' },
		...Object.values(Category).map((c) => ({ value: c, label: c }))
	];

	function handle_clear_filters() {
		search = '';
		order_by = 'created_at:desc';
		cuisine = '';
		category = '';
		update_url();
	}

	async function toggle_bookmark(event: MouseEvent, recipe_id: string, is_bookmarked: boolean) {
		event.stopPropagation();
		const success = is_bookmarked ? await RecipeStore.unbookmark(recipe_id) : await RecipeStore.bookmark(recipe_id);
		if (success) {
			invalidateAll();
		}
	}
</script>

{#snippet recipe_row(recipe: Recipe, is_bookmarked: boolean)}
	<tr
		class="cursor-pointer"
		onclick={() => goto(`/recipes/${recipe.recipe_id}`)}
	>
		<td class="w-full">
			<div class="flex items-center gap-3">
				{#if recipe.photo_url}
					<div class="avatar shrink-0">
						<div class="skeleton mask mask-squircle h-12 w-12">
							<img
								src={recipe.photo_url}
								alt={recipe.title}
								class="h-full w-full object-cover"
								onload={(e) => e.currentTarget.parentElement?.classList.remove('skeleton')}
							/>
						</div>
					</div>
				{:else}
					<div class="avatar placeholder shrink-0">
						<div class="mask mask-squircle bg-base-200 flex h-12 w-12 items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-6 w-6 opacity-40"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
								/>
							</svg>
						</div>
					</div>
				{/if}
				<div class="font-bold">{recipe.title}</div>
			</div>
		</td>
		{#if session}
			<td class="w-12">
				<button
					class="btn btn-ghost btn-sm btn-square"
					onclick={(e) => toggle_bookmark(e, recipe.recipe_id, is_bookmarked)}
					title={is_bookmarked ? 'Remove bookmark' : 'Bookmark'}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill={is_bookmarked ? 'currentColor' : 'none'}
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-4 w-4 {is_bookmarked ? 'text-primary' : ''}"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
						/>
					</svg>
				</button>
			</td>
		{/if}
	</tr>
{/snippet}

<div class="pb-8 md:pb-12">
	<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">Recipes</h1>
			<p class="text-base-content/60 text-sm md:text-base">
				{recipes.length}
				{recipes.length === 1 ? 'recipe' : 'recipes'}
			</p>
		</div>
		{#if session}
			<a
				href="/recipes/new"
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
				New Recipe
			</a>
		{/if}
	</div>

	<div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
		<input
			type="text"
			placeholder="Search recipes..."
			class="input input-bordered w-full sm:w-48"
			value={search}
			oninput={handle_search}
		/>
		<Select
			options={cuisine_options}
			bind:value={cuisine}
			placeholder="All cuisines"
			onchange={update_url}
			class="sm:w-48"
		/>
		<Select
			options={category_options}
			bind:value={category}
			placeholder="All categories"
			onchange={update_url}
			class="sm:w-48"
		/>
		<div class="flex items-center gap-2">
			<div class="join">
				{#each sort_options as option (option.value)}
					<button
						class="btn join-item btn-sm {order_by === option.value ? 'btn-active' : ''}"
						onclick={() => handle_sort(option.value)}
					>
						{option.label}
					</button>
				{/each}
			</div>
			{#if has_active_filters}
				<button
					class="btn btn-ghost btn-sm"
					onclick={handle_clear_filters}>Clear</button
				>
			{/if}
		</div>
	</div>

	{#if recipes.length === 0}
		<div
			class="border-base-content/20 mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
		>
			<div class="bg-base-200 rounded-full p-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-8 w-8 opacity-40"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
					/>
				</svg>
			</div>
			<h3 class="mt-4 text-lg font-bold">No recipes found</h3>
			<p class="mt-1 text-sm opacity-60">
				{#if has_active_filters}
					Try adjusting your filters.
				{:else}
					There are no recipes to display.
				{/if}
			</p>
		</div>
	{:else}
		{#if bookmarked_recipes.length > 0}
			<h2 class="mt-8 text-lg font-bold tracking-tight md:text-xl">Bookmarked</h2>
			<div class="mt-2 overflow-x-auto">
				<table class="table w-full table-fixed">
					<tbody>
						{#each bookmarked_recipes as recipe (recipe.recipe_id)}
							{@render recipe_row(recipe, true)}
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if other_recipes.length > 0}
			{#if bookmarked_recipes.length > 0}
				<h2 class="mt-8 text-lg font-bold tracking-tight md:text-xl">All Recipes</h2>
			{/if}
			<div class="mt-2 overflow-x-auto">
				<table class="table w-full table-fixed">
					<tbody>
						{#each other_recipes as recipe (recipe.recipe_id)}
							{@render recipe_row(recipe, false)}
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/if}
</div>
