<script lang="ts">
	import { enhance } from '$app/forms';
	import type { User } from '$lib/types/user';
	import { browser } from '$app/environment';

	interface Props {
		user: User | null;
	}

	let { user }: Props = $props();
	let loggingOut = $state(false);

	const themes = ['light', 'dark', 'cupcake', 'forest'] as const;
	let currentTheme = $state('light');

	function setTheme(theme: string) {
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme);
			localStorage.setItem('theme', theme);
			currentTheme = theme;
			// Close dropdown by blurring
			(document.activeElement as HTMLElement)?.blur();
		}
	}

	$effect(() => {
		if (browser) {
			const saved = localStorage.getItem('theme');
			if (saved && themes.includes(saved as (typeof themes)[number])) {
				document.documentElement.setAttribute('data-theme', saved);
				currentTheme = saved;
			}
		}
	});
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl">Pippaothy</a>
	</div>
	<div class="flex-none gap-2">
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-sm gap-1">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="4"/>
					<path d="M12 2v2"/>
					<path d="M12 20v2"/>
					<path d="m4.93 4.93 1.41 1.41"/>
					<path d="m17.66 17.66 1.41 1.41"/>
					<path d="M2 12h2"/>
					<path d="M20 12h2"/>
					<path d="m6.34 17.66-1.41 1.41"/>
					<path d="m19.07 4.93-1.41 1.41"/>
				</svg>
				<span class="capitalize">{currentTheme}</span>
				<svg width="10" height="10" class="fill-current opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
					<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
				</svg>
			</div>
			<ul
				tabindex="0"
				class="dropdown-content bg-base-200 rounded-box z-10 mt-3 w-40 p-2 shadow-lg"
			>
				{#each themes as theme}
					<li>
						<button
							class="btn btn-sm btn-block btn-ghost justify-start capitalize"
							class:btn-active={currentTheme === theme}
							onclick={() => setTheme(theme)}
						>
							{#if currentTheme === theme}
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							{/if}
							{theme}
						</button>
					</li>
				{/each}
			</ul>
		</div>
		{#if user}
			<span class="text-sm">{user.username}</span>
			<a href="/logs" class="btn btn-ghost btn-sm">Logs</a>
			<a href="/profile" class="btn btn-ghost btn-sm">Profile</a>
			<form
				method="POST"
				action="/logout"
				use:enhance={() => {
					loggingOut = true;
					return async ({ update }) => {
						try {
							await update();
						} finally {
							loggingOut = false;
						}
					};
				}}
			>
				<button type="submit" disabled={loggingOut} class="btn btn-error btn-sm">
					{#if loggingOut}
						<span class="loading loading-spinner loading-xs"></span>
					{/if}
					Logout
				</button>
			</form>
		{:else}
			<a href="/login" class="btn btn-ghost btn-sm">Login</a>
			<a href="/register" class="btn btn-primary btn-sm">Register</a>
		{/if}
	</div>
</div>
