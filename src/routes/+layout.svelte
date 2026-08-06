<script lang="ts">
	import '../app.css';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<div class="flex min-h-screen flex-col">
	<header class="navbar border-base-content/10 border-b">
		<div class="flex-1">
			<a
				href="/"
				class="px-2 text-lg font-black tracking-tight md:text-xl">julian-one.com</a
			>
		</div>
		<div class="flex items-center gap-2">
			{#if data.user}
				<span class="hidden px-2 text-sm sm:inline md:text-base">{data.user.username}</span>
				<form
					method="POST"
					action="/logout"
				>
					<button class="btn btn-ghost btn-sm">Log out</button>
				</form>
			{:else}
				<a
					href="/login"
					class="btn btn-ghost btn-sm">Log in</a
				>
			{/if}
			<ThemeSwitcher />
		</div>
	</header>
	{@render children()}
</div>
