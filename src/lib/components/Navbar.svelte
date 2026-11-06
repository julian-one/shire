<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AuthController from '#lib/controllers/auth.js';
	import { ToastStore } from '#lib/stores/toasts.svelte.js';
	import type { User } from '#lib/types/user.js';

	let { user }: { user?: User } = $props();

	const auth = new AuthController();

	async function logout() {
		try {
			await auth.logout();
		} catch {
			ToastStore.error('Log out failed.', 'Please try again.');
			return;
		}
		await goto(resolve('/(unauthenticated)/login'));
	}
</script>

<header class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl" href={resolve('/(authenticated)')}>julian-one</a>
	</div>
	<div class="flex-none gap-2">
		{#if user}
			<span class="hidden md:inline">{user.username}</span>
		{/if}
		<button class="btn btn-ghost" type="button" onclick={logout}>Log out</button>
	</div>
</header>
