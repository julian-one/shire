<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let username = $state('');
	let email = $state('');
	let loading = $state(false);

	let usernameError = $derived(form?.field === 'username' ? form.message : '');
	let emailError = $derived(form?.field === 'email' ? form.message : '');
</script>

<div class="flex min-h-[80vh] items-center justify-center p-4">
	<div class="card bg-base-200 border-base-content/10 w-full max-w-md border">
		<div class="card-body">
			<h2 class="card-title mb-6 justify-center text-3xl font-bold">Create Account</h2>

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ result }: { result: ActionResult }) => {
						if (result.type === 'failure') {
							if (!result.data?.field) {
								AlertStore.add(result.data?.message, 'error');
							}
						} else if (result.type === 'redirect') {
							AlertStore.add('Verification email sent. Please check your inbox.', 'info');
						}
						await applyAction(result);
						loading = false;
					};
				}}
			>
				<fieldset class="fieldset">
					<legend class="sr-only">Registration Details</legend>

					<label
						for="username"
						class="fieldset-label text-base">Username</label
					>
					<input
						type="text"
						class="input validator w-full"
						class:input-error={usernameError}
						placeholder="johndoe"
						id="username"
						name="username"
						bind:value={username}
						required
						disabled={loading}
						pattern="[A-Za-z][A-Za-z0-9\-]*"
						minlength="3"
						maxlength="30"
					/>
					{#if usernameError}
						<p class="text-error mt-1 text-sm">{usernameError}</p>
					{:else}
						<p class="validator-hint hidden"> 3-30 characters. Only letters, numbers or dash. </p>
					{/if}

					<label
						for="email"
						class="fieldset-label mt-4 text-base">Email</label
					>
					<input
						type="email"
						class="input validator w-full"
						class:input-error={emailError}
						placeholder="name@example.com"
						id="email"
						name="email"
						bind:value={email}
						required
						disabled={loading}
					/>
					{#if emailError}
						<p class="text-error mt-1 text-sm">{emailError}</p>
					{:else}
						<div class="validator-hint hidden">Please enter a valid email address</div>
					{/if}

					<div class="mt-8 flex flex-col gap-4">
						<button
							class="btn btn-primary w-full"
							type="submit"
							disabled={loading}
						>
							{#if loading}
								<span class="loading loading-spinner"></span>
								Sending Verification...
							{:else}
								Register
							{/if}
						</button>

						<div class="divider text-xs opacity-50">OR</div>

						<div class="text-center">
							<span class="text-sm opacity-70">Already have an account?</span>
							<a
								href="/login"
								class="link link-primary ml-1 text-sm font-semibold">Login here</a
							>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	</div>
</div>
