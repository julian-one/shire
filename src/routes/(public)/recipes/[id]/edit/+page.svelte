<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick, untrack } from 'svelte';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import { Unit, type FormIngredient, type Recipe, type Cuisine, type Category } from '$lib/types/recipe';
	import { fraction_to_float, float_to_fraction } from '../../fraction';
	import { minutes_to_nanoseconds, nanoseconds_to_minutes } from '../../recipe-form';
	import RecipeBasicsFields from '../../RecipeBasicsFields.svelte';
	import RecipeIngredientRows from '../../RecipeIngredientRows.svelte';
	import RecipeInstructionRows from '../../RecipeInstructionRows.svelte';

	let { data } = $props();
	const original_recipe = untrack(() => data.recipe as Recipe);
	let form_el: HTMLFormElement;

	let title = $state(original_recipe.title);
	let description = $state(original_recipe.description ?? '');
	let photo_url = $state(original_recipe.photo_url ?? '');
	let source_url = $state(original_recipe.source_url ?? '');
	let ingredients = $state<FormIngredient[]>(
		original_recipe.ingredients.map((i) => ({
			amount: float_to_fraction(i.amount),
			unit: i.unit,
			item: i.item
		}))
	);
	let instructions = $state<string[]>([...original_recipe.instructions]);
	let cook_time = $state(original_recipe.cook_time ? nanoseconds_to_minutes(original_recipe.cook_time) : '');
	let serves = $state(original_recipe.serves ? original_recipe.serves.toString() : '');
	let cuisine = $state<Cuisine | ''>(original_recipe.cuisine ?? '');
	let category = $state<Category | ''>(original_recipe.category ?? '');

	async function strip_and_submit() {
		ingredients = ingredients.filter((i) => i.amount.trim() || i.item.trim());
		if (ingredients.length === 0) ingredients = [{ amount: '', unit: Unit.G, item: '' }];
		instructions = instructions.filter((i) => i.trim());
		if (instructions.length === 0) instructions = [''];
		await tick();
		form_el.requestSubmit();
	}

	async function handle_submit(event: SubmitEvent) {
		event.preventDefault();

		const success = await RecipeStore.update(original_recipe.recipe_id, {
			title: title.trim(),
			description: description.trim(),
			photo_url: photo_url.trim() || undefined,
			source_url: source_url.trim() || undefined,
			ingredients: ingredients.map((i) => ({
				amount: fraction_to_float(i.amount),
				unit: i.unit,
				item: i.item.trim()
			})),
			instructions: instructions.map((i) => i.trim()),
			cook_time: minutes_to_nanoseconds(cook_time) ?? 0,
			serves: serves ? parseInt(serves) : 0,
			cuisine: cuisine || '',
			category: category || ''
		});

		if (success) {
			goto(`/recipes/${original_recipe.recipe_id}`);
		}
	}
</script>

<div class="pb-8 md:pb-12">
	<div class="breadcrumbs text-sm">
		<ul>
			<li><a href="/recipes">Recipes</a></li>
			<li><a href="/recipes/{original_recipe.recipe_id}">{original_recipe.title}</a></li>
			<li><span>Edit</span></li>
		</ul>
	</div>

	<h1 class="mt-2 text-3xl font-black tracking-tight md:text-4xl">Edit Recipe</h1>

	<form
		bind:this={form_el}
		onsubmit={handle_submit}
		class="mt-8 space-y-10"
	>
		<!-- Basics -->
		<section class="space-y-6">
			<h2 class="text-lg font-bold tracking-tight">Basics</h2>

			<RecipeBasicsFields
				bind:title
				bind:description
				bind:photo_url
				bind:source_url
				bind:cook_time
				bind:serves
				bind:cuisine
				bind:category
			/>
		</section>

		<div class="divider"></div>

		<!-- Ingredients -->
		<section class="space-y-4">
			<h2 class="text-lg font-bold tracking-tight">Ingredients</h2>

			<RecipeIngredientRows bind:ingredients />
		</section>

		<div class="divider"></div>

		<!-- Instructions -->
		<section class="space-y-4">
			<h2 class="text-lg font-bold tracking-tight">Instructions</h2>

			<RecipeInstructionRows bind:instructions />
		</section>

		<div class="divider"></div>

		<!-- Actions -->
		<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
			<a
				href="/recipes/{original_recipe.recipe_id}"
				class="btn btn-ghost">Cancel</a
			>
			<button
				type="button"
				class="btn btn-primary"
				disabled={RecipeStore.loading}
				onclick={strip_and_submit}
			>
				{#if RecipeStore.loading}
					<span class="loading loading-spinner"></span>
					Saving...
				{:else}
					Save Changes
				{/if}
			</button>
		</div>
	</form>
</div>
