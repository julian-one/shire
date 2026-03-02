<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import type { Ingredient } from '$lib/types/recipe';

	let step = $state(1);

	let title = $state('');
	let description = $state('');
	let cook_time = $state('');
	let serves = $state('');
	let cuisine = $state('');
	let ingredients = $state<Ingredient[]>([{ amount: '', unit: '', item: '' }]);
	let instructions = $state<string[]>(['']);

	let can_advance_step_1 = $derived(title.trim().length > 0);
	let can_advance_step_2 = $derived(
		ingredients.length > 0 && ingredients.every((i) => i.item.trim().length > 0)
	);
	let can_submit = $derived(
		instructions.length > 0 && instructions.every((i) => i.trim().length > 0)
	);

	function next() {
		if (step === 1 && can_advance_step_1) step = 2;
		else if (step === 2 && can_advance_step_2) step = 3;
	}

	function back() {
		if (step > 1) step--;
	}

	function add_ingredient() {
		ingredients = [...ingredients, { amount: '', unit: '', item: '' }];
	}

	function remove_ingredient(index: number) {
		ingredients = ingredients.filter((_, i) => i !== index);
	}

	function add_instruction() {
		instructions = [...instructions, ''];
	}

	function remove_instruction(index: number) {
		instructions = instructions.filter((_, i) => i !== index);
	}

	async function handle_submit(event: SubmitEvent) {
		event.preventDefault();

		const user_id = page.data.user?.user_id;
		if (!user_id) {
			AlertStore.add('You must be logged in to create a recipe', 'error');
			return;
		}

		const trimmed_ingredients = ingredients.map((i) => ({
			amount: i.amount.trim(),
			unit: i.unit.trim(),
			item: i.item.trim()
		}));
		const trimmed_instructions = instructions.map((i) => i.trim());

		const recipe_id = await RecipeStore.create(
			user_id,
			title.trim(),
			description.trim(),
			trimmed_ingredients,
			trimmed_instructions,
			cook_time.trim(),
			serves.trim(),
			cuisine.trim()
		);

		if (recipe_id) {
			goto('/recipes');
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

	<h1 class="mt-2 text-3xl font-black tracking-tight md:text-4xl">New Recipe</h1>

	<ul class="steps mt-8 w-full">
		<li class="step" class:step-primary={step >= 1}>Basics</li>
		<li class="step" class:step-primary={step >= 2}>Ingredients</li>
		<li class="step" class:step-primary={step >= 3}>Instructions</li>
	</ul>

	<form onsubmit={handle_submit} class="mt-8">
		{#if step === 1}
			<fieldset class="space-y-6">
				<legend class="sr-only">Basics</legend>

				<div>
					<label for="title" class="text-sm font-bold tracking-wide uppercase opacity-60">
						Title
					</label>
					<input
						type="text"
						class="input mt-2 w-full"
						placeholder="Recipe title"
						id="title"
						bind:value={title}
						required
					/>
				</div>

				<div>
					<label for="description" class="text-sm font-bold tracking-wide uppercase opacity-60">
						Description
					</label>
					<textarea
						class="textarea mt-2 w-full"
						placeholder="A short description (optional)"
						id="description"
						bind:value={description}
						rows="3"
					></textarea>
				</div>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
					<div>
						<label
							for="cook_time"
							class="text-sm font-bold tracking-wide uppercase opacity-60"
						>
							Cook Time
						</label>
						<input
							type="text"
							class="input mt-2 w-full"
							placeholder="e.g. 30 mins"
							id="cook_time"
							bind:value={cook_time}
						/>
					</div>

					<div>
						<label for="serves" class="text-sm font-bold tracking-wide uppercase opacity-60">
							Serves
						</label>
						<input
							type="text"
							class="input mt-2 w-full"
							placeholder="e.g. 4"
							id="serves"
							bind:value={serves}
						/>
					</div>

					<div>
						<label for="cuisine" class="text-sm font-bold tracking-wide uppercase opacity-60">
							Cuisine
						</label>
						<input
							type="text"
							class="input mt-2 w-full"
							placeholder="e.g. Italian"
							id="cuisine"
							bind:value={cuisine}
						/>
					</div>
				</div>

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<a href="/recipes" class="btn btn-ghost">Cancel</a>
					<button
						type="button"
						class="btn btn-primary"
						disabled={!can_advance_step_1}
						onclick={next}
					>
						Next
					</button>
				</div>
			</fieldset>
		{:else if step === 2}
			<fieldset class="space-y-6">
				<legend class="sr-only">Ingredients</legend>

				<div class="space-y-3">
					<span class="text-sm font-bold tracking-wide uppercase opacity-60">Ingredients</span>
					{#each ingredients as _, index}
						<div class="flex gap-2">
							<input
								type="text"
								class="input w-20 shrink-0"
								placeholder="Amt"
								bind:value={ingredients[index].amount}
							/>
							<input
								type="text"
								class="input w-20 shrink-0"
								placeholder="Unit"
								bind:value={ingredients[index].unit}
							/>
							<input
								type="text"
								class="input w-full"
								placeholder="Item"
								bind:value={ingredients[index].item}
							/>
							{#if ingredients.length > 1}
								<button
									type="button"
									class="btn btn-ghost btn-square"
									onclick={() => remove_ingredient(index)}
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
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							{/if}
						</div>
					{/each}
				</div>

				<button type="button" class="btn btn-soft btn-sm" onclick={add_ingredient}>
					+ Add ingredient
				</button>

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<button type="button" class="btn btn-ghost" onclick={back}>Back</button>
					<button
						type="button"
						class="btn btn-primary"
						disabled={!can_advance_step_2}
						onclick={next}
					>
						Next
					</button>
				</div>
			</fieldset>
		{:else if step === 3}
			<fieldset class="space-y-6">
				<legend class="sr-only">Instructions</legend>

				<div class="space-y-3">
					<span class="text-sm font-bold tracking-wide uppercase opacity-60">Instructions</span>
					{#each instructions as _, index}
						<div class="flex gap-2">
							<span
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-base-200 text-sm font-bold"
							>
								{index + 1}
							</span>
							<input
								type="text"
								class="input w-full"
								placeholder="Describe this step"
								bind:value={instructions[index]}
							/>
							{#if instructions.length > 1}
								<button
									type="button"
									class="btn btn-ghost btn-square"
									onclick={() => remove_instruction(index)}
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
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							{/if}
						</div>
					{/each}
				</div>

				<button type="button" class="btn btn-soft btn-sm" onclick={add_instruction}>
					+ Add step
				</button>

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<button type="button" class="btn btn-ghost" onclick={back}>Back</button>
					<button
						type="submit"
						class="btn btn-primary"
						disabled={!can_submit || RecipeStore.loading}
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
