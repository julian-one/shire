<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { Recipe, RecipeReview } from '$lib/types/recipe';
	import type { Session } from '$lib/types/session';
	import RecipeReviewForm from './RecipeReviewForm.svelte';
	import RecipeReviewItem from './RecipeReviewItem.svelte';

	let { recipe, recipe_reviews, session } = $props<{
		recipe: Recipe;
		recipe_reviews: RecipeReview[];
		session: Session | null;
	}>();

	let show_review_form = $state(false);

	let has_reviewed_today = $derived(
		session
			? recipe_reviews.some(
					(r: RecipeReview) =>
						r.user_id === session.user_id && new Date(r.created_at).toDateString() === new Date().toDateString()
				)
			: false
	);

	// Filters
	let filter_rating = $state(0);
	let filter_difficulty = $state(0);
	let has_active_filters = $derived(filter_rating > 0 || filter_difficulty > 0);

	let filtered_reviews = $derived(
		recipe_reviews.filter((r: RecipeReview) => {
			if (filter_rating > 0 && r.rating !== filter_rating) return false;
			if (filter_difficulty > 0 && r.difficulty !== filter_difficulty) return false;
			return true;
		})
	);

	function clear_filters() {
		filter_rating = 0;
		filter_difficulty = 0;
		review_offset = 0;
	}

	// Pagination
	const REVIEWS_PER_PAGE = 5;
	let review_offset = $state(0);
	let paged_reviews = $derived(filtered_reviews.slice(review_offset, review_offset + REVIEWS_PER_PAGE));

	let total_reviews = $derived(recipe_reviews.length);
	let average_rating = $derived(
		total_reviews > 0
			? recipe_reviews.reduce((acc: number, r: RecipeReview) => acc + (r.rating || 0), 0) / total_reviews
			: 0
	);

	function render_stars(rating: number): string {
		return '★'.repeat(rating);
	}

	async function delete_review(review_id: string) {
		if (confirm('Delete this review?')) {
			const success = await RecipeStore.delete_recipe_review(review_id);
			if (success) {
				invalidateAll();
			}
		}
	}
</script>

<div
	id="reviews"
	class="divider mt-16 mb-10"
></div>

<section>
	<!-- Compact header: title + summary inline -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex items-baseline gap-3">
			<h2 class="text-xl font-bold tracking-tight md:text-2xl">Reviews</h2>
			{#if total_reviews > 0}
				<span class="text-base-content/40 text-sm">
					<span class="text-warning text-base font-semibold">{render_stars(Math.round(average_rating))}</span>
					{average_rating.toFixed(1)} · {total_reviews}
					{total_reviews === 1 ? 'review' : 'reviews'}
				</span>
			{/if}
		</div>

		<div>
			{#if session}
				{#if has_reviewed_today}
					<button
						class="btn btn-outline btn-sm"
						disabled
					>
						Reviewed today
					</button>
				{:else}
					<button
						class="btn btn-outline btn-sm"
						onclick={() => (show_review_form = !show_review_form)}
					>
						Log your cook
					</button>
				{/if}
			{:else}
				<a
					href="/login"
					class="btn btn-outline btn-sm">Log in to review</a
				>
			{/if}
		</div>
	</div>

	<!-- Review Form -->
	{#if show_review_form && session}
		<div class="mt-8">
			<RecipeReviewForm
				recipe_id={recipe.recipe_id}
				onCancel={() => (show_review_form = false)}
				onSuccess={() => (show_review_form = false)}
			/>
		</div>
	{/if}

	<!-- Filters -->
	{#if recipe_reviews.length > 0}
		<div class="mt-6 flex flex-wrap items-center gap-2">
			<select
				class="select select-sm w-36"
				bind:value={filter_rating}
				onchange={() => (review_offset = 0)}
			>
				<option value={0}>All ratings</option>
				{#each [5, 4, 3, 2, 1] as star (star)}
					<option value={star}>{star} star{star === 1 ? '' : 's'}</option>
				{/each}
			</select>

			<select
				class="select select-sm w-36"
				bind:value={filter_difficulty}
				onchange={() => (review_offset = 0)}
			>
				<option value={0}>All difficulty</option>
				{#each [1, 2, 3, 4, 5] as level (level)}
					<option value={level}>Level {level}</option>
				{/each}
			</select>

			{#if has_active_filters}
				<button
					class="btn btn-ghost btn-sm text-error"
					onclick={clear_filters}
				>
					Clear
				</button>
			{/if}
		</div>
	{/if}

	<!-- Review List -->
	{#if recipe_reviews.length > 0}
		{#if filtered_reviews.length > 0}
			<div class="rounded-box border-base-content/10 bg-base-100 mt-4 overflow-x-auto border">
				<table class="table">
					<tbody>
						{#each paged_reviews as review (review.review_id)}
							<RecipeReviewItem
								{review}
								current_user_id={session?.user_id}
								onDelete={delete_review}
							/>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mt-4">
				<Pagination
					total={filtered_reviews.length}
					limit={REVIEWS_PER_PAGE}
					offset={review_offset}
					on_page_change={(new_offset) => (review_offset = new_offset)}
				/>
			</div>
		{:else}
			<p class="text-base-content/40 mt-6 text-sm">No reviews match the selected filters.</p>
		{/if}
	{:else}
		<p class="text-base-content/40 mt-8 text-sm">No reviews yet — be the first to cook and review this recipe.</p>
	{/if}
</section>
