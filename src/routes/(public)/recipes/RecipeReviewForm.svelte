<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import ScrollPicker from '$lib/components/ScrollPicker.svelte';

	let { recipe_id, onCancel, onSuccess } = $props<{
		recipe_id: string;
		onCancel: () => void;
		onSuccess: () => void;
	}>();

	let review_notes = $state('');
	let review_rating = $state(0);
	let review_hours = $state(0);
	let review_minutes = $state(0);
	let review_difficulty = $state(0);

	async function submit_review() {
		const request: Record<string, unknown> = {
			rating: review_rating
		};
		if (review_difficulty > 0) {
			request.difficulty = review_difficulty;
		}
		if (review_hours > 0 || review_minutes > 0) {
			request.duration = (review_hours * 60 + review_minutes) * 60_000_000_000;
		}
		if (review_notes.trim()) request.notes = review_notes.trim();

		const review_id = await RecipeStore.create_recipe_review(recipe_id, request);
		if (review_id) {
			review_notes = '';
			review_rating = 0;
			review_hours = 0;
			review_minutes = 0;
			review_difficulty = 0;
			invalidateAll();
			onSuccess();
		}
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		submit_review();
	}}
	class="border-base-content/10 mb-8 border-b pb-8"
>
	<h3 class="text-base font-bold">Log Your Cook</h3>

	<div class="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
		<!-- Rating -->
		<div>
			<span class="text-base-content/50 text-xs font-semibold uppercase">Rating</span>
			<div class="mt-2 flex flex-col gap-1.5">
				<div class="rating gap-1.5">
					<input
						type="radio"
						name="rating"
						class="rating-hidden hidden"
						value={0}
						bind:group={review_rating}
					/>
					{#each [1, 2, 3, 4, 5] as value (value)}
						<input
							type="radio"
							name="rating"
							aria-label="Rating {value}"
							class="mask mask-star-2 bg-warning h-7 w-7"
							{value}
							bind:group={review_rating}
						/>
					{/each}
				</div>
				<div
					class="text-base-content/40 flex w-full max-w-[175px] justify-between text-[10px] font-semibold tracking-wider uppercase"
				>
					<span>Not a fan</span>
					<span>Loved it</span>
				</div>
			</div>
		</div>

		<!-- Difficulty -->
		<div>
			<span class="text-base-content/50 text-xs font-semibold uppercase"
				>Difficulty <span class="text-base-content/30 normal-case">(optional)</span></span
			>
			<div class="mt-2 flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					{#each [1, 2, 3, 4, 5] as value (value)}
						<button
							type="button"
							aria-label="Difficulty {value}"
							class="h-7 w-4 rounded-full {review_difficulty >= value ? 'bg-error' : 'bg-base-content/15'}"
							onclick={() => {
								if (review_difficulty === value) {
									review_difficulty = 0;
								} else {
									review_difficulty = value;
								}
							}}
						></button>
					{/each}
				</div>
				<div
					class="text-base-content/40 flex w-full max-w-[100px] justify-between text-[10px] font-semibold tracking-wider uppercase"
				>
					<span>Easy</span>
					<span>Hard</span>
				</div>
			</div>
		</div>

		<!-- Time -->
		<div>
			<span class="text-base-content/50 text-xs font-semibold uppercase"
				>Cook time <span class="text-base-content/30 normal-case">(optional)</span></span
			>
			<div class="mt-2 flex items-center gap-4">
				<ScrollPicker
					max={24}
					label="Hours"
					bind:value={review_hours}
				/>
				<div class="text-base-content/20 pb-6 text-xl font-bold">:</div>
				<ScrollPicker
					max={59}
					label="Mins"
					bind:value={review_minutes}
				/>
			</div>
		</div>
	</div>

	<!-- Notes -->
	<div class="mt-6">
		<label
			for="review-notes"
			class="text-base-content/50 text-xs font-semibold uppercase"
			>Comments <span class="text-base-content/30 normal-case">(optional)</span></label
		>
		<textarea
			id="review-notes"
			class="textarea mt-2 w-full text-sm"
			rows="3"
			placeholder="Did you make any substitutions? How did it turn out?"
			bind:value={review_notes}
		></textarea>
	</div>

	<div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
		<button
			type="button"
			class="btn btn-ghost btn-sm"
			onclick={onCancel}>Cancel</button
		>
		<button
			type="submit"
			class="btn btn-primary btn-sm"
			disabled={RecipeStore.loading || review_rating === 0}
		>
			{#if RecipeStore.loading}
				<span class="loading loading-spinner loading-xs"></span>
				Saving...
			{:else}
				Submit
			{/if}
		</button>
	</div>
</form>
