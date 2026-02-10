<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import type { ActionResult } from '@sveltejs/kit';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<h2 class="text-2xl font-bold">Login</h2>
	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ result }: { result: ActionResult }) => {
				if (result.type === 'failure') {
					AlertStore.add(result.data?.message, 'error');
				}
				await applyAction(result);
				loading = false;
			};
		}}
		class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
	>
		<legend class="fieldset-legend">Login</legend>

		<label
			for="email"
			class="label">Email</label
		>
		<input
			type="email"
			class="input"
			placeholder="Email"
			id="email"
			name="email"
			bind:value={email}
			required
			disabled={loading}
		/>

		<label
			for="password"
			class="label">Password</label
		>
		<input
			type="password"
			class="input"
			placeholder="Password"
			id="password"
			name="password"
			bind:value={password}
			required
			disabled={loading}
		/>

		<button
			class="btn btn-neutral mt-4"
			type="submit"
			disabled={loading}
		>
			{#if loading}
				<span class="loading loading-spinner"></span>
				Logging In...
			{:else}
				Login
			{/if}
		</button>
	</form>
</div>
