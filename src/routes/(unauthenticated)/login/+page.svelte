<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import type { ActionResult } from '@sveltejs/kit';

	let identifier = $state('');
	let password = $state('');
	let loading = $state(false);
	let showPassword = $state(false);
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

					<div class="mt-4 flex items-center justify-between">
						<label
							for="password"
							class="fieldset-label text-base">Password</label
						>
						<a
							href="/forgot-password"
							class="link text-base-content/70 text-sm md:text-base"
							tabindex="-1"
						>
							Forgot password?
						</a>
					</div>
					<div class="relative w-full">
						<input
							type={showPassword ? 'text' : 'password'}
							class="input validator w-full pr-10"
							id="password"
							name="password"
							bind:value={password}
							required
							disabled={loading}
						/>
						<button
							type="button"
							class="text-base-content/50 absolute top-1/2 right-3 -translate-y-1/2"
							onclick={() => (showPassword = !showPassword)}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{#if showPassword}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path
										d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
									/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line
										x1="2"
										x2="22"
										y1="2"
										y2="22"
									/></svg
								>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path
										d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
									/><circle
										cx="12"
										cy="12"
										r="3"
									/></svg
								>
							{/if}
						</button>
					</div>
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
