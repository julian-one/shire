<script lang="ts">
	import type { RecipeReview } from '$lib/types/recipe';
	import { nanoseconds_to_minutes } from './form';

	let { review, current_user_id, onDelete } = $props<{
		review: RecipeReview;
		current_user_id?: string;
		onDelete: (id: string) => void;
	}>();

	function format_date(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function render_stars(rating: number): string {
		return '★'.repeat(rating);
	}
</script>

<tr>
	<td class="w-full">
		<div class="flex items-center gap-3">
			<div
				class="bg-neutral text-neutral-content flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase"
			>
				{review.username.slice(0, 2)}
			</div>
			<div>
				<div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
					<span class="text-sm font-bold">{review.username}</span>
					<span class="text-base-content/40 text-xs">{format_date(review.created_at)}</span>
				</div>
				<div class="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
					{#if review.rating}
						<span class="text-warning text-lg font-semibold tracking-wider">{render_stars(review.rating)}</span>
					{/if}
					{#if review.duration}
						<span class="text-base-content/50 text-xs">{nanoseconds_to_minutes(review.duration)} min</span>
					{/if}
					{#if review.difficulty}
						<span
							class="text-base-content/50 flex items-center gap-0.5 text-xs"
							title="Difficulty {review.difficulty}/5"
						>
							{#each [1, 2, 3, 4, 5] as value (value)}
								<span
									class="inline-block h-2.5 w-1 rounded-full {review.difficulty >= value
										? 'bg-error/80'
										: 'bg-base-content/10'}"
								></span>
							{/each}
						</span>
					{/if}
				</div>
				{#if review.notes}
					<p class="text-base-content/60 mt-1 text-sm leading-relaxed whitespace-pre-wrap">{review.notes}</p>
				{/if}
			</div>
		</div>
	</td>
	{#if current_user_id === review.user_id}
		<td class="w-12">
			<button
				class="btn btn-ghost btn-sm btn-square"
				onclick={() => onDelete(review.review_id)}
				title="Delete review"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="text-error/60 h-4 w-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
					/>
				</svg>
			</button>
		</td>
	{/if}
</tr>
