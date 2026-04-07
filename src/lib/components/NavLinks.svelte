<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import type { Session } from '$lib/types/session';
	import type { User } from '$lib/types/user';
	import type { ActionResult } from '@sveltejs/kit';

	type Props = {
		session?: Session;
		user?: User;
	};

	let { session, user }: Props = $props();
</script>

{#if session}
	{#if user?.role == 'admin'}
		<li><a href="/admin">Admin</a></li>
	{/if}
	<li><a href="/recipes">Recipes</a></li>
	<li><a href="/blog">Blog</a></li>
	<li><a href="/profile">Profile</a></li>
	<li>
		<form
			action="/logout"
			method="POST"
			use:enhance={() => {
				return async ({ result }: { result: ActionResult }) => {
					if (result.type === 'redirect') {
						AlertStore.add('Logged out successfully', 'success');
					}
					await applyAction(result);
				};
			}}
		>
			<button type="submit">Logout</button>
		</form>
	</li>
{:else}
	<li><a href="/recipes">Recipes</a></li>
	<li><a href="/blog">Blog</a></li>
	<li><a href="/login">Login</a></li>
	<li><a href="/register">Register</a></li>
{/if}
