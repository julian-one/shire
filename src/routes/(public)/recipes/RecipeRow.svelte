<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { RecipeStore } from '$lib/stores/recipe.svelte';
	import type { Recipe } from '$lib/types/recipe';

	type Props = {
		recipe: Recipe;
		is_bookmarked: boolean;
		show_bookmark: boolean;
	};

	let { recipe, is_bookmarked, show_bookmark }: Props = $props();

	async function toggle_bookmark(event: MouseEvent) {
		event.stopPropagation();
		const success = is_bookmarked
			? await RecipeStore.unbookmark(recipe.recipe_id)
			: await RecipeStore.bookmark(recipe.recipe_id);
		if (success) {
			invalidateAll();
		}
	}
</script>

<tr
	class="cursor-pointer"
	onclick={() => goto(`/recipes/${recipe.recipe_id}`)}
>
	<td class="w-full">
		<div class="flex items-center gap-3">
			{#if recipe.photo_url}
				<div class="avatar shrink-0">
					<div class="skeleton mask mask-squircle h-12 w-12">
						<img
							src={recipe.photo_url}
							alt={recipe.title}
							class="h-full w-full object-cover"
							onload={(e) => e.currentTarget.parentElement?.classList.remove('skeleton')}
						/>
					</div>
				</div>
			{:else}
				<div class="avatar placeholder shrink-0">
					<div class="mask mask-squircle bg-base-200 flex h-12 w-12 items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="text-base-content/60 h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
							/>
						</svg>
					</div>
				</div>
			{/if}
			<div class="font-bold">{recipe.title}</div>
		</div>
	</td>
	{#if show_bookmark}
		<td class="w-12">
			<button
				class="btn btn-ghost btn-sm btn-square"
				onclick={toggle_bookmark}
				title={is_bookmarked ? 'Remove bookmark' : 'Bookmark'}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill={is_bookmarked ? 'currentColor' : 'none'}
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-4 w-4 {is_bookmarked ? 'text-primary' : ''}"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
					/>
				</svg>
			</button>
		</td>
	{/if}
</tr>
