<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import { Unit, type FormIngredient, type Cuisine, type Category } from '$lib/types/recipe';
	import { float_to_fraction, fraction_to_float } from '../fraction';
	import { minutes_to_nanoseconds, nanoseconds_to_minutes } from '../form';
	import RecipeBasicsFields from '../RecipeBasicsFields.svelte';
	import RecipeIngredientRows from '../RecipeIngredientRows.svelte';
	import RecipeInstructionRows from '../RecipeInstructionRows.svelte';

	let step = $state(1);
	let scanning = $state(false);
	let form_el: HTMLFormElement;

	let title = $state('');
	let description = $state('');
	let photo_url = $state('');
	let source_url = $state('');
	let ingredients = $state<FormIngredient[]>([{ amount: '', unit: Unit.G, item: '' }]);
	let instructions = $state<string[]>(['']);
	let cook_time = $state('45');
	let serves = $state('4');
	let cuisine = $state<Cuisine | ''>('');
	let category = $state<Category | ''>('');

	function back() {
		if (step > 1) step--;
	}

	async function strip_and_submit() {
		if (step === 2) {
			ingredients = ingredients.filter((i) => i.amount.trim() || i.item.trim());
			if (ingredients.length === 0) ingredients = [{ amount: '', unit: Unit.G, item: '' }];
		}
		if (step === 3) {
			instructions = instructions.filter((i) => i.trim());
			if (instructions.length === 0) instructions = [''];
		}
		await tick();
		form_el.requestSubmit();
	}

	async function handle_submit(event: SubmitEvent) {
		event.preventDefault();

		if (step < 3) {
			step++;
			return;
		}

		const user_id = page.data.user?.user_id;
		if (!user_id) {
			AlertStore.add('You must be logged in to create a recipe', 'error');
			return;
		}

		const recipe_id = await RecipeStore.create({
			user_id,
			title: title.trim(),
			description: description.trim() || undefined,
			photo_url: photo_url.trim() || undefined,
			source_url: source_url.trim() || undefined,
			ingredients: ingredients.map((i) => ({
				amount: fraction_to_float(i.amount),
				unit: i.unit,
				item: i.item.trim()
			})),
			instructions: instructions.map((i) => i.trim()),
			cook_time: minutes_to_nanoseconds(cook_time),
			serves: serves ? parseInt(serves) : undefined,
			cuisine: cuisine || undefined,
			category: category || undefined
		});

		if (recipe_id) {
			goto('/recipes');
		}
	}

	async function handle_scan(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		scanning = true;
		try {
			const result = await RecipeStore.scan(file);
			if (result) {
				if (result.title) title = result.title;
				if (result.description) description = result.description;
				if (result.ingredients && result.ingredients.length > 0) {
					ingredients = result.ingredients.map((i) => ({
						amount: float_to_fraction(i.amount),
						unit: i.unit,
						item: i.item
					}));
				}
				if (result.instructions && result.instructions.length > 0) {
					instructions = result.instructions;
				}
				if (result.cook_time) {
					cook_time = nanoseconds_to_minutes(result.cook_time);
				}
				if (result.serves) {
					serves = result.serves.toString();
				}
				if (result.cuisine) cuisine = result.cuisine as Cuisine;
				if (result.category) category = result.category as Category;
				if (result.photo_url) photo_url = result.photo_url;
				if (result.source_url) source_url = result.source_url;

				AlertStore.add('Recipe details populated from scan', 'info');
			}
		} finally {
			scanning = false;
		}
	}
</script>

<div class="pb-8 md:pb-12">
	<div class="breadcrumbs text-sm">
		<ul>
			<li>
				<a href="/recipes">Recipes</a>
			</li>
			<li>
				<span>New Recipe</span>
			</li>
		</ul>
	</div>

	<div class="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-3xl font-black tracking-tight md:text-4xl">New Recipe</h1>
		{#if page.data.user?.role === 'admin'}
			<label
				class="btn btn-soft btn-sm"
				class:btn-disabled={scanning}
			>
				{#if scanning}
					<span class="loading loading-spinner loading-sm"></span>
					Scanning...
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
						/>
					</svg>
					Scan Recipe Image
				{/if}
				<input
					type="file"
					accept="image/*"
					class="hidden"
					onchange={handle_scan}
					disabled={scanning}
				/>
			</label>
		{/if}
	</div>

	<ul class="steps mt-8 w-full">
		<li
			class="step"
			class:step-primary={step >= 1}>Basics</li
		>
		<li
			class="step"
			class:step-primary={step >= 2}>Ingredients</li
		>
		<li
			class="step"
			class:step-primary={step >= 3}>Instructions</li
		>
	</ul>

	<form
		bind:this={form_el}
		onsubmit={handle_submit}
		class="mt-8"
	>
		{#if step === 1}
			<fieldset class="space-y-6">
				<legend class="sr-only">Basics</legend>

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

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<a
						href="/recipes"
						class="btn btn-ghost">Cancel</a
					>
					<button
						type="submit"
						class="btn btn-primary"
					>
						Next
					</button>
				</div>
			</fieldset>
		{:else if step === 2}
			<fieldset class="space-y-6">
				<legend class="sr-only">Ingredients</legend>

				<span class="text-base-content/60 text-sm font-bold tracking-wide uppercase">Ingredients</span>
				<RecipeIngredientRows bind:ingredients />

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<button
						type="button"
						class="btn btn-ghost"
						onclick={back}>Back</button
					>
					<button
						type="button"
						class="btn btn-primary"
						onclick={strip_and_submit}
					>
						Next
					</button>
				</div>
			</fieldset>
		{:else if step === 3}
			<fieldset class="space-y-6">
				<legend class="sr-only">Instructions</legend>

				<span class="text-base-content/60 text-sm font-bold tracking-wide uppercase">Instructions</span>
				<RecipeInstructionRows bind:instructions />

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<button
						type="button"
						class="btn btn-ghost"
						onclick={back}>Back</button
					>
					<button
						type="button"
						class="btn btn-primary"
						disabled={RecipeStore.loading}
						onclick={strip_and_submit}
					>
						{#if RecipeStore.loading}
							<span class="loading loading-spinner"></span>
							Creating...
						{:else}
							Create Recipe
						{/if}
					</button>
				</div>
			</fieldset>
		{/if}
	</form>
</div>
