<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import { Cuisine, Category, Unit, type Ingredient } from '$lib/types/recipe';
	import Select from '$lib/components/Select.svelte';

	let step = $state(1);
	let scanning = $state(false);

	let title = $state('');
	let description = $state('');
	let photo_url = $state('');
	let source_url = $state('');
	let ingredients = $state<Ingredient[]>([{ amount: 0, unit: Unit.G, item: '' }]);
	let instructions = $state<string[]>(['']);
	let cook_time = $state('45');
	let serves = $state('4');
	let cuisine = $state<Cuisine | ''>('');
	let category = $state<Category | ''>('');

	const cuisine_options = [
		{ value: '', label: 'None' },
		...Object.values(Cuisine).map((c) => ({ value: c, label: c }))
	];
	const category_options = [
		{ value: '', label: 'None' },
		...Object.values(Category).map((c) => ({ value: c, label: c }))
	];
	const unit_options = Object.values(Unit).map((u) => ({ value: u, label: u }));

	let can_advance_step_1 = $derived(title.trim().length > 0);
	let can_advance_step_2 = $derived(ingredients.length > 0 && ingredients.every((i) => i.item.trim().length > 0));
	let can_submit = $derived(instructions.length > 0 && instructions.every((i) => i.trim().length > 0));

	function next() {
		if (step === 1 && can_advance_step_1) step = 2;
		else if (step === 2 && can_advance_step_2) step = 3;
	}

	function back() {
		if (step > 1) step--;
	}

	function add_ingredient() {
		ingredients = [...ingredients, { amount: 0, unit: Unit.G, item: '' }];
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

		const recipe_id = await RecipeStore.create({
			user_id,
			title: title.trim(),
			description: description.trim() || undefined,
			photo_url: photo_url.trim() || undefined,
			source_url: source_url.trim() || undefined,
			ingredients: ingredients.map((i) => ({
				amount: parseFloat(i.amount.toString()) || 0,
				unit: i.unit,
				item: i.item.trim()
			})),
			instructions: instructions.map((i) => i.trim()),
			cook_time: cook_time ? parseInt(cook_time) * 60 * 1000 * 1000 * 1000 : undefined,
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
					ingredients = result.ingredients;
				}
				if (result.instructions && result.instructions.length > 0) {
					instructions = result.instructions;
				}
				if (result.cook_time) {
					cook_time = Math.round(result.cook_time / (60 * 1000 * 1000 * 1000)).toString();
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
		onsubmit={handle_submit}
		class="mt-8"
	>
		{#if step === 1}
			<fieldset class="space-y-6">
				<legend class="sr-only">Basics</legend>

				<div>
					<label
						for="title"
						class="text-sm font-bold tracking-wide uppercase opacity-60"
					>
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
					<label
						for="description"
						class="text-sm font-bold tracking-wide uppercase opacity-60"
					>
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

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label
							for="photo_url"
							class="text-sm font-bold tracking-wide uppercase opacity-60"
						>
							Photo URL
						</label>
						<input
							type="url"
							class="input mt-2 w-full"
							placeholder="https://example.com/photo.jpg"
							id="photo_url"
							bind:value={photo_url}
						/>
					</div>
					<div>
						<label
							for="source_url"
							class="text-sm font-bold tracking-wide uppercase opacity-60"
						>
							Source URL
						</label>
						<input
							type="url"
							class="input mt-2 w-full"
							placeholder="https://example.com/recipe"
							id="source_url"
							bind:value={source_url}
						/>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					<div>
						<label
							for="cook_time"
							class="text-sm font-bold tracking-wide uppercase opacity-60"
						>
							Cook Time (mins)
						</label>
						<input
							type="number"
							class="input mt-2 w-full"
							placeholder="e.g. 45"
							id="cook_time"
							bind:value={cook_time}
						/>
					</div>
					<div>
						<label
							for="serves"
							class="text-sm font-bold tracking-wide uppercase opacity-60"
						>
							Serves (people)
						</label>
						<input
							type="number"
							class="input mt-2 w-full"
							placeholder="e.g. 4"
							id="serves"
							bind:value={serves}
						/>
					</div>
					<div>
						<label
							for="cuisine"
							class="text-sm font-bold tracking-wide uppercase opacity-60"
						>
							Cuisine
						</label>
						<div class="mt-2">
							<Select
								options={cuisine_options}
								bind:value={cuisine}
							/>
						</div>
					</div>
					<div>
						<label
							for="category"
							class="text-sm font-bold tracking-wide uppercase opacity-60"
						>
							Category
						</label>
						<div class="mt-2">
							<Select
								options={category_options}
								bind:value={category}
							/>
						</div>
					</div>
				</div>

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<a
						href="/recipes"
						class="btn btn-ghost">Cancel</a
					>
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
					<div class="flex items-center justify-between">
						<span class="text-sm font-bold tracking-wide uppercase opacity-60">Ingredients</span>
						<div class="hidden grid-cols-12 gap-2 text-xs font-bold uppercase opacity-40 md:ml-4 md:grid md:flex-1">
							<div class="col-span-2">Amount</div>
							<div class="col-span-3">Unit</div>
							<div class="col-span-6">Item</div>
							<div class="col-span-1"></div>
						</div>
					</div>
					{#each ingredients as ingredient, index (index)}
						<div class="grid grid-cols-1 gap-2 md:grid-cols-12">
							<div class="col-span-2">
								<input
									type="number"
									class="input w-full"
									placeholder="Amount"
									bind:value={ingredient.amount}
								/>
							</div>
							<div class="col-span-3">
								<Select
									options={unit_options}
									bind:value={ingredient.unit}
								/>
							</div>
							<div class="col-span-6">
								<input
									type="text"
									class="input w-full"
									placeholder="Item (e.g. Flour)"
									bind:value={ingredient.item}
								/>
							</div>
							<div class="col-span-1 flex justify-end">
								{#if ingredients.length > 1}
									<button
										type="button"
										class="btn btn-ghost btn-square"
										onclick={() => remove_ingredient(index)}
										aria-label="Remove ingredient"
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
						</div>
					{/each}
				</div>

				<button
					type="button"
					class="btn btn-soft btn-sm"
					onclick={add_ingredient}
				>
					+ Add ingredient
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
					{#each instructions.map((_, i) => i) as index (index)}
						<div class="flex gap-2">
							<span
								class="bg-base-200 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
							>
								{index + 1}
							</span>
							<textarea
								class="textarea w-full"
								placeholder="Describe this step"
								bind:value={instructions[index]}
								rows="2"
							></textarea>
							{#if instructions.length > 1}
								<button
									type="button"
									class="btn btn-ghost btn-square"
									onclick={() => remove_instruction(index)}
									aria-label="Remove instruction"
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

				<button
					type="button"
					class="btn btn-soft btn-sm"
					onclick={add_instruction}
				>
					+ Add step
				</button>

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<button
						type="button"
						class="btn btn-ghost"
						onclick={back}>Back</button
					>
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
