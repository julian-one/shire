<script lang="ts">
	import RecipeRow from './RecipeRow.svelte';
	import SortHeader from '$lib/components/SortHeader.svelte';
	import type { Recipe } from '$lib/types/recipe';
	import type { Session } from '$lib/types/session';

	type Props = {
		recipes: Recipe[];
		bookmarked_ids: Set<string>;
		session?: Session;
		has_active_filters: boolean;
		order_by: string;
		on_sort: (value: string) => void;
	};

	let { recipes, bookmarked_ids, session, has_active_filters, order_by, on_sort }: Props = $props();
</script>

{#snippet recipe_table(rows: Recipe[])}
	<div class="rounded-box border-base-content/10 bg-base-100 overflow-x-auto border">
		<table class="table">
			<thead>
				<tr>
					<SortHeader
						label="Recipe"
						field="title"
						{order_by}
						{on_sort}
					/>
					{#if session}
						<th class="w-12"></th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each rows as recipe (recipe.recipe_id)}
					<RecipeRow
						{recipe}
						is_bookmarked={bookmarked_ids.has(recipe.recipe_id)}
						show_bookmark={!!session}
					/>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

{#if recipes.length === 0}
	<div
		class="border-base-content/10 mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
	>
		<div class="bg-base-200 rounded-full p-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="text-base-content/60 h-8 w-8"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
				/>
			</svg>
		</div>
		<h3 class="mt-4 text-lg font-bold">No recipes found</h3>
		<p class="text-base-content/60 mt-1 text-sm">
			{#if has_active_filters}
				Try adjusting your filters.
			{:else}
				There are no recipes to display.
			{/if}
		</p>
	</div>
{:else}
	{@render recipe_table(recipes)}
{/if}
