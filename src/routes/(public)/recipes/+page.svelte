<script lang="ts">
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import Select from '$lib/components/Select.svelte';
	import type { Recipe } from '$lib/types/recipe';
	import { Cuisine, Category } from '$lib/types/recipe';

	let { data } = $props();
	let recipes = $derived(data.recipes as Recipe[]);
	let session = $derived(page.data.session);
	let user = $derived(page.data.user);

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

	async function delete_recipe(id: string) {
		if (confirm('Are you sure you want to delete this recipe?')) {
			const success = await RecipeStore.delete(id);
			if (success) {
				invalidateAll();
			}
		}
	}
</script>

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
		<div class="mt-4 overflow-x-auto">
			<table class="table w-full table-fixed">
				<tbody>
					{#each recipes as recipe (recipe.recipe_id)}
						<tr
							class="cursor-pointer"
							onclick={() => goto(`/recipes/${recipe.recipe_id}`)}
						>
							<td class="w-full">
								<div class="flex items-center gap-3">
									{#if recipe.photo_url}
										<div class="avatar shrink-0">
											<div class="mask mask-squircle h-12 w-12">
												<img
													src={recipe.photo_url}
													alt={recipe.title}
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
							<td class="w-12 text-right">
								{#if user?.user_id === recipe.user_id}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<div
										class="dropdown dropdown-end"
										onclick={(e) => e.stopPropagation()}
										role="menu"
										tabindex="-1"
									>
										<button
											class="btn btn-ghost btn-xs btn-square"
											aria-label="Recipe options"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="2"
												stroke="currentColor"
												class="h-4 w-4"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
												/>
											</svg>
										</button>
										<ul
											class="dropdown-content menu bg-base-100 rounded-box border-base-content/10 z-1 w-40 border p-2"
										>
											<li><a href="/recipes/{recipe.recipe_id}/edit">Edit</a></li>
											<li>
												<button
													class="text-error"
													onclick={() => delete_recipe(recipe.recipe_id)}
												>
													Delete
												</button>
											</li>
										</ul>
									</div>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
