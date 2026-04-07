<script lang="ts">
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import { goto } from '$app/navigation';
	import type { Recipe, RecipeLog } from '$lib/types/recipe';
	import { Intensity } from '$lib/types/recipe';
	import RecipePhoto from '../RecipePhoto.svelte';
	import { float_to_fraction } from '../fraction';
	import { nanoseconds_to_minutes } from '../form';

	let { data } = $props();
	let recipe = $derived(data.recipe as Recipe);
	let is_owner = $derived(page.data.user?.user_id === recipe.user_id);
	let session = $derived(page.data.session);
	let bookmarked = $derived(data.bookmarked as boolean);
	let recipe_logs = $derived((data.recipe_logs ?? []) as RecipeLog[]);

	let show_log_form = $state(false);
	let log_notes = $state('');
	let log_rating = $state(0);
	let log_duration = $state('');
	let log_intensity = $state(0);

	const intensity_options = [
		{ value: Intensity.RachaelRay, label: 'Level 1 — Rachael Ray', description: '30 mins or less, dead simple' },
		{
			value: Intensity.AltonBrown,
			label: 'Level 2 — Alton Brown',
			description: 'More involved but clear instructions'
		},
		{
			value: Intensity.JuliaChild,
			label: 'Level 3 — Julia Child',
			description: 'Read instructions multiple times, unit conversions, hunt for ingredients'
		}
	];

	async function toggle_bookmark() {
		const success = bookmarked
			? await RecipeStore.unbookmark(recipe.recipe_id)
			: await RecipeStore.bookmark(recipe.recipe_id);
		if (success) {
			invalidateAll();
		}
	}

	async function submit_log() {
		const request: Record<string, unknown> = {};
		if (log_notes.trim()) request.notes = log_notes.trim();
		if (log_rating > 0) request.rating = log_rating;
		if (log_duration) request.duration = parseInt(log_duration) * 60_000_000_000;
		if (log_intensity > 0) request.intensity = log_intensity;

		const log_id = await RecipeStore.create_recipe_log(recipe.recipe_id, request);
		if (log_id) {
			reset_log_form();
			invalidateAll();
		}
	}

	function reset_log_form() {
		show_log_form = false;
		log_notes = '';
		log_rating = 0;
		log_duration = '';
		log_intensity = 0;
	}

	async function delete_log(log_id: string) {
		if (confirm('Delete this cook log?')) {
			const success = await RecipeStore.delete_recipe_log(log_id);
			if (success) {
				invalidateAll();
			}
		}
	}

	async function delete_recipe() {
		if (confirm('Are you sure you want to delete this recipe?')) {
			const success = await RecipeStore.delete_recipe(recipe.recipe_id);
			if (success) {
				goto('/recipes');
			}
		}
	}

	function format_date(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function intensity_label(level: number): string {
		switch (level) {
			case 1:
				return 'Rachael Ray';
			case 2:
				return 'Alton Brown';
			case 3:
				return 'Julia Child';
			default:
				return '';
		}
	}

	function render_stars(rating: number): string {
		const empty = 5 - rating;
		return '★'.repeat(rating) + '☆'.repeat(empty);
	}
</script>

<div class="pb-8 md:pb-12">
	<div class="breadcrumbs text-sm">
		<ul>
			<li><a href="/recipes">Recipes</a></li>
			<li><span>{recipe.title}</span></li>
		</ul>
	</div>

	<div class="mt-4 w-full lg:float-right lg:mb-6 lg:ml-6 lg:w-72 xl:w-80">
		<RecipePhoto
			src={recipe.photo_url}
			alt={recipe.title}
			is_detail={true}
		/>
	</div>

	<h1 class="mt-4 text-2xl font-black tracking-tight md:text-3xl lg:mt-0 lg:text-4xl">{recipe.title}</h1>

	<div class="mt-6">
		{#if recipe.description}
			<p class="text-base-content/60 text-lg leading-relaxed">
				{recipe.description}
			</p>
		{/if}
		{#if recipe.source_url}
			<a
				href={recipe.source_url}
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary mt-3 inline-flex items-center gap-1.5 text-sm font-medium"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-4 w-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
					/>
				</svg>
				Original Source
			</a>
		{/if}

		<div class="text-base-content/60 mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
			{#if recipe.cook_time}
				<span
					><span class="text-base-content font-semibold">{nanoseconds_to_minutes(recipe.cook_time)} mins</span> cook time</span
				>
			{/if}
			{#if recipe.serves}
				<span><span class="text-base-content font-semibold">Serves {recipe.serves}</span></span>
			{/if}
			{#if recipe.cuisine}
				<span>{recipe.cuisine}</span>
			{/if}
			{#if recipe.category}
				<span>{recipe.category}</span>
			{/if}
		</div>

		<div class="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
			{#if session}
				<button
					class="btn {bookmarked ? 'btn-primary' : 'btn-soft'} btn-sm"
					onclick={toggle_bookmark}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill={bookmarked ? 'currentColor' : 'none'}
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-4 w-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
						/>
					</svg>
					{bookmarked ? 'Bookmarked' : 'Want to Cook'}
				</button>

				<button
					class="btn btn-soft btn-sm"
					onclick={() => (show_log_form = !show_log_form)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-4 w-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 4.5v15m7.5-7.5h-15"
						/>
					</svg>
					I Made This
				</button>
			{/if}

			{#if is_owner}
				<a
					href="/recipes/{recipe.recipe_id}/edit"
					class="btn btn-soft btn-sm">Edit Recipe</a
				>
				<button
					class="btn btn-ghost btn-sm text-error"
					onclick={delete_recipe}>Delete Recipe</button
				>
			{/if}
		</div>
	</div>

	<!-- Cook Log Form -->
	{#if show_log_form}
		<div class="border-base-content/10 bg-base-200 mt-6 rounded-lg border p-3 md:p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-sm font-bold">Log Your Cook</h3>
					<p class="text-base-content/60 text-xs">All fields optional</p>
				</div>
				<div class="flex items-center gap-2">
					<button
						class="btn btn-ghost btn-xs"
						onclick={reset_log_form}>Cancel</button
					>
					<button
						class="btn btn-primary btn-xs"
						disabled={RecipeStore.loading}
						onclick={submit_log}
					>
						{#if RecipeStore.loading}
							<span class="loading loading-spinner loading-xs"></span>
						{:else}
							Save
						{/if}
					</button>
				</div>
			</div>

			<div class="mt-3 space-y-3">
				<textarea
					id="log-notes"
					class="textarea textarea-sm w-full"
					rows="2"
					placeholder="Notes — e.g. doubled the garlic, added 5 extra mins at altitude..."
					bind:value={log_notes}
				></textarea>

				<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div class="form-control">
						<label
							class="label text-base-content/60 py-0.5 text-sm font-bold tracking-wide uppercase"
							for="log-rating">Rating</label
						>
						<div class="rating rating-sm">
							<input
								type="radio"
								class="rating-hidden"
								checked={log_rating === 0}
								onclick={() => (log_rating = 0)}
							/>
							{#each [1, 2, 3, 4, 5] as value (value)}
								<input
									type="radio"
									name="log-rating"
									class="mask mask-star-2 bg-warning"
									checked={log_rating === value}
									onclick={() => (log_rating = value)}
								/>
							{/each}
						</div>
					</div>

					<div class="form-control">
						<label
							class="label text-base-content/60 py-0.5 text-sm font-bold tracking-wide uppercase"
							for="log-duration">How long did it really take?</label
						>
						<input
							id="log-duration"
							type="number"
							min="1"
							class="input input-sm w-full"
							placeholder="Minutes"
							bind:value={log_duration}
						/>
					</div>

					<div class="form-control">
						<label
							class="label text-base-content/60 py-0.5 text-sm font-bold tracking-wide uppercase"
							for="log-intensity">How difficult was it?</label
						>
						<select
							id="log-intensity"
							class="select select-sm w-full"
							bind:value={log_intensity}
						>
							<option value={0}>Pick a level...</option>
							{#each intensity_options as opt (opt.value)}
								<option value={opt.value}>{opt.label}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
		<div class="lg:col-span-4">
			<h2 class="text-lg font-bold tracking-tight md:text-xl">Ingredients</h2>
			<ul class="mt-4 space-y-3">
				{#each recipe.ingredients as ingredient, i (i)}
					<li class="border-base-content/5 flex items-baseline gap-2 border-b pb-3 text-sm last:border-0 md:text-base">
						<span class="font-semibold tabular-nums">
							{float_to_fraction(ingredient.amount)}
							{ingredient.unit}
						</span>
						<span class="text-base-content/60">{ingredient.item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="lg:col-span-8">
			<h2 class="text-lg font-bold tracking-tight md:text-xl">Instructions</h2>
			<ol class="mt-4 space-y-6">
				{#each recipe.instructions as step, i (i)}
					<li class="flex gap-4">
						<span class="text-base-content/60 shrink-0 pt-0.5 text-sm font-semibold tabular-nums">
							{i + 1}.
						</span>
						<p class="text-sm leading-relaxed md:text-base">{step}</p>
					</li>
				{/each}
			</ol>
		</div>
	</div>

	<!-- Recipe Log History -->
	{#if recipe_logs.length > 0}
		<div class="mt-10">
			<h2 class="text-lg font-bold tracking-tight md:text-xl">Your Cook Log</h2>
			<div class="mt-4 space-y-3">
				{#each recipe_logs as log (log.log_id)}
					<div class="border-base-content/10 rounded-lg border p-4">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<span class="text-base-content/60 text-xs">{format_date(log.created_at)}</span>
								{#if log.rating}
									<span class="text-warning text-sm font-medium">{render_stars(log.rating)}</span>
								{/if}
							</div>
							<button
								class="btn btn-ghost btn-xs text-error"
								aria-label="Delete cook log"
								onclick={() => delete_log(log.log_id)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="h-3.5 w-3.5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
									/>
								</svg>
							</button>
						</div>

						{#if log.duration || log.intensity}
							<div class="text-base-content/60 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
								{#if log.duration}
									<span>Took {nanoseconds_to_minutes(log.duration)} mins</span>
								{/if}
								{#if log.intensity}
									<span class="badge badge-sm badge-outline">{intensity_label(log.intensity)}</span>
								{/if}
							</div>
						{/if}

						{#if log.notes}
							<p class="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{log.notes}</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
