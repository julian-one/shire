<script lang="ts">
	import NavLinks from '$lib/components/NavLinks.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import type { Session } from '$lib/types/session';
	import type { User } from '$lib/types/user';

	let {
		session,
		user,
		theme = $bindable()
	} = $props<{
		session?: Session;
		user?: User;
		theme: string;
	}>();
</script>

<div class="navbar bg-base-100 border-base-content/10 border-b">
	<div class="flex flex-1 items-center gap-2">
		<a
			class="btn btn-ghost text-xl"
			href="/">julian-one</a
		>
		<ThemeSwitcher bind:theme />
	</div>
	<div class="flex flex-none items-center gap-2">
		<!-- Desktop menu -->
		<ul class="menu menu-horizontal hidden px-1 md:flex">
			<NavLinks
				{session}
				{user}
			/>
		</ul>

		<!-- Mobile menu -->
		<div class="dropdown dropdown-end md:hidden">
			<div
				tabindex="0"
				role="button"
				class="btn btn-ghost btn-square"
				aria-label="Open menu"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</div>
			<ul
				tabindex="-1"
				class="menu dropdown-content bg-base-200 rounded-box border-base-content/10 z-10 mt-3 w-52 border p-2"
			>
				<NavLinks
					{session}
					{user}
				/>
			</ul>
		</div>
	</div>
</div>
