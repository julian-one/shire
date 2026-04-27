<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick, untrack } from 'svelte';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import {
		Unit,
		type FormComponent,
		type Recipe,
		type Cuisine,
		type Category,
		type SourceType
	} from '$lib/types/recipe';
	import { fraction_to_float, float_to_fraction } from '../../fraction';
	import { minutes_to_nanoseconds, nanoseconds_to_minutes } from '../../form';
	import RecipeBasicsFields from '../../RecipeBasicsFields.svelte';
	import RecipeIngredientRows from '../../RecipeIngredientRows.svelte';
	import RecipeInstructionRows from '../../RecipeInstructionRows.svelte';

	let { data } = $props();
	const original_recipe = untrack(() => data.recipe as Recipe);
	let form_el: HTMLFormElement;

	let title = $state(original_recipe.title);
	let description = $state(original_recipe.description ?? '');
	let photo_url = $state(original_recipe.photo_url ?? '');
	let source_type = $state<SourceType | ''>(original_recipe.source_type ?? '');
	let source = $state(original_recipe.source ?? '');
	let components = $state<FormComponent[]>(
		(original_recipe.components ?? []).map((c) => ({
			name: c.name ?? '',
			ingredients:
				c.ingredients && c.ingredients.length > 0
					? c.ingredients.map((i) => ({
							amount: float_to_fraction(i.amount),
							unit: i.unit,
							item: i.item
						}))
					: [{ amount: '', unit: Unit.G, item: '' }],
			instructions: c.instructions && c.instructions.length > 0 ? [...c.instructions] : ['']
		}))
	);
	let prep_time = $state(original_recipe.prep_time ? nanoseconds_to_minutes(original_recipe.prep_time) : '');
	let cook_time = $state(original_recipe.cook_time ? nanoseconds_to_minutes(original_recipe.cook_time) : '');
	let serves = $state(original_recipe.serves ? original_recipe.serves.toString() : '');
	let cuisine = $state<Cuisine | ''>(original_recipe.cuisine ?? '');
	let category = $state<Category | ''>(original_recipe.category ?? '');

	function add_component() {
		components = [
			...components,
			{ name: '', ingredients: [{ amount: '', unit: Unit.G, item: '' }], instructions: [''] }
		];
	}

	function remove_component(index: number) {
		components = components.filter((_, i) => i !== index);
	}

	async function strip_and_submit() {
		components = components.map((comp) => {
			let filtered_ingredients = comp.ingredients.filter((i) => i.amount.trim() || i.item.trim());
			if (filtered_ingredients.length === 0) filtered_ingredients = [{ amount: '', unit: Unit.G, item: '' }];

			let filtered_instructions = comp.instructions.filter((i) => i.trim());
			if (filtered_instructions.length === 0) filtered_instructions = [''];

			return {
				...comp,
				ingredients: filtered_ingredients,
				instructions: filtered_instructions
			};
		});
		await tick();
		form_el.requestSubmit();
	}

	async function handle_submit(event: SubmitEvent) {
		event.preventDefault();

		const success = await RecipeStore.update(original_recipe.recipe_id, {
			title: title.trim(),
			description: description.trim(),
			photo_url: photo_url.trim() || undefined,
			source_type: source_type || '',
			source: source.trim(),
			components: components.map((comp) => ({
				name: comp.name.trim() || undefined,
				ingredients: comp.ingredients.map((i) => ({
					amount: fraction_to_float(i.amount),
					unit: i.unit,
					item: i.item.trim()
				})),
				instructions: comp.instructions.map((i) => i.trim())
			})),
			prep_time: minutes_to_nanoseconds(prep_time) ?? 0,
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
				bind:source_type
				bind:source
				bind:prep_time
				bind:cook_time
				bind:serves
				bind:cuisine
				bind:category
			/>
		</section>

		<div class="divider"></div>

		<!-- Ingredients -->
		<section class="space-y-6">
			<h2 class="text-lg font-bold tracking-tight">Ingredients</h2>

			{#each components as comp, ci (ci)}
				<div class="space-y-4">
					{#if components.length > 1}
						<div class="flex items-center gap-2">
							<input
								type="text"
								class="input input-sm w-full max-w-xs"
								placeholder="Component name (e.g. Sauce)"
								bind:value={comp.name}
							/>
							<button
								type="button"
								class="btn btn-ghost btn-sm text-error"
								onclick={() => remove_component(ci)}
							>
								Remove
							</button>
						</div>
					{/if}
					{#if components.length > 1}
						<span class="text-base-content/60 text-sm font-bold tracking-wide uppercase">
							{comp.name || `Component ${ci + 1}`}
						</span>
					{/if}
					<RecipeIngredientRows bind:ingredients={comp.ingredients} />
				</div>
				{#if ci < components.length - 1}
					<div class="divider"></div>
				{/if}
			{/each}

			<button
				type="button"
				class="btn btn-soft btn-sm"
				onclick={add_component}
			>
				+ Add component
			</button>
		</section>

		<div class="divider"></div>

		<!-- Instructions -->
		<section class="space-y-6">
			<h2 class="text-lg font-bold tracking-tight">Instructions</h2>

			{#each components as comp, ci (ci)}
				<div class="space-y-4">
					{#if components.length > 1}
						<span class="text-base-content/60 text-sm font-bold tracking-wide uppercase">
							{comp.name || `Component ${ci + 1}`}
						</span>
					{/if}
					<RecipeInstructionRows bind:instructions={comp.instructions} />
				</div>
				{#if ci < components.length - 1}
					<div class="divider"></div>
				{/if}
			{/each}
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
