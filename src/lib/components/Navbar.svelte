<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AuthController from '#lib/controllers/auth.js';
	import type { User } from '#lib/types/user.js';

	let { user }: { user?: User } = $props();

	const auth = new AuthController();

	let ready = $state(false);
	let message = $state('');

	onMount(() => {
		ready = true;
	});

	async function logout() {
		message = '';
		try {
			await auth.logout();
		} catch {
			message = 'Log out failed. Please try again.';
			return;
		}
		await goto(resolve('/(unauthenticated)/login'));
	}
</script>

<header class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl" href={resolve('/(authenticated)')}>Shire</a>
	</div>
	<div class="flex-none gap-2">
		{#if user}
			<span class="hidden md:inline">{user.username}</span>
		{/if}
		{#if message}
			<span class="text-error" role="alert">{message}</span>
		{/if}
		<button class="btn btn-ghost" type="button" disabled={!ready} onclick={logout}>Log out</button>
	</div>
</header>
