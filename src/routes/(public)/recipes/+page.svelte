<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import type { Recipe } from '$lib/types/recipe';
	import RecipePhoto from '$lib/components/RecipePhoto.svelte';

	let { data } = $props();
	let recipes = $derived(data.recipes as Recipe[]);
	let session = $derived(page.data.session);
	let user = $derived(page.data.user);

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
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-3xl font-black tracking-tight md:text-4xl">Recipes</h1>
		{#if session}
			<a href="/recipes/new" class="btn btn-primary">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				New Recipe
			</a>
		{/if}
	</div>

	{#if recipes.length === 0}
		<div class="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-base-content/20 py-20 text-center">
			<div class="rounded-full bg-base-200 p-4">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8 opacity-40">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
				</svg>
			</div>
			<h3 class="mt-4 text-lg font-bold">No recipes yet</h3>
			<p class="mt-1 text-sm opacity-60">There are no recipes to display.</p>
		</div>
	{:else}
		<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each recipes as recipe}
				<div class="card bg-base-100 border border-base-content/10">
					<RecipePhoto
						src={recipe.photo_url}
						alt={recipe.title}
						recipe_id={recipe.recipe_id}
					/>
					<div class="card-body">
						<div class="flex items-start justify-between">
							<h2 class="card-title text-xl font-black">{recipe.title}</h2>
							{#if user?.user_id === recipe.user_id}
								<div class="dropdown dropdown-end">
									<button class="btn btn-ghost btn-xs btn-square" aria-label="Recipe options">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
											<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
										</svg>
									</button>
									<ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 border border-base-content/10">
										<li><a href="/recipes/{recipe.recipe_id}/edit">Edit</a></li>
										<li>
											<button class="text-error" onclick={() => delete_recipe(recipe.recipe_id)}>
												Delete
											</button>
										</li>
									</ul>
								</div>
							{/if}
						</div>

						<p class="mt-2 text-sm opacity-70 line-clamp-2 min-h-[3rem]">
							{recipe.description || 'No description provided.'}
						</p>

						<div class="mt-4 flex flex-wrap gap-2">
							{#if recipe.cook_time}
								<div class="badge badge-soft badge-sm gap-1">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3 w-3">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
									</svg>
									{Math.round(recipe.cook_time / (60 * 1000 * 1000 * 1000))}m
								</div>
							{/if}
							{#if recipe.serves}
								<div class="badge badge-soft badge-sm gap-1">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3 w-3">
										<path stroke-linecap="round" stroke-linejoin="round" d="M4 10h16c0 4.418-3.582 8-8 8s-8-3.582-8-8Z" />
									</svg>
									{recipe.serves}
								</div>
							{/if}
							{#if recipe.cuisine}
								<div class="badge badge-soft badge-sm">{recipe.cuisine}</div>
							{/if}
							{#if recipe.category}
								<div class="badge badge-soft badge-sm">{recipe.category}</div>
							{/if}
						</div>

						<div class="card-actions mt-6">
							<a href="/recipes/{recipe.recipe_id}" class="btn btn-soft btn-sm btn-block">View Details</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
