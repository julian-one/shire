<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import { Unit, SourceType, type FormComponent, type Cuisine, type Category } from '$lib/types/recipe';
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
	let source_type = $state<SourceType | ''>('');
	let source = $state('');
	let components = $state<FormComponent[]>([
		{ name: '', ingredients: [{ amount: '', unit: Unit.G, item: '' }], instructions: [''] }
	]);
	let prep_time = $state('');
	let cook_time = $state('');
	let serves = $state('');
	let cuisine = $state<Cuisine | ''>('');
	let category = $state<Category | ''>('');

	function add_component() {
		components = [
			...components,
			{ name: '', ingredients: [{ amount: '', unit: Unit.G, item: '' }], instructions: [''] }
		];
	}

	function remove_component(index: number) {
		components = components.filter((_, i) => i !== index);
	}

	function back() {
		if (step > 1) step--;
	}

	async function strip_and_submit() {
		if (step === 2) {
			components = components.map((comp) => {
				let filtered = comp.ingredients.filter((i) => i.amount.trim() || i.item.trim());
				if (filtered.length === 0) filtered = [{ amount: '', unit: Unit.G, item: '' }];
				return { ...comp, ingredients: filtered };
			});
		}
		if (step === 3) {
			components = components.map((comp) => {
				let filtered = comp.instructions.filter((i) => i.trim());
				if (filtered.length === 0) filtered = [''];
				return { ...comp, instructions: filtered };
			});
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
			source_type: source_type || undefined,
			source: source.trim() || undefined,
			components: components.map((comp) => ({
				name: comp.name.trim() || undefined,
				ingredients: comp.ingredients.map((i) => ({
					amount: fraction_to_float(i.amount),
					unit: i.unit,
					item: i.item.trim()
				})),
				instructions: comp.instructions.map((i) => i.trim())
			})),
			prep_time: minutes_to_nanoseconds(prep_time),
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
				if (result.components && result.components.length > 0) {
					components = result.components.map((c) => ({
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
					}));
				}
				if (result.prep_time) {
					prep_time = nanoseconds_to_minutes(result.prep_time);
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
				if (result.source_type) source_type = result.source_type as SourceType;
				if (result.source) source = result.source;

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
					bind:source_type
					bind:source
					bind:prep_time
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
						<span class="text-base-content/60 text-sm font-bold tracking-wide uppercase">
							{comp.name || (components.length > 1 ? `Component ${ci + 1}` : 'Ingredients')}
						</span>
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

				{#each components as comp, ci (ci)}
					<div class="space-y-4">
						<span class="text-base-content/60 text-sm font-bold tracking-wide uppercase">
							{comp.name || (components.length > 1 ? `Component ${ci + 1}` : 'Instructions')}
						</span>
						<RecipeInstructionRows bind:instructions={comp.instructions} />
					</div>
					{#if ci < components.length - 1}
						<div class="divider"></div>
					{/if}
				{/each}

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
