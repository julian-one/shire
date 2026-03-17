<script lang="ts">
	import { Unit, type FormIngredient } from '$lib/types/recipe';
	import Select from '$lib/components/Select.svelte';
	import { unit_options } from '$lib/helpers/recipe-form';

	let {
		ingredients = $bindable()
	}: {
		ingredients: FormIngredient[];
	} = $props();

	function add_ingredient() {
		ingredients = [...ingredients, { amount: '', unit: Unit.G, item: '' }];
	}

	function remove_ingredient(index: number) {
		ingredients = ingredients.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	<div class="hidden grid-cols-12 gap-2 text-xs font-bold uppercase opacity-40 md:grid">
		<div class="col-span-2">Amount</div>
		<div class="col-span-3">Unit</div>
		<div class="col-span-6">Item</div>
		<div class="col-span-1"></div>
	</div>
	{#each ingredients as ingredient, index (index)}
		<div class="grid grid-cols-1 gap-2 md:grid-cols-12">
			<div class="col-span-2">
				<input
					type="text"
					class="input validator w-full"
					placeholder="e.g. 1 1/2"
					required
					pattern="\d[\d\s/.]*"
					bind:value={ingredient.amount}
				/>
				<div class="validator-hint hidden">Enter a number or fraction</div>
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
					class="input validator w-full"
					placeholder="Item (e.g. Flour)"
					required
					bind:value={ingredient.item}
				/>
				<div class="validator-hint hidden">Required</div>
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
