<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import type { ActionResult } from '@sveltejs/kit';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
</script>

<div class="flex min-h-[80vh] items-center justify-center p-4">
	<div class="card bg-base-200 w-full max-w-md shadow-xl">
		<div class="card-body">
			<h2 class="card-title mb-6 justify-center text-3xl font-bold">Welcome Back</h2>

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
			>
				<fieldset class="fieldset">
					<legend class="sr-only">Login Details</legend>

					<label
						for="email"
						class="fieldset-label text-base">Email</label
					>
					<input
						type="email"
						class="input validator w-full"
						placeholder="name@example.com"
						id="email"
						name="email"
						bind:value={email}
						required
						disabled={loading}
					/>
					<div class="validator-hint hidden">Please enter a valid email address</div>

					<label
						for="password"
						class="fieldset-label mt-4 text-base">Password</label
					>
					<input
						type="password"
						class="input w-full"
						placeholder="••••••••"
						id="password"
						name="password"
						bind:value={password}
						required
						disabled={loading}
					/>

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

						<div class="divider text-xs opacity-50">OR</div>

						<div class="text-center">
							<span class="text-sm opacity-70">Don't have an account?</span>
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
