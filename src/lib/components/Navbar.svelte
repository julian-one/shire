<script lang="ts">
	import type { Session } from '$lib/types/session';
	import type { User } from '$lib/types/user';
	import ThemeSwitcher from '$lib/themes/Switcher.svelte';

	let {
		session,
		user,
		theme = $bindable()
	} = $props<{
		session: Session | null;
		user: User | null;
		theme: string;
	}>();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<a
			class="btn btn-ghost text-xl"
			href={session ? '/home' : '/'}>jroberts</a
		>
	</div>
	<div class="flex flex-none items-center gap-4">
		<ThemeSwitcher bind:theme />
		<ul class="menu menu-horizontal px-1">
			{#if session}
				{#if user?.role == 'admin'}
					<li><a href="/admin">Users</a></li>
				{/if}
				<li><a href="/profile">Profile</a></li>
				<!-- <li><a href="/logout">Logout</a></li> -->
				<li>
					<form
						action="/logout"
						method="POST"
					>
						<button type="submit">Logout</button>
					</form>
				</li>
			{:else}
				<li><a href="/login">Login</a></li>
				<li><a href="/register">Register</a></li>
			{/if}
		</ul>
	</div>
</div>
