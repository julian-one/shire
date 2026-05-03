<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { AlertStore } from '$lib/stores/alert.svelte';

	let loading = $state(false);
	let success = $state(false);
</script>

<div class="flex min-h-[80vh] items-center justify-center p-4">
	<div class="card bg-base-200 border-base-content/10 w-full max-w-md border">
		<div class="card-body">
			<h2 class="card-title mb-6 justify-center text-3xl font-black tracking-tight md:text-4xl"> Reset Password </h2>

			{#if success}
				<div class="alert alert-success">
					<span>If an account exists for that email, we have sent a password reset link. Please check your inbox.</span>
				</div>
				<div class="mt-6 text-center">
					<a
						href="/login"
						class="btn btn-primary w-full">Return to Login</a
					>
				</div>
			{:else}
				<p class="text-base-content/80 mb-4 text-sm md:text-base">
					Enter your email address and we'll send you a link to reset your password.
				</p>
				<form
					method="POST"
					use:enhance={() => {
						loading = true;
						return async ({ result }: { result: ActionResult }) => {
							if (result.type === 'failure') {
								AlertStore.add(result.data?.message, 'error');
							} else if (result.type === 'success') {
								success = true;
							}
							await applyAction(result);
							loading = false;
						};
					}}
				>
					<fieldset class="fieldset">
						<legend class="sr-only">Forgot Password Details</legend>

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
							required
							disabled={loading}
						/>
						<div class="validator-hint hidden">Please enter a valid email address</div>

						<div class="mt-8 flex flex-col gap-4">
							<button
								class="btn btn-primary w-full"
								type="submit"
								disabled={loading}
							>
								{#if loading}
									<span class="loading loading-spinner"></span>
									Sending...
								{:else}
									Send Reset Link
								{/if}
							</button>

							<div class="divider text-base-content/60 text-xs">OR</div>

							<div class="text-center">
								<a
									href="/login"
									class="link link-primary ml-1 text-sm font-semibold"
								>
									Back to Login
								</a>
							</div>
						</div>
					</fieldset>
				</form>
			{/if}
		</div>
	</div>
</div>
