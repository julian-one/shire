<script lang="ts">
	import { page } from '$app/state';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import { goto } from '$app/navigation';
	import type { Recipe } from '$lib/types/recipe';
	import RecipePhoto from '$lib/components/recipe/RecipePhoto.svelte';
	import { float_to_fraction } from '$lib/helpers/fraction';
	import { nanoseconds_to_minutes } from '$lib/helpers/recipe-form';

	let { data } = $props();
	let recipe = $derived(data.recipe as Recipe);
	let is_owner = $derived(page.data.user?.user_id === recipe.user_id);

	async function delete_recipe() {
		if (confirm('Are you sure you want to delete this recipe?')) {
			const success = await RecipeStore.delete(recipe.recipe_id);
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
			<p class="text-lg leading-relaxed opacity-70">
				{recipe.description}
			</p>
		{/if}
		{#if recipe.source_url}
			<a
				href={recipe.source_url}
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary mt-3 inline-flex items-center gap-1.5 text-sm font-medium"
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
				Original Source
			</a>
		{/if}

		<div class="text-base-content/60 mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
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

		{#if is_owner}
			<div class="mt-6 flex flex-row gap-2">
				<a
					href="/recipes/{recipe.recipe_id}/edit"
					class="btn btn-soft">Edit Recipe</a
				>
				<button
					class="btn btn-ghost text-error"
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
						<span class="text-base-content/70">{ingredient.item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="lg:col-span-8">
			<h2 class="text-lg font-bold tracking-tight md:text-xl">Instructions</h2>
			<ol class="mt-4 space-y-6">
				{#each recipe.instructions as step, i (i)}
					<li class="flex gap-4">
						<span class="text-base-content/40 shrink-0 pt-0.5 text-sm font-semibold tabular-nums">
							{i + 1}.
						</span>
						<p class="text-sm leading-relaxed md:text-base">{step}</p>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</div>
