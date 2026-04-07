<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import type { ActionResult } from '@sveltejs/kit';

	let identifier = $state('');
	let password = $state('');
	let loading = $state(false);
</script>

<div class="flex min-h-[80vh] items-center justify-center p-4">
	<div class="card bg-base-200 border-base-content/10 w-full max-w-md border">
		<div class="card-body">
			<h2 class="card-title mb-6 justify-center text-3xl font-bold">Welcome Back</h2>

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ result }: { result: ActionResult }) => {
						if (result.type === 'failure') {
							AlertStore.add(result.data?.message, 'error');
						} else if (result.type === 'redirect') {
							AlertStore.add('Logged in successfully', 'success');
						}
						await applyAction(result);
						loading = false;
					};
				}}
			>
				<fieldset class="fieldset">
					<legend class="sr-only">Login Details</legend>

					<label
						for="identifier"
						class="fieldset-label text-base">Email or Username</label
					>
					<input
						type="text"
						class="input validator w-full"
						id="identifier"
						name="identifier"
						bind:value={identifier}
						required
						disabled={loading}
					/>
					<div class="validator-hint hidden">Required</div>

					<label
						for="password"
						class="fieldset-label mt-4 text-base">Password</label
					>
					<input
						type="password"
						class="input validator w-full"
						id="password"
						name="password"
						bind:value={password}
						required
						disabled={loading}
					/>
					<div class="validator-hint hidden">Required</div>

					<div class="mt-6 flex flex-col gap-4">
						<button
							class="btn btn-primary w-full"
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

						<div class="divider text-base-content/60 text-xs">OR</div>

						<div class="text-center">
							<span class="text-base-content/60 text-sm">Don't have an account?</span>
							<a
								href="/register"
								class="link link-primary ml-1 text-sm font-semibold">Register now</a
							>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	</div>
</div>
