<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { AlertStore } from '$lib/stores/alert.svelte';

	const password_regex = '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}';
	import type { ActionResult } from '@sveltejs/kit';

	let { data, form } = $props();
	let loading = $state(false);
	let verified = $state(false);
	let autoSubmitted = $state(false);

	let verifyFormEl: HTMLFormElement | undefined = $state();

	let verifiedToken = $state('');
	let verifiedUsername = $state('');
	let password = $state('');

	$effect(() => {
		if (data.code && verifyFormEl && !autoSubmitted) {
			autoSubmitted = true;
			verifyFormEl.requestSubmit();
		}
	});
</script>

<div class="flex min-h-[80vh] items-center justify-center p-4">
	<div class="card bg-base-200 border-base-content/10 w-full max-w-md border">
		<div class="card-body items-center text-center">
			{#if verified}
				<h2 class="card-title mb-4 text-3xl font-bold">Set Your Password</h2>
				<p class="text-base-content/70 mb-6">
					Welcome, <span class="font-semibold">{verifiedUsername}</span>! Create a password to finish setting up your
					account.
				</p>

				<form
					method="POST"
					action="?/set_password"
					class="w-full"
					use:enhance={() => {
						loading = true;
						return async ({ result }: { result: ActionResult }) => {
							if (result.type === 'success') {
								goto('/profile', { invalidateAll: true });
							} else if (result.type === 'failure') {
								AlertStore.add(result.data?.message, 'error');
							}
							await applyAction(result);
							loading = false;
						};
					}}
				>
					<fieldset class="fieldset">
						<legend class="sr-only">Set Password</legend>

						<input
							type="hidden"
							name="token"
							value={verifiedToken}
						/>

						<label
							for="password"
							class="fieldset-label text-base">Password</label
						>
						<input
							type="password"
							class="input validator w-full"
							placeholder="••••••••"
							id="password"
							name="password"
							bind:value={password}
							required
							disabled={loading}
							minlength="8"
							pattern={password_regex}
						/>
						<div class="validator-hint hidden"> 8+ chars with a number, lowercase & uppercase letter </div>

						<button
							class="btn btn-primary mt-6 w-full"
							type="submit"
							disabled={loading}
						>
							{#if loading}
								<span class="loading loading-spinner"></span>
								Creating Account...
							{:else}
								Create Account
							{/if}
						</button>
					</fieldset>
				</form>
			{:else if data.code}
				{#if form?.message}
					<h2 class="card-title mb-4 text-3xl font-bold">Verification Failed</h2>
					<p class="text-base-content/70 mb-6">{form.message}</p>
					<a
						href="/register"
						class="btn btn-primary w-full">Back to registration</a
					>
				{:else}
					<h2 class="card-title mb-4 text-3xl font-bold">Verifying Email</h2>
					<span class="loading loading-spinner loading-lg"></span>
					<p class="text-base-content/70 mt-4">Please wait while we verify your email...</p>
				{/if}

				<form
					method="POST"
					action="?/verify"
					class="hidden"
					bind:this={verifyFormEl}
					use:enhance={() => {
						loading = true;
						return async ({ result }: { result: ActionResult }) => {
							if (result.type === 'success' && result.data) {
								const d = result.data as { verified: boolean; token: string; username: string };
								verified = d.verified;
								verifiedToken = d.token;
								verifiedUsername = d.username;
							} else if (result.type === 'failure') {
								AlertStore.add(result.data?.message, 'error');
							}
							await applyAction(result);
							loading = false;
						};
					}}
				>
					<input
						type="hidden"
						name="code"
						value={data.code}
					/>
				</form>
			{:else}
				<h2 class="card-title mb-2 text-3xl font-bold">Verify your email</h2>
				<p class="text-base-content/70 mb-2"> We sent a verification link to: </p>
				<p class="mb-6 font-semibold">{data.email}</p>

				<p class="text-base-content/50 mb-6 text-sm">
					Check your inbox and click the link to verify your account. The link expires in 24 hours.
				</p>

				<div class="flex flex-col items-center gap-2">
					<a
						href="/register"
						class="link text-base-content/60 text-sm">Back to registration</a
					>
					<span class="text-base-content/40 text-xs">Already verified your email?</span>
					<a
						href="/login"
						class="link link-primary text-sm font-semibold">Login here</a
					>
				</div>
			{/if}
		</div>
	</div>
</div>
