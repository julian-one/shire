<script lang="ts">
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import { goto } from '$app/navigation';
	import type { Recipe, Bookmark, RecipeReview } from '$lib/types/recipe';
	import RecipePhoto from '../RecipePhoto.svelte';
	import { float_to_fraction } from '../fraction';
	import { nanoseconds_to_minutes } from '../form';
	import RecipeReviews from '../RecipeReviews.svelte';

	let { data } = $props();
	let recipe = $derived(data.recipe as Recipe);
	let recipe_reviews = $derived((data.recipe_reviews ?? []) as RecipeReview[]);
	let is_owner = $derived(page.data.user?.user_id === recipe.user_id);
	let session = $derived(page.data.session);
	let bookmarked = $derived(((data.user_bookmarks as Bookmark[]) ?? []).some((b) => b.recipe_id === recipe.recipe_id));

	async function toggle_bookmark() {
		const success = bookmarked
			? await RecipeStore.unbookmark(recipe.recipe_id)
			: await RecipeStore.bookmark(recipe.recipe_id);
		if (success) {
			invalidateAll();
		}
	}

	async function delete_recipe() {
		if (confirm('Are you sure you want to delete this recipe?')) {
			const success = await RecipeStore.delete_recipe(recipe.recipe_id);
			if (success) {
				goto('/recipes');
			}
		}
	}
</script>

<div class="pb-8 md:pb-12">
	<div class="breadcrumbs text-sm">
		<ul>
			<li><a href="/recipes">Recipes</a></li>
			<li><span>{recipe.title}</span></li>
		</ul>
	</div>

	<div class="mt-4 w-full lg:float-right lg:mb-6 lg:ml-6 lg:w-72 xl:w-80">
		<RecipePhoto
			src={recipe.photo_url}
			alt={recipe.title}
			is_detail={true}
		/>
	</div>

	<h1 class="mt-4 text-2xl font-black tracking-tight md:text-3xl lg:mt-0 lg:text-4xl">{recipe.title}</h1>

	<div class="mt-6">
		{#if recipe.description}
			<p class="text-base-content/60 text-lg leading-relaxed">
				{recipe.description}
			</p>
		{/if}
		{#if recipe.source_url || session}
			<div class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
				{#if recipe.source_url}
					<a
						href={recipe.source_url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-primary inline-flex items-center gap-1.5 text-sm font-medium"
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
								d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
							/>
						</svg>
						Source
					</a>
				{/if}

				{#if session}
					<button
						onclick={toggle_bookmark}
						class="text-primary inline-flex items-center gap-1.5 text-sm font-medium"
						title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill={bookmarked ? 'currentColor' : 'none'}
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="h-4 w-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
							/>
						</svg>
						{bookmarked ? 'Bookmarked' : 'Bookmark'}
					</button>

					<a
						href="#reviews"
						class="text-primary inline-flex items-center gap-1.5 text-sm font-medium"
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
								d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
							/>
						</svg>
						Reviews
					</a>
				{/if}
			</div>
		{/if}

		{#if recipe.cook_time || recipe.serves || recipe.cuisine || recipe.category}
			<div class="text-base-content/60 mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
				{#if recipe.cook_time}
					<span
						><span class="text-base-content font-semibold">{nanoseconds_to_minutes(recipe.cook_time)} mins</span> cook time</span
					>
				{/if}
				{#if recipe.serves}
					<span><span class="text-base-content font-semibold">Serves {recipe.serves}</span></span>
				{/if}
				{#if recipe.cuisine}
					<span>{recipe.cuisine}</span>
				{/if}
				{#if recipe.category}
					<span>{recipe.category}</span>
				{/if}
			</div>
		{/if}

		{#if is_owner}
			<div class="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
				<a
					href="/recipes/{recipe.recipe_id}/edit"
					class="btn btn-soft btn-sm">Edit Recipe</a
				>
				<button
					class="btn btn-ghost btn-sm text-error"
					onclick={delete_recipe}>Delete Recipe</button
				>
			</div>
		{/if}
	</div>

	<div class="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
		<div class="lg:col-span-4">
			<h2 class="text-lg font-bold tracking-tight md:text-xl">Ingredients</h2>
			<ul class="mt-4 space-y-3">
				{#each recipe.ingredients as ingredient, i (i)}
					<li class="border-base-content/5 flex items-baseline gap-2 border-b pb-3 text-sm last:border-0 md:text-base">
						<span class="font-semibold tabular-nums">
							{float_to_fraction(ingredient.amount)}
							{ingredient.unit}
						</span>
						<span class="text-base-content/60">{ingredient.item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="lg:col-span-8">
			<h2 class="text-lg font-bold tracking-tight md:text-xl">Instructions</h2>
			<ol class="mt-4 space-y-6">
				{#each recipe.instructions as step, i (i)}
					<li class="flex gap-4">
						<span class="text-base-content/60 shrink-0 pt-0.5 text-sm font-semibold tabular-nums">
							{i + 1}.
						</span>
						<p class="text-sm leading-relaxed md:text-base">{step}</p>
					</li>
				{/each}
			</ol>
		</div>
	</div>

	<RecipeReviews
		{recipe}
		{recipe_reviews}
		{session}
	/>
</div>
