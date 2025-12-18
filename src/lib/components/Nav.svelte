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

<div class="navbar bg-base-100 shadow-sm min-h-0 px-2 sm:px-4">
	<div class="navbar-start flex-shrink-0">
		<a href="/" class="btn btn-ghost text-base sm:text-xl px-2 sm:px-4">
			<span class="hidden sm:inline">Julian Roberts</span>
			<span class="sm:hidden">JR</span>
		</a>
	</div>

	<!-- Desktop nav links - hidden below lg -->
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1 gap-1">
			<li><a href="/about">About</a></li>
			<li><a href="/education">Education</a></li>
			<li><a href="/experience">Experience</a></li>
			<li><a href="/skills">Skills</a></li>
			<li><a href="/contact">Contact</a></li>
		</ul>
	</div>

	<div class="navbar-end gap-1 flex-shrink-0">
		<!-- Theme dropdown -->
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-square">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
			</div>
			<ul tabindex="0" class="dropdown-content bg-base-200 rounded-box z-20 mt-3 w-40 p-2 shadow-lg">
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

		<!-- Mobile menu - visible below lg -->
		<div class="dropdown dropdown-end lg:hidden">
			<div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-square">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="4" x2="20" y1="12" y2="12"/>
					<line x1="4" x2="20" y1="6" y2="6"/>
					<line x1="4" x2="20" y1="18" y2="18"/>
				</svg>
			</div>
			<ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box z-20 mt-3 w-52 p-2 shadow-lg">
				<li><a href="/about">About</a></li>
				<li><a href="/education">Education</a></li>
				<li><a href="/experience">Experience</a></li>
				<li><a href="/skills">Skills</a></li>
				<li><a href="/contact">Contact</a></li>
			</ul>
		</div>

		{#if user}
			<a href="/profile" class="btn btn-ghost btn-sm btn-square sm:btn-wide sm:px-3">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sm:hidden">
					<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
					<circle cx="12" cy="7" r="4"/>
				</svg>
				<span class="hidden sm:inline">Profile</span>
			</a>
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
					<span class="hidden sm:inline">Logout</span>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sm:hidden">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
						<polyline points="16 17 21 12 16 7"/>
						<line x1="21" x2="9" y1="12" y2="12"/>
					</svg>
				</button>
			</form>
		{/if}
	</div>
</div>
