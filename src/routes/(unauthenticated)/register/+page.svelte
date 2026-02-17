<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { AlertStore } from '$lib/stores/alert.svelte';
	import { password_regex } from '$lib/helpers/password';

	let username = $state('');
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
</script>

<div class="flex min-h-[80vh] items-center justify-center p-4">
	<div class="card bg-base-200 w-full max-w-md shadow-xl">
		<div class="card-body">
			<h2 class="card-title mb-6 justify-center text-3xl font-bold">Create Account</h2>

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
					<legend class="sr-only">Registration Details</legend>

					<label
						for="username"
						class="fieldset-label text-base">Username</label
					>
					<input
						type="text"
						class="input validator w-full"
						placeholder="johndoe"
						id="username"
						name="username"
						bind:value={username}
						required
						disabled={loading}
						pattern="[A-Za-z][A-Za-z0-9\-]*"
						minlength="3"
						maxlength="30"
						title="Only letters, numbers or dash"
					/>
					<p class="validator-hint hidden"> 3-30 characters. Only letters, numbers or dash. </p>

					<label
						for="email"
						class="fieldset-label mt-4 text-base">Email</label
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
						class="input validator w-full"
						placeholder="••••••••"
						id="password"
						name="password"
						bind:value={password}
						required
						disabled={loading}
						minlength="8"
						pattern={password_regex}
						title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
					/>
					<div class="validator-hint hidden"> 8+ chars with a number, lowercase & uppercase letter </div>

					<div class="mt-8 flex flex-col gap-4">
						<button
							class="btn btn-primary w-full"
							type="submit"
							disabled={loading}
						>
							{#if loading}
								<span class="loading loading-spinner"></span>
								Creating Account...
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
