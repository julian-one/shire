<script lang="ts">
	import { resolve } from '$app/paths';
	import AccountMenu from '#lib/components/AccountMenu.svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import type { User } from '#lib/types/user.js';

	let { user }: { user?: User } = $props();

	const homeHref = $derived(user ? resolve('/(authenticated)/home') : resolve('/(public)'));
</script>

<header class="border-b-2 border-base-300 bg-base-100">
	<div class="navbar mx-auto max-w-400 gap-6 px-8 py-3">
		<div class="navbar-start">
			<a
				class="flex min-h-11 link items-center text-xl font-bold tracking-wider link-hover underline-offset-6"
				href={homeHref}
			>
				julian-one
			</a>
		</div>
		{#if user}
			<nav class="navbar-end" aria-label="Site">
				<AccountMenu {user} />
			</nav>
		{:else}
			<nav class="navbar-end" aria-label="Site">
				<ThemeToggle />
			</nav>
		{/if}
	</div>
</header>
