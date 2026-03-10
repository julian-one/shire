<script lang="ts">
	import { page } from '$app/state';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import { goto } from '$app/navigation';
	import type { Recipe } from '$lib/types/recipe';
	import RecipePhoto from '$lib/components/RecipePhoto.svelte';

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

	<h1 class="mt-4 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">{recipe.title}</h1>

	<RecipePhoto
		src={recipe.photo_url}
		alt={recipe.title}
		is_detail={true}
	/>

	<div class="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
		<div class="flex-1">
			{#if recipe.description}
				<p class="text-lg opacity-70 leading-relaxed max-w-2xl">
					{recipe.description}
				</p>
			{/if}
			{#if recipe.source_url}
				<a href={recipe.source_url} target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
					</svg>
					Original Source
				</a>
			{/if}

			<div class="mt-8 flex flex-wrap gap-4">
				{#if recipe.cook_time}
					<div class="flex items-center gap-2 rounded-lg bg-base-200 px-4 py-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5 opacity-60">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
						</svg>
						<div class="flex flex-col">
							<span class="text-[10px] font-bold uppercase tracking-wider opacity-40">Cook Time</span>
							<span class="font-bold">{Math.round(recipe.cook_time / (60 * 1000 * 1000 * 1000))} mins</span>
						</div>
					</div>
				{/if}

				{#if recipe.serves}
					<div class="flex items-center gap-2 rounded-lg bg-base-200 px-4 py-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5 opacity-60">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 10h16c0 4.418-3.582 8-8 8s-8-3.582-8-8Z" />
						</svg>
						<div class="flex flex-col">
							<span class="text-[10px] font-bold uppercase tracking-wider opacity-40">Serves</span>
							<span class="font-bold">{recipe.serves}</span>
						</div>
					</div>
				{/if}

				{#if recipe.cuisine}
					<div class="flex items-center gap-2 rounded-lg bg-base-200 px-4 py-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5 opacity-60">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l.406.34c.503.422 1 .845 1.018 1.405a2.25 2.25 0 0 1-.35 1.307l-.31.455c-.092.135-.202.253-.327.35l-.367.285c-.28.217-.603.353-.947.396l-.397.05c-.586.075-1.103.44-1.332 1.013a3.111 3.111 0 0 0-.14.314c-.109.298-.327.546-.621.662l-.287.113a2.25 2.25 0 0 1-1.881 0l-.288-.113a1.125 1.125 0 0 0-1.164.132l-.197.155c-.204.161-.263.439-.145.67l.272.537c.113.223.158.477.129.729l-.033.287c-.033.284-.042.57-.027.857l.02.392c.019.382.1.758.238 1.114l.044.116a2.25 2.25 0 0 1-.034 1.73l-.25.492a.75.75 0 0 0 .667 1.087h.122A10.5 10.5 0 0 0 21 12.75c0-5.323-3.951-9.718-9-10.455Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M12.75 3.031a10.501 10.501 0 0 0-11.455 10.455 10.501 10.501 0 0 0 9.705 10.468.75.75 0 0 0 .75-.75v-1.125c0-.621.504-1.125 1.125-1.125h1.125a9 9 0 0 0 9-9h-1.125c-.621 0-1.125-.504-1.125-1.125V9.75a9 9 0 0 0-9-9V3.03Z" />
						</svg>
						<div class="flex flex-col">
							<span class="text-[10px] font-bold uppercase tracking-wider opacity-40">Cuisine</span>
							<span class="font-bold">{recipe.cuisine}</span>
						</div>
					</div>
				{/if}

				{#if recipe.category}
					<div class="flex items-center gap-2 rounded-lg bg-base-200 px-4 py-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5 opacity-60">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.659A2.25 2.25 0 0 0 9.568 3Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
						</svg>
						<div class="flex flex-col">
							<span class="text-[10px] font-bold uppercase tracking-wider opacity-40">Category</span>
							<span class="font-bold">{recipe.category}</span>
						</div>
					</div>
				{/if}
			</div>
		</div>

		{#if is_owner}
			<div class="flex flex-row gap-2 lg:flex-col lg:w-48">
				<a href="/recipes/{recipe.recipe_id}/edit" class="btn btn-soft btn-block">Edit Recipe</a>
				<button class="btn btn-ghost btn-block text-error" onclick={delete_recipe}>Delete Recipe</button>
			</div>
		{/if}
	</div>

	<div class="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
		<div class="lg:col-span-4">
			<h2 class="text-2xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">Ingredients</h2>
			<ul class="mt-8 space-y-4">
				{#each recipe.ingredients as ingredient}
					<li class="flex items-baseline gap-3 border-b border-base-content/5 pb-4 last:border-0">
						<span class="font-bold text-primary tabular-nums">
							{ingredient.amount} {ingredient.unit}
						</span>
						<span class="opacity-80">{ingredient.item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="lg:col-span-8">
			<h2 class="text-2xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">Instructions</h2>
			<ol class="mt-8 space-y-8">
				{#each recipe.instructions as step, i}
					<li class="flex gap-6">
						<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content font-black">
							{i + 1}
						</span>
						<div class="pt-1">
							<p class="text-lg leading-relaxed opacity-90">{step}</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</div>
