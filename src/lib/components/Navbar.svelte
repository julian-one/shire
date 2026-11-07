<script lang="ts">
	import { resolve } from '$app/paths';
	import AccountMenu from '#lib/components/AccountMenu.svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import type { User } from '#lib/types/user.js';

	let { user }: { user?: User } = $props();
</script>

<header class="navbar gap-6 border-b-2 border-base-300 bg-base-100 px-4 py-3 md:px-8">
	<div class="navbar-start">
		<a
			class="flex min-h-11 link items-center text-xl font-bold tracking-tight link-hover underline-offset-6"
			href={resolve('/(authenticated)')}
		>
			julian-one
		</a>
	</div>
	{#if user}
		<nav class="navbar-end" aria-label="Account">
			<AccountMenu {user} />
		</nav>
	{:else}
		<nav class="navbar-end" aria-label="Site">
			<ThemeToggle />
		</nav>
	{/if}
</header>
