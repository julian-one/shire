<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { page } from '$app/stores';

	let loading = $state(false);
	let token = $derived($page.url.searchParams.get('token') || '');

	// Require a token to display the form
	let hasToken = $derived(token.length > 0);

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
</script>

<div class="flex min-h-[80vh] items-center justify-center p-4">
	<div class="card bg-base-200 border-base-content/10 w-full max-w-md border">
		<div class="card-body">
			<h2 class="card-title mb-6 justify-center text-3xl font-black tracking-tight md:text-4xl">
				Choose New Password
			</h2>

			{#if !hasToken}
				<div class="alert alert-error">
					<span>Missing or invalid password reset token. Please use the link from your email.</span>
				</div>
				<div class="mt-6 text-center">
					<a
						href="/forgot-password"
						class="btn btn-outline w-full">Request New Link</a
					>
				</div>
			{:else}
				<p class="text-base-content/80 mb-4 text-sm md:text-base"> Please enter your new password below. </p>
				<form
					method="POST"
					use:enhance={() => {
						loading = true;
						return async ({ result }: { result: ActionResult }) => {
							if (result.type === 'failure') {
								AlertStore.add(result.data?.message, 'error');
							} else if (result.type === 'redirect') {
								AlertStore.add('Password updated successfully. You can now log in.', 'success');
							}
							await applyAction(result);
							loading = false;
						};
					}}
				>
					<fieldset class="fieldset">
						<legend class="sr-only">New Password Details</legend>

						<input
							type="hidden"
							name="token"
							value={token}
						/>

						<label
							for="password"
							class="fieldset-label text-base">New Password</label
						>
						<div class="relative w-full">
							<input
								type={showPassword ? 'text' : 'password'}
								class="input validator w-full pr-10"
								placeholder="Enter new password"
								id="password"
								name="password"
								required
								disabled={loading}
								minlength="8"
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
						<div class="validator-hint hidden">Password must be at least 8 characters long</div>

						<label
							for="confirm_password"
							class="fieldset-label mt-4 text-base">Confirm Password</label
						>
						<div class="relative w-full">
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								class="input validator w-full pr-10"
								placeholder="Confirm new password"
								id="confirm_password"
								name="confirm_password"
								required
								disabled={loading}
								minlength="8"
							/>
							<button
								type="button"
								class="text-base-content/50 absolute top-1/2 right-3 -translate-y-1/2"
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
								aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
							>
								{#if showConfirmPassword}
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

						<div class="mt-8 flex flex-col gap-4">
							<button
								class="btn btn-primary w-full"
								type="submit"
								disabled={loading}
							>
								{#if loading}
									<span class="loading loading-spinner"></span>
									Updating...
								{:else}
									Update Password
								{/if}
							</button>
						</div>
					</fieldset>
				</form>
			{/if}
		</div>
	</div>
</div>
