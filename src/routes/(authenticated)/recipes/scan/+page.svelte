<script lang="ts">
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import type { ScanResult } from '$lib/types/recipe';

	let file: File | null = $state(null);
	let result: ScanResult | null = $state(null);
	let file_input: HTMLInputElement | undefined = $state();

	function handle_file_change(event: Event) {
		const input = event.target as HTMLInputElement;
		file = input.files?.[0] ?? null;
		result = null;
	}

	async function handle_upload() {
		if (!file) return;
		const scan_result = await RecipeStore.scan(file);
		if (scan_result) {
			result = scan_result;
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
				<span>Scan</span>
			</li>
		</ul>
	</div>

	<h1 class="mt-2 text-3xl font-black tracking-tight md:text-4xl">Scan Recipe</h1>
	<p class="mt-2 text-sm opacity-60 md:text-base">
		Upload a photo of a recipe to extract its contents.
	</p>

	<div class="mt-8 space-y-6">
		<div>
			<label for="recipe-image" class="text-sm font-bold tracking-wide uppercase opacity-60">
				Recipe Image
			</label>
			<input
				type="file"
				id="recipe-image"
				class="file-input mt-2 w-full"
				accept="image/jpeg,image/png,image/webp"
				onchange={handle_file_change}
				bind:this={file_input}
			/>
		</div>

		<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
			<a href="/recipes" class="btn btn-ghost">Cancel</a>
			<button
				type="button"
				class="btn btn-primary"
				disabled={!file || RecipeStore.loading}
				onclick={handle_upload}
			>
				{#if RecipeStore.loading}
					<span class="loading loading-spinner"></span>
					Scanning...
				{:else}
					Scan
				{/if}
			</button>
		</div>
	</div>

	{#if RecipeStore.scan_error}
		<div class="alert alert-error mt-8">
			<span>{RecipeStore.scan_error}</span>
		</div>
	{/if}

	{#if result}
		<div class="mt-10 space-y-8">
			<div>
				<h2 class="text-2xl font-black tracking-tight md:text-3xl">{result.title}</h2>

				{#if result.yield || result.prep_time || result.cook_time}
					<div class="mt-4 flex flex-wrap gap-3">
						{#if result.yield}
							<span class="badge badge-lg">Yield: {result.yield}</span>
						{/if}
						{#if result.prep_time}
							<span class="badge badge-lg">Prep: {result.prep_time}</span>
						{/if}
						{#if result.cook_time}
							<span class="badge badge-lg">Cook: {result.cook_time}</span>
						{/if}
					</div>
				{/if}
			</div>

			{#if result.ingredients.length > 0}
				<div>
					<h3 class="text-sm font-bold tracking-wide uppercase opacity-60">Ingredients</h3>
					<div class="mt-3 overflow-x-auto">
						<table class="table">
							<thead>
								<tr>
									<th>Amount</th>
									<th>Unit</th>
									<th>Item</th>
								</tr>
							</thead>
							<tbody>
								{#each result.ingredients as ingredient}
									<tr>
										<td>{ingredient.amount}</td>
										<td>{ingredient.unit}</td>
										<td>{ingredient.item}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}

			{#if result.instructions.length > 0}
				<div>
					<h3 class="text-sm font-bold tracking-wide uppercase opacity-60">Instructions</h3>
					<ol class="mt-3 list-inside list-decimal space-y-3 text-base-content">
						{#each result.instructions as instruction}
							<li class="text-sm md:text-base">{instruction}</li>
						{/each}
					</ol>
				</div>
			{/if}
		</div>
	{/if}
</div>
