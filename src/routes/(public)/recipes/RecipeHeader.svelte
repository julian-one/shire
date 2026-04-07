<script lang="ts">
	import type { Session } from '$lib/types/session';

	type Props = {
		total_recipes: number;
		session?: Session;
	};

	let { total_recipes, session }: Props = $props();
</script>

<header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">Recipes</h1>
		<p class="text-base-content/60 text-sm md:text-base">
			{total_recipes}
			{total_recipes === 1 ? 'recipe' : 'recipes'}
		</p>
	</div>
	{#if session}
		<a
			href="/recipes/new"
			class="btn btn-primary"
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
					d="M12 4.5v15m7.5-7.5h-15"
				/>
			</svg>
			New Recipe
		</a>
	{/if}
</header>
