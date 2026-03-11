<script lang="ts">
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import { Cuisine, Category, Unit, type Ingredient, type Recipe } from '$lib/types/recipe';
	import Select from '$lib/components/Select.svelte';

	let { data } = $props();
	const original_recipe = untrack(() => data.recipe as Recipe);

	let title = $state(original_recipe.title);
	let description = $state(original_recipe.description ?? '');
	let photo_url = $state(original_recipe.photo_url ?? '');
	let source_url = $state(original_recipe.source_url ?? '');
	let ingredients = $state<Ingredient[]>(JSON.parse(JSON.stringify(original_recipe.ingredients)));
	let instructions = $state<string[]>([...original_recipe.instructions]);
	let cook_time = $state(
		original_recipe.cook_time ? Math.round(original_recipe.cook_time / (60 * 1000 * 1000 * 1000)).toString() : ''
	);
	let serves = $state(original_recipe.serves ? original_recipe.serves.toString() : '');
	let cuisine = $state<Cuisine | ''>(original_recipe.cuisine ?? '');
	let category = $state<Category | ''>(original_recipe.category ?? '');

	const cuisine_options = [
		{ value: '', label: 'None' },
		...Object.values(Cuisine).map((c) => ({ value: c, label: c }))
	];
	const category_options = [
		{ value: '', label: 'None' },
		...Object.values(Category).map((c) => ({ value: c, label: c }))
	];
	const unit_options = Object.values(Unit).map((u) => ({ value: u, label: u }));

	let can_submit = $derived(
		title.trim().length > 0 &&
			ingredients.length > 0 &&
			ingredients.every((i) => i.item.trim().length > 0) &&
			instructions.length > 0 &&
			instructions.every((i) => i.trim().length > 0)
	);

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

		const success = await RecipeStore.update(original_recipe.recipe_id, {
			title: title.trim(),
			description: description.trim(),
			photo_url: photo_url.trim() || undefined,
			source_url: source_url.trim() || undefined,
			ingredients: ingredients.map((i) => ({
				amount: parseFloat(i.amount.toString()) || 0,
				unit: i.unit,
				item: i.item.trim()
			})),
			instructions: instructions.map((i) => i.trim()),
			cook_time: cook_time ? parseInt(cook_time) * 60 * 1000 * 1000 * 1000 : 0,
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
		onsubmit={handle_submit}
		class="mt-8 space-y-10"
	>
		<!-- Basics -->
		<section class="space-y-6">
			<h2 class="text-lg font-bold tracking-tight">Basics</h2>

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
		</section>

		<div class="divider"></div>

		<!-- Ingredients -->
		<section class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-bold tracking-tight">Ingredients</h2>
				<button
					type="button"
					class="btn btn-soft btn-sm"
					onclick={add_ingredient}
				>
					+ Add
				</button>
			</div>

			<div class="hidden grid-cols-12 gap-2 text-xs font-bold uppercase opacity-40 md:grid">
				<div class="col-span-2">Amount</div>
				<div class="col-span-3">Unit</div>
				<div class="col-span-6">Item</div>
				<div class="col-span-1"></div>
			</div>

			<div class="space-y-3">
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
		</section>

		<div class="divider"></div>

		<!-- Instructions -->
		<section class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-bold tracking-tight">Instructions</h2>
				<button
					type="button"
					class="btn btn-soft btn-sm"
					onclick={add_instruction}
				>
					+ Add
				</button>
			</div>

			<div class="space-y-3">
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
		</section>

		<div class="divider"></div>

		<!-- Actions -->
		<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
			<a
				href="/recipes/{original_recipe.recipe_id}"
				class="btn btn-ghost">Cancel</a
			>
			<button
				type="submit"
				class="btn btn-primary"
				disabled={!can_submit || RecipeStore.loading}
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
